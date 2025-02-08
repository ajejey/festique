'use server'

// app/lib/actions/auth.js
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { User } from '@/models/User'
import { connectDB } from '../db'

// In-memory OTP store (replace with Redis in production)
const otpStore = new Map()

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

export async function sendOTP(email) {
  
  await connectDB()

  // Rate limiting
  const storedData = otpStore.get(email)
  if (storedData && Date.now() - storedData.timestamp < 60000) { // 1 minute
    throw new Error('Please wait before requesting another OTP')
  }

  const otp = Math.floor(100000 + Math.random() * 900000)
  otpStore.set(email, {
    otp,
    timestamp: Date.now(),
    attempts: 0
  })

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your Festique Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF6B6B;">Welcome to Festique</h1>
          <p>Your OTP for login is: <strong style="font-size: 24px; color: #4ECDC4;">${otp}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      `
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send OTP:', error)
    throw new Error('Failed to send OTP')
  }
}

export async function verifyOTP(email, otp) {
  
  await connectDB()

  const storedData = otpStore.get(email)
  
  if (!storedData) {
    throw new Error('OTP expired or not found')
  }

  if (Date.now() - storedData.timestamp > 600000) { // 10 minutes
    otpStore.delete(email)
    throw new Error('OTP expired')
  }

  if (storedData.otp !== parseInt(otp)) {
    storedData.attempts += 1
    if (storedData.attempts >= 3) {
      otpStore.delete(email)
      throw new Error('Too many failed attempts')
    }
    throw new Error('Invalid OTP')
  }

  // Clear OTP
  otpStore.delete(email)

  // Find or create user
  let user = await User.findOne({ email })
  const isNewUser = !user

  if (!user) {
    user = await User.create({
      email,
      name: email.split('@')[0], // Temporary name from email
      role: 'participant',
      emailVerified: true,
      canCreateEvents: false, // Default to false for new users
      profile: {
        firstName: email.split('@')[0],
        lastName: ''
      },
      settings: {
        language: 'en',
        notifications: {
          email: true,
          push: true
        },
        privacy: {
          showProfile: true,
          showStats: true
        }
      },
      preferences: {
        eventTypes: [],
        sportInterests: []
      }
    })
  }

  // Generate JWT
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      canCreateEvents: user.canCreateEvents,
      isNewUser
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  // Set HTTP-only cookie
  await cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })

  return { success: true, isNewUser }
}

export async function logout() {
  cookies().delete('auth-token')
}

export async function updateProfile(userId, data) {
  
  
  await connectDB()
  
  // Validate user exists
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('User not found')
  }
  
  // Update user data
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true }
  )
  
  return { success: true, user: updatedUser }
}
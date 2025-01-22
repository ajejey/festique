// app/lib/auth.js
import { cookies } from 'next/headers'
import { verify, sign } from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import { User } from '@/models/User'
import { connectDB } from './db'

const getAuthToken = async () => {
  const token = (await cookies()).get('auth-token')
  return token ? token.value : null
}

export async function requireAuth() {
  const token = await getAuthToken()
  
  if (!token) {
    redirect('/login')
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET)
    return decoded
  } catch {
    redirect('/login')
  }
}

export async function requireRole(allowedRoles) {
  const user = await requireAuth()
  
  if (!allowedRoles.includes(user.role)) {
    redirect('/')
  }
  
  return user
}

export async function getUser() {
  const token = await getAuthToken()
  
  if (!token) {
    return null
  }

  try {
    return verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

export async function requireEventCreation() {
  const user = await requireAuth()

  await connectDB()
  
  // Fetch user to get the latest canCreateEvents status
  const userDoc = await User.findById(user.userId)

  
  if (!userDoc.canCreateEvents) {
    redirect('/become-event-organizer')
  }
  
  return user
}

// New function to update authentication cookie
export async function updateAuthCookie(userData) {
  // Validate required fields
  if (!userData._id) {
    throw new Error('User ID is required to update authentication cookie')
  }

  // Generate new JWT with updated user data
  const token = sign(
    {
      userId: userData._id,
      email: userData.email,
      role: userData.role,
      canCreateEvents: userData.canCreateEvents || false,
      organizerProfile: userData.organizerProfile || {}
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  // Set HTTP-only cookie
  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })

  return token
}
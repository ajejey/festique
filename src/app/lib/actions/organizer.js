'use server'

import { User } from '@/models/User'
import { connectDB } from '../db'
import { requireAuth } from '../auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { uploadFile } from '@/app/organize/actions'
import { updateAuthCookie } from '../auth'

export async function requestEventCreationEligibility(formData) {
  await connectDB()
  
  // Verify user is authenticated
  const user = await requireAuth()

  // Collect organizer profile information
  const organizationName = formData.get('organizationName')
  const contactPhone = formData.get('contactPhone')
  const verificationDocumentFile = formData.get('verificationDocuments')

  console.log("organizationName", organizationName)
  console.log("contactPhone", contactPhone)
  

  let verificationDocumentPath = await uploadFile(verificationDocumentFile, 'organizer-docs')

  console.log("verificationDocumentPath", verificationDocumentPath)

  try {
    // Update user with organizer profile and set verification status to pending
    console.log("user in requestEventCreationEligibility", user)
    const updatedUser = await User.findByIdAndUpdate(
      user.userId, 
      {
        canCreateEvents: true, // verify right away for now
        organizerProfile: {
          organizationName,
          contactPhone,
          verificationStatus: 'verified',
          verificationDocuments: verificationDocumentPath ? verificationDocumentPath.url : ""
        }
      },
      { new: true }
    )
    console.log("updatedUser", updatedUser)

    // Convert Mongoose document to plain object and remove sensitive fields
    const userResponse = updatedUser.toObject ? updatedUser.toObject() : updatedUser
    delete userResponse?.password // Remove password if exists
    delete userResponse?.__v // Remove version key
    delete userResponse?.activeOTP // Remove any sensitive authentication data

    await updateAuthCookie(userResponse)

    return {
      success: true,
      message: 'Event creation eligibility request submitted successfully',
      user: userResponse
    }
  } catch (error) {
    console.error('Error in requestEventCreationEligibility:', error)
    return {
      success: false,
      message: 'Failed to submit event creation eligibility request'
    }
  }
}

export async function approveEventCreationEligibility(userId) {
  await connectDB()
  
  // This should only be callable by admin
  const adminUser = await requireAuth()
  if (adminUser.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      {
        canCreateEvents: true,
        'organizerProfile.verificationStatus': 'verified',
        'organizerProfile.eventCreationEligibility': new Date()
      },
      { new: true }
    )
    console.log("updatedUser", updatedUser)

    // Convert Mongoose document to plain object and remove sensitive fields
    const userResponse = updatedUser.toObject ? updatedUser.toObject() : updatedUser
    delete userResponse?.password // Remove password if exists
    delete userResponse?.__v // Remove version key
    delete userResponse?.activeOTP // Remove any sensitive authentication data

    await updateAuthCookie(userResponse)

    return {
      success: true,
      message: 'User approved for event creation',
      user: userResponse
    }
  } catch (error) {
    console.error('Error in approveEventCreationEligibility:', error)
    return {
      success: false,
      message: 'Failed to approve event creation eligibility'
    }
  }
}

export async function checkEventCreationEligibility() {
  await connectDB()
  
  const user = await requireAuth()

  // Check if user can create events
  const userDoc = await User.findById(user.id)

  // Convert Mongoose document to plain object and remove sensitive fields
  const userResponse = userDoc.toObject ? userDoc.toObject() : userDoc
  delete userResponse?.password // Remove password if exists
  delete userResponse?.__v // Remove version key
  delete userResponse?.activeOTP // Remove any sensitive authentication data

  return {
    canCreateEvents: userResponse?.canCreateEvents,
    verificationStatus: userResponse?.organizerProfile?.verificationStatus
  }
}

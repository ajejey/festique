'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import Registration from '@/models/Registration'
import Event from '@/models/Event'
import { requireAuth } from '@/app/lib/auth'
import { connectDB } from '@/app/lib/db'

export async function getRegistrationDetails(registrationId) {
  // await dbConnect()
  await connectDB()

  // Verify user is authenticated
  const user = await requireAuth()

  const registration = await Registration.findById(registrationId)
    .populate('event')
    .lean()
  
  if (!registration) {
    throw new Error('Registration not found')
  }

  console.log("registration ", registration)
  console.log("registration.user.toString() ", registration.user.toString())
  console.log("user ", user)
  
  // Verify user owns this registration
  if (registration.user.toString() !== user.userId) {
    throw new Error('Unauthorized')
  }
  
  return JSON.parse(JSON.stringify(registration))
}

export async function getEventDetails(eventId) {
  await connectDB()
  
  const event = await Event.findById(eventId).lean()
  
  if (!event) {
    throw new Error('Event not found')
  }
  
  return JSON.parse(JSON.stringify(event))
}

export async function completeRegistration(data) {
  await connectDB()
  
  // Verify user is authenticated
  const user = await requireAuth()
  
  const registration = await Registration.findById(data.registrationId)
  
  if (!registration) {
    throw new Error('Registration not found')
  }
  
  // Verify user owns this registration
  if (registration.user.toString() !== user.userId) {
    throw new Error('Unauthorized')
  }
  
  // Update registration with provided details
  registration.registrationDetails = {
    ...registration.registrationDetails,
    ...data.registrationDetails
  }
  
  // Add custom fields if provided
  if (data.customFields?.length > 0) {
    registration.registrationDetails.customFields = data.customFields
  }
  
  // Save T-shirt details if provided
  if (data.tshirtSize) {
    registration.tshirtDetails = {
      size: data.tshirtSize,
      additionalTshirts: data.additionalTshirts || []
    }
  }
  
  // Save rules acknowledgment
  registration.rulesAcknowledged = data.rulesAcknowledged || false
  
  // Mark registration as completed
  registration.status = 'completed'
  registration.completedAt = new Date()
  
  await registration.save()
  
  // Revalidate the registration page
  revalidatePath(`/events/${registration.event}/register/${registration._id}`)
  revalidatePath(`/organize`)
  
  return JSON.parse(JSON.stringify(registration))
}

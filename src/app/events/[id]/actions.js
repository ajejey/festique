'use server'

import { connectDB } from '@/app/lib/db'
import Registration from '@/models/Registration'
import Event from '@/models/Event'
import { User } from '@/models/User'

export async function createInitialRegistration(data) {
  try {
    // Connect to database
    await connectDB()

    // Find the event to get current ticket tiers and pricing
    const event = await Event.findById(data.eventId)
    if (!event) {
      throw new Error('Event not found')
    }

    // Determine ticket tier based on current date and event pricing
    const currentTicketTier = event.ticketTiers.find(tier => 
      new Date() >= tier.startDate && new Date() <= tier.endDate
    )

    if (!currentTicketTier) {
      throw new Error('No active ticket tier available')
    }

    // Ensure we have a valid price
    const ticketPrice = currentTicketTier.price || 0

    // Create initial registration
    const registration = new Registration({
      event: data.eventId,
      user: data.user,  // Use the user ID passed from the client
      category: data.category,
      categoryPreferences: data.categoryPreferences || [], // Add category preferences
      ticketTier: currentTicketTier._id,
      registrationDetails: {
        name: data.registrationDetails.name,
        email: data.registrationDetails.email,
        phone: data.registrationDetails.phone
      },
      payment: {
        amount: ticketPrice,
        currency: 'INR', // Default currency, adjust as needed
        status: 'pending'
      }
    })

    // Save registration
    await registration.save()

    // Convert Mongoose document to plain object and remove sensitive data
    const registrationObject = registration.toObject()
    delete registrationObject.__v

    return JSON.parse(JSON.stringify({
      registration: registrationObject,
      registrationDetails: data.registrationDetails
    }))
  } catch (error) {
    console.error('Registration creation error:', error)
    throw new Error(error.message || 'Failed to create registration')
  }
}

export async function createUserForRegistration(registrationDetails) {
  try {
    // Connect to database
    await connectDB()

    // Create or update user
    let user = await User.findOne({ email: registrationDetails.email })
    if (!user) {
      user = new User({
        email: registrationDetails.email,
        name: registrationDetails.name,
        phone: registrationDetails.phone,
        role: 'participant'
      })
      await user.save()
    }

    // Convert Mongoose document to plain object and remove sensitive data
    const userObject = user.toObject()
    delete userObject.__v
    delete userObject.password

    return JSON.parse(JSON.stringify({
      _id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone
    }))
  } catch (error) {
    console.error('User creation error:', error)
    throw new Error(error.message || 'Failed to create user')
  }
}

export async function getRegistrationDetails(registrationId) {
  try {
    // Connect to database
    await connectDB()

    // Find registration and populate related event details
    const registration = await Registration.findById(registrationId)
      .populate('event', 'name startDate location')
      .populate('user', 'name email phone')

    if (!registration) {
      throw new Error('Registration not found')
    }

    // Convert to plain object and remove sensitive data
    const registrationObject = registration.toObject()
    delete registrationObject.__v

    return JSON.parse(JSON.stringify(registrationObject))
  } catch (error) {
    console.error('Get registration details error:', error)
    throw new Error(error.message || 'Failed to retrieve registration details')
  }
}

export async function completeRegistration({ registrationId, additionalDetails }) {
  try {
    // Connect to database
    await connectDB()

    // Find the registration
    const registration = await Registration.findById(registrationId)
    if (!registration) {
      throw new Error('Registration not found')
    }

    // Update registration with additional details
    registration.additionalDetails = {
      dateOfBirth: additionalDetails.dateOfBirth,
      gender: additionalDetails.gender,
      emergencyContact: {
        name: additionalDetails.emergencyContact.name,
        phone: additionalDetails.emergencyContact.phone,
        relation: additionalDetails.emergencyContact.relation
      },
      address: {
        street: additionalDetails.address.street,
        city: additionalDetails.address.city,
        state: additionalDetails.address.state,
        country: additionalDetails.address.country,
        pincode: additionalDetails.address.pincode
      }
    }

    // Update registration status
    registration.status = 'details_completed'

    // Save the updated registration
    await registration.save()

    // Update user with additional details
    await User.findByIdAndUpdate(registration.user, {
      dateOfBirth: additionalDetails.dateOfBirth,
      gender: additionalDetails.gender,
      address: {
        street: additionalDetails.address.street,
        city: additionalDetails.address.city,
        state: additionalDetails.address.state,
        country: additionalDetails.address.country,
        pincode: additionalDetails.address.pincode
      },
      emergencyContact: {
        name: additionalDetails.emergencyContact.name,
        phone: additionalDetails.emergencyContact.phone,
        relation: additionalDetails.emergencyContact.relation
      }
    })

    // Convert to plain object and remove sensitive data
    const registrationObject = registration.toObject()
    delete registrationObject.__v

    return JSON.parse(JSON.stringify(registrationObject))
  } catch (error) {
    console.error('Complete registration error:', error)
    throw new Error(error.message || 'Failed to complete registration')
  }
}
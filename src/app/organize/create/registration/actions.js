'use server'

import { requireAuth, requireRole } from '@/app/lib/auth'
import { connectDB } from '@/app/lib/db'
// import { requireAuth } from '@/lib/auth/requireAuth'
// import { requireRole } from '@/lib/auth/requireRole'
// import { connectToDatabase } from '@/lib/db'
import Event from '@/models/Event'

export async function saveRegistrationFormFields(eventId, fields) {
  // Verify authentication and role
  const user = await requireAuth()
  await requireRole(['organizer', 'admin', 'participant'])

  try {
    // Connect to database
    await connectDB()

    // Find and update the event with new registration fields
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId, 
      { 
        $set: { 
          dynamicRegistrationFields: fields.map(field => ({
            id: field.id || crypto.randomUUID(),
            label: field.label,
            type: field.type,
            required: field.required || false,
            options: field.options || [],
            validationRules: field.validationRules || {}
          }))
        } 
      }, 
      { new: true, runValidators: true }
    )

    if (!updatedEvent) {
      throw new Error('Event not found')
    }

    // Convert Mongoose document to plain object and then to JSON
    return JSON.parse(JSON.stringify(updatedEvent))
  } catch (error) {
    console.error('Error saving registration form fields:', error)
    throw new Error('Failed to save registration form fields')
  }
}

export async function getEventRegistrationFields(eventId) {
  // Verify authentication and role
  const user = await requireAuth()
  await requireRole(user, ['organizer', 'admin'])

  try {
    // Connect to database
    await connectDB()

    // Find the event and return its registration fields
    const event = await Event.findById(eventId).select('dynamicRegistrationFields')

    if (!event) {
      throw new Error('Event not found')
    }

    // Convert Mongoose document to plain object and then to JSON
    return JSON.parse(JSON.stringify(event.dynamicRegistrationFields || []))
  } catch (error) {
    console.error('Error fetching registration form fields:', error)
    throw new Error('Failed to fetch registration form fields')
  }
}

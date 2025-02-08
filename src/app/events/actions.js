'use server'

import mongoose from 'mongoose'
import Event from '@/models/Event'
import { connectDB } from '../lib/db'
import { User } from '@/models/User'
// import { connectDB } from '@/lib/db'

export async function getEvents(filters = {}) {
  try {
    // Connect to database
    await connectDB()

    // Default query to get upcoming events
    const baseQuery = {
      // startDate: { $gte: new Date() },
    //   status: 'published'
    }

    // Merge base query with additional filters
    const query = { ...baseQuery, ...filters }

    // Fetch events with populated organizer details
    const events = await Event.find(query)
      .populate({
        path: 'organizer',
        select: 'name email profilePicture'
      })
      .sort({ startDate: 1 }) // Sort by upcoming events first
      .lean() // Convert to plain JavaScript object for client

      console.log("events", events)
    // Convert MongoDB _id to string for client
    return events.map(event => ({
      ...event,
      _id: event._id.toString(),
      organizer: event.organizer ? {
        ...event.organizer,
        _id: event.organizer._id.toString()
      } : null
    }))
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

/**
 * Get a single event by its ID
 * @param {string} id - Event ID
 * @returns {Promise<Object|null>} Event object or null if not found
 */
export async function getEventById(id) {
  try {
    await connectDB()

    const event = await Event.findById(id)
      .lean()

    if (!event) {
      return null
    }

    // Convert MongoDB _id to string
    return {
      ...event,
      _id: event._id.toString(),
      createdAt: event.createdAt?.toISOString(),
      updatedAt: event.updatedAt?.toISOString(),
      startDate: event.startDate?.toISOString(),
      endDate: event.endDate?.toISOString(),
      registrationOpenDate: event.registrationOpenDate?.toISOString(),
      registrationCloseDate: event.registrationCloseDate?.toISOString()
    }
  } catch (error) {
    console.error('Error fetching event:', error)
    throw new Error('Failed to fetch event')
  }
}

export async function getFilteredEvents(filters = {}) {
  try {
    // Connect to database
    await connectDB()

    // Construct dynamic filter object
    const dynamicFilters = {}

    // Filter by event type
    if (filters.eventType) {
      dynamicFilters.eventType = filters.eventType
    }

    // Filter by location
    if (filters.city) {
      dynamicFilters['location.city'] = filters.city
    }

    // Filter by date range
    if (filters.startDate && filters.endDate) {
      dynamicFilters.startDate = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      }
    }

    // Base query for upcoming published events
    const baseQuery = {
      startDate: { $gte: new Date() },
      status: 'published'
    }

    // Merge base query with dynamic filters
    const query = { ...baseQuery, ...dynamicFilters }

    // Fetch filtered events
    const events = await Event.find(query)
      .populate({
        path: 'organizer',
        select: 'name email profilePicture'
      })
      .sort({ startDate: 1 })
      .lean()

    // Convert MongoDB _id to string for client
    return events.map(event => ({
      ...event,
      _id: event._id.toString(),
      organizer: event.organizer ? {
        ...event.organizer,
        _id: event.organizer._id.toString()
      } : null
    }))
  } catch (error) {
    console.error('Error fetching filtered events:', error)
    return []
  }
}

export async function getEventTypes() {
  try {
    // Connect to database
    await connectDB()

    // Get unique event types
    const eventTypes = await Event.distinct('eventType', {
      startDate: { $gte: new Date() },
      status: 'published'
    })

    return eventTypes
  } catch (error) {
    console.error('Error fetching event types:', error)
    return []
  }
}

export async function getEventCities() {
  try {
    // Connect to database
    await connectDB()

    // Get unique cities
    const cities = await Event.distinct('location.city', {
      startDate: { $gte: new Date() },
      status: 'published'
    })

    return cities
  } catch (error) {
    console.error('Error fetching event cities:', error)
    return []
  }
}
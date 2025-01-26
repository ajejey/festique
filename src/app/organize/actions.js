'use server'

import { requireEventCreation } from '@/app/lib/auth'
import { revalidatePath } from 'next/cache'
import mongoose from 'mongoose'
import Event from '@/models/Event'
import Registration from '@/models/Registration'
import User from '@/models/User'
import ImageKit from "imagekit";
import { readFile } from 'fs/promises';

export async function createEvent(formData) {
  const user = await requireEventCreation()
  const userId = new mongoose.Types.ObjectId(user.userId)

  try {
    // Validate dynamic registration fields
    const validatedDynamicFields = (formData.dynamicRegistrationFields || []).map(field => {
      // Validate field configuration
      if (!field.label) throw new Error('Dynamic field label is required')
      if (!field.type) throw new Error('Dynamic field type is required')

      // Validate options for dropdown and radio fields
      if (['dropdown', 'radio'].includes(field.type) && 
          (!field.options || field.options.length === 0)) {
        throw new Error(`Options are required for ${field.type} field type`)
      }

      // Validate number field constraints
      if (field.type === 'number') {
        const { min, max } = field.validation || {}
        if (min !== undefined && max !== undefined && min > max) {
          throw new Error('Minimum value cannot be greater than maximum value')
        }
      }

      // Validate text field pattern
      if (field.type === 'text' && field.validation?.pattern) {
        try {
          new RegExp(field.validation.pattern)
        } catch (error) {
          throw new Error('Invalid regex pattern for text validation')
        }
      }

      return {
        id: field.id || `field_${Date.now()}`,
        type: field.type,
        label: field.label,
        required: !!field.required,
        options: field.options || [],
        validation: field.validation || {}
      }
    })

    // File upload handling is now done in the EventMediaUpload component
    // Just use the URLs directly from formData
    const newEvent = await Event.create({
      name: formData.name,
      eventType: formData.eventType,
      description: formData.description,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      registrationOpenDate: new Date(formData.registrationOpenDate),
      registrationCloseDate: new Date(formData.registrationCloseDate),
      categories: formData.categories.map(category => ({
        name: category.name,
        distance: category.distance,
        startTime: category.startTime ? new Date(category.startTime) : null,
        ageGroup: {
          min: category.ageGroup?.min || null,
          max: category.ageGroup?.max || null
        },
        gender: category.gender || 'All',
        description: category.description || '',
        basePrice: parseFloat(category.basePrice) || 0
      })),
      location: {
        venue: formData.location.venue,
        address: formData.location.address,
        city: formData.location.city,
        state: formData.location.state || '',
        country: formData.location.country,
        coordinates: {
          lat: formData.location.coordinates?.lat || 0,
          lng: formData.location.coordinates?.lng || 0
        },
        googleMapsLink: formData.location.googleMapsLink || ''
      },
      organizer: userId,
      organizerDetails: {
        name: formData.organizerDetails.name.trim(),
        logo: formData.organizerDetails.logo,
        description: formData.organizerDetails.description?.trim() || '',
        contact: {
          email: formData.organizerDetails.contact.email?.trim().toLowerCase() || '',
          phone: formData.organizerDetails.contact.phone?.trim() || ''
        }
      },
      ticketTiers: formData.ticketTiers.map(tier => ({
        name: tier.name,
        discountPercentage: parseFloat(tier.discountPercentage) || 0,
        startDate: tier.startDate ? new Date(tier.startDate) : null,
        endDate: tier.endDate ? new Date(tier.endDate) : null,
        isEarlyBird: !!tier.isEarlyBird
      })),
      coverImage: formData.coverImage,
      additionalImages: formData.additionalImages,
      status: 'Draft',
      dynamicRegistrationFields: validatedDynamicFields,
      rules: formData.rules
        ? formData.rules
          .filter(rule => rule.trim() !== '')
          .map(rule => rule.trim())
        : [],
      amenities: formData.amenities
        ? formData.amenities
          .filter(amenity => amenity.trim() !== '')
          .map(amenity => amenity.trim())
        : [],
      capacity: {
        total: 10000,
        registered: 0
      },
      schedule: formData.schedule
        ? formData.schedule
          .filter(item => 
            item.time instanceof Date && 
            item.activity && 
            item.activity.trim() !== ''
          )
          .map(item => ({
            time: item.time.toISOString(),
            activity: item.activity
          }))
        : [],
      tshirtOptions: {
        includedTshirt: {
          provided: formData.tshirtOptions?.includedTshirt?.provided || false,
          sizes: formData.tshirtOptions?.includedTshirt?.sizes || [],
          designUrl: formData.tshirtOptions?.includedTshirt?.designUrl || '',
          material: formData.tshirtOptions?.includedTshirt?.material || 'Moisture-Wicking'
        },
        additionalTshirts: (formData.tshirtOptions?.additionalTshirts || []).map(tshirt => ({
          name: tshirt.name || '',
          price: parseFloat(tshirt.price) || 0,
          sizes: tshirt.sizes || [],
          designUrl: tshirt.designUrl || '',
          material: tshirt.material || 'Moisture-Wicking',
          quantity: parseInt(tshirt.quantity) || 0,
          availableTill: tshirt.availableTill ? new Date(tshirt.availableTill) : null
        }))
      },
      eventSpecificConfig: {
        terrainType: formData.eventSpecificConfig?.terrainType || '',
        elevationProfile: formData.eventSpecificConfig?.elevationProfile || '',
        ageRestrictions: {
          minimumAge: formData.eventSpecificConfig?.ageRestrictions?.minimumAge || null,
          maximumAge: formData.eventSpecificConfig?.ageRestrictions?.maximumAge || null
        },
        difficulty: formData.difficulty || 'Intermediate',
      },
    })

    // Revalidate the organize page to show the new event
    revalidatePath('/organize')

    return { 
      success: true, 
      eventId: newEvent._id 
    }
  } catch (error) {
    console.error('Event creation error:', error)
    return { 
      success: false, 
      message: error.message || 'Failed to create event' 
    }
  }
}

// ImageKit Authentication Server Action
export async function imagekitAuth() {
  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
  });

  const authenticationParameters = imagekit.getAuthenticationParameters();
  
  return {
    signature: authenticationParameters.signature,
    expire: authenticationParameters.expire,
    token: authenticationParameters.token
  };
}

// Update existing uploadFile function
export async function uploadFile(file, folder) {
  console.log("uploadFile function called with file and folder", file, folder);

  try {
    // Initialize ImageKit
    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
    });

    // Convert File to Buffer
    let buffer;
    if (file instanceof File) {
      // For browser File objects in server actions
      buffer = Buffer.from(await file.arrayBuffer());
    } else if (typeof file === 'string') {
      // For file paths
      buffer = await readFile(file);
    } else {
      throw new Error('Unsupported file type');
    }

    // Generate a unique filename
    const fileName = `${folder}_${Date.now()}_${file.name || 'file'}`;

    // Upload to ImageKit using buffer
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: `/festique/${folder}`,
      useUniqueFileName: true,
      tags: ['festique-event']
    });

    console.log("ImageKit Upload Response:", uploadResponse);

    return {
      url: uploadResponse.url,
      fileId: uploadResponse.fileId
    };
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw new Error(`File upload failed: ${error.message}`);
  }
}

export async function updateEventStatus(eventId, status) {
  const user = await requireEventCreation()
  const userId = new mongoose.Types.ObjectId(user.useId)

  try {
    await Event.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(eventId), organizer: userId },
      { status },
      { new: true }
    )

    revalidatePath('/organize')

    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

export async function getOrganizerStats() {
  const user = await requireEventCreation()
  console.log("user in getOrganizerStats", user)
  const userId = new mongoose.Types.ObjectId(user.userId)

  try {
    const [
      totalEvents, 
      upcomingEvents, 
      totalRegistrations, 
      totalRevenue
    ] = await Promise.all([
      Event.countDocuments({ organizer: userId }),
      Event.countDocuments({ 
        organizer: userId, 
        // startDate: { $gt: new Date() },
        // status: 'Published' 
      }),
      Event.aggregate([
        { $match: { organizer: userId } },
        { $group: { _id: null, total: { $sum: '$capacity.registered' } } }
      ]).exec(),
      Event.aggregate([
        { $match: { organizer: userId } },
        { $unwind: { 
          path: '$ticketTiers', 
          preserveNullAndEmptyArrays: true 
        }},
        { $group: { 
          _id: null, 
          total: { $sum: { $multiply: ['$ticketTiers.price', '$ticketTiers.quantity'] } } 
        } }
      ]).exec()
    ])

    console.log('Total Events:', totalEvents)
    console.log('Upcoming Events:', upcomingEvents)
    console.log('Total Registrations:', totalRegistrations[0]?.total || 0)
    console.log('Total Revenue:', totalRevenue[0]?.total || 0)

    return {
      totalEvents,
      upcomingEvents,
      totalRegistrations: totalRegistrations[0]?.total || 0,
      totalRevenue: totalRevenue[0]?.total || 0
    }
  } catch (error) {
    console.error('Error fetching organizer stats:', error)
    return {
      totalEvents: 0,
      upcomingEvents: 0,
      totalRegistrations: 0,
      totalRevenue: 0
    }
  }
}

export async function getRecentEvents() {
  const user = await requireEventCreation()
  const userId = new mongoose.Types.ObjectId(user.userId)

  try {
    const recentEvents = await Event.find({ 
      organizer: userId 
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name startDate status')
    .exec()

    return recentEvents
  } catch (error) {
    console.error('Error fetching recent events:', error)
    return []
  }
}

export async function saveEventRegistrationFields(fields) {
  try {
    const user = await requireEventCreation()
    
    // Get the most recently created event for this user
    const latestEvent = await Event.findOne({ 
      organizer: user._id, 
      status: 'Draft' 
    }).sort({ createdAt: -1 })

    if (!latestEvent) {
      return { 
        success: false, 
        message: 'No draft event found. Please create an event first.' 
      }
    }

    // Validate and sanitize fields
    const sanitizedFields = fields.map(field => ({
      id: field.id || `field_${Date.now()}`,
      label: field.label.trim(),
      type: field.type,
      required: !!field.required,
      options: field.options || [],
      validationRules: {
        minLength: field.minLength || undefined,
        maxLength: field.maxLength || undefined,
        pattern: field.pattern || undefined
      }
    }))

    // Update the event with dynamic registration fields
    latestEvent.dynamicRegistrationFields = sanitizedFields
    await latestEvent.save()

    return { 
      success: true, 
      eventId: latestEvent._id 
    }
  } catch (error) {
    console.error('Error saving registration fields:', error)
    return { 
      success: false, 
      message: error.message || 'Failed to save registration fields' 
    }
  }
}

export async function getEventRegistrations(eventId) {
  const user = await requireEventCreation()
  
  try {
    // Find the event to ensure the user is the organizer
    const event = await Event.findById(eventId)
    
    if (!event || event.organizer.toString() !== user.userId) {
      throw new Error('Unauthorized access or event not found')
    }

    // Fetch registrations with populated user details
    const registrations = await Registration.find({ event: eventId })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .lean()

    // Transform registrations to remove sensitive data
    const safeRegistrations = registrations.map(reg => ({
      _id: reg._id,
      user: {
        name: reg.user.name,
        email: reg.user.email,
        phone: reg.user.phone
      },
      status: {
        payment: reg.status,
        participation: reg.participation?.status || 'registered'
      },
      category: reg.category,
      payment: reg.payment,
      createdAt: reg.createdAt,
      additionalDetails: reg.additionalDetails
    }))

    return JSON.parse(JSON.stringify(safeRegistrations))
  } catch (error) {
    console.error('Error fetching event registrations:', error)
    throw new Error('Failed to fetch registrations')
  }
}

export async function getOrganizerRegistrations() {
  const user = await requireEventCreation()
  
  try {
    // Find events organized by the user
    const events = await Event.find({ organizer: user.userId }, '_id name startDate')

    // Fetch registrations for all events
    const registrations = await Registration.find({ 
      event: { $in: events.map(event => event._id) } 
    })
      .populate('event', 'name startDate')
      .sort({ createdAt: -1 })
      .lean()

    // Transform registrations to remove sensitive data
    const safeRegistrations = registrations.map(reg => ({
      _id: reg._id,
      event: {
        name: reg.event.name,
        startDate: reg.event.startDate
      },
      registrationDetails: {
        name: reg.registrationDetails.name,
        email: reg.registrationDetails.email,
        phone: reg.registrationDetails.phone
      },
      status: {
        payment: reg.status,
        participation: reg.participation?.status || 'registered'
      },
      category: reg.category,
      payment: reg.payment,
      createdAt: reg.createdAt
    }))

    return {
      registrations: safeRegistrations,
      events: events.map(event => ({
        _id: event._id,
        name: event.name,
        startDate: event.startDate
      }))
    }
  } catch (error) {
    console.error('Error fetching organizer registrations:', error)
    throw new Error('Failed to fetch registrations')
  }
}

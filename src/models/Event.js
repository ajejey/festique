import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['marathon', 'run', 'concert', 'conference', 'workshop', 'other']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Timing
  schedule: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    registrationStart: {
      type: Date,
      required: true
    },
    registrationEnd: {
      type: Date,
      required: true
    },
    // Detailed schedule
    timeline: [{
      time: Date,
      title: String,
      description: String
    }]
  },
  // Location
  venue: {
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    // For virtual/hybrid events
    online: {
      isVirtual: {
        type: Boolean,
        default: false
      },
      platform: String,
      joinUrl: String
    }
  },
  // Ticket categories
  categories: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    price: {
      amount: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        default: 'INR'
      }
    },
    capacity: {
      total: {
        type: Number,
        required: true
      },
      available: {
        type: Number,
        required: true
      },
      reserved: {
        type: Number,
        default: 0
      }
    },
    benefits: [String],
    validTill: Date,
    restrictions: {
      minAge: Number,
      maxAge: Number,
      gender: String
    }
  }],
  // Media
  media: {
    cover: {
      url: String,
      alt: String
    },
    gallery: [{
      url: String,
      alt: String,
      type: {
        type: String,
        enum: ['image', 'video']
      }
    }],
    brochure: String
  },
  // Features and amenities
  features: {
    general: [{
      name: String,
      description: String,
      icon: String
    }],
    // Optional running-specific features
    running: {
      distance: {
        type: String,
        enum: ['5k', '10k', 'half', 'full', 'ultra', 'other']
      },
      terrain: {
        type: String,
        enum: ['road', 'trail', 'track', 'mixed']
      },
      elevation: {
        gain: Number,
        loss: Number
      },
      services: {
        chipTiming: Boolean,
        pacers: Boolean,
        waterStations: Number,
        medicalSupport: Boolean,
        finisherMedal: Boolean,
        tShirt: Boolean,
        photography: Boolean
      },
      courseMap: {
        image: String,
        gpxFile: String,
        checkpoints: [{
          name: String,
          distance: Number,
          coordinates: {
            lat: Number,
            lng: Number
          },
          services: [String]
        }]
      }
    }
  },
  // Content
  content: {
    about: String,
    rules: [String],
    faqs: [{
      question: String,
      answer: String
    }],
    termsAndConditions: String,
    cancellationPolicy: String
  },
  // Contact information
  contact: {
    email: String,
    phone: String,
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String
    }
  },
  // Stats and analytics
  stats: {
    views: {
      type: Number,
      default: 0
    },
    registrations: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    },
    ratings: {
      average: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      }
    }
  },
  // Status and visibility
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed', 'postponed'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public'
  },
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String
  },
  // Additional settings
  settings: {
    requireApproval: {
      type: Boolean,
      default: false
    },
    allowTeams: {
      type: Boolean,
      default: false
    },
    maxTeamSize: Number,
    allowWaitlist: {
      type: Boolean,
      default: false
    },
    waitlistLimit: Number,
    allowTransfers: {
      type: Boolean,
      default: false
    },
    transferDeadline: Date,
    customFields: [{
      name: String,
      type: {
        type: String,
        enum: ['text', 'number', 'date', 'select', 'checkbox']
      },
      required: Boolean,
      options: [String], // For select type
      validation: String // Regex pattern for validation
    }]
  }
}, {
  timestamps: true
})

// Add indexes
eventSchema.index({ slug: 1 })
eventSchema.index({ 'schedule.startDate': 1 })
eventSchema.index({ 'venue.address.city': 1 })
eventSchema.index({ eventType: 1 })
eventSchema.index({ status: 1 })
eventSchema.index({ visibility: 1 })
eventSchema.index({ 'features.running.distance': 1 })

export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema)

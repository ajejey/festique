import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['participant', 'admin', 'organizer'],
    default: 'participant'
  },
  canCreateEvents: {
    type: Boolean,
    default: false
  },
  organizerProfile: {
    type: {
      organizationName: {
        type: String,
        trim: true
      },
      contactPhone: {
        type: String,
        trim: true
      },
      verificationStatus: {
        type: String,
        enum: ['not_requested', 'pending', 'verified', 'rejected'],
        default: 'not_requested'
      },
      verificationDocuments: [{
        type: String,
        trim: true
      }],
      eventCreationEligibility: {
        type: Date,
        default: null
      }
    },
    default: {}
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  // For OTP-based authentication
  emailVerified: {
    type: Boolean,
    default: false
  },
  activeOTP: {
    code: String,
    expiresAt: Date
  },
  // Profile
  avatar: {
    type: String
  },
  bio: {
    type: String,
    maxLength: 500
  },
  // Emergency Contact
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  // Interests and Preferences
  interests: [{
    type: String
  }],
  // Stats
  stats: {
    eventsParticipated: {
      type: Number,
      default: 0
    },
    eventsOrganized: {
      type: Number,
      default: 0
    },
    // Optional running-specific stats
    running: {
      totalDistance: {
        type: Number, // in kilometers
        default: 0
      },
      preferredDistance: {
        type: String,
        enum: ['5k', '10k', 'half', 'full']
      },
      personalBests: {
        fiveK: Number,
        tenK: Number,
        halfMarathon: Number,
        fullMarathon: Number
      }
    }
  },
  // Achievements and Badges
  achievements: [{
    title: String,
    description: String,
    date: Date,
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  }],
  // Settings and Preferences
  settings: {
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      showProfile: {
        type: Boolean,
        default: true
      },
      showStats: {
        type: Boolean,
        default: true
      }
    }
  },
  // Social Links
  social: {
    instagram: String,
    facebook: String,
    twitter: String,
    strava: String  // Optional for runners
  }
}, {
  timestamps: true
})

// Add indexes
userSchema.index({ role: 1 })
userSchema.index({ 'address.city': 1 })
userSchema.index({ interests: 1 })

export const User = mongoose.models.User || mongoose.model('User', userSchema)

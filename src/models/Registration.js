import mongoose from 'mongoose'

const customFieldResponseSchema = new mongoose.Schema({
  fieldId: {
    type: String,
    required: false,
    trim: true
  },
  label: {
    type: String,
    required: false,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'number', 'dropdown', 'checkbox', 'radio', 'date'],
    required: false
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  }
}, { _id: false })

const registrationSchema = new mongoose.Schema({
  // Event and User References
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Event Category and Ticket Details
  category: {
    type: String,
    required: false
  },
  categoryPreferences: [{
    type: String,
    trim: true
  }],
  ticketTier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event.ticketTiers'
  },

  // Registration Details
  registrationDetails: {
    // Basic Personal Information
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: false,
      validate: {
        validator: function(v) {
          // Ensure date of birth is reasonable
          const age = new Date().getFullYear() - v.getFullYear()
          return age >= 10 && age < 120
        },
        message: 'Invalid date of birth'
      }
    },
    gender: {
      type: String,
      required: false
    },

    // Emergency Contact
    emergencyContact: {
      name: {
        type: String,
        required: false,
        trim: true
      },
      phone: {
        type: String,
        required: false,
        trim: true
      },
      relation: {
        type: String,
        required: false,
        trim: true
      }
    },

    // Address Details
    address: {
      street: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        required: false,
        trim: true
      },
      state: {
        type: String,
        trim: true
      },
      pincode: {
        type: String,
        trim: true
      },
      country: {
        type: String,
        required: false,
        trim: true
      }
    },

    // Medical and Physical Information
    medicalInfo: {
      medicalConditions: [String],
      allergies: [String],
      medications: [String],
      emergencyMedicalNotes: String
    },

    // Dynamic Registration Fields
    customFields: [customFieldResponseSchema],

    // Running/Sports Specific Information
    athleteProfile: {
      runningExperience: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional']
      },
      previousRaces: [{
        eventName: String,
        distance: String,
        completionTime: String,
        year: Number
      }],
      personalBests: {
        type: Map,
        of: String
      }
    }
  },

  // T-shirt Details
  tshirtDetails: {
    size: {
      type: String,
      required: false,
      trim: true
    },
    additionalTshirts: [{
      tshirtId: String,
      size: String,
      quantity: Number
    }]
  },

  // Rules and Status
  rulesAcknowledged: {
    type: Boolean,
    required: true,
    default: false
  },

  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },

  completedAt: {
    type: Date
  },

  // Payment Details
  payment: {
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    transactionId: String,
    paidAt: Date,
    refundedAt: Date
  },

  // Event Participation Details
  participation: {
    status: {
      type: String,
      enum: [
        'registered', 
        'checked_in', 
        'in_progress', 
        'completed', 
        'DNF',  // Did Not Finish
        'DNS',  // Did Not Start
        'disqualified'
      ],
      default: 'registered'
    },
    startTime: Date,
    endTime: Date,
    completionTime: String,
    chipTime: String,  // Timing from RFID/Chip
    position: {
      overall: Number,
      category: Number
    },
    splits: [{
      distance: String,
      time: String
    }]
  },

  // Tracking and Audit
  bib: {
    type: String,
    unique: true,
    sparse: true
  },
  qrCode: String,
  trackingLink: String,

  // Additional Metadata
  source: {
    type: String,
    enum: ['web', 'mobile', 'admin'],
    default: 'web'
  },
  referralCode: String,
  promoCode: String,

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  indexes: [
    { event: 1, user: 1 },
    { 'registrationDetails.email': 1 },
    { 'participation.status': 1 }
  ]
})

// Middleware to update timestamps
registrationSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.models.Registration || mongoose.model('Registration', registrationSchema)

import mongoose from 'mongoose'

const dynamicFieldSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'number', 'dropdown', 'checkbox', 'radio', 'date']
  },
  required: {
    type: Boolean,
    default: false
  },
  options: [{
    type: String,
    trim: true
  }],
  validationRules: {
    minLength: Number,
    maxLength: Number,
    pattern: String
  }
}, { _id: false })

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  distance: {
    type: String,
    required: true,
    trim: true
  },
  startTime: Date,
  ageGroup: {
    min: Number,
    max: Number
  },
  gender: {
    type: String,
    enum: ['All', 'Male', 'Female', 'Other'],
    default: 'All'
  },
  description: {
    type: String,
    trim: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  }
})

const ticketTierSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: null
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  isEarlyBird: {
    type: Boolean,
    default: false
  }
}, { 
  strict: 'throw',  
  timestamps: true  
})

const eventSchema = new mongoose.Schema({
  // Basic Event Details
  name: {
    type: String,
    required: true,
    trim: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventType: {
    type: String,
    enum: ['Marathon', 'Trail Run', 'Fun Run', 'Ultra Marathon', 'Running', 'Cycling', 'Triathlon', 'Swimming', 'Trail Running', 'Mountain Biking'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Timing and Location
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  location: {
    venue: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: false
      },
      lng: {
        type: Number,
        required: false
      }
    },
    googleMapsLink: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          // Optional validation for Google Maps URL
          if (!v) return true;
          const googleMapsRegex = /^(https?:\/\/)?(www\.)?google\.com\/maps\/.*$/;
          return googleMapsRegex.test(v);
        },
        message: 'Please provide a valid Google Maps URL'
      }
    }
  },

  // Registration Details
  registrationOpenDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v <= this.endDate
      },
      message: 'Registration open date must be before or equal to the event end date'
    }
  },
  registrationCloseDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v >= this.registrationOpenDate && v <= this.endDate
      },
      message: 'Registration close date must be between registration open date and event end date'
    }
  },

  // Capacity and Ticket Tiers
  capacity: {
    total: {
      type: Number,
      required: true,
      min: 0
    },
    registered: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  categories: [categorySchema],
  ticketTiers: [ticketTierSchema],

  // Event Media
  coverImage: {
    type: String,
    trim: true
  },
  additionalImages: [{
    type: String,
    trim: true
  }],

  // Event Details
  courseMap: {
    type: String,
    trim: true
  },
  schedule: [{
    time: Date,
    activity: {
      type: String,
      trim: true
    }
  }],
  amenities: [{
    type: String,
    trim: true
  }],
  rules: [{
    type: String,
    trim: true
  }],

  // Organizer Details
  organizerDetails: {
    name: {
      type: String,
      trim: true
    },
    logo: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    contact: {
      email: {
        type: String,
        trim: true,
        lowercase: true
      },
      phone: {
        type: String,
        trim: true
      }
    }
  },

  // Additional Event Metadata
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
    default: 'Intermediate'
  },
  trainingResources: [{
    type: String,
    trim: true
  }],
  eventSpecificConfig: {
    terrainType: {
      type: String,
      trim: true,
    },
    elevationProfile: {
      type: String,
      trim: true
    },
    medicalCertificateRequired: {
      type: Boolean,
      default: false
    }
  },

  // T-shirt Options
  tshirtOptions: {
    includedTshirt: {
      provided: {
        type: Boolean,
        default: false
      },
      sizes: [{
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
      }],
      designImages: {
        type: [String],
        trim: true,
        validate: {
          validator: function(v) {
            return v.length <= 5;
          },
          message: 'Maximum of 5 design images allowed'
        }
      },
      material: {
        type: String,
      }
    },
    additionalTshirts: [{
      name: {
        type: String,
        trim: true,
        required: false
      },
      price: {
        type: Number,
        min: 0,
        required: false
      },
      sizes: [{
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
      }],
      designImages: {
        type: [String],
        trim: true,
        validate: {
          validator: function(v) {
            return v.length <= 5;
          },
          message: 'Maximum of 5 design images allowed'
        }
      },
      material: {
        type: String,
      },
      quantity: {
        type: Number,
        min: 0,
        default: 0
      },
      availableTill: {
        type: Date
      }
    }]
  },

  // Dynamic Registration Fields
  dynamicRegistrationFields: [dynamicFieldSchema],

  // Tracking and Analytics
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },

  // Status and Visibility
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Cancelled', 'Completed'],
    default: 'Draft'
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt fields
})

// Indexes for performance
eventSchema.index({ startDate: 1, registrationCloseDate: 1 })
eventSchema.index({ organizer: 1, status: 1 })
eventSchema.index({ eventType: 1, location: 1 })

export default mongoose.models.Event || mongoose.model('Event', eventSchema)

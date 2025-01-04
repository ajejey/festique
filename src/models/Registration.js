import mongoose from 'mongoose'

const registrationSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true
  },
  // Registration details
  registrationDetails: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    emergencyContact: {
      name: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      relation: {
        type: String,
        required: true
      }
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },
    // Optional fields based on event type
    additionalInfo: {
      type: Map,
      of: String
    }
  },
  // Payment details
  payment: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date,
    refund: {
      status: {
        type: String,
        enum: ['not_applicable', 'pending', 'processed'],
        default: 'not_applicable'
      },
      amount: Number,
      processedAt: Date,
      reason: String
    }
  },
  // Event participation details
  participation: {
    status: {
      type: String,
      enum: ['registered', 'checked_in', 'in_progress', 'completed', 'DNF', 'DNS'],
      default: 'registered'
    },
    startTime: Date,
    endTime: Date,
    // Generic checkpoints that can be used for any event type
    checkpoints: [{
      name: String,
      time: Date,
      status: {
        type: String,
        enum: ['pending', 'completed', 'missed'],
        default: 'pending'
      },
      notes: String
    }],
    // Optional running-specific details
    running: {
      bibNumber: String,
      timing: {
        netTime: Number,  // in seconds
        gunTime: Number,  // in seconds
        splits: [{
          distance: Number,
          time: Number
        }]
      },
      category: {
        ageGroup: String,
        competitionType: String  // elite, amateur, etc.
      }
    }
  },
  // Kit/Package collection
  collection: {
    required: {
      type: Boolean,
      default: false
    },
    items: [{
      name: String,
      collected: {
        type: Boolean,
        default: false
      }
    }],
    status: {
      type: String,
      enum: ['not_collected', 'partially_collected', 'collected'],
      default: 'not_collected'
    },
    collectedAt: Date,
    collectedBy: String,
    notes: String
  },
  // Registration status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  cancellation: {
    date: Date,
    reason: String,
    requestedBy: {
      type: String,
      enum: ['participant', 'organizer', 'admin']
    },
    notes: String
  },
  // Feedback and rating
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    submittedAt: Date
  },
  // Certificate
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    url: String,
    issuedAt: Date
  }
}, {
  timestamps: true
})

// Add indexes
registrationSchema.index({ event: 1, user: 1 })
registrationSchema.index({ 'participation.status': 1 })
registrationSchema.index({ 'payment.status': 1 })
registrationSchema.index({ status: 1 })
registrationSchema.index({ 'registrationDetails.email': 1 })
registrationSchema.index({ 'participation.running.bibNumber': 1 })

export const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema)

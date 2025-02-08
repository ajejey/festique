'use client'

import { useState } from 'react'
import { X, AlertCircle, Ticket } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { createInitialRegistration, createUserForRegistration } from '../actions'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function RegistrationModal({ 
  eventId, 
  eventCategories,
  isRegistrationOpen,
  spotsLeft
}) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      categoryPreferences: []
    }
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      // First, create or update user
      const userResult = await createUserForRegistration({
        name: data.fullName,
        email: data.email,
        phone: data.phone
      })

      // Prepare registration data with user ID
      const registrationData = {
        eventId,
        user: userResult._id,
        category: data.categoryPreferences[0],
        categoryPreferences: data.categoryPreferences,
        registrationDetails: {
          name: data.fullName,
          email: data.email,
          phone: data.phone
        }
      }

      // Then, create initial registration
      const registrationResult = await createInitialRegistration(registrationData)

      // Handle successful registration
      toast.success('Registration Initiated', {
        description: 'Redirecting to complete your registration details.',
        duration: 4000,
        position: 'top-right'
      })
      
      // Redirect to complete registration page
      router.push(`/events/${eventId}/register/${registrationResult.registration._id}`)
    } catch (error) {
      toast.error('Registration Failed', {
        description: error.message || 'Please try again later.',
        duration: 4000,
        position: 'top-right'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Registration Button
  const renderRegistrationButton = () => {
    const buttonClasses = `
      w-full py-3 px-6 rounded-full
      font-montserrat font-semibold
      flex items-center justify-center gap-2
      ${isRegistrationOpen
        ? 'bg-[#FF6B6B] text-white hover:bg-[#ff5252]'
        : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
      }
      transition-colors
    `

    return (
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={!isRegistrationOpen}
        className={buttonClasses}
      >
        <Ticket className="w-5 h-5" />
        {isRegistrationOpen 
          ? 'Register Now'
          : 'Registration Closed'
        }
      </button>
    )
  }

  return (
    <>
      {renderRegistrationButton()}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isLoading && setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 p-6 space-y-6">
            {/* Close Button */}
            <button
              onClick={() => !isLoading && setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <h2 className="font-playfair text-2xl font-bold text-neutral-800">
                Start Your Registration
              </h2>
              <p className="text-neutral-600 mt-1">
                Enter your details to begin the registration process
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('fullName', { 
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.fullName 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-neutral-300 focus:ring-primary'
                  } focus:outline-none focus:ring-2 transition-colors`}
                  disabled={isLoading}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-neutral-300 focus:ring-primary'
                  } focus:outline-none focus:ring-2 transition-colors`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.phone 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-neutral-300 focus:ring-primary'
                  } focus:outline-none focus:ring-2 transition-colors`}
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Category Preferences */}
              <div className="bg-neutral-50 p-4 rounded-xl">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 mt-1">
                    <AlertCircle className="w-5 h-5 text-neutral-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700">
                      Interested Categories
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Select categories you&apos;re interested in. You can change your final category later.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {eventCategories.map((category) => (
                    <label 
                      key={category.name}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        value={category.name}
                        {...register('categoryPreferences')}
                        className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary"
                        disabled={isLoading}
                      />
                      <div>
                        <p className="text-sm font-medium text-neutral-700">
                          {category.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {category.distance} • {formatCurrency(category.basePrice)}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 px-6 rounded-full font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Continue Registration'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

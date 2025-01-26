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
  } = useForm()

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
        category: data.category,
        user: userResult._id,  // Add user ID here
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
      // Handle errors
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

  // Category Selection
  const renderCategorySelection = () => {
    return (
      <div className="space-y-4">
        <h3 className="font-playfair font-semibold text-lg text-neutral-900">
          Select Category
        </h3>
        {eventCategories.map((category) => (
          <label 
            key={category.name}
            className={`
              flex items-center justify-between p-4 rounded-xl border 
              cursor-pointer transition-all duration-300
              ${watch('category') === category.name 
                ? 'border-[#4ECDC4] bg-[#4ECDC4]/10 shadow-sm' 
                : 'border-neutral-200 hover:border-[#4ECDC4]/50'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                {...register('category', { required: 'Please select a category' })}
                value={category.name}
                className="
                  w-4 h-4 
                  text-[#4ECDC4] 
                  focus:ring-[#4ECDC4] 
                  border-neutral-300
                  focus:ring-2
                "
              />
              <span className="font-montserrat text-neutral-800">
                {category.name}
              </span>
            </div>
            <span className="font-montserrat font-medium text-[#FF6B6B]">
              {formatCurrency(category.basePrice || 0)}
            </span>
          </label>
        ))}
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">
            {errors.category.message}
          </p>
        )}
      </div>
    )
  }

  // Modal Dialog
  const renderModal = () => {
    if (!isModalOpen) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-neutral-200">
            <h2 className="font-playfair text-xl font-bold text-neutral-900">
              Register for Event
            </h2>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            {renderCategorySelection()}

            {/* Full Name */}
            <div>
              <label 
                htmlFor="fullName" 
                className="block text-sm font-montserrat text-neutral-700 mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                {...register('fullName', { 
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-montserrat text-neutral-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label 
                htmlFor="phone" 
                className="block text-sm font-montserrat text-neutral-700 mb-2"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+91 1234567890"
                {...register('phone', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                    message: 'Invalid phone number'
                  }
                })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF6B6B] text-white py-3 rounded-full hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Register and Pay'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <>
      {renderRegistrationButton()}
      {renderModal()}
    </>
  )
}

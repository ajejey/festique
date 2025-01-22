'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getRegistrationDetails, completeRegistration } from '../../actions'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function CompleteRegistrationPage() {
  const params = useParams()
  const router = useRouter()
  const [registrationDetails, setRegistrationDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue 
  } = useForm()

  useEffect(() => {
    async function fetchRegistrationDetails() {
      try {
        const details = await getRegistrationDetails(params.registrationId)
        setRegistrationDetails(details)
        
        // Pre-fill form with existing details
        setValue('fullName', details.registrationDetails.name)
        setValue('email', details.registrationDetails.email)
        setValue('phone', details.registrationDetails.phone)
      } catch (error) {
        toast.error('Failed to load registration details', {
          description: error.message
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.registrationId) {
      fetchRegistrationDetails()
    }
  }, [params.registrationId, setValue])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      
      const result = await completeRegistration({
        registrationId: params.registrationId,
        additionalDetails: {
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          emergencyContact: {
            name: data.emergencyContactName,
            phone: data.emergencyContactPhone,
            relation: data.emergencyContactRelation
          },
          address: {
            street: data.street,
            city: data.city,
            state: data.state,
            country: data.country,
            pincode: data.pincode
          }
        }
      })

      toast.success('Registration Completed', {
        description: 'Your registration details have been saved successfully.'
      })

      // Redirect to confirmation page
      router.push(`/events/${params.id}/register/${params.registrationId}/confirmation`)
    } catch (error) {
      toast.error('Registration Completion Failed', {
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading registration details...</div>
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="font-playfair text-2xl font-bold mb-6">
        Complete Your Registration
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Full Name
            </label>
            <input
              {...register('fullName', { required: 'Full name is required' })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email
            </label>
            <input
              {...register('email', { required: 'Email is required' })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              disabled
            />
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              {...register('dateOfBirth', { required: 'Date of birth is required' })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-xs mt-1">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Gender
            </label>
            <select
              {...register('gender', { required: 'Gender is required' })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer Not to Say</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-neutral-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Emergency Contact</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Name
              </label>
              <input
                {...register('emergencyContactName', { required: 'Emergency contact name is required' })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              />
              {errors.emergencyContactName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.emergencyContactName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                {...register('emergencyContactPhone', { required: 'Emergency contact phone is required' })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              />
              {errors.emergencyContactPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.emergencyContactPhone.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Relation
              </label>
              <input
                {...register('emergencyContactRelation', { required: 'Relation is required' })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              />
              {errors.emergencyContactRelation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.emergencyContactRelation.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Address Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Street
              </label>
              <input
                {...register('street', { required: 'Street address is required' })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              />
              {errors.street && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.street.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                City
              </label>
              <input
                {...register('city', { required: 'City is required' })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                State
              </label>
              <input
                {...register('state', { required: 'State is required' })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Country
              </label>
              <input
                {...register('country', { required: 'Country is required' })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Pincode
              </label>
              <input
                {...register('pincode', { required: 'Pincode is required' })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              />
              {errors.pincode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.pincode.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full py-3 rounded-full 
            bg-[#FF6B6B] text-white 
            hover:bg-[#ff5252] 
            transition-colors
            disabled:opacity-50
          "
        >
          {isLoading ? 'Saving...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  )
}

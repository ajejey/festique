'use client'

import { useParams, useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import BasicDetailsSection from './components/BasicDetailsSection'
import EmergencyContactSection from './components/EmergencyContactSection'
import AddressSection from './components/AddressSection'
import TshirtSection from './components/TshirtSection'
import MedicalSection from './components/MedicalSection'
import RulesSection from './components/RulesSection'
import DynamicFieldsSection from './components/DynamicFieldsSection'
import CategorySection from './components/CategorySection'
import { getRegistrationDetails, completeRegistration, getEventDetails } from '../actions'

export default function CompleteRegistrationPage() {
  const params = useParams()
  const router = useRouter()
  const [registrationDetails, setRegistrationDetails] = useState(null)
  const [eventDetails, setEventDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  console.log("eventDetails ", eventDetails)

  const methods = useForm({
    defaultValues: {
      registrationDetails: {
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        medicalInfo: {
          medicalConditions: '',
          allergies: '',
          medications: '',
          emergencyMedicalNotes: ''
        }
      },
      category: '',
      tshirtDetails: {
        size: '',
        additionalTshirts: []
      },
      rulesAcknowledged: false,
      customFields: {}
    }
  })

  const { setValue, register, handleSubmit, formState: { errors, isSubmitting }, watch } = methods

  useEffect(() => {
    async function fetchDetails() {
      try {
        const [registration, event] = await Promise.all([
          getRegistrationDetails(params.registrationId),
          getEventDetails(params.id)
        ])
        
        setRegistrationDetails(registration)
        setEventDetails(event)
        
        // Pre-fill form with existing details
        setValue('registrationDetails.name', registration.registrationDetails?.name)
        setValue('registrationDetails.email', registration.registrationDetails?.email)
        setValue('registrationDetails.phone', registration.registrationDetails?.phone)
        
        // Pre-fill other fields if they exist
        if (registration.registrationDetails?.dateOfBirth) {
          setValue('registrationDetails.dateOfBirth', 
            new Date(registration.registrationDetails.dateOfBirth).toISOString().split('T')[0]
          )
        }
        if (registration.registrationDetails?.gender) {
          setValue('registrationDetails.gender', registration.registrationDetails.gender)
        }
        
        // Pre-fill category if exists
        if (registration.category) {
          setValue('category', registration.category)
        }
        
        // Pre-fill t-shirt details if they exist
        if (registration.tshirtDetails?.size) {
          setValue('tshirtDetails.size', registration.tshirtDetails.size)
        }
        if (registration.tshirtDetails?.additionalTshirts?.length > 0) {
          setValue('tshirtDetails.additionalTshirts', registration.tshirtDetails.additionalTshirts)
        }

        // Pre-fill rules acknowledgment
        if (registration.rulesAcknowledged) {
          setValue('rulesAcknowledged', registration.rulesAcknowledged)
        }
      } catch (error) {
        toast.error('Failed to load registration details', {
          description: error.message
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.registrationId && params.id) {
      fetchDetails()
    }
  }, [params.registrationId, params.id, setValue])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      
      // Transform form data to match the Registration model structure
      const formattedData = {
        registrationId: params.registrationId,
        registrationDetails: {
          ...data.registrationDetails,
          dateOfBirth: new Date(data.registrationDetails.dateOfBirth),
          medicalInfo: {
            medicalConditions: data.registrationDetails.medicalInfo.medicalConditions?.split(',').map(item => item.trim()) || [],
            allergies: data.registrationDetails.medicalInfo.allergies?.split(',').map(item => item.trim()) || [],
            medications: data.registrationDetails.medicalInfo.medications?.split(',').map(item => item.trim()) || [],
            emergencyMedicalNotes: data.registrationDetails.medicalInfo.emergencyMedicalNotes
          }
        },
        category: data.category,
        tshirtDetails: {
          size: data.tshirtDetails.size,
          additionalTshirts: data.tshirtDetails.additionalTshirts
        },
        rulesAcknowledged: data.rulesAcknowledged,
        customFields: Object.entries(data.customFields || {}).map(([fieldId, value]) => {
          const field = eventDetails.dynamicRegistrationFields.find(f => f.id === fieldId)
          return {
            fieldId,
            label: field.label,
            type: field.type,
            value
          }
        })
      }

      const result = await completeRegistration(formattedData)

      toast.success('Registration Completed', {
        description: 'Your registration details have been saved successfully.'
      })

      // Redirect to confirmation page
      router.push(`/events/${params.id}/register/${params.registrationId}/confirmation`)
    } catch (error) {
      toast.error('Registration Completion Failed', {
        description: error.message || 'An unexpected error occurred. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-neutral-600 animate-pulse">
          {isSubmitting ? 'Saving your registration...' : 'Loading registration details...'}
        </p>
      </div>
    )
  }

  if (!registrationDetails || !eventDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">Registration Not Found</h1>
          <p className="text-neutral-600">The registration details could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-playfair text-3xl font-bold mb-8">
            Complete Your Registration
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Details */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <BasicDetailsSection 
                register={register} 
                errors={errors} 
                disabled={true}
              />
            </div>

            {/* Category Selection */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <CategorySection 
                register={register}
                errors={errors}
                eventCategories={eventDetails.categories}
                categoryPreferences={registrationDetails.categoryPreferences}
              />
            </div>

            {/* T-shirt Selection */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <TshirtSection 
                register={register}
                errors={errors}
                tshirtOptions={eventDetails.tshirtOptions}
              />
            </div>

            {/* Medical Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <MedicalSection 
                register={register}
                errors={errors}
              />
            </div>

            {/* Emergency Contact */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <EmergencyContactSection 
                register={register}
                errors={errors}
              />
            </div>

            {/* Address */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <AddressSection 
                register={register}
                errors={errors}
              />
            </div>

            {/* Dynamic Fields */}
            {eventDetails.dynamicRegistrationFields?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <DynamicFieldsSection 
                  register={register}
                  errors={errors}
                  fields={eventDetails.dynamicRegistrationFields}
                />
              </div>
            )}

            {/* Rules */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <RulesSection 
                register={register}
                errors={errors}
                rules={eventDetails.rules}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading || isSubmitting ? 'Saving...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  )
}

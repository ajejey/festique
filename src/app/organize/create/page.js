'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import EventBasicInfoForm from './components/EventBasicInfoForm'
import EventDetailsReactHookForm from './components/EventDetailsReactHookForm'
import EventTicketingForm from './components/EventTicketingForm'
import EventMediaUpload from './components/EventMediaUpload'
import DynamicRegistrationFields from './components/DynamicRegistrationFields'
import { createEvent } from '../actions'

export default function CreateEventPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    eventType: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationOpenDate: '',
    registrationCloseDate: '',
    location: {
      venue: '',
      address: '',
      city: '',
      state: '',
      country: ''
    },
    ticketTiers: [],
    coverImage: null,
    additionalImages: []
  })
  const [dynamicFields, setDynamicFields] = useState([])
  const [location, setLocation] = useState({
    venue: '',
    address: '',
    city: '',
    state: '',
    country: '',
    coordinates: { lat: null, lng: null },
    googleMapsLink: ''
  })

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation)
  }

  const steps = [
    {
      component: EventBasicInfoForm,
      title: 'Basic Event Information'
    },
    {
      component: EventDetailsReactHookForm,
      title: 'Event Details'
    },
    {
      component: EventTicketingForm,
      title: 'Ticketing'
    },
    // {
    //   component: DynamicRegistrationFields,
    //   title: 'Custom Registration Fields'
    // },
    {
      component: EventMediaUpload,
      title: 'Media & Promotion'
    }
  ]

  const handleNextStep = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }))
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1))
  }

  const handlePrevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0))
  }

  const handleDynamicFieldsChange = (fields) => {
    setDynamicFields(fields)
  }

  const handleSubmit = async () => {
    console.log('Form Data before submit:', formData);
    const completeEventData = {
      ...formData,
      status: 'Draft',
      dynamicRegistrationFields: dynamicFields,
      coverImage: formData.coverImage || null,
      additionalImages: formData.additionalImages || [],
      ticketTiers: formData.ticketTiers.map(tier => ({
        name: tier.name || '',
        discountPercentage: tier.discountPercentage || 0,
        startDate: tier.startDate || null,
        endDate: tier.endDate || null,
        isEarlyBird: tier.isEarlyBird || false
      }))
    }
    console.log('Complete Event Data:', completeEventData);

    try {
      const result = await createEvent(completeEventData)
      
      if (result.success) {
        localStorage.setItem('currentEventId', result.eventId)
        router.push('/organize/create/registration?eventId=' + result.eventId)
      } else {
        console.error(result.message)
      }
    } catch (error) {
      console.error('Event creation failed:', error)
    }
  }

  console.log("Current Step:", currentStep)
  console.log("Form Data:", formData)
  

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`
                flex-1 h-1 mx-2 rounded-full 
                ${index <= currentStep 
                  ? 'bg-[#FF6B6B]' 
                  : 'bg-neutral-300'
                }
              `}
            />
          ))}
        </div>

        {currentStep < steps.length - 1 ? (
          <CurrentStepComponent 
            initialData={formData}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            isLastStep={currentStep === steps.length - 1}
            onSubmit={handleSubmit}
          />
        ) : (
          <EventMediaUpload
            initialData={formData}
            onNext={async (mediaData) => {
              // First update the form data
              setFormData(prev => ({
                ...prev,
                coverImage: mediaData.coverImage,
                additionalImages: mediaData.additionalImages
              }));
              
              // Then create the event with complete data
              const completeEventData = {
                ...formData,
                coverImage: mediaData.coverImage,
                additionalImages: mediaData.additionalImages,
                status: 'Draft',
                dynamicRegistrationFields: dynamicFields,
                ticketTiers: formData.ticketTiers?.map(tier => ({
                  name: tier.name || '',
                  discountPercentage: tier.discountPercentage || 0,
                  startDate: tier.startDate || null,
                  endDate: tier.endDate || null,
                  isEarlyBird: tier.isEarlyBird || false
                })) || []
              };

              try {
                const result = await createEvent(completeEventData);
                if (result.success) {
                  localStorage.setItem('currentEventId', result.eventId);
                  router.push('/organize/create/registration?eventId=' + result.eventId);
                } else {
                  console.error(result.message);
                }
              } catch (error) {
                console.error('Event creation failed:', error);
              }
            }}
            onPrev={() => setCurrentStep(steps.length - 2)}
            isLastStep={true}
          />
        )}
      </div>
    </div>
  )
}

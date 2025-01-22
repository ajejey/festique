'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
// import { getRegistrationDetails } from '../../actions'
import { 
  Check, 
  Calendar, 
  MapPin, 
  Ticket, 
  Download, 
  Share2 
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { getRegistrationDetails } from '../../../actions'

export default function RegistrationConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const [registrationDetails, setRegistrationDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRegistrationDetails() {
      try {
        const details = await getRegistrationDetails(params.registrationId)
        setRegistrationDetails(details)
      } catch (error) {
        toast.error('Failed to load registration details', {
          description: error.message
        })
        router.push('/events')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.registrationId) {
      fetchRegistrationDetails()
    }
  }, [params.registrationId, router])

  const handleDownloadTicket = () => {
    // TODO: Implement ticket download functionality
    toast.info('Ticket Download', {
      description: 'Ticket download feature coming soon!'
    })
  }

  const handleShareEvent = () => {
    // TODO: Implement event sharing functionality
    toast.info('Event Sharing', {
      description: 'Share event feature coming soon!'
    })
  }

  // Location rendering function
  const renderEventLocation = (location) => {
    if (typeof location === 'string') return location
    
    // If location is an object, construct a readable address
    if (location && typeof location === 'object') {
      const addressParts = [
        location.venue,
        location.address,
        location.city,
        location.state,
        location.country
      ].filter(Boolean)

      return addressParts.join(', ')
    }

    return 'Location not specified'
  }

  if (isLoading) {
    return <div>Loading confirmation details...</div>
  }

  if (!registrationDetails) {
    return null
  }

  const { event, category } = registrationDetails

  console.log("event", event)

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Success Header */}
        <div className="text-center">
          <div className="bg-[#4ECDC4] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-neutral-900 mb-2">
            Registration Confirmed!
          </h1>
          <p className="font-montserrat text-neutral-600">
            You're all set for the {event.name} event.
          </p>
        </div>

        {/* Event Details */}
        <div className="bg-neutral-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#FF6B6B]" />
            <span className="font-montserrat text-neutral-800">
              {new Date(event.startDate).toLocaleDateString('en-US', {
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#FF6B6B]" />
            <span className="font-montserrat text-neutral-800">
              {renderEventLocation(event.location)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Ticket className="w-5 h-5 text-[#FF6B6B]" />
            <span className="font-montserrat text-neutral-800">
              {category} Category
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleDownloadTicket}
            className="
              flex items-center justify-center gap-2
              w-full py-3 rounded-full 
              bg-neutral-100 text-neutral-800
              hover:bg-neutral-200
              transition-colors
            "
          >
            <Download className="w-5 h-5" />
            Download Ticket
          </button>
          <button 
            onClick={handleShareEvent}
            className="
              flex items-center justify-center gap-2
              w-full py-3 rounded-full 
              bg-[#FF6B6B] text-white 
              hover:bg-[#ff5252]
              transition-colors
            "
          >
            <Share2 className="w-5 h-5" />
            Share Event
          </button>
        </div>

        {/* Next Steps */}
        <div className="bg-[#4ECDC4]/10 rounded-xl p-4">
          <h3 className="font-playfair font-semibold text-lg mb-3 text-neutral-900">
            What's Next?
          </h3>
          <ul className="font-montserrat text-neutral-700 space-y-2 list-disc list-inside">
            <li>Check your email for event details</li>
            <li>Prepare for the event day</li>
            <li>Arrive at least 30 minutes early</li>
          </ul>
        </div>

        {/* Continue Exploring */}
        <div className="text-center">
          <Link 
            href="/events" 
            className="
              inline-block px-6 py-3 
              bg-neutral-100 text-neutral-800
              rounded-full 
              hover:bg-neutral-200
              transition-colors
              font-montserrat
            "
          >
            Explore More Events
          </Link>
        </div>
      </div>
    </div>
  )
}

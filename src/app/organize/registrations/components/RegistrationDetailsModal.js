'use client'

import { X, User, Mail, Phone, Calendar, MapPin, CreditCard, TicketCheck } from 'lucide-react'

export default function RegistrationDetailsModal({ 
  registration, 
  onClose 
}) {
  if (!registration) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div 
      className="
        fixed inset-0 z-50 
        flex items-center justify-center 
        bg-black/50 backdrop-blur-sm
        p-4
      "
      onClick={onClose}
    >
      <div 
        className="
          bg-white rounded-2xl shadow-2xl 
          max-w-md w-full 
          max-h-[90vh] overflow-y-auto
          relative
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="
            absolute top-4 right-4 
            p-2 rounded-full 
            hover:bg-neutral-100
            transition-colors
          "
        >
          <X className="w-6 h-6 text-neutral-600" />
        </button>

        {/* Header */}
        <div 
          className="
            bg-[#FF6B6B] text-white 
            px-6 py-4 
            rounded-t-2xl
            flex items-center gap-3
          "
        >
          <TicketCheck className="w-8 h-8" />
          <div>
            <h2 className="font-playfair text-xl font-bold">
              Registration Details
            </h2>
            <p className="font-montserrat text-sm">
              {registration.event.name}
            </p>
          </div>
        </div>

        {/* User Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-[#FF6B6B]" />
            <div>
              <p className="font-montserrat font-semibold">
                {registration.registrationDetails.name}
              </p>
              <p className="text-neutral-600 text-sm">
                Participant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#FF6B6B]" />
            <p className="font-montserrat">
              {registration.registrationDetails.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-[#FF6B6B]" />
            <p className="font-montserrat">
              {registration.registrationDetails.phone || 'Not provided'}
            </p>
          </div>

          {/* Event Details */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-[#FF6B6B]" />
              <p className="font-montserrat">
                {formatDate(registration.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-[#FF6B6B]" />
              <p className="font-montserrat">
                {registration.event.location?.venue || 'Location not specified'}
              </p>
            </div>
          </div>

          {/* Registration Details */}
          <div className="border-t pt-4 mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="font-montserrat text-sm text-neutral-600">
                Category
              </p>
              <p className="font-montserrat font-semibold">
                {registration.category}
              </p>
            </div>

            <div>
              <p className="font-montserrat text-sm text-neutral-600">
                Status
              </p>
              <span 
                className={`
                  inline-block px-2 py-1 rounded-full text-xs
                  ${
                    registration.status.participation === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-neutral-100 text-neutral-800'
                  }
                `}
              >
                {registration.status.participation}
              </span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#FF6B6B]" />
              <div>
                <p className="font-montserrat font-semibold">
                  {registration.payment.amount} | {registration.payment.status}
                </p>
                <p className="text-neutral-600 text-sm">
                  Payment Details
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

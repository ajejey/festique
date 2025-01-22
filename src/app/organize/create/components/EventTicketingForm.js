'use client'

import { useState } from 'react'
import { ChevronLeft, PlusCircle } from 'lucide-react'

export default function EventTicketingForm({ 
  onNext, 
  onPrev, 
  initialData 
}) {
  const [ticketTiers, setTicketTiers] = useState(
    initialData?.ticketTiers?.length > 0 
      ? initialData.ticketTiers 
      : [{ 
          name: '', 
          discountPercentage: 0, 
          startDate: '', 
          endDate: '', 
          isEarlyBird: false 
        }]
  )
  const [errors, setErrors] = useState({})

  const handleTicketChange = (index, e) => {
    const { name, value, type, checked } = e.target
    const updatedTiers = [...ticketTiers]
    
    updatedTiers[index] = {
      ...updatedTiers[index],
      [name]: type === 'checkbox' ? checked : value
    }
    
    setTicketTiers(updatedTiers)
  }

  const addTicketTier = () => {
    setTicketTiers([
      ...ticketTiers, 
      { 
        name: '', 
        discountPercentage: 0, 
        startDate: '', 
        endDate: '', 
        isEarlyBird: false 
      }
    ])
  }

  const removeTicketTier = (indexToRemove) => {
    if (ticketTiers.length > 1) {
      setTicketTiers(ticketTiers.filter((_, index) => index !== indexToRemove))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    ticketTiers.forEach((tier, index) => {
      if (tier.name.trim() || tier.startDate.trim() || tier.endDate.trim()) {
        if (!tier.name.trim()) newErrors[`${index}.name`] = 'Ticket tier name is required'
        
        if (tier.startDate && tier.endDate) {
          const start = new Date(tier.startDate)
          const end = new Date(tier.endDate)
          
          if (start > end) {
            newErrors[`${index}.endDate`] = 'End date must be after start date'
          }
        }
        
        if (tier.discountPercentage < 0 || tier.discountPercentage > 100) {
          newErrors[`${index}.discountPercentage`] = 'Discount must be between 0 and 100'
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Filter out completely empty tiers
      const filteredTiers = ticketTiers.filter(tier => 
        tier.name.trim() || 
        tier.startDate.trim() || 
        tier.endDate.trim()
      )
      
      onNext({ ticketTiers: filteredTiers })
    }
  }

  const handleSkip = () => {
    onNext({ ticketTiers: [] })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-playfair font-bold text-neutral-800 mb-6">
        Event Ticketing Details
      </h2>
      <p className="text-neutral-600 font-montserrat mb-6">
        Define ticket tiers for your event. You can create multiple tiers with different pricing and availability.
      </p>

      {ticketTiers.map((tier, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label 
                htmlFor={`ticketTiers.${index}.name`} 
                className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
              >
                Ticket Tier Name
              </label>
              <input
                type="text"
                id={`ticketTiers.${index}.name`}
                name="name"
                value={tier.name}
                onChange={(e) => handleTicketChange(index, e)}
                placeholder="e.g. Early Bird, Standard, Last Minute"
                className={`
                  w-full px-4 py-3 rounded-lg border 
                  ${errors[`${index}.name`] 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-neutral-300 focus:border-primary focus:ring-primary'}
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                  font-montserrat text-neutral-900
                `}
              />
              {errors[`${index}.name`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`${index}.name`]}</p>
              )}
            </div>

            <div>
              <label 
                htmlFor={`ticketTiers.${index}.discountPercentage`} 
                className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
              >
                Discount Percentage
              </label>
              <input
                type="number"
                id={`ticketTiers.${index}.discountPercentage`}
                name="discountPercentage"
                value={tier.discountPercentage}
                onChange={(e) => handleTicketChange(index, e)}
                min="0"
                max="100"
                placeholder="0-100%"
                className={`
                  w-full px-4 py-3 rounded-lg border 
                  ${errors[`${index}.discountPercentage`] 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-neutral-300 focus:border-primary focus:ring-primary'}
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                  font-montserrat text-neutral-900
                `}
              />
              {errors[`${index}.discountPercentage`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`${index}.discountPercentage`]}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label 
                htmlFor={`ticketTiers.${index}.startDate`} 
                className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
              >
                Start Date
              </label>
              <input
                type="date"
                id={`ticketTiers.${index}.startDate`}
                name="startDate"
                value={tier.startDate}
                onChange={(e) => handleTicketChange(index, e)}
                className={`
                  w-full px-4 py-3 rounded-lg border 
                  ${errors[`${index}.startDate`] 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-neutral-300 focus:border-primary focus:ring-primary'}
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                  font-montserrat text-neutral-900
                `}
              />
              {errors[`${index}.startDate`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`${index}.startDate`]}</p>
              )}
            </div>

            <div>
              <label 
                htmlFor={`ticketTiers.${index}.endDate`} 
                className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
              >
                End Date
              </label>
              <input
                type="date"
                id={`ticketTiers.${index}.endDate`}
                name="endDate"
                value={tier.endDate}
                onChange={(e) => handleTicketChange(index, e)}
                className={`
                  w-full px-4 py-3 rounded-lg border 
                  ${errors[`${index}.endDate`] 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-neutral-300 focus:border-primary focus:ring-primary'}
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                  font-montserrat text-neutral-900
                `}
              />
              {errors[`${index}.endDate`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`${index}.endDate`]}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <input
              type="checkbox"
              id={`ticketTiers.${index}.isEarlyBird`}
              name="isEarlyBird"
              checked={tier.isEarlyBird}
              onChange={(e) => handleTicketChange(index, e)}
              className="
                w-4 h-4 rounded-lg border 
                border-neutral-300 focus:border-primary focus:ring-primary
                focus:outline-none focus:ring-2 focus:ring-opacity-50
              "
            />
            <label 
              htmlFor={`ticketTiers.${index}.isEarlyBird`} 
              className="block text-sm font-montserrat font-medium text-neutral-700"
            >
              Is Early Bird
            </label>
          </div>

          {ticketTiers.length > 1 && (
            <div className="mt-4 text-right">
              <button
                type="button"
                onClick={() => removeTicketTier(index)}
                className="
                  text-red-500 hover:text-red-600 
                  font-montserrat text-sm 
                  transition-colors
                "
              >
                Remove Tier
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-between items-center mb-6">
        <button
          type="button"
          onClick={addTicketTier}
          className="
            flex items-center gap-2 text-primary 
            hover:text-primary/80 transition-colors
            font-montserrat font-medium
          "
        >
          <PlusCircle className="w-5 h-5" /> Add Another Tier
        </button>
      </div>

      <div className="flex justify-between items-center mt-8">
        <button 
          type="button" 
          onClick={onPrev} 
          className="
            flex items-center gap-2 text-neutral-600 
            hover:text-neutral-900 transition-colors
            font-montserrat font-medium
          "
        >
          <ChevronLeft className="w-5 h-5" /> Previous
        </button>

        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={handleSkip}
            className="
              text-neutral-600 hover:text-neutral-900 
              transition-colors font-montserrat font-medium
            "
          >
            Skip
          </button>

          <button 
            type="submit" 
            className="
              bg-[#FF6B6B] text-white px-6 py-3 
              rounded-full hover:bg-[#ff5252] 
              transition-colors font-montserrat font-medium
            "
          >
            Continue
          </button>
        </div>
      </div>
    </form>
  )
}

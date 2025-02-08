'use client'

import { CheckCircle } from 'lucide-react'

export default function RulesSection({ register, errors, event }) {
  console.log("event in rules section", event)
  return (
    <div className="space-y-6">
      <h3 className="font-playfair text-xl font-semibold">Event Rules & Amenities</h3>
      
      <div className="space-y-6">
        {/* Rules */}
        <div>
          <h4 className="font-medium mb-2">Event Rules</h4>
          <ul className="list-disc pl-5 space-y-1">
            {event?.rules?.map((rule, index) => (
              <li key={index} className="text-sm text-neutral-600">{rule}</li>
            ))}
          </ul>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="font-medium mb-2">Available Amenities</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {event?.amenities?.map((amenity, index) => (
              <div key={index} className="text-sm text-neutral-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                {amenity}
              </div>
            ))}
          </div>
        </div>

        {/* Rules Acknowledgment */}
        <div className="pt-4 border-t border-neutral-200">
          <label className="flex items-start space-x-2">
            <input
              type="checkbox"
              {...register('rulesAcknowledged', {
                required: 'You must acknowledge the rules'
              })}
              className="mt-1"
            />
            <span className="text-sm text-neutral-700">
              I have read and agree to follow all event rules and guidelines
            </span>
          </label>
          {errors.rulesAcknowledged && (
            <p className="text-red-500 text-xs mt-1">
              {errors.rulesAcknowledged.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

export default function EmergencyContactSection({ register, errors }) {
  return (
    <div className="space-y-6">
      <h3 className="font-playfair text-xl font-semibold">Emergency Contact</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Contact Name *
          </label>
          <input
            {...register('registrationDetails.emergencyContact.name', { 
              required: 'Emergency contact name is required' 
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
          {errors.registrationDetails?.emergencyContact?.name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.registrationDetails.emergencyContact.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Contact Phone *
          </label>
          <input
            type="tel"
            {...register('registrationDetails.emergencyContact.phone', {
              required: 'Emergency contact phone is required',
              pattern: {
                value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                message: 'Please enter a valid phone number'
              }
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
          {errors.registrationDetails?.emergencyContact?.phone && (
            <p className="text-red-500 text-xs mt-1">
              {errors.registrationDetails.emergencyContact.phone.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Relationship *
          </label>
          <input
            {...register('registrationDetails.emergencyContact.relation', { 
              required: 'Relationship is required' 
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
          {errors.registrationDetails?.emergencyContact?.relation && (
            <p className="text-red-500 text-xs mt-1">
              {errors.registrationDetails.emergencyContact.relation.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

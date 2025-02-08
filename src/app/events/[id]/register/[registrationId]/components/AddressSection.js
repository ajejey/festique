'use client'

export default function AddressSection({ register, errors }) {
  return (
    <div className="space-y-6">
      <h3 className="font-playfair text-xl font-semibold">Address Information</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Street Address
          </label>
          <input
            {...register('registrationDetails.address.street')}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
          {errors.registrationDetails?.address?.street && (
            <p className="text-red-500 text-xs mt-1">
              {errors.registrationDetails.address.street.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            City *
          </label>
          <input
            {...register('registrationDetails.address.city', { 
              required: 'City is required' 
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
          {errors.registrationDetails?.address?.city && (
            <p className="text-red-500 text-xs mt-1">
              {errors.registrationDetails.address.city.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            State
          </label>
          <input
            {...register('registrationDetails.address.state')}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
          {errors.registrationDetails?.address?.state && (
            <p className="text-red-500 text-xs mt-1">
              {errors.registrationDetails.address.state.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Pincode
          </label>
          <input
            {...register('registrationDetails.address.pincode')}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
          {errors.registrationDetails?.address?.pincode && (
            <p className="text-red-500 text-xs mt-1">
              {errors.registrationDetails.address.pincode.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Country *
          </label>
          <input
            {...register('registrationDetails.address.country', { 
              required: 'Country is required' 
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
          {errors.registrationDetails?.address?.country && (
            <p className="text-red-500 text-xs mt-1">
              {errors.registrationDetails.address.country.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

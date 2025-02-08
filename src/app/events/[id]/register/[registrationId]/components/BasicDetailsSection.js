'use client'

export default function BasicDetailsSection({ register, errors, disabled = false }) {
  return (
    <div className="space-y-6">
      <h3 className="font-playfair text-xl font-semibold">Basic Details</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Full Name
          </label>
          <input
            {...register('registrationDetails.name', { required: 'Full name is required' })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg disabled:bg-neutral-100"
            disabled={disabled}
          />
          {errors.registrationDetails?.name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.registrationDetails.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register('registrationDetails.email', { 
              required: 'Email is required',
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Please enter a valid email'
              }
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg disabled:bg-neutral-100"
            disabled={disabled}
          />
          {errors.registrationDetails?.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.registrationDetails.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            {...register('registrationDetails.phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                message: 'Please enter a valid phone number'
              }
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg disabled:bg-neutral-100"
            disabled={disabled}
          />
          {errors.registrationDetails?.phone && (
            <p className="text-red-500 text-xs mt-1">
              {errors.registrationDetails.phone.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            {...register('registrationDetails.dateOfBirth', { 
              required: 'Date of birth is required',
              validate: value => {
                const age = new Date().getFullYear() - new Date(value).getFullYear()
                return (age >= 10 && age < 120) || 'Invalid date of birth'
              }
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
          {errors.registrationDetails?.dateOfBirth && (
            <p className="text-red-500 text-xs mt-1">
              {errors.registrationDetails.dateOfBirth.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Gender
          </label>
          <select
            {...register('registrationDetails.gender', { required: 'Gender is required' })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer Not to Say</option>
          </select>
          {errors.registrationDetails?.gender && (
            <p className="text-red-500 text-xs mt-1">
              {errors.registrationDetails.gender.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

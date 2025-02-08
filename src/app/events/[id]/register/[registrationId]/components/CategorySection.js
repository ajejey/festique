'use client'

import { AlertCircle, Info } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useFormContext } from 'react-hook-form'

export default function CategorySection({ errors, eventCategories, categoryPreferences }) {
  const { register, watch } = useFormContext()
  const dateOfBirth = watch('registrationDetails.dateOfBirth')
  
  // Calculate age and determine eligible categories
  const getAgeAndEligibility = () => {
    if (!dateOfBirth) return { age: null, eligibleCategories: [] }
    
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    
    // Adjust age if birthday hasn't occurred this year
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    // Find eligible categories based on age
    const eligibleCategories = eventCategories.filter(
      category => age >= category.ageGroup.min && age <= category.ageGroup.max
    )
    
    return { age, eligibleCategories }
  }

  const { age, eligibleCategories } = getAgeAndEligibility()

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        {/* <div className="flex-shrink-0 mt-1">
          <AlertCircle className="w-5 h-5 text-primary" />
        </div> */}
        <div>
          <h3 className="font-playfair text-xl font-semibold">Select Your Category</h3>
          <p className="text-sm text-neutral-600 mt-1">
            Choose the category you want to participate in
          </p>
        </div>
      </div>

      {/* Age-based feedback */}
      {age !== null && (
        <div className={`p-4 rounded-xl ${
          eligibleCategories.length > 0 
            ? 'bg-secondary/10 border border-secondary/20' 
            : 'bg-red-50 border border-red-100'
        }`}>
          <div className="flex items-start gap-3">
            <Info className={`w-5 h-5 flex-shrink-0 ${
              eligibleCategories.length > 0 ? 'text-secondary' : 'text-red-500'
            }`} />
            <div>
              <p className="text-sm font-medium text-neutral-700">
                Based on your age ({age} years)
              </p>
              {eligibleCategories.length > 0 ? (
                <p className="text-sm text-neutral-600 mt-1">
                  You are eligible for: {eligibleCategories.map(c => c.name).join(', ')}
                </p>
              ) : (
                <p className="text-sm text-red-600 mt-1">
                  There are no categories available for your age group
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Previous preferences */}
      {categoryPreferences?.length > 0 && (
        <div className="bg-neutral-50 p-4 rounded-xl">
          <p className="text-sm text-neutral-600 mb-2">
            Your previously selected interests:
          </p>
          <div className="flex flex-wrap gap-2">
            {categoryPreferences.map((pref) => (
              <span 
                key={pref} 
                className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-100 text-sm text-neutral-700"
              >
                {pref}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {eventCategories?.map((category) => {
          const isEligible = age !== null && age >= category.ageGroup.min && age <= category.ageGroup.max
          
          return (
            <label 
              key={category.name}
              className={`
                block p-4 rounded-xl border transition-all relative
                ${errors?.category 
                  ? 'border-red-200 hover:border-red-300' 
                  : isEligible
                    ? 'border-neutral-200 hover:border-primary cursor-pointer'
                    : 'border-neutral-200 opacity-50 cursor-not-allowed'
                }
                ${!isEligible && 'pointer-events-none'}
              `}
            >
              <div className="flex items-start">
                <input
                  type="radio"
                  value={category.name}
                  disabled={!isEligible}
                  {...register('category', { 
                    required: 'Please select a category to participate in',
                    validate: value => {
                      if (!age) return 'Please enter your date of birth first'
                      const selectedCategory = eventCategories.find(c => c.name === value)
                      return (age >= selectedCategory.ageGroup.min && age <= selectedCategory.ageGroup.max) || 
                        'You are not eligible for this category based on your age'
                    }
                  })}
                  className="peer mt-1 w-4 h-4 border-neutral-300 text-primary focus:ring-primary disabled:opacity-50"
                />
                <div className="ml-3 flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-neutral-900">{category.name}</p>
                      <p className="text-sm text-neutral-600 mt-1">{category.distance}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Age: {category.ageGroup.min}-{category.ageGroup.max} years
                      </p>
                    </div>
                    <p className="font-medium text-primary">
                      {formatCurrency(category.basePrice)}
                    </p>
                  </div>
                  {category.description && (
                    <p className="text-sm text-neutral-600 mt-2">{category.description}</p>
                  )}
                </div>
              </div>
              
              {/* Ineligible overlay */}
              {!isEligible && age !== null && (
                <div className="absolute inset-0 bg-neutral-50/80 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                  <p className="text-sm text-neutral-500 font-medium px-4 text-center">
                    Not eligible for this age group
                  </p>
                </div>
              )}
              <div className="absolute inset-0 border-2 border-primary bg-primary/5 rounded-xl opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
            </label>
          )
        })}
        {errors?.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>
    </div>
  )
}

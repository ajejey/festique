'use client'

export default function DynamicFieldsSection({ register, errors, dynamicFields }) {
  if (!dynamicFields?.length) return null

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            {...register(`customFields.${field.id}`, {
              required: field.required ? `${field.label} is required` : false,
              ...field.validationRules && {
                minLength: {
                  value: field.validationRules.minLength,
                  message: `Minimum ${field.validationRules.minLength} characters required`
                },
                maxLength: {
                  value: field.validationRules.maxLength,
                  message: `Maximum ${field.validationRules.maxLength} characters allowed`
                },
                pattern: field.validationRules.pattern && {
                  value: new RegExp(field.validationRules.pattern),
                  message: 'Invalid format'
                }
              }
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
        )

      case 'number':
        return (
          <input
            type="number"
            {...register(`customFields.${field.id}`, {
              required: field.required ? `${field.label} is required` : false,
              valueAsNumber: true
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
        )

      case 'dropdown':
        return (
          <select
            {...register(`customFields.${field.id}`, {
              required: field.required ? `${field.label} is required` : false
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  {...register(`customFields.${field.id}`, {
                    required: field.required ? `${field.label} is required` : false
                  })}
                />
                <span className="text-sm text-neutral-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={option}
                  {...register(`customFields.${field.id}`, {
                    required: field.required ? `${field.label} is required` : false
                  })}
                />
                <span className="text-sm text-neutral-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'date':
        return (
          <input
            type="date"
            {...register(`customFields.${field.id}`, {
              required: field.required ? `${field.label} is required` : false
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="font-playfair text-xl font-semibold">Additional Information</h3>
      
      <div className="space-y-4">
        {dynamicFields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              {field.label} {field.required && '*'}
            </label>
            {renderField(field)}
            {errors.customFields?.[field.id] && (
              <p className="text-red-500 text-xs mt-1">
                {errors.customFields[field.id].message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

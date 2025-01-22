'use client'

import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'

export function FieldConfigForm({ 
  type, 
  onSubmit, 
  initialData = {} 
}) {
  const [fieldConfig, setFieldConfig] = useState({
    label: initialData?.label || '',
    required: initialData?.required || false,
    options: initialData?.options || [],
    validationRules: initialData?.validationRules || {}
  })

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target
    setFieldConfig(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }))
  }

  const handleOptionsChange = (index, value) => {
    const newOptions = [...fieldConfig.options]
    newOptions[index] = value
    setFieldConfig(prev => ({ ...prev, options: newOptions }))
  }

  const addOption = () => {
    setFieldConfig(prev => ({ 
      ...prev, 
      options: [...prev.options, ''] 
    }))
  }

  const removeOption = (index) => {
    const newOptions = fieldConfig.options.filter((_, i) => i !== index)
    setFieldConfig(prev => ({ ...prev, options: newOptions }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...fieldConfig,
      type,
      id: initialData?.id || crypto.randomUUID()
    })
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6 bg-white p-6 rounded-2xl shadow-sm"
    >
      <div>
        <label 
          htmlFor="label" 
          className="block text-sm font-montserrat text-neutral-700 mb-2"
        >
          Field Label
        </label>
        <input
          id="label"
          name="label"
          value={fieldConfig.label}
          onChange={handleChange}
          placeholder="Enter field label"
          required
          className="w-full px-3 py-2 border border-neutral-300 rounded-md font-montserrat focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="flex items-center justify-between">
        <label 
          htmlFor="required" 
          className="text-sm font-montserrat text-neutral-700"
        >
          Required Field
        </label>
        <input
          type="checkbox"
          id="required"
          name="required"
          checked={fieldConfig.required}
          onChange={(e) => setFieldConfig(prev => ({ 
            ...prev, 
            required: e.target.checked 
          }))}
          className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
        />
      </div>

      {['dropdown', 'radio'].includes(type) && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-montserrat text-neutral-700">
              Options
            </label>
            <button 
              type="button" 
              onClick={addOption}
              className="flex items-center text-primary hover:bg-primary/10 px-2 py-1 rounded-md"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Option
            </button>
          </div>
          {fieldConfig.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                value={option}
                onChange={(e) => handleOptionsChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-grow px-3 py-2 border border-neutral-300 rounded-md font-montserrat focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button 
                type="button" 
                onClick={() => removeOption(index)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-md"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button 
        type="submit" 
        className="w-full bg-primary text-white hover:bg-primary/90 rounded-full font-montserrat py-2 transition-colors"
      >
        Save Field
      </button>
    </form>
  )
}

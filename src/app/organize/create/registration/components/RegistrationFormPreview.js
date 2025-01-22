'use client'

import { useState } from 'react'

export function RegistrationFormPreview({ fields }) {
  // Default fields from the Registration model
  const defaultFields = [
    // Personal Information
    { 
      id: 'firstName', 
      label: 'First Name', 
      type: 'text', 
      required: true 
    },
    { 
      id: 'lastName', 
      label: 'Last Name', 
      type: 'text', 
      required: true 
    },
    { 
      id: 'email', 
      label: 'Email', 
      type: 'text', 
      required: true 
    },
    { 
      id: 'phone', 
      label: 'Phone Number', 
      type: 'text', 
      required: true 
    },
    { 
      id: 'dateOfBirth', 
      label: 'Date of Birth', 
      type: 'date', 
      required: true 
    },
    { 
      id: 'gender', 
      label: 'Gender', 
      type: 'dropdown', 
      required: true,
      options: ['Male', 'Female', 'Other', 'Prefer Not to Say']
    },
    
    // Emergency Contact
    { 
      id: 'emergencyContactName', 
      label: 'Emergency Contact Name', 
      type: 'text', 
      required: true 
    },
    { 
      id: 'emergencyContactPhone', 
      label: 'Emergency Contact Phone', 
      type: 'text', 
      required: true 
    },
    { 
      id: 'emergencyContactRelation', 
      label: 'Relation to Emergency Contact', 
      type: 'text', 
      required: true 
    },
    
    // Address
    { 
      id: 'city', 
      label: 'City', 
      type: 'text', 
      required: true 
    },
    { 
      id: 'country', 
      label: 'Country', 
      type: 'text', 
      required: true 
    }
  ]

  // Combine default fields with custom fields
  const combinedFields = [...defaultFields, ...fields]

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={field.label}
            required={field.required}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md font-montserrat focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        )
      case 'number':
        return (
          <input
            type="number"
            placeholder={field.label}
            required={field.required}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md font-montserrat focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        )
      case 'date':
        return (
          <input
            type="date"
            placeholder={field.label}
            required={field.required}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md font-montserrat focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        )
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`checkbox-${field.id}`}
              required={field.required}
              className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
            />
            <label 
              htmlFor={`checkbox-${field.id}`}
              className="text-sm font-montserrat text-neutral-700"
            >
              {field.label}
            </label>
          </div>
        )
      case 'dropdown':
        return (
          <select 
            required={field.required}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md font-montserrat focus:outline-none focus:ring-2 focus:ring-primary/50"
            defaultValue=""
          >
            <option value="" disabled>
              {field.label}
            </option>
            {field.options.map((option, index) => (
              <option 
                key={index} 
                value={option}
                className="font-montserrat"
              >
                {option}
              </option>
            ))}
          </select>
        )
      case 'radio':
        return (
          <div>
            {field.options.map((option, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-2 mb-2"
              >
                <input 
                  type="radio" 
                  name={`radio-${field.id}`}
                  value={option} 
                  id={`radio-${field.id}-${index}`} 
                  className="h-4 w-4 text-primary focus:ring-primary border-neutral-300"
                />
                <label
                  htmlFor={`radio-${field.id}-${index}`}
                  className="text-sm font-montserrat text-neutral-700"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-playfair font-bold text-neutral-900 mb-4">
        Registration Form Preview
      </h2>
      <div className="text-sm font-montserrat text-neutral-700 mb-4">
        <p>Default fields are pre-populated based on the event registration requirements.</p>
        <p>You can add custom fields as needed.</p>
      </div>
      {combinedFields.map((field, index) => (
        <div key={field.id || index}>
          <label 
            className="block text-sm font-montserrat text-neutral-700 mb-2"
          >
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          {renderField(field)}
        </div>
      ))}
    </div>
  )
}

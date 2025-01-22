'use client'

import { useState } from 'react'
import PropTypes from 'prop-types'
import { Plus, Trash2, Settings, ChevronLeft, ChevronRight } from 'lucide-react'

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'number', label: 'Number Input' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'date', label: 'Date' }
]

export default function DynamicRegistrationFields({ 
  initialFields = [], 
  onFieldsChange = () => {}, 
  onPrevious,  
  onNext       
}) {
  const [fields, setFields] = useState(initialFields)
  const [editingField, setEditingField] = useState(null)
  const [draftField, setDraftField] = useState(null)

  const addField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: '',
      required: false,
      options: [],
      validation: {}
    }
    const updatedFields = [...fields, newField]
    setFields(updatedFields)
    setEditingField(newField)
    setDraftField(newField)
  }

  const updateField = (fieldId, updates) => {
    const updatedFields = fields.map(field => 
      field.id === fieldId 
        ? { ...field, ...updates } 
        : field
    )
    setFields(updatedFields)
    onFieldsChange(updatedFields)
  }

  const removeField = (fieldId) => {
    const updatedFields = fields.filter(field => field.id !== fieldId)
    setFields(updatedFields)
    onFieldsChange(updatedFields)
    setEditingField(null)
  }

  const renderFieldEditor = (field) => {
    const updateFieldProperty = (key, value) => {
      setDraftField({ ...draftField, [key]: value })
    }

    return (
      <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 space-y-4">
        <div>
          <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
            Field Label
          </label>
          <input
            type="text"
            value={draftField.label}
            onChange={(e) => updateFieldProperty('label', e.target.value)}
            placeholder="Enter field label"
            className="w-full px-4 py-2 rounded-lg border border-neutral-300"
          />
        </div>

        <div>
          <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
            Field Type
          </label>
          <select
            value={draftField.type}
            onChange={(e) => updateFieldProperty('type', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-neutral-300"
          >
            {FIELD_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {['dropdown', 'radio'].includes(draftField.type) && (
          <div>
            <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
              Options (comma-separated)
            </label>
            <input
              type="text"
              value={draftField.options.join(', ')}
              onChange={(e) => {
                const options = e.target.value
                  .split(',')
                  .map(opt => opt.trim())
                  .filter(Boolean)
                updateFieldProperty('options', options)
              }}
              placeholder="Option 1, Option 2, Option 3"
              className="w-full px-4 py-2 rounded-lg border border-neutral-300"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`required_${draftField.id}`}
            checked={draftField.required}
            onChange={(e) => updateFieldProperty('required', e.target.checked)}
            className="rounded text-primary focus:ring-primary"
          />
          <label 
            htmlFor={`required_${draftField.id}`}
            className="text-sm text-neutral-700"
          >
            Required Field
          </label>
        </div>

        {['text', 'number', 'date'].includes(draftField.type) && (
          <div className="grid grid-cols-2 gap-4">
            {draftField.type === 'number' && (
              <>
                <div>
                  <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
                    Minimum Value
                  </label>
                  <input
                    type="number"
                    value={draftField.validation?.min || ''}
                    onChange={(e) => updateFieldProperty('validation', {
                      ...draftField.validation,
                      min: e.target.value ? Number(e.target.value) : undefined
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
                    Maximum Value
                  </label>
                  <input
                    type="number"
                    value={draftField.validation?.max || ''}
                    onChange={(e) => updateFieldProperty('validation', {
                      ...draftField.validation,
                      max: e.target.value ? Number(e.target.value) : undefined
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
              </>
            )}
            {draftField.type === 'text' && (
              <div className="col-span-2">
                <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
                  Validation Pattern
                </label>
                <input
                  type="text"
                  value={draftField.validation?.pattern || ''}
                  onChange={(e) => updateFieldProperty('validation', {
                    ...draftField.validation,
                    pattern: e.target.value || undefined
                  })}
                  placeholder="Optional regex pattern"
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300"
                />
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={() => {
              setEditingField(null)
              setDraftField(null)
            }}
            className="
              px-4 py-2 rounded-full 
              text-neutral-600 hover:bg-neutral-100
              transition-colors font-montserrat
            "
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              updateField(draftField.id, draftField)
              setEditingField(null)
              setDraftField(null)
            }}
            className="
              px-4 py-2 rounded-full 
              bg-primary text-white 
              hover:bg-primary/90
              transition-colors font-montserrat
            "
          >
            Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-montserrat font-semibold text-neutral-800">
          Custom Registration Fields
        </h3>
        <button
          type="button"
          onClick={addField}
          className="
            flex items-center text-primary 
            hover:bg-primary/10 px-4 py-2 rounded-full
            transition-colors font-montserrat font-semibold
          "
        >
          <Plus className="mr-2 w-5 h-5" />
          Add Field
        </button>
      </div>

      {fields.map((field) => (
        <div 
          key={field.id} 
          className="relative group"
        >
          {editingField === field ? (
            renderFieldEditor(field)
          ) : (
            <div 
              className="
                bg-neutral-50 p-4 rounded-lg border border-neutral-200 
                flex justify-between items-center hover:bg-neutral-100 
                transition-colors cursor-pointer
              "
              onClick={() => {
                setEditingField(field)
                setDraftField({ ...field })
              }}
            >
              <div>
                <p className="font-montserrat text-neutral-700 font-medium">
                  {field.label || 'Unnamed Field'}
                </p>
                <p className="text-sm text-neutral-500">
                  {field.type}
                  {field.required ? ' • Required' : ' • Optional'}
                </p>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    removeField(field.id)
                  }}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingField(field)
                    setDraftField({ ...field })
                  }}
                  className="text-primary hover:bg-primary/10 p-2 rounded-full"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {fields.length === 0 && (
        <div className="text-center text-neutral-500 py-6">
          No custom fields added yet. Click &quot;Add Field&quot; to get started.
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="
            flex items-center text-neutral-600 
            px-6 py-3 rounded-full 
            hover:bg-neutral-100 transition-colors
            font-montserrat font-semibold
          "
        >
          <ChevronLeft className="mr-2 w-5 h-5" />
          Previous Step
        </button>

        <button
          type="button"
          onClick={() => {
            // Validate fields before proceeding
            const hasInvalidFields = fields.some(field => 
              !field.label || 
              (field.type === 'dropdown' && field.options.length === 0)
            )

            if (hasInvalidFields) {
              alert('Please complete all field details before proceeding.')
              return
            }

            // Proceed to next step
            try {
              onFieldsChange(fields)
            } catch (error) {
              console.error('Error in onFieldsChange:', error)
              alert('An error occurred while processing fields. Please try again.')
              return
            }
            
            onNext()
          }}
          className="
            flex items-center bg-[#FF6B6B] text-white 
            px-6 py-3 rounded-full 
            hover:bg-[#FF6B6B]/90 transition-colors
            font-montserrat font-semibold
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          disabled={fields.length === 0}
        >
          Next Step
          <ChevronRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// Add PropTypes for type checking
DynamicRegistrationFields.propTypes = {
  initialFields: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.string),
    validation: PropTypes.object
  })),
  onFieldsChange: PropTypes.func,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func
}

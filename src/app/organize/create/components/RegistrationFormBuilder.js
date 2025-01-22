'use client'

import React, { useState } from 'react'
import { 
  Plus, 
  Trash2, 
  Edit, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react'

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'number', label: 'Number Input' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'date', label: 'Date' }
]

export default function RegistrationFormBuilder({ 
  initialFields = [], 
  onFieldsUpdate 
}) {
  const [fields, setFields] = useState(initialFields)
  const [editingField, setEditingField] = useState(null)

  const addField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
      options: []
    }
    setFields([...fields, newField])
    setEditingField(newField)
  }

  const updateField = (fieldId, updates) => {
    const updatedFields = fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    )
    setFields(updatedFields)
    onFieldsUpdate(updatedFields)
  }

  const removeField = (fieldId) => {
    const filteredFields = fields.filter(field => field.id !== fieldId)
    setFields(filteredFields)
    onFieldsUpdate(filteredFields)
  }

  const moveField = (index, direction) => {
    const newFields = [...fields]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    
    if (swapIndex >= 0 && swapIndex < newFields.length) {
      [newFields[index], newFields[swapIndex]] = [newFields[swapIndex], newFields[index]]
      setFields(newFields)
      onFieldsUpdate(newFields)
    }
  }

  const renderFieldEditor = (field) => {
    return (
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-4">
          <input 
            placeholder="Field Label" 
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
            className="mr-2 px-2 py-1 border rounded w-full"
          />
          <select 
            value={field.type}
            onChange={(e) => updateField(field.id, { type: e.target.value })}
            className="px-2 py-1 border rounded w-[180px]"
          >
            {FIELD_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <input 
            type="checkbox" 
            checked={field.required}
            onChange={(e) => updateField(field.id, { required: e.target.checked })}
            className="mr-2"
          />
          <span>Required Field</span>
        </div>

        {['dropdown', 'radio'].includes(field.type) && (
          <div>
            <div className="flex mb-2">
              <input 
                placeholder="Add Option" 
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    const newOptions = [...(field.options || []), e.target.value.trim()]
                    updateField(field.id, { options: newOptions })
                    e.target.value = ''
                  }
                }}
                className="mr-2 px-2 py-1 border rounded w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(field.options || []).map((option, idx) => (
                <div 
                  key={idx} 
                  className="bg-gray-200 px-2 py-1 rounded flex items-center"
                >
                  {option}
                  <Trash2 
                    className="ml-2 cursor-pointer text-red-500" 
                    size={16} 
                    onClick={() => {
                      const newOptions = field.options.filter((_, i) => i !== idx)
                      updateField(field.id, { options: newOptions })
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Registration Form Builder</h2>
      
      {fields.map((field, index) => (
        <div key={field.id} className="relative">
          <div className="absolute left-[-40px] flex flex-col space-y-2">
            {index > 0 && (
              <button 
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => moveField(index, 'up')}
              >
                <ChevronUp />
              </button>
            )}
            {index < fields.length - 1 && (
              <button 
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => moveField(index, 'down')}
              >
                <ChevronDown />
              </button>
            )}
          </div>
          
          {editingField?.id === field.id ? (
            renderFieldEditor(field)
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <div>
                <span className="font-semibold">{field.label}</span>
                <span className="text-gray-500 ml-2">
                  ({field.type}) {field.required ? '(Required)' : ''}
                </span>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="p-1 border rounded hover:bg-gray-100"
                  onClick={() => setEditingField(field)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="p-1 border rounded hover:bg-red-50 text-red-500"
                  onClick={() => removeField(field.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      
      <button 
        onClick={addField} 
        className="w-full py-2 border border-dashed border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center"
      >
        <Plus className="mr-2" /> Add Registration Field
      </button>
    </div>
  )
}

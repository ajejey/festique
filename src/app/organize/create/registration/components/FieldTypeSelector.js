'use client'

import { useState } from 'react'
import { 
  AlignLeft, 
  Hash, 
  CalendarDays, 
  CheckSquare, 
  ListOrdered, 
  RadioIcon 
} from 'lucide-react'

const FIELD_TYPES = [
  { 
    type: 'text', 
    label: 'Text Input', 
    icon: AlignLeft 
  },
  { 
    type: 'number', 
    label: 'Number Input', 
    icon: Hash 
  },
  { 
    type: 'date', 
    label: 'Date', 
    icon: CalendarDays 
  },
  { 
    type: 'checkbox', 
    label: 'Checkbox', 
    icon: CheckSquare 
  },
  { 
    type: 'dropdown', 
    label: 'Dropdown', 
    icon: ListOrdered 
  },
  { 
    type: 'radio', 
    label: 'Radio Buttons', 
    icon: RadioIcon 
  }
]

export function FieldTypeSelector({ onSelectType }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {FIELD_TYPES.map((fieldType) => (
        <button
          key={fieldType.type}
          onClick={() => onSelectType(fieldType.type)}
          className="
            flex flex-col items-center justify-center 
            p-4 rounded-2xl 
            border border-neutral-200 
            hover:border-primary 
            hover:bg-primary/10 
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-primary
          "
        >
          <fieldType.icon className="h-8 w-8 mb-2 text-neutral-700 group-hover:text-primary" />
          <span className="text-sm font-montserrat text-neutral-800">
            {fieldType.label}
          </span>
        </button>
      ))}
    </div>
  )
}

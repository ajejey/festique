'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Save } from 'lucide-react'

import { FieldTypeSelector } from './components/FieldTypeSelector'
import { FieldConfigForm } from './components/FieldConfigForm'
import { RegistrationFormPreview } from './components/RegistrationFormPreview'

import { saveRegistrationFormFields, getEventRegistrationFields } from './actions'

export default function RegistrationSetupPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [selectedFieldType, setSelectedFieldType] = useState(null)
  const [registrationFields, setRegistrationFields] = useState([])
  const [editingField, setEditingField] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [eventId, setEventId] = useState(null)

  useEffect(() => {
    // Check if event ID is passed from previous step
    const storedEventId = localStorage.getItem('currentEventId')
    if (storedEventId) {
      setEventId(storedEventId)
      localStorage.removeItem('currentEventId')
    }
  }, [])

  const eventIdParam = searchParams.get('eventId')
  console.log("eventIdParam", eventIdParam)

  useEffect(() => {
    async function fetchExistingFields() {
      try {
        const eventId = eventIdParam || params.id // Use eventId state if available
        const existingFields = await getEventRegistrationFields(eventId)
        setRegistrationFields(existingFields)
      } catch (error) {
        toast.error('Failed to load existing registration fields')
      } finally {
        setIsLoading(false)
      }
    }

    fetchExistingFields()
  }, [params.id, eventId])

  const handleAddField = (field) => {
    // If editing an existing field, replace it
    if (editingField) {
      setRegistrationFields(prev => 
        prev.map(f => f.id === editingField.id ? field : f)
      )
      setEditingField(null)
    } else {
      // Add new field
      setRegistrationFields(prev => [...prev, field])
    }
    
    // Reset field type selection
    setSelectedFieldType(null)
  }

  const handleSaveFields = async () => {
    try {
      // Prioritize eventId from state, then from params, then from localStorage
      const currentEventId = eventId || eventIdParam || localStorage.getItem('currentEventId')
      
      if (!currentEventId) {
        console.log('No event ID found. Please start the event creation process again.')
        toast.error('No event ID found. Please start the event creation process again.')
        return
      }

      // Validate fields
      const hasValidFields = registrationFields.every(field => 
        field.label.trim() && field.type
      )

      if (!hasValidFields) {
        toast.error('Please ensure all fields have a label and type')
        return
      }

      await saveRegistrationFormFields(currentEventId, registrationFields)
      
      toast.success('Registration fields saved successfully')
      router.push('/organize/')
    } catch (error) {
      toast.error('Failed to save registration fields')
      console.error(error)
    }
  }

  const handleSkip = async () => {
    console.log('Skipping registration setup')
    try {
      const currentEventId = eventId || eventIdParam || localStorage.getItem('currentEventId')
      
      if (!currentEventId) {
        console.log('No event ID found. Please start the event creation process again.')
        toast.error('No event ID found. Please start the event creation process again.')
        return
      }

      console.log('Skipping registration setup 2')
      // Save an empty registration form
      await saveRegistrationFormFields(currentEventId, [])

      console.log('Skipping registration setup 3')
      
      toast.info('Registration setup skipped')
      router.push('/organize/')
    } catch (error) {
      toast.error('Failed to skip registration setup')
      console.error(error)
    }
  }

  const handleEditField = (field) => {
    setEditingField(field)
    setSelectedFieldType(field.type)
  }

  const handleRemoveField = (fieldId) => {
    setRegistrationFields(prev => 
      prev.filter(field => field.id !== fieldId)
    )
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-neutral-900 mb-4">
            Customize Your Event Registration
          </h1>
          <p className="text-neutral-600 font-montserrat max-w-3xl mx-auto text-lg">
            Design your event registration form. Collect only the information you need 
            from attendees - like name, contact, age, or any special requirements. 
            Make it easy for people to sign up for your event.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-playfair font-bold text-neutral-800 mb-4">
                Add Registration Fields
              </h2>
              <p className="text-neutral-600 font-montserrat mb-4">
                Choose the type of information you want to collect from attendees. 
                Click on a field type (like Text, Number, or Dropdown) to add custom 
                fields to your registration form. You can add multiple fields and 
                customize them as needed.
              </p>
              
              {!selectedFieldType ? (
                <FieldTypeSelector 
                  onSelectType={setSelectedFieldType} 
                />
              ) : (
                <FieldConfigForm
                  type={selectedFieldType}
                  onSubmit={handleAddField}
                  initialData={editingField}
                />
              )}
            </div>

            {registrationFields.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-xl font-playfair font-semibold text-neutral-900 mb-4">
                  Added Fields
                </h3>
                <div className="space-y-2">
                  {registrationFields.map((field) => (
                    <div 
                      key={field.id} 
                      className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg"
                    >
                      <span className="font-montserrat text-neutral-800">
                        {field.label} ({field.type})
                      </span>
                      <div className="space-x-2">
                        <button 
                          onClick={() => handleEditField(field)}
                          className="text-primary hover:bg-primary/10 px-2 py-1 rounded-md text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleRemoveField(field.id)}
                          className="text-red-500 hover:bg-red-50 px-2 py-1 rounded-md text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
              <h2 className="text-2xl font-playfair font-bold text-neutral-800 mb-4">
                Registration Form Preview
              </h2>
              <p className="text-neutral-600 font-montserrat mb-4">
                This is how your registration form will look to attendees. 
                As you add fields on the left, they will appear here in real-time. 
                Use this preview to ensure the form looks exactly how you want.
              </p>
              <RegistrationFormPreview fields={registrationFields} />
            </div>
            
            <div className="mt-6 flex space-x-4">
              <button 
                onClick={handleSkip}
                className="w-full py-2 rounded-full font-montserrat text-neutral-600 
                  hover:bg-neutral-100 transition-colors border border-neutral-300"
              >
                Skip Registration Setup
              </button>

              <button 
                onClick={handleSaveFields}
                disabled={registrationFields.length === 0}
                className={`w-full py-2 rounded-full font-montserrat transition-colors ${
                  registrationFields.length === 0 
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' 
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                <div className="flex items-center justify-center">
                  <Save className="mr-2 h-5 w-5" /> Save Registration Fields
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

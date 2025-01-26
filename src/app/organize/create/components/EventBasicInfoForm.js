'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { uploadFile } from '../../actions'
// import { uploadFile } from '@/app/organize/actions'

const EVENT_TYPES = [
  'Running', 
  'Cycling', 
  'Triathlon', 
  'Swimming', 
  'Trail Running', 
  'Mountain Biking'
]

const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Professional']

export default function EventBasicInfoForm({ 
  initialData, 
  onNext 
}) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    eventType: initialData.eventType || '',
    description: initialData.description || '',
    difficulty: initialData.difficulty || 'Intermediate',
    organizerDetails: {
      name: initialData.organizerDetails?.name || '',
      logo: initialData.organizerDetails?.logo || '',
      description: initialData.organizerDetails?.description || '',
      contact: {
        email: initialData.organizerDetails?.contact?.email || '',
        phone: initialData.organizerDetails?.contact?.phone || ''
      }
    }
  })

  const [logoInput, setLogoInput] = useState({
    type: 'url', // Default to URL input
    value: initialData.organizerDetails?.logo || '',
    file: null
  })

  const [isUploading, setIsUploading] = useState(false)

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Handle nested organizer details
    const organizerDetailMatch = name.match(/^organizerDetails\.(\w+)$/)
    const organizerContactMatch = name.match(/^organizerDetails\.contact\.(\w+)$/)
    
    if (organizerDetailMatch) {
      const field = organizerDetailMatch[1]
      setFormData(prev => ({
        ...prev,
        organizerDetails: {
          ...prev.organizerDetails,
          [field]: value
        }
      }))
    } else if (organizerContactMatch) {
      const field = organizerContactMatch[1]
      setFormData(prev => ({
        ...prev,
        organizerDetails: {
          ...prev.organizerDetails,
          contact: {
            ...prev.organizerDetails.contact,
            [field]: value
          }
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleLogoInputTypeChange = (type) => {
    setLogoInput(prev => ({
      type,
      value: type === 'url' ? prev.value : '',
      file: type === 'file' ? prev.file : null
    }))
  }

  const handleLogoFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          'organizerDetails.logo': 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP.'
        }))
        return
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          'organizerDetails.logo': 'File size exceeds 5MB limit.'
        }))
        return
      }

      // Clear previous errors
      setErrors(prev => ({ ...prev, 'organizerDetails.logo': '' }))
      setIsUploading(true)

      try {
        // Create a new File object with the original file's properties
        const fileToUpload = new File([file], file.name, {
          type: file.type,
          lastModified: file.lastModified
        });

        // Upload file using server action
        const uploadResult = await uploadFile(fileToUpload, 'organizer-logos')
        
        // Update form data with uploaded logo URL
        setFormData(prev => ({
          ...prev,
          organizerDetails: {
            ...prev.organizerDetails,
            logo: uploadResult.url
          }
        }))

        // Update logo input state
        setLogoInput(prev => ({
          ...prev,
          value: uploadResult.url,
          file: fileToUpload
        }))
      } catch (error) {
        console.error('Logo Upload Error:', error)
        setErrors(prev => ({
          ...prev,
          'organizerDetails.logo': `Failed to upload logo: ${error.message}`
        }))
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleLogoUrlChange = (e) => {
    const url = e.target.value
    setLogoInput(prev => ({
      ...prev,
      type: 'url',
      value: url,
      file: null
    }))

    // Optional URL validation
    if (url && url.trim()) {
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
      if (!urlRegex.test(url)) {
        setErrors(prev => ({
          ...prev,
          'organizerDetails.logo': 'Invalid logo URL'
        }))
      } else if (errors['organizerDetails.logo']) {
        const { 'organizerDetails.logo': removedError, ...restErrors } = errors
        setErrors(restErrors)
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Event name is required'
    if (!formData.eventType) newErrors.eventType = 'Event type is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    
    // Difficulty validation
    if (!formData.difficulty) newErrors.difficulty = 'Event difficulty is required'
    
    // Organizer details validation
    if (!formData.organizerDetails.name.trim()) newErrors['organizerDetails.name'] = 'Organizer name is required'
    
    if (formData.organizerDetails.contact.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.organizerDetails.contact.email)) {
        newErrors['organizerDetails.contact.email'] = 'Invalid email format'
      }
    }

    if (formData.organizerDetails.contact.phone.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
      if (!phoneRegex.test(formData.organizerDetails.contact.phone)) {
        newErrors['organizerDetails.contact.phone'] = 'Invalid phone number format'
      }
    }

    // Logo validation
    if (!logoInput.value) {
      newErrors['organizerDetails.logo'] = 'Organizer logo is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Prepare form data with logo
      const finalFormData = {
        ...formData,
        organizerDetails: {
          ...formData.organizerDetails,
          logo: logoInput.value
        }
      }
      
      onNext(finalFormData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label 
          htmlFor="name" 
          className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
        >
          Event Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter event name"
          className={`
            w-full px-4 py-3 rounded-lg border 
            ${errors.name 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-neutral-300 focus:border-primary focus:ring-primary'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            font-montserrat text-neutral-900
          `}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label 
          htmlFor="eventType" 
          className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
        >
          Event Type
        </label>
        <select
          id="eventType"
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          className={`
            w-full px-4 py-3 rounded-lg border 
            ${errors.eventType 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-neutral-300 focus:border-primary focus:ring-primary'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            font-montserrat text-neutral-900
          `}
        >
          <option value="">Select Event Type</option>
          {EVENT_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.eventType && (
          <p className="text-red-500 text-xs mt-1">{errors.eventType}</p>
        )}
      </div>

      <div>
        <label 
          htmlFor="description" 
          className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
        >
          Event Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe your event, key highlights, and what participants can expect"
          className={`
            w-full px-4 py-3 rounded-lg border 
            ${errors.description 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-neutral-300 focus:border-primary focus:ring-primary'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            font-montserrat text-neutral-900
          `}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <label 
          htmlFor="difficulty" 
          className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
        >
          Event Difficulty
        </label>
        <select
          id="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className={`
            w-full px-4 py-3 rounded-lg border 
            ${errors.difficulty 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-neutral-300 focus:border-primary focus:ring-primary'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            font-montserrat text-neutral-900
          `}
        >
          <option value="">Select Difficulty Level</option>
          {DIFFICULTY_LEVELS.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
        {errors.difficulty && (
          <p className="text-red-500 text-xs mt-1">{errors.difficulty}</p>
        )}
      </div>

      <div className="space-y-4 bg-neutral-50 p-4 rounded-2xl">
        <h3 className="text-lg font-montserrat font-semibold text-neutral-800">Organizer Details</h3>
        
        <div>
          <label 
            htmlFor="organizerDetails.name" 
            className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
          >
            Organizer Name
          </label>
          <input
            type="text"
            id="organizerDetails.name"
            name="organizerDetails.name"
            value={formData.organizerDetails.name}
            onChange={handleChange}
            placeholder="Enter organizer name"
            className={`
              w-full px-4 py-3 rounded-lg border 
              ${errors['organizerDetails.name'] 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-neutral-300 focus:border-primary focus:ring-primary'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              font-montserrat text-neutral-900
            `}
          />
          {errors['organizerDetails.name'] && (
            <p className="text-red-500 text-xs mt-1">{errors['organizerDetails.name']}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
            Organizer Logo
          </label>
            
          {/* Radio Button Input Type Selector */}
          <div className="flex items-center space-x-4 mb-1">
            <div className="flex items-center">
              <input
                type="radio"
                id="logo-url"
                name="logoInputType"
                value="url"
                checked={logoInput.type === 'url'}
                onChange={() => handleLogoInputTypeChange('url')}
                className="h-4 w-4 text-primary focus:ring-primary border-neutral-300"
              />
              <label 
                htmlFor="logo-url" 
                className="ml-2 block text-sm font-montserrat text-neutral-700"
              >
                URL Input
              </label>
            </div>
              
            <div className="flex items-center">
              <input
                type="radio"
                id="logo-file"
                name="logoInputType"
                value="file"
                checked={logoInput.type === 'file'}
                onChange={() => handleLogoInputTypeChange('file')}
                className="h-4 w-4 text-primary focus:ring-primary border-neutral-300"
              />
              <label 
                htmlFor="logo-file" 
                className="ml-2 block text-sm font-montserrat text-neutral-700"
              >
                File Upload
              </label>
            </div>
          </div>

          {/* URL Input */}
          {logoInput.type === 'url' && (
            <div className="space-y-2">
              <input
                type="text"
                value={logoInput.value}
                onChange={handleLogoUrlChange}
                placeholder="Enter logo URL (e.g., https://example.com/logo.png)"
                className={`
                  w-full px-4 py-3 rounded-lg border 
                  ${errors['organizerDetails.logo'] 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-neutral-300 focus:border-primary focus:ring-primary'
                  }
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                  font-montserrat text-neutral-900
                `}
              />
              {logoInput.value && (
                <div className="mt-2">
                  <img 
                    src={logoInput.value} 
                    alt="Logo Preview" 
                    className="max-w-[200px] max-h-[200px] object-contain rounded-lg border"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      setErrors(prev => ({
                        ...prev,
                        'organizerDetails.logo': 'Invalid image URL'
                      }))
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* File Upload */}
          {logoInput.type === 'file' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <input 
                  type="file" 
                  onChange={handleLogoFileChange}
                  disabled={isUploading}
                  className="hidden"
                  id="logo-file-upload"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                />
                <label 
                  htmlFor="logo-file-upload" 
                  className={`
                    inline-flex items-center px-4 py-2 rounded-full
                    ${isUploading 
                      ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-primary/80 cursor-pointer'
                    }
                    transition-colors
                  `}
                >
                  {isUploading ? 'Uploading...' : 'Upload Logo'}
                </label>
              </div>
              
              {/* Preview */}
              {logoInput.value && (
                <div className="mt-4 flex justify-center">
                  <img 
                    src={logoInput.value} 
                    alt="Logo Preview" 
                    className="max-w-[300px] max-h-[300px] object-contain rounded-lg border"
                  />
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {errors['organizerDetails.logo'] && (
            <p className="text-red-500 text-xs mt-2">
              {errors['organizerDetails.logo']}
            </p>
          )}
        </div>

        <div>
          <label 
            htmlFor="organizerDetails.description" 
            className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
          >
            Organizer Description
          </label>
          <textarea
            id="organizerDetails.description"
            name="organizerDetails.description"
            value={formData.organizerDetails.description}
            onChange={handleChange}
            rows={3}
            placeholder="Tell us about the organizer"
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 font-montserrat"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="organizerDetails.contact.email" 
              className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
            >
              Organizer Email
            </label>
            <input
              type="email"
              id="organizerDetails.contact.email"
              name="organizerDetails.contact.email"
              value={formData.organizerDetails.contact.email}
              onChange={handleChange}
              placeholder="Enter email"
              className={`
                w-full px-4 py-3 rounded-lg border 
                ${errors['organizerDetails.contact.email'] 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-neutral-300 focus:border-primary focus:ring-primary'
                }
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                font-montserrat text-neutral-900
              `}
            />
            {errors['organizerDetails.contact.email'] && (
              <p className="text-red-500 text-xs mt-1">{errors['organizerDetails.contact.email']}</p>
            )}
          </div>

          <div>
            <label 
              htmlFor="organizerDetails.contact.phone" 
              className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
            >
              Organizer Phone
            </label>
            <input
              type="tel"
              id="organizerDetails.contact.phone"
              name="organizerDetails.contact.phone"
              value={formData.organizerDetails.contact.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={`
                w-full px-4 py-3 rounded-lg border 
                ${errors['organizerDetails.contact.phone'] 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-neutral-300 focus:border-primary focus:ring-primary'
                }
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                font-montserrat text-neutral-900
              `}
            />
            {errors['organizerDetails.contact.phone'] && (
              <p className="text-red-500 text-xs mt-1">{errors['organizerDetails.contact.phone']}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="
            flex items-center bg-[#FF6B6B] text-white 
            px-6 py-3 rounded-full 
            hover:bg-primary/90 transition-colors
            font-montserrat font-semibold
          "
        >
          Next Step
          <ChevronRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </form>
  )
}

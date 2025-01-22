'use client'

import { useState, useCallback } from 'react'
import { ChevronRight, ChevronLeft, PlusCircle, Trash2, PlusCircleIcon } from 'lucide-react'
import { uploadFile } from '@/app/organize/actions'

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Australia', 'Canada']

export default function EventDetailsForm({ 
  initialData, 
  onNext,
  onPrev 
}) {
  const [formData, setFormData] = useState({
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    registrationOpenDate: initialData.registrationOpenDate || '',
    registrationCloseDate: initialData.registrationCloseDate || '',
    location: {
      venue: initialData.location?.venue || '',
      address: initialData.location?.address || '',
      city: initialData.location?.city || '',
      state: initialData.location?.state || '',
      country: initialData.location?.country || '',
      coordinates: {
        lat: initialData.location?.coordinates?.lat !== undefined 
          ? Number(initialData.location.coordinates.lat) 
          : null,
        lng: initialData.location?.coordinates?.lng !== undefined 
          ? Number(initialData.location.coordinates.lng) 
          : null
      },
      googleMapsLink: initialData.location?.googleMapsLink || ''
    },
    categories: initialData.categories?.length 
      ? initialData.categories.map(cat => ({
        name: cat.name || '',
        distance: cat.distance || '',
        startTime: cat.startTime || '',
        basePrice: cat.basePrice || 0,
        ageGroup: {
          min: cat.ageGroup?.min || null,
          max: cat.ageGroup?.max || null
        },
        gender: cat.gender || 'All',
        description: cat.description || ''
      })) 
      : [{ 
        name: '', 
        distance: '', 
        startTime: '', 
        basePrice: 0,
        ageGroup: { min: null, max: null },
        gender: 'All',
        description: '' 
      }],
    courseMap: initialData.courseMap || '',
    rules: initialData.rules?.length ? initialData.rules : [''],
    schedule: initialData.schedule?.length 
      ? initialData.schedule.map(scheduleItem => ({
        time: scheduleItem.time 
          ? (scheduleItem.time instanceof Date 
              ? scheduleItem.time 
              : new Date(`1970-01-01T${scheduleItem.time}`)) 
          : new Date('1970-01-01T00:00'),
        activity: scheduleItem.activity || ''
      })) 
      : [{ 
        time: new Date('1970-01-01T00:00'), 
        activity: '' 
      }],
    amenities: initialData.amenities?.length 
      ? initialData.amenities 
      : [''],
    eventSpecificConfig: {
      terrainType: initialData.eventSpecificConfig?.terrainType || '',
      elevationProfile: initialData.eventSpecificConfig?.elevationProfile || '',
      ageRestrictions: {
        minimumAge: initialData.eventSpecificConfig?.ageRestrictions?.minimumAge || null,
        maximumAge: initialData.eventSpecificConfig?.ageRestrictions?.maximumAge || null
      }
    },
    tshirtOptions: {
      includedTshirt: {
        provided: initialData.tshirtOptions?.includedTshirt?.provided || false,
        designFiles: initialData.tshirtOptions?.includedTshirt?.designFiles || [],
        designUrl: initialData.tshirtOptions?.includedTshirt?.designUrl || [],
        sizes: initialData.tshirtOptions?.includedTshirt?.sizes || [],
        material: initialData.tshirtOptions?.includedTshirt?.material || 'Moisture-Wicking'
      },
      additionalTshirts: initialData.tshirtOptions?.additionalTshirts?.length 
        ? initialData.tshirtOptions.additionalTshirts.map(tshirt => ({
            name: tshirt.name || '',
            price: tshirt.price || 0,
            sizes: tshirt.sizes || ['S', 'M', 'L', 'XL'],
            designUrl: tshirt.designUrl || '',
            material: tshirt.material || 'Moisture-Wicking',
            quantity: tshirt.quantity || 0,
            availableTill: tshirt.availableTill || null
          }))
        : []
    }
  })

  console.log("formData in EventDetailsForm ", formData)

  const [errors, setErrors] = useState({})

  const handleChange = async (e) => {
    const name = typeof e === 'string' ? e : e?.target?.name
    const value = typeof e === 'string' ? null : e?.target?.value
    
    // Handle file uploads separately
    if (e?.target?.files) {
      const files = Array.from(e.target.files);
      
      // Check if it's an additional T-shirt design upload
      if (name.includes('additionalTshirts') && name.includes('designUrl')) {
        const [, indexStr] = name.split('.')
        const index = Number(indexStr)
        
        try {
          if (files.length > 5) {
            alert('You can upload a maximum of 5 design images');
            e.target.value = null;
            return;
          }

          // Validate file sizes (max 5MB per file)
          const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
          if (oversizedFiles.length > 0) {
            alert('Each design image must be less than 5MB');
            e.target.value = null;
            return;
          }

          // Upload files
          const uploadedFiles = await Promise.all(
            files.map(file => uploadFile(file, 'tshirt-designs'))
          );

          // Create preview URLs
          const previews = uploadedFiles.map(file => 
            file.url ? URL.createObjectURL(new Blob([file.url], {type: 'image/jpeg'})) : null
          ).filter(preview => preview !== null);

          setFormData(prev => {
            const updatedAdditionalTshirts = [...prev.tshirtOptions.additionalTshirts];
            updatedAdditionalTshirts[index] = {
              ...updatedAdditionalTshirts[index],
              designFiles: uploadedFiles,
              designUrl: previews
            };

            return {
              ...prev,
              tshirtOptions: {
                ...prev.tshirtOptions,
                additionalTshirts: updatedAdditionalTshirts
              }
            }
          });
        } catch (error) {
          console.error('Unexpected error in file upload:', error);
          alert('An unexpected error occurred while uploading files.');
        }
        return;
      }
      
      // Handle included T-shirt design upload
      if (name.includes('includedTshirt') && name.includes('designUrl')) {
        try {
          if (files.length > 5) {
            alert('You can upload a maximum of 5 design images');
            e.target.value = null;
            return;
          }

          // Validate file sizes (max 5MB per file)
          const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
          if (oversizedFiles.length > 0) {
            alert('Each design image must be less than 5MB');
            e.target.value = null;
            return;
          }

          // Upload files
          const uploadedFiles = await Promise.all(
            files.map(file => uploadFile(file, 'tshirt-designs'))
          );

          // Create preview URLs
          const previews = uploadedFiles.map(file => 
            file.url ? URL.createObjectURL(new Blob([file.url], {type: 'image/jpeg'})) : null
          ).filter(preview => preview !== null);

          setFormData(prev => ({
            ...prev,
            tshirtOptions: {
              ...prev.tshirtOptions,
              includedTshirt: {
                ...prev.tshirtOptions.includedTshirt,
                designFiles: uploadedFiles,
                designUrl: previews
              }
            }
          }));
        } catch (error) {
          console.error('Unexpected error in file upload:', error);
          alert('An unexpected error occurred while uploading files.');
        }
        return;
      }
    }

    // Existing change handling logic
    if (name.startsWith('basicInfo')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          [field]: value
        }
      }))
    } else if (name.startsWith('tshirtOptions.includedTshirt')) {
      const field = name.split('.')[2]
      if (field === 'sizes') {
        const size = value;
        const sizes = formData.tshirtOptions.includedTshirt.sizes;
        const index = sizes.indexOf(size);
        if (index === -1) {
          setFormData(prev => ({
            ...prev,
            tshirtOptions: {
              ...prev.tshirtOptions,
              includedTshirt: {
                ...prev.tshirtOptions.includedTshirt,
                sizes: [...sizes, size]
              }
            }
          }))
        } else {
          setFormData(prev => ({
            ...prev,
            tshirtOptions: {
              ...prev.tshirtOptions,
              includedTshirt: {
                ...prev.tshirtOptions.includedTshirt,
                sizes: sizes.filter(s => s !== size)
              }
            }
          }))
        }
      } else {
        setFormData(prev => ({
          ...prev,
          tshirtOptions: {
            ...prev.tshirtOptions,
            includedTshirt: {
              ...prev.tshirtOptions.includedTshirt,
              [field]: value
            }
          }
        }))
      }
    } else if (name.startsWith('tshirtOptions.additionalTshirts')) {
      // Detailed parsing of the name attribute
      const nameParts = name.split('.')
      
      console.log('Additional T-shirts input DEBUG:', {
        fullName: name,
        nameParts,
        value,
        valueType: typeof value,
        eventType: typeof e,
        eventTarget: e?.target ? Object.keys(e.target) : 'No target'
      })
      
      // Ensure we have enough parts to parse
      if (nameParts.length < 4) {
        console.error('Invalid name format for additional T-shirts:', name)
        return
      }

      // Extract index and field
      const indexStr = nameParts[2]
      const field = nameParts[3]
      const index = Number(indexStr)
      
      // Validate index
      if (isNaN(index) || index < 0) {
        console.error('Invalid index for additional T-shirts:', indexStr)
        return
      }

      // Normalize the value for different input types
      const normalizedValue = e?.target?.type === 'checkbox' 
        ? e.target.checked 
        : (value ?? e?.target?.value)

      console.log('Normalized Value:', {
        normalizedValue,
        field,
        index
      })

      setFormData(prev => {
        // Create a deep copy of the previous additional T-shirts, defaulting to an empty array
        const updatedAdditionalTshirts = [...(prev.tshirtOptions?.additionalTshirts || [])]
        
        // Ensure the specific index exists, create if not
        if (!updatedAdditionalTshirts[index]) {
          updatedAdditionalTshirts[index] = {
            name: '',
            price: 0,
            sizes: [],
            designUrl: '',
            material: 'Cotton',
            quantity: 0,
            availabilityDate: ''
          }
        }

        // Special handling for size checkboxes
        if (field === 'sizes') {
          const size = nameParts[4];
          const currentSizes = updatedAdditionalTshirts[index].sizes || [];
          const updatedSizes = currentSizes.includes(size)
            ? currentSizes.filter(s => s !== size)
            : [...currentSizes, size];

          updatedAdditionalTshirts[index] = {
            ...updatedAdditionalTshirts[index],
            sizes: updatedSizes
          }
        } else {
          // Update the specific field
          updatedAdditionalTshirts[index] = {
            ...updatedAdditionalTshirts[index],
            [field]: normalizedValue
          }
        }

        console.log('Updated Additional T-shirts:', updatedAdditionalTshirts)

        return {
          ...prev,
          tshirtOptions: {
            ...prev.tshirtOptions,
            additionalTshirts: updatedAdditionalTshirts
          }
        }
      })
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAddCategory = () => {
    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, { 
        name: '', 
        distance: '', 
        startTime: '', 
        basePrice: 0,
        ageGroup: { min: null, max: null },
        gender: 'All',
        description: '' 
      }]
    }))
  }

  const handleRemoveCategory = (index) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, idx) => idx !== index)
    }))
  }

  const handleAddRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }))
  }

  const handleRemoveRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, idx) => idx !== index)
    }))
  }

  const handleAddAmenity = () => {
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, '']
    }))
  }

  const handleRemoveAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, idx) => idx !== index)
    }))
  }

  const handleAddScheduleItem = () => {
    handleChange('addScheduleItem')
  }

  const handleRemoveScheduleItem = (index) => {
    handleChange({
      target: {
        name: 'removeScheduleItem', 
        value: index
      }
    })
  }

  const handleAddTshirt = () => {
    setFormData(prev => ({
      ...prev,
      tshirtOptions: {
        ...prev.tshirtOptions,
        additionalTshirts: [
          ...prev.tshirtOptions.additionalTshirts,
          {
            name: '',
            price: 0,
            sizes: ['S', 'M', 'L', 'XL'],
            designUrl: '',
            material: 'Moisture-Wicking',
            quantity: 0,
            availableTill: null
          }
        ]
      }
    }))
  }

  const handleRemoveTshirt = (index) => {
    setFormData(prev => ({
      ...prev,
      tshirtOptions: {
        ...prev.tshirtOptions,
        additionalTshirts: prev.tshirtOptions.additionalTshirts.filter((_, idx) => idx !== index)
      }
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'
    
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date'
    }

    if (!formData.registrationOpenDate) newErrors.registrationOpenDate = 'Registration open date is required'
    if (!formData.registrationCloseDate) newErrors.registrationCloseDate = 'Registration close date is required'
    
    if (formData.registrationOpenDate && formData.startDate) {
      if (new Date(formData.registrationOpenDate) > new Date(formData.startDate)) {
        newErrors.registrationOpenDate = 'Registration open date must be before or equal to event start date'
      }
    }

    if (formData.registrationCloseDate && formData.endDate) {
      if (new Date(formData.registrationCloseDate) > new Date(formData.endDate)) {
        newErrors.registrationCloseDate = 'Registration close date must be before or equal to event end date'
      }
    }

    const { location } = formData
    if (!location.venue.trim()) newErrors['location.venue'] = 'Venue is required'
    if (!location.address.trim()) newErrors['location.address'] = 'Address is required'
    if (!location.city.trim()) newErrors['location.city'] = 'City is required'
    if (!location.state.trim()) newErrors['location.state'] = 'State is required'
    if (!location.country) newErrors['location.country'] = 'Country is required'

    if (location.coordinates.lat !== null && location.coordinates.lng !== null) {
      if (typeof location.coordinates.lat !== 'number' || isNaN(location.coordinates.lat)) {
        newErrors['location.coordinates.lat'] = 'Invalid latitude'
      }
      if (typeof location.coordinates.lng !== 'number' || isNaN(location.coordinates.lng)) {
        newErrors['location.coordinates.lng'] = 'Invalid longitude'
      }
      
      if (location.coordinates.lat !== null) {
        if (location.coordinates.lat < -90 || location.coordinates.lat > 90) {
          newErrors['location.coordinates.lat'] = 'Latitude must be between -90 and 90'
        }
      }
      
      if (location.coordinates.lng !== null) {
        if (location.coordinates.lng < -180 || location.coordinates.lng > 180) {
          newErrors['location.coordinates.lng'] = 'Longitude must be between -180 and 180'
        }
      }
    }

    if (location.googleMapsLink && location.googleMapsLink.trim()) {
      const googleMapsRegex = /^(https?:\/\/)?(www\.)?google\.com\/maps\/.*$/
      if (!googleMapsRegex.test(location.googleMapsLink)) {
        newErrors['location.googleMapsLink'] = 'Invalid Google Maps link'
      }
    }

    if (formData.tshirtOptions.includedTshirt.provided) {
      if (!formData.tshirtOptions.includedTshirt.sizes.length) {
        newErrors['tshirtOptions.includedTshirt.sizes'] = 'Please select at least one size'
      }
    }

    formData.tshirtOptions.additionalTshirts.forEach((tshirt, index) => {
      if (tshirt.name.trim() === '') {
        newErrors[`tshirtOptions.additionalTshirts.${index}.name`] = 'T-Shirt name is required'
      }
      if (tshirt.price < 0) {
        newErrors[`tshirtOptions.additionalTshirts.${index}.price`] = 'Price cannot be negative'
      }
      if (!tshirt.sizes.length) {
        newErrors[`tshirtOptions.additionalTshirts.${index}.sizes`] = 'Please select at least one size'
      }
      if (tshirt.quantity < 0) {
        newErrors[`tshirtOptions.additionalTshirts.${index}.quantity`] = 'Quantity cannot be negative'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onNext(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label 
            htmlFor="startDate" 
            className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 rounded-lg border 
              ${errors.startDate 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-neutral-300 focus:border-primary focus:ring-primary'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              font-montserrat text-neutral-900
            `}
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label 
            htmlFor="endDate" 
            className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 rounded-lg border 
              ${errors.endDate 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-neutral-300 focus:border-primary focus:ring-primary'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              font-montserrat text-neutral-900
            `}
          />
          {errors.endDate && (
            <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label 
            htmlFor="registrationOpenDate" 
            className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
          >
            Registration Open Date
          </label>
          <input
            type="date"
            id="registrationOpenDate"
            name="registrationOpenDate"
            value={formData.registrationOpenDate}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 rounded-lg border 
              ${errors.registrationOpenDate 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-neutral-300 focus:border-primary focus:ring-primary'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              font-montserrat text-neutral-900
            `}
          />
          {errors.registrationOpenDate && (
            <p className="text-red-500 text-xs mt-1">{errors.registrationOpenDate}</p>
          )}
        </div>

        <div>
          <label 
            htmlFor="registrationCloseDate" 
            className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
          >
            Registration Close Date
          </label>
          <input
            type="date"
            id="registrationCloseDate"
            name="registrationCloseDate"
            value={formData.registrationCloseDate}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 rounded-lg border 
              ${errors.registrationCloseDate 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-neutral-300 focus:border-primary focus:ring-primary'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              font-montserrat text-neutral-900
            `}
          />
          {errors.registrationCloseDate && (
            <p className="text-red-500 text-xs mt-1">{errors.registrationCloseDate}</p>
          )}
        </div>
      </div>

      <div>
        <label 
          htmlFor="location.venue" 
          className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
        >
          Venue Name
        </label>
        <input
          type="text"
          id="location.venue"
          name="location.venue"
          value={formData.location.venue}
          onChange={handleChange}
          placeholder="Enter venue name"
          className={`
            w-full px-4 py-3 rounded-lg border 
            ${errors['location.venue'] 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-neutral-300 focus:border-primary focus:ring-primary'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            font-montserrat text-neutral-900
          `}
        />
        {errors['location.venue'] && (
          <p className="text-red-500 text-xs mt-1">{errors['location.venue']}</p>
        )}
      </div>

      <div>
        <label 
          htmlFor="location.address" 
          className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
        >
          Address
        </label>
        <input
          type="text"
          id="location.address"
          name="location.address"
          value={formData.location.address}
          onChange={handleChange}
          placeholder="Enter event venue address"
          className={`
            w-full px-4 py-3 rounded-lg border 
            ${errors['location.address'] 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-neutral-300 focus:border-primary focus:ring-primary'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            font-montserrat text-neutral-900
          `}
        />
        {errors['location.address'] && (
          <p className="text-red-500 text-xs mt-1">{errors['location.address']}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label 
            htmlFor="location.city" 
            className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
          >
            City
          </label>
          <input
            type="text"
            id="location.city"
            name="location.city"
            value={formData.location.city}
            onChange={handleChange}
            placeholder="City"
            className={`
              w-full px-4 py-3 rounded-lg border 
              ${errors['location.city'] 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-neutral-300 focus:border-primary focus:ring-primary'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              font-montserrat text-neutral-900
            `}
          />
          {errors['location.city'] && (
            <p className="text-red-500 text-xs mt-1">{errors['location.city']}</p>
          )}
        </div>

        <div>
          <label 
            htmlFor="location.state" 
            className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
          >
            State
          </label>
          <input
            type="text"
            id="location.state"
            name="location.state"
            value={formData.location.state}
            onChange={handleChange}
            placeholder="State"
            className={`
              w-full px-4 py-3 rounded-lg border 
              ${errors['location.state'] 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-neutral-300 focus:border-primary focus:ring-primary'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              font-montserrat text-neutral-900
            `}
          />
          {errors['location.state'] && (
            <p className="text-red-500 text-xs mt-1">{errors['location.state']}</p>
          )}
        </div>
      </div>

      <div>
        <label 
          htmlFor="location.country" 
          className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
        >
          Country
        </label>
        <select
          id="location.country"
          name="location.country"
          value={formData.location.country}
          onChange={handleChange}
          className={`
            w-full px-4 py-3 rounded-lg border 
            ${errors['location.country'] 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-neutral-300 focus:border-primary focus:ring-primary'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            font-montserrat text-neutral-900
          `}
        >
          <option value="">Select Country</option>
          {COUNTRIES.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {errors['location.country'] && (
          <p className="text-red-500 text-xs mt-1">{errors['location.country']}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label 
            htmlFor="location.coordinates.lat" 
            className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
          >
            Latitude
          </label>
          <input
            type="number"
            id="location.coordinates.lat"
            name="location.coordinates.lat"
            value={formData.location.coordinates.lat || ''}
            onChange={handleChange}
            placeholder="Latitude"
            step="any"
            className={`
              w-full px-4 py-3 rounded-lg border 
              ${errors['location.coordinates.lat'] 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-neutral-300 focus:border-primary focus:ring-primary'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              font-montserrat text-neutral-900
            `}
          />
          {errors['location.coordinates.lat'] && (
            <p className="text-red-500 text-xs mt-1">{errors['location.coordinates.lat']}</p>
          )}
        </div>

        <div>
          <label 
            htmlFor="location.coordinates.lng" 
            className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
          >
            Longitude
          </label>
          <input
            type="number"
            id="location.coordinates.lng"
            name="location.coordinates.lng"
            value={formData.location.coordinates.lng || ''}
            onChange={handleChange}
            placeholder="Longitude"
            step="any"
            className={`
              w-full px-4 py-3 rounded-lg border 
              ${errors['location.coordinates.lng'] 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-neutral-300 focus:border-primary focus:ring-primary'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              font-montserrat text-neutral-900
            `}
          />
          {errors['location.coordinates.lng'] && (
            <p className="text-red-500 text-xs mt-1">{errors['location.coordinates.lng']}</p>
          )}
        </div>
      </div>

      <div>
        <label 
          htmlFor="location.googleMapsLink" 
          className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
        >
          Google Maps Link
        </label>
        <input
          type="text"
          id="location.googleMapsLink"
          name="location.googleMapsLink"
          value={formData.location.googleMapsLink}
          onChange={handleChange}
          placeholder="Google Maps Link"
          className={`
            w-full px-4 py-3 rounded-lg border 
            ${errors['location.googleMapsLink'] 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-neutral-300 focus:border-primary focus:ring-primary'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            font-montserrat text-neutral-900
          `}
        />
        {errors['location.googleMapsLink'] && (
          <p className="text-red-500 text-xs mt-1">{errors['location.googleMapsLink']}</p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-montserrat font-semibold text-neutral-800">Event Categories</h3>
        {formData.categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-4 bg-neutral-50 p-4 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor={`categories.${categoryIndex}.name`}
                  className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id={`categories.${categoryIndex}.name`}
                  placeholder="e.g., 5K Run, Half Marathon"
                  name={`categories.${categoryIndex}.name`}
                  value={category.name}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-lg border 
                    border-neutral-300 focus:border-primary focus:ring-primary
                    focus:outline-none focus:ring-2 focus:ring-opacity-50
                    font-montserrat text-neutral-900
                  `}
                />
              </div>

              <div>
                <label 
                  htmlFor={`categories.${categoryIndex}.distance`}
                  className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
                >
                  Distance
                </label>
                <input
                  type="text"
                  id={`categories.${categoryIndex}.distance`}
                  placeholder="e.g., 5 km, 21.1 km"
                  name={`categories.${categoryIndex}.distance`}
                  value={category.distance}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-lg border 
                    border-neutral-300 focus:border-primary focus:ring-primary
                    focus:outline-none focus:ring-2 focus:ring-opacity-50
                    font-montserrat text-neutral-900
                  `}
                />
              </div>

              <div>
                <label 
                  htmlFor={`categories.${categoryIndex}.startTime`}
                  className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
                >
                  Category Start Time
                </label>
                <input
                  type="datetime-local"
                  id={`categories.${categoryIndex}.startTime`}
                  name={`categories.${categoryIndex}.startTime`}
                  value={category.startTime}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-lg border 
                    border-neutral-300 focus:border-primary focus:ring-primary
                    focus:outline-none focus:ring-2 focus:ring-opacity-50
                    font-montserrat text-neutral-900
                  `}
                />
              </div>

              <div>
                <label 
                  htmlFor={`categories.${categoryIndex}.basePrice`}
                  className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
                >
                  Category Base Price (₹)
                </label>
                <input
                  type="number"
                  id={`categories.${categoryIndex}.basePrice`}
                  placeholder="Entry fee"
                  name={`categories.${categoryIndex}.basePrice`}
                  value={category.basePrice}
                  onChange={handleChange}
                  min="0"
                  className={`
                    w-full px-4 py-3 rounded-lg border 
                    border-neutral-300 focus:border-primary focus:ring-primary
                    focus:outline-none focus:ring-2 focus:ring-opacity-50
                    font-montserrat text-neutral-900
                  `}
                />
              </div>

              <div>
                <label 
                  htmlFor={`categories.${categoryIndex}.ageGroup.min`}
                  className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
                >
                  Age Group Min
                </label>
                <input
                  type="number"
                  id={`categories.${categoryIndex}.ageGroup.min`}
                  name={`categories.${categoryIndex}.ageGroup.min`}
                  value={category.ageGroup.min || ''}
                  onChange={handleChange}
                  placeholder="Min Age"
                  className={`
                    w-full px-4 py-3 rounded-lg border 
                    ${errors[`categories.${categoryIndex}.ageGroup.min`] 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-neutral-300 focus:border-primary focus:ring-primary'}
                    focus:outline-none focus:ring-2 focus:ring-opacity-50
                    font-montserrat text-neutral-900
                  `}
                />
                {errors[`categories.${categoryIndex}.ageGroup.min`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`categories.${categoryIndex}.ageGroup.min`]}
                  </p>
                )}
              </div>

              <div>
                <label 
                  htmlFor={`categories.${categoryIndex}.ageGroup.max`}
                  className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
                >
                  Age Group Max
                </label>
                <input
                  type="number"
                  id={`categories.${categoryIndex}.ageGroup.max`}
                  name={`categories.${categoryIndex}.ageGroup.max`}
                  value={category.ageGroup.max || ''}
                  onChange={handleChange}
                  placeholder="Max Age"
                  className={`
                    w-full px-4 py-3 rounded-lg border 
                    ${errors[`categories.${categoryIndex}.ageGroup.max`] 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-neutral-300 focus:border-primary focus:ring-primary'}
                    focus:outline-none focus:ring-2 focus:ring-opacity-50
                    font-montserrat text-neutral-900
                  `}
                />
                {errors[`categories.${categoryIndex}.ageGroup.max`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`categories.${categoryIndex}.ageGroup.max`]}
                  </p>
                )}
              </div>

              <div>
                <label 
                  htmlFor={`categories.${categoryIndex}.gender`}
                  className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
                >
                  Gender
                </label>
                <select
                  id={`categories.${categoryIndex}.gender`}
                  name={`categories.${categoryIndex}.gender`}
                  value={category.gender}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-lg border 
                    border-neutral-300 focus:border-primary focus:ring-primary
                    focus:outline-none focus:ring-2 focus:ring-opacity-50
                    font-montserrat text-neutral-900
                  `}
                >
                  <option value="All">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label 
                  htmlFor={`categories.${categoryIndex}.description`}
                  className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id={`categories.${categoryIndex}.description`}
                  name={`categories.${categoryIndex}.description`}
                  value={category.description}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-lg border 
                    border-neutral-300 focus:border-primary focus:ring-primary
                    focus:outline-none focus:ring-2 focus:ring-opacity-50
                    font-montserrat text-neutral-900
                  `}
                />
              </div>
            </div>

            {categoryIndex > 0 && (
              <div className="flex justify-end mt-2">
                <button 
                  type="button" 
                  onClick={() => handleRemoveCategory(categoryIndex)}
                  className="
                    text-red-500 hover:text-red-700 
                    flex items-center 
                    font-montserrat text-sm
                    transition-colors
                  "
                >
                  Remove Category
                </button>
              </div>
            )}
          </div>
        ))}
        
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleAddCategory}
            className="
              flex items-center 
              bg-[#4ECDC4] text-white 
              px-4 py-2 rounded-full 
              hover:bg-[#4ECDC4]/90 
              transition-colors
              font-montserrat font-semibold
            "
          >
            Add Category
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="courseMap" className="block text-sm font-montserrat mb-2">
          Course Map URL
        </label>
        <input
          type="text"
          id="courseMap"
          name="courseMap"
          value={formData.courseMap}
          onChange={handleChange}
          placeholder="Enter course map URL"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-montserrat font-semibold text-neutral-800">Event Rules</h3>
        {formData.rules.map((rule, index) => (
          <div key={index} className="flex space-x-2 items-center">
            <input
              type="text"
              placeholder="Enter rule"
              value={rule}
              onChange={(e) => {
                const newRules = [...formData.rules]
                newRules[index] = e.target.value
                setFormData(prev => ({ ...prev, rules: newRules }))
              }}
              className="flex-grow px-3 py-2 border rounded-md"
            />
            {index > 0 && (
              <button 
                type="button" 
                onClick={() => handleRemoveRule(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button 
          type="button" 
          onClick={handleAddRule}
          className="text-primary hover:text-primary/80"
        >
          + Add Rule
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-montserrat font-semibold text-neutral-800">Event Schedule</h3>
        {formData.schedule.map((scheduleItem, index) => (
          <div key={index} className="flex space-x-2 items-center">
            <div className="flex-grow">
              <label 
                htmlFor={`schedule-time-${index}`} 
                className="block text-sm font-montserrat font-medium text-neutral-700 mb-1"
              >
                Time
              </label>
              <input
                type="time"
                id={`schedule-time-${index}`}
                name={`schedule.${index}.time`}
                value={scheduleItem.time instanceof Date 
                  ? scheduleItem.time.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      hour12: false 
                    }) 
                  : scheduleItem.time || ''
                }
                onChange={handleChange}
                className={`
                  w-full px-4 py-3 rounded-lg border 
                  border-neutral-300 focus:border-primary focus:ring-primary
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                  font-montserrat text-neutral-900
                `}
              />
            </div>
            <div className="flex-grow">
              <label 
                htmlFor={`schedule-activity-${index}`} 
                className="block text-sm font-montserrat font-medium text-neutral-700 mb-1"
              >
                Activity
              </label>
              <input
                type="text"
                id={`schedule-activity-${index}`}
                name={`schedule.${index}.activity`}
                value={scheduleItem.activity}
                onChange={handleChange}
                placeholder="Enter activity"
                className={`
                  w-full px-4 py-3 rounded-lg border 
                  border-neutral-300 focus:border-primary focus:ring-primary
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                  font-montserrat text-neutral-900
                `}
              />
            </div>
            <div className="self-end">
              <button
                type="button"
                onClick={() => handleRemoveScheduleItem(index)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddScheduleItem}
          className={`
            w-full py-3 rounded-lg border border-dashed 
            border-neutral-300 text-neutral-600 hover:border-primary 
            hover:text-primary transition-colors flex items-center 
            justify-center space-x-2 font-montserrat
          `}
        >
          <PlusCircle size={20} />
          <span>Add Schedule Item</span>
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-montserrat font-semibold text-neutral-800">Event Amenities</h3>
        {formData.amenities.map((amenity, index) => (
          <div key={index} className="flex space-x-2 items-center">
            <input
              type="text"
              placeholder="Enter amenity"
              value={amenity}
              onChange={(e) => {
                const newAmenities = [...formData.amenities]
                newAmenities[index] = e.target.value
                setFormData(prev => ({ ...prev, amenities: newAmenities }))
              }}
              className="flex-grow px-3 py-2 border rounded-md"
            />
            {index > 0 && (
              <button 
                type="button" 
                onClick={() => handleRemoveAmenity(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button 
          type="button" 
          onClick={handleAddAmenity}
          className="text-primary hover:text-primary/80"
        >
          + Add Amenity
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-montserrat font-semibold text-neutral-800">Event Specific Config</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="eventSpecificConfig.terrainType"
              className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
            >
              Terrain Type
            </label>
            <input
              type="text"
              id="eventSpecificConfig.terrainType"
              name="eventSpecificConfig.terrainType"
              value={formData.eventSpecificConfig.terrainType}
              onChange={handleChange}
              placeholder="Terrain Type"
              className={`
                w-full px-4 py-3 rounded-lg border 
                border-neutral-300 focus:border-primary focus:ring-primary
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                font-montserrat text-neutral-900
              `}
            />
          </div>

          <div>
            <label 
              htmlFor="eventSpecificConfig.elevationProfile"
              className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
            >
              Elevation Profile
            </label>
            <input
              type="text"
              id="eventSpecificConfig.elevationProfile"
              name="eventSpecificConfig.elevationProfile"
              value={formData.eventSpecificConfig.elevationProfile}
              onChange={handleChange}
              placeholder="Elevation Profile"
              className={`
                w-full px-4 py-3 rounded-lg border 
                border-neutral-300 focus:border-primary focus:ring-primary
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                font-montserrat text-neutral-900
              `}
            />
          </div>

          <div>
            <label 
              htmlFor="eventSpecificConfig.ageRestrictions.minimumAge"
              className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
            >
              Minimum Age
            </label>
            <input
              type="number"
              id="eventSpecificConfig.ageRestrictions.minimumAge"
              name="eventSpecificConfig.ageRestrictions.minimumAge"
              value={formData.eventSpecificConfig.ageRestrictions.minimumAge || ''}
              onChange={handleChange}
              placeholder="Minimum Age"
              className={`
                w-full px-4 py-3 rounded-lg border 
                border-neutral-300 focus:border-primary focus:ring-primary
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                font-montserrat text-neutral-900
              `}
            />
          </div>

          <div>
            <label 
              htmlFor="eventSpecificConfig.ageRestrictions.maximumAge"
              className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
            >
              Maximum Age
            </label>
            <input
              type="number"
              id="eventSpecificConfig.ageRestrictions.maximumAge"
              name="eventSpecificConfig.ageRestrictions.maximumAge"
              value={formData.eventSpecificConfig.ageRestrictions.maximumAge || ''}
              onChange={handleChange}
              placeholder="Maximum Age"
              className={`
                w-full px-4 py-3 rounded-lg border 
                border-neutral-300 focus:border-primary focus:ring-primary
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                font-montserrat text-neutral-900
              `}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-montserrat font-semibold text-neutral-800">T-Shirt Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="tshirtOptions.includedTshirt.provided"
              className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
            >
              Is Free T-Shirt Included?
            </label>
            <input
              type="checkbox"
              id="tshirtOptions.includedTshirt.provided"
              name="tshirtOptions.includedTshirt.provided"
              checked={formData.tshirtOptions.includedTshirt.provided}
              onChange={(e) => {
                const newValue = e.target.checked;
                setFormData(prev => ({
                  ...prev,
                  tshirtOptions: {
                    ...prev.tshirtOptions,
                    includedTshirt: {
                      ...prev.tshirtOptions.includedTshirt,
                      provided: newValue,
                      // Reset other fields if unchecked
                      ...(newValue ? {} : {
                        sizes: [],
                        designFiles: [],
                        designUrl: []
                      })
                    }
                  }
                }))
              }}
              className="mr-2"
            />
          </div>

          {formData.tshirtOptions.includedTshirt.provided && (
            <div>
              <label 
                htmlFor="tshirtOptions.includedTshirt.designUrl"
                className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
              >
                T-Shirt Design Images (Max 5)
              </label>
              <input
                type="file"
                id="tshirtOptions.includedTshirt.designUrl"
                name="tshirtOptions.includedTshirt.designUrl"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  try {
                    const files = Array.from(e.target.files);
                    console.log('Selected files:', files);

                    if (files.length > 5) {
                      alert('You can upload a maximum of 5 design images');
                      e.target.value = null;
                      return;
                    }

                    // Validate file sizes (max 5MB per file)
                    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
                    if (oversizedFiles.length > 0) {
                      alert('Each design image must be less than 5MB');
                      e.target.value = null;
                      return;
                    }

                    // Upload files
                    const uploadedFiles = await Promise.all(
                      files.map(async (file) => {
                        try {
                          const uploadResult = await uploadFile(file, 'tshirt-designs');
                          console.log('Uploaded file result:', uploadResult);
                          return uploadResult;
                        } catch (uploadError) {
                          console.error('File upload error:', uploadError);
                          alert(`Failed to upload ${file.name}: ${uploadError.message}`);
                          return null;
                        }
                      })
                    );

                    // Filter out any failed uploads
                    const successfulUploads = uploadedFiles.filter(file => file !== null);
                    
                    // Create preview URLs
                    const previews = successfulUploads.map(file => 
                      file.url ? URL.createObjectURL(new Blob([file.url], {type: 'image/jpeg'})) : null
                    ).filter(preview => preview !== null);

                    console.log('Upload previews:', previews);

                    setFormData(prev => ({
                      ...prev,
                      tshirtOptions: {
                        ...prev.tshirtOptions,
                        includedTshirt: {
                          ...prev.tshirtOptions.includedTshirt,
                          designFiles: successfulUploads,
                          designUrl: previews
                        }
                      }
                    }));

                    console.log('Updated formData:', formData);
                  } catch (error) {
                    console.error('Unexpected error in file upload:', error);
                    alert('An unexpected error occurred while uploading files.');
                  }
                }}
                className={`
                  w-full px-4 py-3 rounded-lg border 
                  border-neutral-300 focus:border-primary focus:ring-primary
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                  font-montserrat text-neutral-900
                `}
              />
              {formData.tshirtOptions.includedTshirt.designUrl.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tshirtOptions.includedTshirt.designUrl.map((preview, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={preview} 
                        alt={`Design Preview ${index + 1}`} 
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => {
                            const newDesignUrls = [...prev.tshirtOptions.includedTshirt.designUrl];
                            const newDesignFiles = [...(prev.tshirtOptions.includedTshirt.designFiles || [])];
                            
                            // Revoke the object URL to free up memory
                            URL.revokeObjectURL(preview);

                            newDesignUrls.splice(index, 1);
                            newDesignFiles.splice(index, 1);

                            return {
                              ...prev,
                              tshirtOptions: {
                                ...prev.tshirtOptions,
                                includedTshirt: {
                                  ...prev.tshirtOptions.includedTshirt,
                                  designUrl: newDesignUrls,
                                  designFiles: newDesignFiles
                                }
                              }
                            }
                          })
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {formData.tshirtOptions.includedTshirt.provided && (
            <div>
              <label 
                htmlFor="tshirtOptions.includedTshirt.sizes"
                className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
              >
                T-Shirt Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                  <label 
                    key={size} 
                    className="inline-flex items-center mr-2 mb-2"
                  >
                    <input
                      type="checkbox"
                      name={`tshirtOptions.includedTshirt.sizes.${size}`}
                      value={size}
                      checked={formData.tshirtOptions.includedTshirt.sizes.includes(size)}
                      onChange={handleChange}
                      className="mr-1"
                    />
                    <span className="text-sm font-montserrat text-neutral-700">{size}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {formData.tshirtOptions.includedTshirt.provided && (
            <div>
              <label 
                htmlFor="tshirtOptions.includedTshirt.material"
                className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
              >
                T-Shirt Material
              </label>
              <input
                type="text"
                id="tshirtOptions.includedTshirt.material"
                name="tshirtOptions.includedTshirt.material"
                value={formData.tshirtOptions.includedTshirt.material}
                onChange={handleChange}
                placeholder="Material"
                className={`
                  w-full px-4 py-3 rounded-lg border 
                  border-neutral-300 focus:border-primary focus:ring-primary
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                  font-montserrat text-neutral-900
                `}
              />
            </div>
          )}
        </div>

        <div>
          <label 
            htmlFor="tshirtOptions.additionalTshirts"
            className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
          >
           Add Additional T-Shirts for a fee
          </label>
          {formData.tshirtOptions.additionalTshirts.map((tshirt, index) => (
            <div key={index} className="space-y-4 bg-neutral-50 p-4 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label 
                    htmlFor={`tshirtOptions.additionalTshirts.${index}.name`}
                    className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
                  >
                    T-Shirt Name
                  </label>
                  <input
                    type="text"
                    id={`tshirtOptions.additionalTshirts.${index}.name`}
                    name={`tshirtOptions.additionalTshirts.${index}.name`}
                    value={tshirt.name}
                    onChange={handleChange}
                    placeholder="T-Shirt Name"
                    className={`
                      w-full px-4 py-3 rounded-lg border 
                      border-neutral-300 focus:border-primary focus:ring-primary
                      focus:outline-none focus:ring-2 focus:ring-opacity-50
                      font-montserrat text-neutral-900
                    `}
                  />
                  {errors[`tshirtOptions.additionalTshirts.${index}.name`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`tshirtOptions.additionalTshirts.${index}.name`]}</p>
                  )}
                </div>

                <div>
                  <label 
                    htmlFor={`tshirtOptions.additionalTshirts.${index}.price`}
                    className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id={`tshirtOptions.additionalTshirts.${index}.price`}
                    name={`tshirtOptions.additionalTshirts.${index}.price`}
                    value={tshirt.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    className={`
                      w-full px-4 py-3 rounded-lg border 
                      border-neutral-300 focus:border-primary focus:ring-primary
                      focus:outline-none focus:ring-2 focus:ring-opacity-50
                      font-montserrat text-neutral-900
                    `}
                  />
                </div>

                <div>
                  <label 
                    htmlFor={`tshirtOptions.additionalTshirts.${index}.quantity`}
                    className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id={`tshirtOptions.additionalTshirts.${index}.quantity`}
                    name={`tshirtOptions.additionalTshirts.${index}.quantity`}
                    value={tshirt.quantity}
                    onChange={handleChange}
                    min="0"
                    placeholder="Quantity"
                    className={`
                      w-full px-4 py-3 rounded-lg border 
                      border-neutral-300 focus:border-primary focus:ring-primary
                      focus:outline-none focus:ring-2 focus:ring-opacity-50
                      font-montserrat text-neutral-900
                    `}
                  />
                </div>

                <div>
                  <label 
                    htmlFor={`tshirtOptions.additionalTshirts.${index}.material`}
                    className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
                  >
                    Material
                  </label>
                  <select
                    id={`tshirtOptions.additionalTshirts.${index}.material`}
                    name={`tshirtOptions.additionalTshirts.${index}.material`}
                    value={tshirt.material}
                    onChange={handleChange}
                    className={`
                      w-full px-4 py-3 rounded-lg border 
                      border-neutral-300 focus:border-primary focus:ring-primary
                      focus:outline-none focus:ring-2 focus:ring-opacity-50
                      font-montserrat text-neutral-900
                    `}
                  >
                    <option value="Cotton">Cotton</option>
                    <option value="Polyester">Polyester</option>
                    <option value="Blend">Blend</option>
                    <option value="Moisture-Wicking">Moisture-Wicking</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label 
                    htmlFor={`tshirtOptions.additionalTshirts.${index}.sizes`}
                    className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
                  >
                    T-Shirt Sizes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                      <label 
                        key={size} 
                        className="inline-flex items-center mr-2 mb-2"
                      >
                        <input
                          type="checkbox"
                          name={`tshirtOptions.additionalTshirts.${index}.sizes.${size}`}
                          value={size}
                          checked={tshirt.sizes.includes(size)}
                          onChange={handleChange}
                          className="mr-1"
                        />
                        <span className="text-sm font-montserrat text-neutral-700">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label 
                    htmlFor={`tshirtOptions.additionalTshirts.${index}.availabilityDate`}
                    className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
                  >
                    Availability Date
                  </label>
                  <input
                    type="date"
                    id={`tshirtOptions.additionalTshirts.${index}.availabilityDate`}
                    name={`tshirtOptions.additionalTshirts.${index}.availabilityDate`}
                    value={tshirt.availabilityDate}
                    onChange={handleChange}
                    className={`
                      w-full px-4 py-3 rounded-lg border 
                      border-neutral-300 focus:border-primary focus:ring-primary
                      focus:outline-none focus:ring-2 focus:ring-opacity-50
                      font-montserrat text-neutral-900
                    `}
                  />
                </div>

                <div>
                  <label 
                    htmlFor={`tshirtOptions.additionalTshirts.${index}.designUrl`}
                    className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
                  >
                    T-Shirt Design Images (Max 5)
                  </label>
                  <input
                    type="file"
                    id={`tshirtOptions.additionalTshirts.${index}.designUrl`}
                    name={`tshirtOptions.additionalTshirts.${index}.designUrl`}
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      try {
                        const files = Array.from(e.target.files);
                        
                        if (files.length > 5) {
                          alert('You can upload a maximum of 5 design images');
                          e.target.value = null;
                          return;
                        }

                        // Validate file sizes (max 5MB per file)
                        const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
                        if (oversizedFiles.length > 0) {
                          alert('Each design image must be less than 5MB');
                          e.target.value = null;
                          return;
                        }

                        // Upload files
                        const uploadedFiles = await Promise.all(
                          files.map(file => uploadFile(file, 'tshirt-designs'))
                        );

                        // Create preview URLs
                        const previews = uploadedFiles.map(file => 
                          file.url ? URL.createObjectURL(new Blob([file.url], {type: 'image/jpeg'})) : null
                        ).filter(preview => preview !== null);

                        setFormData(prev => {
                          const updatedAdditionalTshirts = [...prev.tshirtOptions.additionalTshirts];
                          updatedAdditionalTshirts[index] = {
                            ...updatedAdditionalTshirts[index],
                            designFiles: uploadedFiles,
                            designUrl: previews
                          };

                          return {
                            ...prev,
                            tshirtOptions: {
                              ...prev.tshirtOptions,
                              additionalTshirts: updatedAdditionalTshirts
                            }
                          }
                        });
                      } catch (error) {
                        console.error('Unexpected error in file upload:', error);
                        alert('An unexpected error occurred while uploading files.');
                      }
                    }}
                    className={`
                      w-full px-4 py-3 rounded-lg border 
                      border-neutral-300 focus:border-primary focus:ring-primary
                      focus:outline-none focus:ring-2 focus:ring-opacity-50
                      font-montserrat text-neutral-900
                    `}
                  />
                  {tshirt.designUrl && tshirt.designUrl.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tshirt.designUrl.map((preview, previewIndex) => (
                        <div key={previewIndex} className="relative">
                          <img 
                            src={preview} 
                            alt={`Design Preview ${previewIndex + 1}`} 
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => {
                                const updatedAdditionalTshirts = [...prev.tshirtOptions.additionalTshirts];
                                const newDesignUrls = [...tshirt.designUrl];
                                const newDesignFiles = [...(tshirt.designFiles || [])];
                                
                                // Revoke the object URL to free up memory
                                URL.revokeObjectURL(preview);

                                newDesignUrls.splice(previewIndex, 1);
                                newDesignFiles.splice(previewIndex, 1);

                                updatedAdditionalTshirts[index] = {
                                  ...updatedAdditionalTshirts[index],
                                  designUrl: newDesignUrls,
                                  designFiles: newDesignFiles
                                };

                                return {
                                  ...prev,
                                  tshirtOptions: {
                                    ...prev.tshirtOptions,
                                    additionalTshirts: updatedAdditionalTshirts
                                  }
                                }
                              })
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <button 
                  type="button" 
                  onClick={() => handleRemoveTshirt(index)}
                  className="
                    text-red-500 hover:text-red-700 
                    flex items-center 
                    font-montserrat text-sm
                    transition-colors
                  "
                >
                  Remove T-Shirt
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-start mt-4">
            <button
              type="button"
              onClick={handleAddTshirt}
              className="
                flex items-center 
                bg-[#4ECDC4] text-white 
                px-4 py-2 rounded-full 
                hover:bg-[#4ECDC4]/90 
                transition-colors
                font-montserrat font-semibold
              "
            >
              <PlusCircleIcon className="mr-2 w-5 h-5" />
              Add T-Shirt
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrev}
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
          type="submit"
          className="
            flex items-center bg-[#FF6B6B] text-white 
            px-6 py-3 rounded-full 
            hover:bg-[#FF6B6B]/90 transition-colors
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

'use client'

import React, { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { ChevronRight, ChevronLeft, PlusCircle, Trash2, Loader2 } from 'lucide-react'
import { uploadFile } from '@/app/organize/actions'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Australia', 'Canada']
const T_SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const T_SHIRT_MATERIALS = ['Cotton', 'Polyester', 'Blend', 'Moisture-Wicking']

const eventDetailsSchema = z.object({
  startDate: z.string().refine(val => val !== '', 'Start date is required'),
  endDate: z.string().refine(val => val !== '', 'End date is required'),
  registrationOpenDate: z.string().refine(val => val !== '', 'Registration open date is required'),
  registrationCloseDate: z.string().refine(val => val !== '', 'Registration close date is required'),
  
  location: z.object({
    venue: z.string().min(1, 'Venue is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().refine(val => COUNTRIES.includes(val), 'Please select a valid country'),
    coordinates: z.object({
      lat: z.number().nullable().refine(
        val => val === null || (val >= -90 && val <= 90), 
        'Latitude must be between -90 and 90'
      ),
      lng: z.number().nullable().refine(
        val => val === null || (val >= -180 && val <= 180), 
        'Longitude must be between -180 and 180'
      )
    }).optional(),
    googleMapsLink: z.string().optional().refine(
      val => val === '' || /^(https?:\/\/)?(www\.)?google\.com\/maps\/.*$/.test(val), 
      'Please provide a valid Google Maps URL'
    )
  }),

  categories: z.array(z.object({
    name: z.string().min(1, 'Category name is required'),
    distance: z.string().min(1, 'Distance is required'),
    startTime: z.string().min(1, 'Start time is required'),
    basePrice: z.number().min(0, 'Base price must be 0 or greater'),
    gender: z.string().optional(),
    description: z.string().optional(),
    ageGroup: z.object({
      min: z.number().nullable(),
      max: z.number().nullable()
    }).optional()
  })).min(1, 'At least one category is required'),

  courseMap: z.string().optional(),
  amenitiesInput: z.string().optional(),
  rulesInput: z.string().optional(),
  amenities: z.array(z.string().trim().min(1, 'Amenity cannot be empty')).optional(),
  rules: z.array(z.string().trim().min(1, 'Rule cannot be empty')).optional(),
  schedule: z.array(z.object({
    time: z.string().refine(val => val !== '', 'Time is required'),
    activity: z.string().trim().min(1, 'Activity description is required')
  })).optional(),
  eventSpecificConfig: z.object({
    terrainType: z.string().trim().optional(),
    elevationProfile: z.string().trim().optional()
  }).optional(),

  tshirtOptions: z.object({
    includedTshirt: z.object({
      provided: z.boolean().default(false),
      sizes: z.array(z.enum(T_SHIRT_SIZES)).optional(),
      designImages: z.array(z.string().trim()).optional().refine(
        val => !val || val.length <= 5, 
        'Maximum of 5 design images allowed'
      ),
      material: z.string().optional()
    }),
    additionalTshirts: z.array(z.object({
      name: z.string().trim().optional(),
      price: z.number().min(0).optional(),
      sizes: z.array(z.enum(T_SHIRT_SIZES)).optional(),
      designImages: z.array(z.string().trim()).optional().refine(
        val => !val || val.length <= 5, 
        'Maximum of 5 design images allowed'
      ),
      material: z.string().optional(),
      quantity: z.number().min(0).default(0),
      availableTill: z.string().optional()
    })).optional()
  })
})

export default function EventDetailsReactHookForm({ 
  initialData, 
  onNext,
  onPrev 
}) {
  const { 
    control, 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: {
      ...initialData,
      categories: initialData?.categories?.length 
        ? initialData.categories 
        : [{ 
            name: '', 
            distance: '', 
            startTime: '',
            basePrice: 0,
            gender: 'All',
            description: '',
            ageGroup: { min: null, max: null }
          }],
      amenitiesInput: initialData?.amenities ? initialData.amenities.join(', ') : '',
      rulesInput: initialData?.rules ? initialData.rules.join(', ') : '',
      amenities: initialData?.amenities || [],
      rules: initialData?.rules || [],
      schedule: initialData?.schedule?.length 
        ? initialData.schedule 
        : [{ time: '', activity: '' }],
      tshirtOptions: {
        includedTshirt: {
          provided: false,
          sizes: [],
          designImages: [],
          material: ''
        },
        additionalTshirts: []
      }
    }
  })

  const { 
    fields: categoryFields, 
    append: appendCategory, 
    remove: removeCategory 
  } = useFieldArray({
    control,
    name: 'categories'
  })

  const { 
    fields: scheduleFields, 
    append: appendSchedule, 
    remove: removeSchedule 
  } = useFieldArray({
    control,
    name: 'schedule'
  })

  const { 
    fields: additionalTshirtFields, 
    append: appendAdditionalTshirt, 
    remove: removeAdditionalTshirt 
  } = useFieldArray({
    control,
    name: 'tshirtOptions.additionalTshirts'
  })

  const [uploadingField, setUploadingField] = useState(null);

  const preprocessAmenitiesAndRules = (data) => {
    // Process amenities input
    if (data.amenitiesInput && data.amenitiesInput.trim() !== '') {
      data.amenities = data.amenitiesInput
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
    }

    // Process rules input
    if (data.rulesInput && data.rulesInput.trim() !== '') {
      data.rules = data.rulesInput
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
    }

    // Remove the input fields from the final data
    delete data.amenitiesInput;
    delete data.rulesInput;

    return data;
  };

  const onSubmit = async (data) => {
    try {
      // Preprocess data before submission
      let processedData = preprocessAmenitiesAndRules(data);

      // Format dates for categories
      if (processedData.categories) {
        processedData.categories = processedData.categories.map(category => {
          if (category.startTime) {
            // Combine event start date with category start time
            const [hours, minutes] = category.startTime.split(':');
            const startDate = new Date(processedData.startDate);
            startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            return {
              ...category,
              startTime: startDate.toISOString()
            };
          }
          return category;
        });
      }
      
      // Validate dates before submission
      const startDate = new Date(processedData.startDate)
      const endDate = new Date(processedData.endDate)
      const registrationOpenDate = new Date(processedData.registrationOpenDate)
      const registrationCloseDate = new Date(processedData.registrationCloseDate)

      if (endDate < startDate) {
        alert('End date must be after start date')
        return
      }

      if (registrationOpenDate > startDate) {
        alert('Registration open date must be before or equal to event start date')
        return
      }

      if (registrationCloseDate > endDate) {
        alert('Registration close date must be before or equal to event end date')
        return
      }

      onNext(processedData)
    } catch (error) {
      console.error('Event submission error:', error)
    }
  }

  const handleFileUpload = async (files, field) => {
    setUploadingField(field);

    // Convert FileList to array if needed
    const fileArray = Array.isArray(files) ? files : Array.from(files);

    // Validate file count
    if (fileArray.length > 5) {
      alert('You can upload a maximum of 5 design images');
      setUploadingField(null);
      return null;
    }

    // Validate file sizes (max 5MB per file)
    const oversizedFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Each design image must be less than 5MB');
      setUploadingField(null);
      return null;
    }

    try {
      // Upload files with new method
      const uploadedFiles = await Promise.all(
        fileArray.map(async (file) => {
          // Create a new File object to ensure compatibility
          const fileToUpload = new File([file], file.name, {
            type: file.type,
            lastModified: file.lastModified
          });

          try {
            const uploadResult = await uploadFile(fileToUpload, 'tshirt-designs');
            return {
              url: uploadResult.url,
              file: fileToUpload
            };
          } catch (uploadError) {
            console.error(`Upload error for ${file.name}:`, uploadError);
            return null;
          }
        })
      );

      // Filter out failed uploads
      const successfulUploads = uploadedFiles.filter(upload => upload !== null);
      
      // Extract URLs for form value
      const previews = successfulUploads.map(upload => upload.url);

      // Set form value
      setValue(field, previews);
      setUploadingField(null);
      return successfulUploads;
    } catch (error) {
      console.error('Unexpected file upload error:', error);
      alert('An error occurred during file upload');
      setUploadingField(null);
      return null;
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Date Section */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('startDate')}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.startDate ? 'border-red-500' : 'border-neutral-300'
            }`}
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('endDate')}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.endDate ? 'border-red-500' : 'border-neutral-300'
            }`}
          />
          {errors.endDate && (
            <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Registration Dates */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
            Registration Open Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('registrationOpenDate')}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.registrationOpenDate ? 'border-red-500' : 'border-neutral-300'
            }`}
          />
          {errors.registrationOpenDate && (
            <p className="text-red-500 text-xs mt-1">{errors.registrationOpenDate.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
            Registration Close Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('registrationCloseDate')}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.registrationCloseDate ? 'border-red-500' : 'border-neutral-300'
            }`}
          />
          {errors.registrationCloseDate && (
            <p className="text-red-500 text-xs mt-1">{errors.registrationCloseDate.message}</p>
          )}
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
              Venue <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('location.venue')}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.location?.venue ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            {errors.location?.venue && (
              <p className="text-red-500 text-xs mt-1">{errors.location.venue.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('location.address')}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.location?.address ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            {errors.location?.address && (
              <p className="text-red-500 text-xs mt-1">{errors.location.address.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('location.city')}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.location?.city ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            {errors.location?.city && (
              <p className="text-red-500 text-xs mt-1">{errors.location.city.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('location.state')}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.location?.state ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            {errors.location?.state && (
              <p className="text-red-500 text-xs mt-1">{errors.location.state.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              {...register('location.country')}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.location?.country ? 'border-red-500' : 'border-neutral-300'
              }`}
            >
              <option value="">Select Country</option>
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            {errors.location?.country && (
              <p className="text-red-500 text-xs mt-1">{errors.location.country.message}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
            Google Maps Link
          </label>
          <input
            type="url"
            placeholder="Paste Google Maps event location URL"
            {...register('location.googleMapsLink')}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.location?.googleMapsLink ? 'border-red-500' : 'border-neutral-300'
            }`}
          />
          {errors.location?.googleMapsLink && (
            <p className="text-red-500 text-xs mt-1">{errors.location.googleMapsLink.message}</p>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Event Categories <span className="text-red-500">*</span></h3>
        {categoryFields.map((field, index) => (
          <div 
            key={field.id} 
            className="grid grid-cols-4 gap-4 mb-4 p-4 bg-neutral-50 rounded-lg relative"
          >
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register(`categories.${index}.name`)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.categories?.[index]?.name ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="Enter category name"
              />
              {errors.categories?.[index]?.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.categories[index].name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Distance <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register(`categories.${index}.distance`)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.categories?.[index]?.distance ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="Enter distance"
              />
              {errors.categories?.[index]?.distance && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.categories[index].distance.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                {...register(`categories.${index}.startTime`)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.categories?.[index]?.startTime ? 'border-red-500' : 'border-neutral-300'
                }`}
              />
              {errors.categories?.[index]?.startTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.categories[index].startTime.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Base Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register(`categories.${index}.basePrice`, { 
                  setValueAs: v => v === '' ? 0 : parseFloat(v) 
                })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.categories?.[index]?.basePrice ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="Enter base price"
                min="0"
                step="0.01"
              />
              {errors.categories?.[index]?.basePrice && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.categories[index].basePrice.message}
                </p>
              )}
            </div>
            <div className="col-span-4 grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Age Group Min
                </label>
                <input
                  type="number"
                  {...register(`categories.${index}.ageGroup.min`, {
                    setValueAs: v => v === '' ? null : parseInt(v)
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Age Group Max
                </label>
                <input
                  type="number"
                  {...register(`categories.${index}.ageGroup.max`, {
                    setValueAs: v => v === '' ? null : parseInt(v)
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Gender
                </label>
                <select
                  {...register(`categories.${index}.gender`)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                >
                  <option value="All">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="col-span-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                {...register(`categories.${index}.description`)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                rows={3}
              />
            </div>
            {index > 0 && (
              <button 
                type="button" 
                onClick={() => removeCategory(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendCategory({ 
            name: '', 
            distance: '', 
            startTime: '',
            basePrice: 0,
            gender: 'All',
            description: '',
            ageGroup: { min: null, max: null }
          })}
          className="flex items-center text-primary hover:text-primary-dark"
        >
          <PlusCircle className="mr-2" /> Add Category
        </button>
      </div>

      {/* Amenities Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">
          Event Amenities 
          <span className="text-neutral-500 text-xs ml-2">(Optional)</span>
        </h3>
        <input
          type="text"
          {...register('amenitiesInput')}
          placeholder="Enter amenities (comma-separated)"
          className="w-full px-3 py-2 rounded-lg border border-neutral-300"
        />
        <p className="text-neutral-500 text-xs mt-1">
          Example: Water Station, First Aid, Parking
        </p>
      </div>

      {/* Rules Section */}
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold mb-4">
          Event Rules 
          <span className="text-neutral-500 text-xs ml-2">(Optional)</span>
        </h3>
        <input
          type="text"
          {...register('rulesInput')}
          placeholder="Enter rules (comma-separated)"
          className="w-full px-3 py-2 rounded-lg border border-neutral-300"
        />
        <p className="text-neutral-500 text-xs mt-1">
          Example: No outside food, Wear safety gear, Follow instructions
        </p>
      </div>

      {/* Event Schedule Section */}
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold mb-4">Event Schedule <span className="text-red-500">*</span></h3>
        {scheduleFields.map((field, index) => (
          <div 
            key={field.id} 
            className="grid grid-cols-3 gap-4 bg-neutral-50 p-4 rounded-lg relative"
          >
            <div className="col-span-1">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                {...register(`schedule.${index}.time`)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.schedule?.[index]?.time ? 'border-red-500' : 'border-neutral-300'
                }`}
              />
              {errors.schedule?.[index]?.time && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.schedule[index].time.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Activity Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register(`schedule.${index}.activity`)}
                placeholder="Describe the activity"
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.schedule?.[index]?.activity ? 'border-red-500' : 'border-neutral-300'
                }`}
              />
              {errors.schedule?.[index]?.activity && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.schedule[index].activity.message}
                </p>
              )}
            </div>
            {scheduleFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeSchedule(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendSchedule({ time: '', activity: '' })}
          className="flex items-center text-primary hover:text-primary-dark mt-4"
        >
          <PlusCircle className="mr-2" /> Add Schedule Item
        </button>
      </div>

      {/* Event Specific Configuration */}
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold mb-4">
          Event Terrain Details 
          <span className="text-neutral-500 text-xs ml-2">(Optional)</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Terrain Type
            </label>
            <select
              {...register('eventSpecificConfig.terrainType')}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300"
            >
              <option value="">Select Terrain Type</option>
              <option value="Road">Road</option>
              <option value="Trail">Trail</option>
              <option value="Mountain">Mountain</option>
              <option value="Beach">Beach</option>
              <option value="Urban">Urban</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Elevation Profile
            </label>
            <select
              {...register('eventSpecificConfig.elevationProfile')}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300"
            >
              <option value="">Select Elevation Profile</option>
              <option value="Flat">Flat</option>
              <option value="Rolling Hills">Rolling Hills</option>
              <option value="Hilly">Hilly</option>
              <option value="Mountainous">Mountainous</option>
              <option value="Mixed Terrain">Mixed Terrain</option>
            </select>
          </div>
        </div>
      </div>

      {/* T-shirt Options Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">
          T-shirt Options 
          <span className="text-neutral-500 text-xs ml-2">(Optional)</span>
        </h3>
        
        {/* Included T-shirt */}
        <div className="bg-neutral-50 p-4 rounded-lg">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              {...register('tshirtOptions.includedTshirt.provided')}
              className="mr-2"
            />
            <label className="text-sm font-medium text-neutral-700">
              Provide Included T-shirt
            </label>
          </div>

          {watch('tshirtOptions.includedTshirt.provided') && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  T-shirt Material
                </label>
                <select
                  {...register('tshirtOptions.includedTshirt.material')}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                >
                  <option value="">Select Material</option>
                  {T_SHIRT_MATERIALS.map(material => (
                    <option key={material} value={material}>{material}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Available Sizes
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {T_SHIRT_SIZES.map(size => (
                    <label key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        value={size}
                        {...register('tshirtOptions.includedTshirt.sizes')}
                        className="mr-2"
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Design Images (Max 5)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files, 'tshirtOptions.includedTshirt.designImages')}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploadingField === 'tshirtOptions.includedTshirt.designImages'}
                />
                {uploadingField === 'tshirtOptions.includedTshirt.designImages' && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading images...</span>
                  </div>
                )}
                {watch('tshirtOptions.includedTshirt.designImages')?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {watch('tshirtOptions.includedTshirt.designImages').map((url, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={url} 
                          alt={`Design Preview ${index + 1}`} 
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const currentDesigns = watch('tshirtOptions.includedTshirt.designImages');
                            const updatedDesigns = currentDesigns.filter((_, i) => i !== index);
                            setValue('tshirtOptions.includedTshirt.designImages', updatedDesigns);
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
          )}
        </div>

        {/* Additional T-shirts */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold mb-2">Additional T-shirts</h4>
          {additionalTshirtFields.map((field, index) => (
            <div 
              key={field.id} 
              className="bg-neutral-50 p-4 rounded-lg relative"
            >
              <button 
                type="button" 
                onClick={() => removeAdditionalTshirt(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    T-shirt Name
                  </label>
                  <input
                    type="text"
                    {...register(`tshirtOptions.additionalTshirts.${index}.name`)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                    placeholder="Enter T-shirt name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    {...register(`tshirtOptions.additionalTshirts.${index}.price`, {
                      setValueAs: v => v === '' ? 0 : parseFloat(v)
                    })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Available Sizes
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {T_SHIRT_SIZES.map(size => (
                    <label key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        value={size}
                        {...register(`tshirtOptions.additionalTshirts.${index}.sizes`)}
                        className="mr-2"
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    T-shirt Material
                  </label>
                  <select
                    {...register(`tshirtOptions.additionalTshirts.${index}.material`)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                  >
                    <option value="">Select Material</option>
                    {T_SHIRT_MATERIALS.map(material => (
                      <option key={material} value={material}>{material}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    {...register(`tshirtOptions.additionalTshirts.${index}.quantity`, {
                      setValueAs: v => v === '' ? 0 : parseInt(v)
                    })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                    placeholder="Enter quantity"
                    min="0"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Available Till
                </label>
                <input
                  type="date"
                  {...register(`tshirtOptions.additionalTshirts.${index}.availableTill`)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Design Images (Max 5)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files, `tshirtOptions.additionalTshirts.${index}.designImages`)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploadingField === `tshirtOptions.additionalTshirts.${index}.designImages`}
                />
                {uploadingField === `tshirtOptions.additionalTshirts.${index}.designImages` && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading images...</span>
                  </div>
                )}
                {watch(`tshirtOptions.additionalTshirts.${index}.designImages`)?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {watch(`tshirtOptions.additionalTshirts.${index}.designImages`).map((url, designIndex) => (
                      <div key={designIndex} className="relative">
                        <img 
                          src={url} 
                          alt={`Design Preview ${designIndex + 1}`} 
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const currentDesigns = watch(`tshirtOptions.additionalTshirts.${index}.designImages`);
                            const updatedDesigns = currentDesigns.filter((_, i) => i !== designIndex);
                            setValue(`tshirtOptions.additionalTshirts.${index}.designImages`, updatedDesigns);
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
          ))}

          <button
            type="button"
            onClick={() => appendAdditionalTshirt({
              name: '',
              price: 0,
              sizes: [],
              material: '',
              quantity: 0,
              availableTill: null,
              designImages: []
            })}
            className="flex items-center text-primary hover:text-primary-dark mt-4"
          >
            <PlusCircle className="mr-2" /> Add Additional T-shirt
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button 
          type="button" 
          onClick={onPrev} 
          className="flex items-center text-neutral-700 hover:text-neutral-900"
        >
          <ChevronLeft className="mr-2" /> Previous
        </button>
        <button 
          type="submit" 
          className="flex items-center bg-primary text-white px-6 py-3 rounded-full hover:bg-primary-dark"
        >
          Next <ChevronRight className="ml-2" />
        </button>
      </div>
    </form>
  )
}
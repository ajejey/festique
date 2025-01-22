'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { ImagePlus, Trash2 } from 'lucide-react'

export default function EventMediaUpload({ 
  initialData, 
  onNext,
  onPrev,
  onSubmit,
  isLastStep 
}) {
  const [coverImage, setCoverImage] = useState(initialData.coverImage || null)
  const [additionalImages, setAdditionalImages] = useState(initialData.additionalImages || [])
  const [errors, setErrors] = useState({})
  const coverImageRef = useRef(null)
  const additionalImagesRef = useRef(null)

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImage({
          file,
          preview: reader.result
        })
        setErrors(prev => ({ ...prev, coverImage: '' }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      return new Promise(resolve => {
        reader.onloadend = () => {
          resolve({
            file,
            preview: reader.result
          })
        }
      })
    })

    Promise.all(newImages).then(processedImages => {
      setAdditionalImages(prev => [...prev, ...processedImages])
      setErrors(prev => ({ ...prev, additionalImages: '' }))
    })
  }

  const removeCoverImage = () => {
    setCoverImage(null)
    if (coverImageRef.current) {
      coverImageRef.current.value = ''
    }
  }

  const removeAdditionalImage = (index) => {
    const newImages = additionalImages.filter((_, i) => i !== index)
    setAdditionalImages(newImages)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!coverImage) {
      newErrors.coverImage = 'Cover image is required'
    }

    if (additionalImages.length === 0) {
      newErrors.additionalImages = 'At least one additional image is recommended'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onNext({ coverImage, additionalImages })
      if (isLastStep) {
        onSubmit()
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label 
          className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
        >
          Cover Image
        </label>
        <div 
          className={`
            border-2 border-dashed rounded-lg p-6 text-center 
            ${errors.coverImage 
              ? 'border-red-500 bg-red-50' 
              : 'border-neutral-300 hover:border-primary'
            } 
            transition-colors
          `}
        >
          {coverImage ? (
            <div className="relative w-full max-h-64 overflow-hidden rounded-lg">
              <Image 
                src={coverImage.preview} 
                alt="Cover" 
                layout="responsive"
                width={800} 
                height={400} 
                objectFit="cover"
                className="rounded-lg"
              />
              <button
                type="button"
                onClick={removeCoverImage}
                className="
                  absolute top-2 right-2 bg-white/80 p-2 rounded-full 
                  text-red-500 hover:bg-white/90 transition-colors
                "
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <input 
                type="file" 
                ref={coverImageRef}
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="hidden"
                id="coverImageUpload"
              />
              <label 
                htmlFor="coverImageUpload"
                className="
                  cursor-pointer flex flex-col items-center 
                  text-neutral-600 hover:text-primary
                  transition-colors
                "
              >
                <ImagePlus className="w-12 h-12 mb-4" />
                <p className="font-montserrat">
                  Click to upload cover image
                </p>
                <p className="text-xs text-neutral-500 mt-2">
                  Recommended size: 1200x630 pixels
                </p>
              </label>
            </>
          )}
        </div>
        {errors.coverImage && (
          <p className="text-red-500 text-xs mt-1">{errors.coverImage}</p>
        )}
      </div>

      <div>
        <label 
          className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
        >
          Additional Event Images
        </label>
        <div 
          className={`
            border-2 border-dashed rounded-lg p-6 
            ${errors.additionalImages 
              ? 'border-red-500 bg-red-50' 
              : 'border-neutral-300 hover:border-primary'
            } 
            transition-colors
          `}
        >
          <input 
            type="file" 
            ref={additionalImagesRef}
            accept="image/*"
            multiple
            onChange={handleAdditionalImagesUpload}
            className="hidden"
            id="additionalImagesUpload"
          />
          <label 
            htmlFor="additionalImagesUpload"
            className="
              cursor-pointer flex flex-col items-center 
              text-neutral-600 hover:text-primary
              transition-colors
            "
          >
            <ImagePlus className="w-12 h-12 mb-4" />
            <p className="font-montserrat">
              Click to upload additional images
            </p>
            <p className="text-xs text-neutral-500 mt-2">
              Maximum 5 images, each up to 5MB
            </p>
          </label>

          {additionalImages.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-6">
              {additionalImages.map((image, index) => (
                <div 
                  key={index} 
                  className="relative rounded-lg overflow-hidden"
                >
                  <Image 
                    src={image.preview} 
                    alt={`Additional image ${index + 1}`} 
                    width={200} 
                    height={200} 
                    objectFit="cover"
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="
                      absolute top-1 right-1 bg-white/80 p-1 rounded-full 
                      text-red-500 hover:bg-white/90 transition-colors
                    "
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.additionalImages && (
          <p className="text-red-500 text-xs mt-1">{errors.additionalImages}</p>
        )}
      </div>

      <div className="flex justify-between mt-8">
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
          Previous Step
        </button>

        <button
          type="submit"
          className="
            flex items-center bg-[#FF6B6B] text-white 
            px-6 py-3 rounded-full 
            hover:bg-[#ff5252] transition-colors
            font-montserrat font-semibold
          "
        >
          {isLastStep ? 'Create Event' : 'Next Step'}
        </button>
      </div>
    </form>
  )
}

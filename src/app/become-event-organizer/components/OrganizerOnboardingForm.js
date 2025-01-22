'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { requestEventCreationEligibility } from '@/app/lib/actions/organizer'
import { FileUp, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function OrganizerOnboardingForm() {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPhone: '',
    verificationDocuments: null
  })

  console.log("formData state", formData)

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false
  })
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({
      ...prev,
      verificationDocuments: file
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, error: null, success: false })
    console.log("formData in submit", formData)
    try {
      // Create FormData to handle file upload
      const formSubmitData = new FormData()
      console.log("formSubmitData", formSubmitData)
      formSubmitData.append('organizationName', formData.organizationName)
      formSubmitData.append('contactPhone', formData.contactPhone)
      if (formData.verificationDocuments) {
        formSubmitData.append('verificationDocuments', formData.verificationDocuments)
      }

      console.log("requesting event creation eligibility", formSubmitData)

      const result = await requestEventCreationEligibility(formSubmitData)

      console.log("result", result)

      if (result.success) {
        setStatus({ 
          loading: false, 
          error: null, 
          success: true 
        })
        // Redirect or show success message
        router.push('/organize?message=organizer_request_submitted')
      } else {
        setStatus({ 
          loading: false, 
          error: result.message, 
          success: false 
        })
      }
    } catch (error) {
      setStatus({ 
        loading: false, 
        error: error.message || 'An unexpected error occurred', 
        success: false 
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="organizationName" className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
          Organization/Company Name
        </label>
        <input
          type="text"
          id="organizationName"
          name="organizationName"
          required
          value={formData.organizationName}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          placeholder="Enter your organization name"
        />
      </div>

      <div>
        <label htmlFor="contactPhone" className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
          Contact Phone Number
        </label>
        <input
          type="tel"
          id="contactPhone"
          name="contactPhone"
          required
          value={formData.contactPhone}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          placeholder="Enter contact phone number"
        />
      </div>

      <div>
        <label htmlFor="verificationDocuments" className="block text-sm font-montserrat font-medium text-neutral-700 mb-2">
          Verification Documents
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-neutral-300 border-dashed rounded-lg cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileUp className="w-10 h-10 text-neutral-500 mb-3" />
              <p className="mb-2 text-sm text-neutral-500">
                {formData.verificationDocuments 
                  ? formData.verificationDocuments.name 
                  : 'Click to upload documents (e.g., business registration)'}
              </p>
            </div>
            <input 
              type="file" 
              id="verificationDocuments"
              name="verificationDocuments"
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </label>
        </div>
      </div>

      {status.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <p className="text-sm">{status.error}</p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={status.loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-montserrat font-semibold text-white 
            ${status.loading 
              ? 'bg-neutral-400 cursor-not-allowed' 
              : 'bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6B]/50'}
            transition-all`}
        >
          {status.loading ? 'Submitting...' : 'Request Event Creation Eligibility'}
        </button>
      </div>

      <div className="text-center text-sm text-neutral-600 mt-4">
        <p>
          By submitting this form, you agree to our{' '}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </form>
  )
}

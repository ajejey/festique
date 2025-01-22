'use client'

import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function Error({
  error,
  reset
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
    
    // Show toast notification
    toast.error('Confirmation Error', {
      description: error.message || 'Something went wrong',
      duration: 4000
    })
  }, [error])

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-50 p-4">
      <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
        <AlertCircle 
          className="mx-auto mb-4 h-12 w-12 text-red-500" 
        />
        <h2 className="font-playfair text-xl font-bold text-neutral-900 mb-4">
          Registration Confirmation Failed
        </h2>
        <p className="font-montserrat text-neutral-700 mb-6">
          {error.message || 'An unexpected error occurred during registration confirmation'}
        </p>
        <div className="space-y-4">
          <button 
            onClick={() => reset()}
            className="
              w-full py-3 rounded-full 
              bg-[#FF6B6B] text-white 
              hover:bg-[#ff5252] 
              transition-colors
            "
          >
            Try Again
          </button>
          <Link 
            href="/events"
            className="
              w-full inline-block py-3 rounded-full 
              bg-neutral-100 text-neutral-800
              hover:bg-neutral-200
              transition-colors
              text-center
            "
          >
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  )
}

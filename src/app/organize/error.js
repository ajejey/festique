'use client'

import { AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

export default function OrganizeError({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <AlertTriangle 
          className="mx-auto mb-4 h-16 w-16 text-red-500" 
        />
        <h2 className="text-2xl font-playfair font-bold text-neutral-900 mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-neutral-600 mb-6">
          {error.message || 'An unexpected error occurred in the Organizer Dashboard'}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => reset()}
            className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/organize"
            className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}

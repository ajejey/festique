'use client'

import { AlertTriangle } from 'lucide-react'

export default function Error({ 
  error, 
  reset 
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
      <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-playfair font-bold text-neutral-900 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-neutral-700 font-montserrat mb-6">
        {error.message || 'Unable to load registration form customization'}
      </p>
      <button 
        onClick={() => reset()}
        className="bg-primary hover:bg-primary/90 text-white rounded-full"
      >
        Try Again
      </button>
    </div>
  )
}

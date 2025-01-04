'use client'

import { AlertTriangle } from 'lucide-react'

export default function RegisterError({ error, reset }) {
  return (
    <main className="min-h-screen pt-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <AlertTriangle className="w-16 h-16 text-[#FF6B6B] mx-auto mb-6" />
          <h1 className="font-playfair text-3xl font-bold mb-4">
            Something went wrong!
          </h1>
          <p className="text-neutral-600 mb-8">
            {error.message || 'An error occurred while loading the registration form.'}
          </p>
          <button
            onClick={reset}
            className="px-6 py-2 rounded-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </main>
  )
}

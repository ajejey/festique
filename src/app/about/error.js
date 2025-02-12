'use client';

import { AlertTriangle } from 'lucide-react';

export default function AboutError({ error, reset }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-neutral-50 p-4">
      <AlertTriangle className="text-[#FF6B6B] mb-4" size={64} />
      <h2 className="font-playfair text-2xl font-bold text-neutral-900 mb-2">
        Something went wrong
      </h2>
      <p className="font-montserrat text-neutral-700 mb-4 text-center">
        We apologize for the inconvenience. Please try again or contact support.
      </p>
      <button 
        onClick={() => reset()}
        className="bg-[#FF6B6B] text-white px-6 py-3 rounded-full hover:bg-[#FF5252] transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

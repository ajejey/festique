'use client'

import Link from 'next/link'
import { Ticket } from 'lucide-react'

export default function RegisterButton({ eventId, isOpen, spotsLeft }) {
  if (!isOpen) {
    return (
      <button 
        disabled
        className="w-full bg-neutral-200 text-neutral-600 px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2"
      >
        <Ticket className="w-5 h-5" />
        Registration Closed
      </button>
    )
  }

  if (spotsLeft === 0) {
    return (
      <button 
        disabled
        className="w-full bg-neutral-200 text-neutral-600 px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2"
      >
        <Ticket className="w-5 h-5" />
        Event Full
      </button>
    )
  }

  return (
    <Link
      href={`/events/${eventId}/register`}
      className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-colors"
      scroll={false}
    >
      <Ticket className="w-5 h-5" />
      Register Now
    </Link>
  )
}

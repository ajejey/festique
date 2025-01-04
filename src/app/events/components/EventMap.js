'use client'

import { MapPin } from 'lucide-react'

export default function EventMap({ coordinates }) {
  return (
    <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="w-8 h-8 mx-auto mb-2 text-[#FF6B6B]" />
        <p className="text-neutral-600">
          Map will be integrated here
          <br />
          Coordinates: {coordinates.lat}, {coordinates.lng}
        </p>
      </div>
    </div>
  )
}

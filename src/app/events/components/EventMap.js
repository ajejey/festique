'use client'

import { MapPin } from 'lucide-react'

export default function EventMap({ center, address }) {
  const [lat, lng] = center || [0, 0]
  
  return (
    <div className="w-full aspect-video bg-neutral-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <MapPin className="w-8 h-8 mx-auto mb-2 text-[#FF6B6B]" />
        <p className="text-neutral-600">
          {address}
          <br />
          <span className="text-sm">
            Coordinates: {lat}, {lng}
          </span>
        </p>
      </div>
    </div>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import { formatDate, formatLocation, formatEventType, formatDifficulty } from '@/lib/utils'

export default function EventCard({ event }) {
  const {
    _id,
    name,
    description,
    startDate,
    location,
    eventType,
    coverImage,
    organizer,
    difficulty
  } = event

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {/* Event Cover Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image 
          src={coverImage || '/default-event-cover.jpg'}
          alt={`Cover image for ${name}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Event Details */}
      <div className="p-4 space-y-3">
        {/* Event Type and Difficulty Badge */}
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-montserrat rounded-full">
            {formatEventType(eventType)}
          </span>
          <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-montserrat rounded-full">
            {formatDifficulty(difficulty)}
          </span>
        </div>

        {/* Event Name */}
        <h3 className="text-lg font-playfair font-bold text-neutral-900 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Event Description */}
        <p className="text-sm font-montserrat text-neutral-600 line-clamp-2">
          {description}
        </p>

        {/* Event Details */}
        <div className="space-y-2">
          {/* Date */}
          <div className="flex items-center space-x-2 text-neutral-700">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-xs font-montserrat">
              {formatDate(startDate, 'MMMM dd, yyyy')}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 text-neutral-700">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-xs font-montserrat">
              {formatLocation(location)}
            </span>
          </div>

          {/* Organizer */}
          {organizer && (
            <div className="flex items-center space-x-2 text-neutral-700">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs font-montserrat">
                {organizer.name}
              </span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <Link 
          href={`/events/${_id}`} 
          className="
            block w-full text-center mt-4 
            bg-primary text-white 
            py-2 rounded-full 
            font-montserrat font-semibold
            hover:bg-primary/90 
            transition-colors
          "
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

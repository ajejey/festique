import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'

export default function EventCard({ event }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <Link href={`/events/${event.id}`}>
      <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
        <div className="relative h-48">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="font-playfair text-xl font-bold mb-2">
            {event.title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-neutral-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center text-neutral-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{event.location}</span>
            </div>
            <div className="flex items-center text-neutral-600">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">{event.participantCount.toLocaleString()} participants</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#FF6B6B] font-semibold">{event.price}</span>
            <span className="text-sm text-neutral-600">
              {event.distance}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

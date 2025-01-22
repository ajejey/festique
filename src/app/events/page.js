'use server'

import { Suspense } from 'react'
import { getEvents, getEventTypes, getEventCities } from './actions'
import EventCard from './components/EventCard'
import { Filter, Search } from 'lucide-react'

export default async function EventsPage() {
  const events = await getEvents()
  const eventTypes = await getEventTypes()
  const eventCities = await getEventCities()

  return (
    <div className="container mx-auto px-4 py-20 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-playfair font-bold text-neutral-900">
          Upcoming Events
        </h1>
        <p className="text-neutral-600 font-montserrat max-w-xl mx-auto">
          Explore a variety of exciting running and cycling events across different locations and difficulty levels.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-neutral-50 rounded-2xl p-6 shadow-sm">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Event Type Filter */}
          <div>
            <label 
              htmlFor="eventType" 
              className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
            >
              Event Type
            </label>
            <select 
              id="eventType" 
              className="
                w-full px-4 py-3 rounded-lg border border-neutral-300
                focus:border-primary focus:ring-primary focus:outline-none
                font-montserrat text-neutral-900
              "
            >
              <option value="">All Types</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label 
              htmlFor="city" 
              className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
            >
              City
            </label>
            <select 
              id="city" 
              className="
                w-full px-4 py-3 rounded-lg border border-neutral-300
                focus:border-primary focus:ring-primary focus:outline-none
                font-montserrat text-neutral-900
              "
            >
              <option value="">All Cities</option>
              {eventCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label 
              htmlFor="dateRange" 
              className="block text-sm font-montserrat font-medium text-neutral-700 mb-2"
            >
              Date Range
            </label>
            <input 
              type="date" 
              id="dateRange" 
              className="
                w-full px-4 py-3 rounded-lg border border-neutral-300
                focus:border-primary focus:ring-primary focus:outline-none
                font-montserrat text-neutral-900
              "
            />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center text-neutral-600 font-montserrat">
            No events found. Check back later or adjust your filters.
          </div>
        ) : (
          events.map(event => (
            <EventCard key={event._id} event={event} />
          ))
        )}
      </div>

      {/* Pagination (Optional) */}
      <div className="flex justify-center mt-8">
        <nav aria-label="Pagination" className="inline-flex space-x-2">
          <button 
            disabled 
            className="
              px-4 py-2 rounded-full 
              bg-neutral-200 text-neutral-600 
              cursor-not-allowed
            "
          >
            Previous
          </button>
          <button 
            className="
              px-4 py-2 rounded-full 
              bg-primary text-white 
              hover:bg-primary/90
            "
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  )
}

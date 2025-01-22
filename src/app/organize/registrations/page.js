'use server'

import { getOrganizerRegistrations } from '../actions'
import RegistrationsTable from './components/RegistrationsTable'
import EventMetrics from './components/EventMetrics'
import { requireAuth } from '@/app/lib/auth'

export default async function RegistrationsPage() {
  await requireAuth()
  
  const { registrations, events } = await getOrganizerRegistrations()

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="
        font-playfair text-3xl font-bold 
        text-neutral-800 mb-6
      ">
        Event Registrations
      </h1>

      {/* Event Metrics */}
      <EventMetrics 
        registrations={registrations} 
        events={events} 
      />

      {/* Registrations Table */}
      <RegistrationsTable registrations={registrations} />
    </div>
  )
}

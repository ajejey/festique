import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Trophy,
  Route,
  Ticket,
  Share2,
  Heart,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react'
import { getEventById } from '../actions'
import { formatLocation, formatCurrency, formatDate } from '@/lib/utils'
import MobileRegistration from './components/MobileRegistration'
import TicketTiers from './components/TicketTiers'
import RegistrationModal from './components/RegistrationModal'

export default async function EventDetailPage({ params }) {
  const { id } = await params
  const event = await getEventById(id)

  console.log("event", event)

  if (!event) {
    notFound()
  }

  // const isRegistrationOpen = new Date(event.registrationCloseDate) > new Date()
  const isRegistrationOpen = true
  const spotsLeft = event.capacity?.total - (event.capacity?.registered || 0)

  return (
    <div>
      <main className="min-h-screen pt-16 pb-24 lg:pb-16">
        {/* Hero Section */}
        <section className="relative h-[40vh] md:h-[50vh]">
          <Image
            src={event.coverImage || '/default-event-cover.jpg'}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-2 lg:mb-4">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              {event.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-neutral-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(event.startDate, 'MMMM dd, yyyy')}</span>
              </div>
              {event.schedule?.length > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>
                    {new Intl.DateTimeFormat('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(new Date(event.schedule[0].time))}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{formatLocation(event.location)}</span>
              </div>
              {event.categories?.length > 0 && (
                <div className="flex items-center gap-2">
                  <Route className="w-5 h-5" />
                  <span>{event.categories[0].distance}</span>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 md:space-y-8">
              {/* Description */}
              <section className="bg-white rounded-2xl p-6">
                <h2 className="font-playfair text-2xl font-bold mb-4">About the Event</h2>
                <div className="prose max-w-none">
                  {event.description?.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-neutral-600">{paragraph}</p>
                  ))}
                </div>
              </section>

              {event.categories?.length > 0 && (
                <section className="bg-white rounded-2xl p-6">
                  <h2 className="font-playfair text-2xl font-bold mb-4">Event Categories</h2>
                  <div className="grid gap-4">
                    {event.categories.map((category, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-neutral-50 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <span className="text-primary font-semibold">
                            {formatCurrency(category.basePrice)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                          <div className="flex items-center gap-1">
                            <Route className="w-4 h-4" />
                            <span>{category.distance}</span>
                          </div>
                          {category.ageGroup && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>Age {category.ageGroup.min}-{category.ageGroup.max}</span>
                            </div>
                          )}
                          {category.gender && category.gender !== 'All' && (
                            <div className="flex items-center gap-1">
                              <Info className="w-4 h-4" />
                              <span>{category.gender} Only</span>
                            </div>
                          )}
                        </div>
                        {category.description && (
                          <p className="text-sm text-neutral-600">{category.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Schedule */}
              {event.schedule?.length > 0 && (
                <section className="bg-white rounded-2xl p-6">
                  <h2 className="font-playfair text-2xl font-bold mb-4">Event Schedule</h2>
                  <div className="space-y-4">
                    {event.schedule.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-lg bg-neutral-50"
                      >
                        <Clock className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <div className="font-semibold">
                            {new Intl.DateTimeFormat('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            }).format(new Date(item.time))}
                          </div>
                          <div className="text-neutral-600">{item.activity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Location */}
              {event.location && (
                <section className="bg-white rounded-2xl p-6">
                  <h2 className="font-playfair text-2xl font-bold mb-4">Location</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-neutral-50">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <div className="font-semibold">{event.location.venue}</div>
                        <div className="text-neutral-600">{event.location.address}</div>
                        <div className="text-sm text-neutral-600">
                          {formatLocation(event.location)}
                        </div>
                      </div>
                    </div>
                    {event.location.googleMapsLink && (
                      <a
                        href={event.location.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-flex items-center gap-2 
                          px-4 py-2 rounded-full
                          bg-primary text-white
                          hover:bg-primary/90 transition-colors
                        "
                      >
                        <MapPin className="w-4 h-4" />
                        View on Google Maps
                      </a>
                    )}
                  </div>
                </section>
              )}

              {/* Amenities */}
              {event.amenities?.length > 0 && (
                <section className="bg-white rounded-2xl p-6">
                  <h2 className="font-playfair text-2xl font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 rounded-lg bg-neutral-50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-secondary" />
                        <span className="text-neutral-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Event Specific Config */}
              {event.eventSpecificConfig && (
                <section className="bg-white rounded-2xl p-6">
                  <h2 className="font-playfair text-2xl font-bold mb-4">Event Details</h2>
                  <div className="grid gap-4">
                    {event.eventSpecificConfig.terrainType && (
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-neutral-50">
                        <Route className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <div className="font-semibold">Terrain Type</div>
                          <div className="text-neutral-600">
                            {event.eventSpecificConfig.terrainType}
                          </div>
                        </div>
                      </div>
                    )}
                    {event.eventSpecificConfig.elevationProfile && (
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-neutral-50">
                        <Trophy className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <div className="font-semibold">Elevation Profile</div>
                          <div className="text-neutral-600">
                            {event.eventSpecificConfig.elevationProfile}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Rules */}
              {event.rules?.length > 0 && (
                <section className="bg-white rounded-2xl p-6">
                  <h2 className="font-playfair text-2xl font-bold mb-4">Event Rules</h2>
                  <div className="space-y-3">
                    {event.rules.map((rule, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-primary mt-1" />
                        <span className="text-neutral-600">{rule}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl p-6 sticky top-24">
                <div className="space-y-6">
                  {/* Ticket Tiers */}
                  <TicketTiers event={event} />

                  {/* Registration Deadline */}
                  <div className="text-center text-sm text-neutral-600">
                    Registration closes on {formatDate(event.registrationCloseDate)}
                  </div>

                  {/* Registration Modal */}
                  <RegistrationModal
                    eventId={event._id}
                    eventCategories={event.categories}
                    isRegistrationOpen={isRegistrationOpen}
                    spotsLeft={spotsLeft}
                  />

                  {/* Share and Save */}
                  <div className="flex gap-2">
                    <button className="
                      flex-1 py-2 px-4 rounded-full
                      border border-neutral-200
                      text-neutral-700 hover:bg-neutral-50
                      flex items-center justify-center gap-2
                      transition-colors
                    ">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button className="
                      flex-1 py-2 px-4 rounded-full
                      border border-neutral-200
                      text-neutral-700 hover:bg-neutral-50
                      flex items-center justify-center gap-2
                      transition-colors
                    ">
                      <Heart className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Registration Card - Sticky Bottom */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-white shadow-2xl border-t border-neutral-100">
            <div className="space-y-2">
              {/* Ticket Tiers */}
              <TicketTiers event={event} />

              {/* Registration Deadline */}
              <div className="text-center text-xs text-neutral-600 py-1">
                Registration closes on {formatDate(event.registrationCloseDate)}
              </div>

              {/* Registration Modal */}
              <RegistrationModal
                eventId={event._id}
                eventCategories={event.categories}
                isRegistrationOpen={isRegistrationOpen}
                spotsLeft={spotsLeft}
              />

              {/* Share and Save */}
              {/* <div className="flex gap-2">
                <button className="
                  flex-1 py-1.5 px-3 rounded-full
                  border border-neutral-200
                  text-neutral-700 hover:bg-neutral-50
                  flex items-center justify-center gap-1
                  text-xs
                  transition-colors
                ">
                  <Share2 className="w-3 h-3" />
                  Share
                </button>
                <button className="
                  flex-1 py-1.5 px-3 rounded-full
                  border border-neutral-200
                  text-neutral-700 hover:bg-neutral-50
                  flex items-center justify-center gap-1
                  text-xs
                  transition-colors
                ">
                  <Heart className="w-3 h-3" />
                  Save
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Mobile Registration */}
        {/* <MobileRegistration 
          event={event}
          isRegistrationOpen={isRegistrationOpen}
          spotsLeft={spotsLeft}
        /> */}
      </main>

      {/* Registration Modal Button */}
      {/* <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md shadow-lg z-40">
        <RegistrationModal 
          eventId={event._id}
          eventCategories={event.categories}
          isRegistrationOpen={isRegistrationOpen}
          spotsLeft={spotsLeft}
        />
      </div> */}
    </div>
  )
}

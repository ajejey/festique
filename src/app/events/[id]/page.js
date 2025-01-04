import Image from 'next/image'
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
  AlertCircle
} from 'lucide-react'
import RegisterButton from '../components/RegisterButton'
import EventMap from '../components/EventMap'
import ShareEvent from '../components/ShareEvent'

// This would come from your database
const eventData = {
  id: 1,
  title: "Mumbai Marathon 2024",
  date: "2024-02-15",
  time: "6:00 AM",
  location: "Mumbai, India",
  address: "Azad Maidan, Mahapalika Marg, Fort, Mumbai",
  coordinates: {
    lat: 18.9322,
    lng: 72.8313
  },
  distance: "42.2km",
  price: "₹2000",
  registrationEndDate: "2025-02-02",
  image: "https://images.pexels.com/photos/1555354/pexels-photo-1555354.jpeg",
  organizer: {
    name: "Mumbai Road Runners",
    logo: "/organizers/mumbai-runners.png",
    description: "Mumbai's premier running community organizing quality marathon events since 2010.",
    contact: "info@mumbairoadrunners.com"
  },
  participantCount: 5000,
  maxParticipants: 7500,
  description: `Join us for Mumbai's biggest marathon event of the year! The Mumbai Marathon is more than just a race - it's a celebration of human spirit and determination.

This AIMS-certified course takes you through the heart of Mumbai, passing iconic landmarks and offering breathtaking views of the Arabian Sea.

Event Features:
- AIMS certified course
- Chip timing
- Hydration stations every 2km
- Medical support throughout the course
- Finisher's medal and t-shirt
- Post-race refreshments

Categories:
- Full Marathon (42.2km)
- Half Marathon (21.1km)
- 10K Run
- 5K Fun Run`,
  schedule: [
    { time: "4:30 AM", activity: "Reporting Time" },
    { time: "5:30 AM", activity: "Warm-up Session" },
    { time: "6:00 AM", activity: "Marathon Start" },
    { time: "6:15 AM", activity: "Half Marathon Start" },
    { time: "6:30 AM", activity: "10K Run Start" },
    { time: "7:00 AM", activity: "5K Fun Run Start" },
    { time: "1:00 PM", activity: "Event Closure" }
  ],
  amenities: [
    "Hydration Stations",
    "Medical Support",
    "Pace Setters",
    "Bag Storage",
    "Changing Rooms",
    "Finisher's Medal",
    "Event T-shirt",
    "Post-race Refreshments"
  ],
  courseMap: "/events/mumbai-marathon-course.jpg",
  rules: [
    "Participants must be 18 years or older",
    "Race bib must be visible at all times",
    "No headphones allowed during the race",
    "Follow marshal instructions",
    "No external assistance allowed"
  ]
}

export default function EventDetail() {
  const isRegistrationOpen = new Date(eventData.registrationEndDate) > new Date()
  const spotsLeft = eventData.maxParticipants - eventData.participantCount

  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh]">
        <Image
          src={eventData.image}
          alt={eventData.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
              {eventData.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(eventData.date).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{eventData.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{eventData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Route className="w-5 h-5" />
                <span>{eventData.distance}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-white rounded-2xl p-6">
              <h2 className="font-playfair text-2xl font-bold mb-4">About the Event</h2>
              <div className="prose max-w-none">
                {eventData.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Schedule */}
            <section className="bg-white rounded-2xl p-6">
              <h2 className="font-playfair text-2xl font-bold mb-4">Event Schedule</h2>
              <div className="space-y-4">
                {eventData.schedule.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-neutral-50"
                  >
                    <Clock className="w-5 h-5 text-[#FF6B6B] mt-1" />
                    <div>
                      <div className="font-semibold">{item.time}</div>
                      <div className="text-neutral-600">{item.activity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Map */}
            <section className="bg-white rounded-2xl p-6">
              <h2 className="font-playfair text-2xl font-bold mb-4">Course Map</h2>
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <EventMap coordinates={eventData.coordinates} />
              </div>
            </section>

            {/* Amenities */}
            <section className="bg-white rounded-2xl p-6">
              <h2 className="font-playfair text-2xl font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {eventData.amenities.map((amenity, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-lg bg-neutral-50"
                  >
                    <Trophy className="w-4 h-4 text-[#4ECDC4]" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Rules */}
            <section className="bg-white rounded-2xl p-6">
              <h2 className="font-playfair text-2xl font-bold mb-4">Event Rules</h2>
              <div className="space-y-3">
                {eventData.rules.map((rule, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-[#FF6B6B] mt-1" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <div className="text-2xl font-bold mb-2">{eventData.price}</div>
              <div className="flex items-center gap-2 text-neutral-600 mb-4">
                <Users className="w-4 h-4" />
                <span>{spotsLeft.toLocaleString()} spots left</span>
              </div>

              <RegisterButton 
                eventId={eventData.id}
                isOpen={isRegistrationOpen}
                spotsLeft={spotsLeft}
              />

              <div className="mt-4 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
                  <Heart className="w-5 h-5" />
                  Save
                </button>
                <ShareEvent 
                  title={eventData.title}
                  description={eventData.description.split('\n')[0]}
                />
              </div>

              {/* Organizer Info */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h3 className="font-semibold mb-2">Organized by</h3>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-100">
                    <Image
                      src={eventData.organizer.logo}
                      alt={eventData.organizer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{eventData.organizer.name}</div>
                    <div className="text-sm text-neutral-600">{eventData.organizer.contact}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-neutral-600">
                  {eventData.organizer.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

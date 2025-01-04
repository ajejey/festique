import { Search, MapPin, Calendar, Trophy } from 'lucide-react'
import EventCard from './components/EventCard'
import SearchFilters from './components/SearchFilters'

// This would come from your database
const sampleEvents = [
  {
    id: 1,
    title: "Mumbai Marathon 2024",
    date: "2024-02-15",
    location: "Mumbai, India",
    distance: "42.2km",
    price: "₹2000",
    registrationEndDate: "2024-02-01",
    image: "https://images.pexels.com/photos/1555354/pexels-photo-1555354.jpeg",
    organizer: "Mumbai Road Runners",
    participantCount: 5000,
  },
  {
    id: 2,
    title: "Hyderabad Marathon 2024",
    date: "2024-08-15",
    location: "Hyderabad, India",
    distance: "21.1km",
    price: "₹1000",
    registrationEndDate: "2024-08-01",
    image: "https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg",
    organizer: "Hyderabad Runners Club",
    participantCount: 2000,
  },
  {
    id: 3,
    title: "Bangalore Marathon 2024",
    date: "2024-12-15",
    location: "Bangalore, India",
    distance: "10km",
    price: "₹500",
    registrationEndDate: "2024-12-01",
    image: "https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg",
    organizer: "Bangalore Runners Community",
    participantCount: 1000,
  },
  {
    id: 4,
    title: "Pune Marathon 2024",
    date: "2024-03-15",
    location: "Pune, India",
    distance: "42.2km",
    price: "₹1500",
    registrationEndDate: "2024-03-01",
    image: "https://images.pexels.com/photos/3621183/pexels-photo-3621183.jpeg",
    organizer: "Pune Runners Association",
    participantCount: 8000,
  },
  {
    id: 5,
    title: "Delhi Marathon 2024",
    date: "2024-04-15",
    location: "New Delhi, India",
    distance: "42.2km",
    price: "₹3000",
    registrationEndDate: "2024-04-01",
    image: "https://images.pexels.com/photos/2524874/pexels-photo-2524874.jpeg",
    organizer: "Delhi Runners Group",
    participantCount: 12000,
  },
  {
    id: 6,
    title: "Chennai Marathon 2024",
    date: "2024-05-15",
    location: "Chennai, India",
    distance: "42.2km",
    price: "₹1000",
    registrationEndDate: "2024-05-01",
    image: "https://images.pexels.com/photos/2524874/pexels-photo-2524874.jpeg",
    organizer: "Chennai Runners Association",
    participantCount: 8000,
  },
  {
    id: 7,
    title: "Kolkata Marathon 2024",
    date: "2024-06-15",
    location: "Kolkata, India",
    distance: "42.2km",
    price: "₹2000",
    registrationEndDate: "2024-06-01",
    image: "https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg",
    organizer: "Kolkata Runners Community",
    participantCount: 10000,
  },
  {
    id: 8,
    title: "Ahmedabad Marathon 2024",
    date: "2024-07-15",
    location: "Ahmedabad, India",
    distance: "42.2km",
    price: "₹3000",
    registrationEndDate: "2024-07-01",
    image: "https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg",
    organizer: "Ahmedabad Runners Association",
    participantCount: 15000,
  },
]

export default async function EventsPage() {
  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FF6B6B]/10 via-[#4ECDC4]/10 to-[#45B7D1]/10 py-24">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-center mb-8">
            Discover Your Next Race
          </h1>
          <p className="text-neutral-600 text-center mb-12 max-w-2xl mx-auto">
            Find and register for marathons across the country. From 5K fun runs to full marathons, 
            we&apos;ve got the perfect race for every runner.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchFilters />
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white p-4 rounded-2xl text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-[#FF6B6B]" />
              <div className="font-bold text-2xl">50+</div>
              <div className="text-sm text-neutral-600">Upcoming Events</div>
            </div>
            <div className="bg-white p-4 rounded-2xl text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-[#4ECDC4]" />
              <div className="font-bold text-2xl">20+</div>
              <div className="text-sm text-neutral-600">Cities</div>
            </div>
            <div className="bg-white p-4 rounded-2xl text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-[#45B7D1]" />
              <div className="font-bold text-2xl">100K+</div>
              <div className="text-sm text-neutral-600">Runners</div>
            </div>
            <div className="bg-white p-4 rounded-2xl text-center">
              <Search className="w-6 h-6 mx-auto mb-2 text-[#FF6B6B]" />
              <div className="font-bold text-2xl">5K+</div>
              <div className="text-sm text-neutral-600">Monthly Searches</div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

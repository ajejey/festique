import Image from 'next/image'
import Link from 'next/link'
import { 
  Target, 
  Sparkles, 
  Users, 
  Medal, 
  Calendar, 
  MapPin,
  TrendingUp,
  Heart,
  MessageCircle,
  Trophy
} from 'lucide-react'

const features = [
  {
    title: "Smart Event Discovery",
    description: "AI-powered recommendations based on your running history and preferences.",
    icon: <Target className="w-8 h-8 text-[#FF6B6B]" />
  },
  {
    title: "Seamless Registration",
    description: "One-click registration with secure payment processing.",
    icon: <Sparkles className="w-8 h-8 text-[#FF6B6B]" />
  },
  {
    title: "Runner Community",
    description: "Connect with fellow runners and share your journey.",
    icon: <Users className="w-8 h-8 text-[#FF6B6B]" />
  }
]

const stats = [
  { number: "50K+", label: "Active Runners", icon: <Medal className="w-6 h-6" /> },
  { number: "1000+", label: "Events Hosted", icon: <Calendar className="w-6 h-6" /> },
  { number: "100+", label: "Cities Covered", icon: <MapPin className="w-6 h-6" /> }
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marathon Runner",
    image: "/testimonials/sarah.jpg",
    quote: "Festique transformed how I discover and participate in marathons. The community features are amazing!"
  },
  {
    name: "David Kumar",
    role: "Event Organizer",
    image: "/testimonials/david.jpg",
    quote: "As an organizer, Festique made event management seamless. The analytics are incredibly helpful."
  }
]

export default function Home() {
  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute w-full h-full object-cover"
            poster="/images/hero-poster.jpg"
          >
            <source 
              src="/video/hero-running.mp4" 
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 via-neutral-900/50 to-neutral-900/30" />
          {/* Animated Pattern Overlay */}
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl text-white">
            <h1 className="font-playfair text-6xl md:text-7xl font-bold mb-6 text-white">
              Your Marathon Journey
              <span className="block text-[#FF6B6B]">Starts Here</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Discover local marathons, register with ease, and connect with fellow runners. 
              One platform, endless possibilities.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link 
                href="/events" 
                className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-8 py-4 rounded-full font-medium transition-all"
              >
                Find Events
              </Link>
              <Link 
                href="/organize" 
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-full font-medium transition-all border border-white/20"
              >
                Organize Event
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-4xl font-bold text-center mb-16">
            Everything You Need in
            <span className="text-[#4ECDC4]"> One Place</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition-all group"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-playfair text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievement Tracking */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                Track Your Progress,<br />
                Celebrate Victories
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <TrendingUp className="w-6 h-6 text-[#4ECDC4] mt-1" />
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Performance Analytics</h3>
                    <p className="text-neutral-300">Track your progress with detailed insights and performance metrics.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Heart className="w-6 h-6 text-[#FF6B6B] mt-1" />
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Health Integration</h3>
                    <p className="text-neutral-300">Sync with your favorite health apps for comprehensive tracking.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Trophy className="w-6 h-6 text-[#4ECDC4] mt-1" />
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Achievement System</h3>
                    <p className="text-neutral-300">Earn badges and rewards as you reach new milestones.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/images/achievements.jpg"
                alt="Achievement tracking dashboard"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24 bg-[#4ECDC4] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              Join the Community
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Connect with fellow runners, share experiences, and grow together.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <div className="font-playfair text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-4xl font-bold text-center mb-16">
            Trusted by Runners & Organizers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-neutral-50 p-8 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-neutral-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-neutral-700 italic">&quot;{testimonial.quote}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join thousands of runners and event organizers on Festique.
          </p>
          <Link 
            href="/register" 
            className="inline-block bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-8 py-4 rounded-full font-medium transition-all"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  )
}

import Image from 'next/image';
import Link from 'next/link';
import MissionVisionSection from './components/MissionVisionSection';
import FoundersSection from './components/FoundersSection';
import ValuesSection from './components/ValuesSection';

export const metadata = {
  title: 'About Festique - Empowering Runners, Connecting Communities',
  description: 'Discover how Festique is revolutionizing the running event ecosystem, supporting runners and organizers alike.'
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="100%" 
            height="100%" 
            className="text-[#45B7D1]"
          >
            <defs>
              <pattern id="pattern" width="100" height="100" patternUnits="userSpaceOnUse">
                <path 
                  d="M0 0 L50 50 L100 0 L50 50 Z" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        {/* Content Container */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center mb-6">
              {/* <RunningMan 
                className="text-[#FF6B6B] mr-4" 
                size={48} 
                strokeWidth={1.5} 
              /> */}
              <h1 className="font-racing text-[#FF6B6B] text-4xl md:text-6xl ">
                Festique.live: Connecting Runners, Empowering Communities
              </h1>
            </div>
            <p className="font-montserrat text-xl text-neutral-700 mb-8 leading-relaxed">
              More than a ticketing platform - we're a dynamic ecosystem that transforms how runners discover events, grow together, and achieve their personal best.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="/events" 
                className="bg-[#FF6B6B] text-white hover:bg-[#FF5252] px-6 py-3 rounded-full font-montserrat font-semibold transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
              >
                Explore Events
              </Link>
              <Link 
                href="/contact" 
                className="bg-transparent border-2 border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white px-6 py-3 rounded-full font-montserrat font-semibold transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 space-y-16">
        <MissionVisionSection />
        <FoundersSection />
        <ValuesSection />
      </div>

      {/* Call to Action */}
      <div className="bg-[#4ECDC4] text-white py-16 text-center">
        <h2 className="font-playfair text-3xl md:text-4xl mb-6">
          Join the Festique Community
        </h2>
        <p className="font-montserrat text-xl mb-8 max-w-2xl mx-auto">
          Whether you're an event organizer or a passionate runner, Festique is your platform to discover, grow, and achieve more.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            href="/events" 
            className="bg-white text-[#FF6B6B] hover:bg-neutral-100 px-6 py-3 rounded-full font-montserrat font-semibold transition-all duration-300 ease-in-out"
          >
            Explore Events
          </Link>
          <Link 
            href="/contact" 
            className="bg-transparent border-2 border-white hover:bg-white hover:text-[#4ECDC4] px-6 py-3 rounded-full font-montserrat font-semibold transition-all duration-300 ease-in-out"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

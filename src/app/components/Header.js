import Link from 'next/link'
import { Menu } from 'lucide-react'
import MobileMenu from './MobileMenu'

// const navigation = [
//   { name: 'Events', href: '/events' },
//   { name: 'How It Works', href: '/how-it-works' },
//   { name: 'Pricing', href: '/pricing' },
//   { name: 'Community', href: '/community' },
// ]

const navigation = [
  { name: 'Events', href: '/events' },
  { name: 'Organize', href: '/organize', requiredRole: ['organizer'] },
  // { name: 'My Registrations', href: '/registrations', requiredRole: ['participant'] },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' }
]

export default function Header() {
  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-neutral-200">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl md:text-5xl font-racing text-[#FF6B6B]">
              Festique
            </span>
            <span className="text-xl sm:text-2xl md:text-2xl font-racing text-[#FF6B6B]">
              .live
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-neutral-600 hover:text-neutral-900"
            >
              Log in
            </Link>
            <Link
              href="/events"
              className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-4 py-2 rounded-full text-sm transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <MobileMenu navigation={navigation} />
        </div>
      </nav>
    </header>
  )
}

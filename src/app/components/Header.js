import Link from 'next/link'
import { Menu } from 'lucide-react'
import MobileMenu from './MobileMenu'

const navigation = [
  { name: 'Events', href: '/events' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Community', href: '/community' },
]

export default function Header() {
  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-neutral-200">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-playfair font-bold text-neutral-900">
              Festique
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
              href="/register"
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

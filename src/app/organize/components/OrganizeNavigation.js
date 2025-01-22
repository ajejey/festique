'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  CalendarPlus, 
  Users, 
  TicketCheck, 
  Settings 
} from 'lucide-react'

const navItems = [
  { 
    href: '/organize', 
    icon: LayoutDashboard, 
    label: 'Dashboard' 
  },
  { 
    href: '/organize/create', 
    icon: CalendarPlus, 
    label: 'Create Event' 
  },
  { 
    href: '/organize/registrations', 
    icon: TicketCheck, 
    label: 'Registrations' 
  },
  { 
    href: '/organize/events', 
    icon: Users, 
    label: 'My Events' 
  },
  { 
    href: '/organize/analytics', 
    icon: Users, 
    label: 'Analytics' 
  },
  { 
    href: '/organize/settings', 
    icon: Settings, 
    label: 'Settings' 
  }
]

export default function OrganizeNavigation() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-white border-r border-neutral-200 p-4 shadow-sm">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-playfair font-bold text-neutral-900">
          Festique Organizer
        </h2>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={`
                  flex items-center p-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-neutral-600 hover:bg-neutral-100'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-montserrat text-sm">
                  {item.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

import { getUser } from '@/app/lib/auth'
import Link from 'next/link'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  PlusCircle 
} from 'lucide-react'
import { getOrganizerStats, getRecentEvents } from './actions'

export const dynamic = 'force-dynamic';

export default async function OrganizeDashboard() {
  const user = await getUser()
  const stats = await getOrganizerStats(user.id)
  const recentEvents = await getRecentEvents(user.id)

  return (
    <div className="space-y-8 pt-16">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-playfair font-bold text-neutral-900">
          Organizer Dashboard
        </h1>
        <Link 
          href="/organize/create"
          className="flex items-center bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: Calendar,
            title: 'Total Events',
            value: stats.totalEvents,
            color: 'text-primary'
          },
          {
            icon: Calendar,
            title: 'Upcoming Events',
            value: stats.upcomingEvents,
            color: 'text-secondary'
          },
          {
            icon: Users,
            title: 'Total Registrations',
            value: stats.totalRegistrations,
            color: 'text-accent'
          },
          {
            icon: DollarSign,
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            color: 'text-green-600'
          }
        ].map(({ icon: Icon, title, value, color }) => (
          <div 
            key={title} 
            className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-600 font-montserrat mb-2">
                  {title}
                </p>
                <p className={`text-3xl font-bold font-playfair ${color}`}>
                  {value}
                </p>
              </div>
              <Icon className={`w-10 h-10 ${color} opacity-30`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Events Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-100">
          <h2 className="text-xl font-playfair font-bold mb-4 text-neutral-900">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Create Event', href: '/organize/create' },
              { label: 'View Events', href: '/organize/events' },
              { label: 'Analytics', href: '/organize/analytics' },
              { label: 'Profile Settings', href: '/organize/settings' }
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="bg-neutral-100 hover:bg-neutral-200 text-center py-3 rounded-lg transition-colors font-montserrat text-sm"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-100">
          <h2 className="text-xl font-playfair font-bold mb-4 text-neutral-900">
            Recent Events
          </h2>
          {recentEvents.length > 0 ? (
            <ul className="space-y-2">
              {recentEvents.map((event) => (
                <li 
                  key={event._id} 
                  className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-b-0"
                >
                  <div>
                    <p className="font-montserrat text-sm font-medium">
                      {event.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(event.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span 
                    className={`
                      text-xs px-2 py-1 rounded-full 
                      ${event.status === 'published' 
                        ? 'bg-secondary/10 text-secondary' 
                        : 'bg-neutral-100 text-neutral-600'
                      }
                    `}
                  >
                    {event.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500 text-center py-8">
              No recent events. Create your first event!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

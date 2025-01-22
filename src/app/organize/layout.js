import { requireEventCreation } from '@/app/lib/auth'
import OrganizeNavigation from './components/OrganizeNavigation'

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Event Organizer Dashboard | Festique',
  description: 'Manage and create your running events'
}

export default async function OrganizeLayout({ children }) {
  // Verify event creation eligibility
  await requireEventCreation()

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <OrganizeNavigation />
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

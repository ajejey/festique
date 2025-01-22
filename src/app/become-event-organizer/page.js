import { getUser } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import OrganizerOnboardingForm from './components/OrganizerOnboardingForm'

export const metadata = {
  title: 'Become an Event Organizer | Festique',
  description: 'Apply to become an event organizer and create amazing running events'
}

export default async function BecomeEventOrganizerPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  console.log("user in become event organizer", user)

  if (user.canCreateEvents) {
    redirect('/organize')
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <h1 className="text-3xl font-playfair font-bold text-neutral-900 mb-6">
            Become an Event Organizer
          </h1>
          <OrganizerOnboardingForm />
        </div>
      </div>
    </div>
  )
}

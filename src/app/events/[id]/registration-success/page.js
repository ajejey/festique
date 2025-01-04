import Link from 'next/link'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

export default function RegistrationSuccess({ params }) {
  return (
    <main className="min-h-screen pt-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <CheckCircle2 className="w-20 h-20 text-[#4ECDC4] mx-auto" />
          </div>
          
          <h1 className="font-playfair text-4xl font-bold mb-4">
            Registration Successful!
          </h1>
          
          <p className="text-neutral-600 mb-8">
            Thank you for registering for the event. We have sent a confirmation email 
            with all the details to your registered email address.
          </p>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl">
              <h2 className="font-medium mb-4">What&apos;s Next?</h2>
              <ul className="text-sm text-neutral-600 space-y-2">
                <li>• Check your email for registration confirmation</li>
                <li>• Download your BIB number (will be sent 1 week before event)</li>
                <li>• Join our WhatsApp group for updates</li>
                <li>• Follow our social media for training tips</li>
              </ul>
            </div>

            <Link 
              href={`/events/${params.id}`}
              className="inline-flex items-center gap-2 text-[#FF6B6B] hover:text-[#ff5252] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Event Details
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

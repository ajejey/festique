import { RegistrationForm } from '../_components/RegistrationForm'

export default function RegisterPage() {
  return (
    <main className="min-h-screen pt-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-playfair text-3xl font-bold mb-8 text-center">
            Event Registration
          </h1>
          <div className="bg-white rounded-2xl p-6">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </main>
  )
}

import LoginForm from '@/app/_components/LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen pt-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-6">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}

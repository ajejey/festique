import { Suspense } from 'react'
import Loading from './loading'

export default function RegistrationLayout({ children }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </div>
  )
}

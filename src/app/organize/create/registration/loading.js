import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-neutral-700 font-montserrat">
          Preparing registration form customization...
        </p>
      </div>
    </div>
  )
}

import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-50">
      <div className="text-center">
        <Loader2 
          className="mx-auto mb-4 h-12 w-12 animate-spin text-[#FF6B6B]" 
        />
        <p className="font-montserrat text-neutral-700">
          Preparing your confirmation...
        </p>
      </div>
    </div>
  )
}

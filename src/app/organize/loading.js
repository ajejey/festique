import { Loader2 } from 'lucide-react'

export default function OrganizeLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-50">
      <div className="text-center">
        <Loader2 
          className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" 
        />
        <p className="text-neutral-600 font-montserrat">
          Loading Organizer Dashboard...
        </p>
      </div>
    </div>
  )
}

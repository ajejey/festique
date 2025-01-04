'use client'

import { Share2 } from 'lucide-react'

export default function ShareEvent({ title, description }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // TODO: Show toast notification
    }
  }

  return (
    <button 
      onClick={handleShare}
      className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
    >
      <Share2 className="w-5 h-5" />
      Share
    </button>
  )
}

'use client'

import { Share2 } from 'lucide-react'

export default function ShareEvent({ title, url, children }) {
  const handleShare = async () => {
    if (typeof window === 'undefined') return

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url)
      // TODO: Show toast notification
    }
  }

  return (
    <div onClick={handleShare}>
      {children}
    </div>
  )
}

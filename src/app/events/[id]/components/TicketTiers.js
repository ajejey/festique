'use client'

import { Clock, Tags, Ticket } from 'lucide-react'
import { calculateTicketTier, formatCurrency, formatDate, formatTimeRemaining } from '@/lib/utils'

export default function TicketTiers({ event }) {
  if (!event?.ticketTiers?.length || !event.categories?.length) return null

  const basePrice = event.categories[0].basePrice
  const { currentTier, nextTier, currentPrice, originalPrice, discount, savings } = 
    calculateTicketTier(event.ticketTiers, basePrice)

  return (
    <div className="space-y-4">
      {/* Current Tier Highlight */}
      {currentTier && (
        <div className="
          bg-primary/5 border-2 border-primary/10 
          rounded-2xl p-4 space-y-3
        ">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Tags className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">{currentTier.name}</h3>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-neutral-600">
                <Clock className="w-4 h-4" />
                <span>{formatTimeRemaining(currentTier.endDate)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(currentPrice)}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-500 line-through">
                  {formatCurrency(originalPrice)}
                </span>
                <span className="text-primary font-semibold">
                  {discount}% OFF
                </span>
              </div>
            </div>
          </div>
          <div className="
            bg-primary/10 rounded-xl p-3
            flex items-center justify-between
            text-sm
          ">
            <span className="text-neutral-700">Save {formatCurrency(savings)} with {currentTier.name}</span>
            <span className="font-medium text-primary">Ends {formatDate(currentTier.endDate, 'MMM dd')}</span>
          </div>
        </div>
      )}

      {/* Upcoming Tiers */}
      {nextTier && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-700">Upcoming Price Tiers</h4>
          <div className="bg-white border border-neutral-200 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{nextTier.name}</div>
                <div className="text-sm text-neutral-600">
                  Starts {formatDate(nextTier.startDate, 'MMM dd')}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {formatCurrency(basePrice - (basePrice * (nextTier.discountPercentage / 100)))}
                </div>
                <div className="text-sm text-primary">
                  {nextTier.discountPercentage}% OFF
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Price Notice */}
      {!currentTier && !nextTier && (
        <div className="text-sm text-neutral-600 flex items-center gap-2">
          <Ticket className="w-4 h-4" />
          <span>Regular price</span>
        </div>
      )}
    </div>
  )
}

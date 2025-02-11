'use client'

import { Clock, Tags, Ticket } from 'lucide-react'
import { calculateTicketTier, formatCurrency, formatDate, formatTimeRemaining } from '@/lib/utils'

export default function TicketTiers({ event }) {
  if (!event?.ticketTiers?.length || !event.categories?.length) return null

  const basePrice = event.categories[0].basePrice
  const { currentTier, nextTier, currentPrice, originalPrice, discount, savings } = 
    calculateTicketTier(event.ticketTiers, basePrice)

  return (
    <div className="space-y-2">
      {/* Current Tier Highlight */}
      {currentTier && (
        <div className="
          bg-primary/5 border-2 border-primary/10 
          rounded-xl p-3 space-y-2
        ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tags className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm md:text-lg">{currentTier.name}</h3>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                {formatCurrency(currentPrice)}
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-neutral-500 line-through mr-1">
                  {formatCurrency(originalPrice)}
                </span>
                <span className="text-primary font-semibold">
                  {discount}% OFF
                </span>
              </div>
            </div>
          </div>
          
          <div className="
            bg-primary/10 rounded-lg p-2
            flex items-center justify-between
            text-xs
          ">
            <span className="text-neutral-700 truncate mr-2">Save {formatCurrency(savings)}</span>
            <span className="font-medium text-primary whitespace-nowrap">
              Ends {formatDate(currentTier.endDate, 'MMM dd')}
            </span>
          </div>
        </div>
      )}

      {/* Upcoming Tiers */}
      {nextTier && (
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-neutral-700">Upcoming Price Tiers</h4>
          <div className="bg-white border border-neutral-200 rounded-lg p-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{nextTier.name}</div>
                <div className="text-xs text-neutral-600">
                  Starts {formatDate(nextTier.startDate, 'MMM dd')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">
                  {formatCurrency(basePrice - (basePrice * (nextTier.discountPercentage / 100)))}
                </div>
                <div className="text-xs text-primary">
                  {nextTier.discountPercentage}% OFF
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Price Notice */}
      {!currentTier && !nextTier && (
        <div className="text-xs text-neutral-600 flex items-center gap-1">
          <Ticket className="w-3 h-3" />
          <span>Regular price</span>
        </div>
      )}
    </div>
  )
}

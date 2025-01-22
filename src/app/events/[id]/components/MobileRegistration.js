'use client'

import { Users, Ticket, Clock, Tags } from 'lucide-react'
import { formatCurrency, formatDate, calculateTicketTier, formatTimeRemaining } from '@/lib/utils'

export default function MobileRegistration({ event, isRegistrationOpen, spotsLeft }) {
  if (!event) return null

  console.log("event in mobile registration", event)
  console.log("event.ticketTiers in mobile registration", event.ticketTiers)

  const basePrice = event.categories?.[0]?.basePrice || 0
  console.log("basePrice", basePrice)
  const { currentTier, currentPrice, discount } = calculateTicketTier(event.ticketTiers, basePrice)

  console.log("currentTier", currentTier)
  console.log("currentPrice", currentPrice)
  console.log("discount", discount)

  return (
    <>
      {/* Floating Offer Banner - Only show when there's an active tier */}
      {/* {currentTier && (
        <div className="
          fixed bottom-[108px] left-4 right-4
          bg-primary text-white
          px-4 py-3 rounded-xl
          flex items-center justify-between
          shadow-lg
          lg:hidden
          z-50
        ">
          <div className="flex items-center gap-2">
            <Tags className="w-5 h-5" />
            <div>
              <div className="font-medium">{currentTier.name} Offer</div>
              <div className="text-sm text-white/90">Save {formatCurrency(basePrice - currentPrice)}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{discount}% OFF</div>
            <div className="text-sm text-white/90">{formatTimeRemaining(currentTier.endDate)}</div>
          </div>
        </div>
      )} */}

      {/* Registration Bar */}
      <div className="
        fixed bottom-0 left-0 right-0 
        bg-white border-t border-neutral-200
        p-4 space-y-3
        lg:hidden
        z-40
      ">
        {/* Price and Registration Status */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold text-primary">
                {formatCurrency(currentPrice)}
              </div>
              {currentTier && (
                <div className="flex flex-col items-start">
                  <span className="
                    text-xs font-medium text-primary
                    px-2 py-0.5 rounded-full
                    bg-primary/10
                  ">
                    {currentTier.name}
                  </span>
                  <span className="text-xs text-neutral-500 line-through ml-2">
                    {formatCurrency(basePrice)}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm font-medium">
              <Users className="w-4 h-4" />
              <span>{spotsLeft} spots left</span>
            </div>
            <div className="text-xs text-neutral-600">
              Closes {formatDate(event.registrationCloseDate, 'MMM dd')}
            </div>
          </div>
        </div>

        {/* Register Button */}
        <button
          disabled={!isRegistrationOpen || spotsLeft === 0}
          className={`
            w-full py-3 px-6 rounded-full
            font-montserrat font-semibold
            flex items-center justify-center gap-2
            ${isRegistrationOpen && spotsLeft > 0
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
            }
            transition-colors
          `}
        >
          <Ticket className="w-5 h-5" />
          {!isRegistrationOpen 
            ? 'Registration Closed'
            : spotsLeft === 0
              ? 'Sold Out'
              : currentTier
                ? `Register Now at ${formatCurrency(currentPrice)}`
                : 'Register Now'
          }
        </button>
      </div>
    </>
  )
}

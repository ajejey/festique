// Utility functions for formatting and common operations

/**
 * Format a date with specified options
 * @param {Date|string} date - The date to format
 * @param {string} format - The format string (e.g., 'MMMM dd, yyyy')
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'MMMM dd, yyyy') {
  if (!date) return ''
  
  const d = new Date(date)
  
  // Mapping for format tokens
  const formatTokens = {
    'MMMM': d.toLocaleString('default', { month: 'long' }),
    'MMM': d.toLocaleString('default', { month: 'short' }),
    'MM': String(d.getMonth() + 1).padStart(2, '0'),
    'dd': String(d.getDate()).padStart(2, '0'),
    'yyyy': d.getFullYear(),
    'yy': String(d.getFullYear()).slice(-2)
  }

  return format.replace(/(MMMM|MMM|MM|dd|yyyy|yy)/g, match => formatTokens[match])
}

/**
 * Format location object into a readable string
 * @param {Object} location - Location object from event
 * @returns {string} Formatted location string
 */
export function formatLocation(location) {
  if (!location) return 'Location not specified'

  const { city, state, country } = location

  // Construct location string, skipping empty parts
  const locationParts = [
    city && city.trim(),
    state && state.trim(),
    country && country.trim()
  ].filter(Boolean)

  return locationParts.join(', ') || 'Location not specified'
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length of text
 * @param {string} [ellipsis='...'] - Ellipsis to append
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength, ellipsis = '...') {
  if (!text) return ''
  return text.length > maxLength 
    ? text.slice(0, maxLength).trim() + ellipsis 
    : text
}

/**
 * Convert price to localized currency string
 * @param {number} price - Price value
 * @param {string} [currency='INR'] - Currency code
 * @returns {string} Formatted currency string
 */
export function formatCurrency(price, currency = 'INR') {
  if (price === undefined || price === null) return ''
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(price)
}

/**
 * Format event type for display
 * @param {string} eventType - Raw event type
 * @returns {string} Formatted event type
 */
export function formatEventType(eventType) {
  if (!eventType) return 'Unspecified'

  // Map of potential event types to their display names
  const eventTypeMap = {
    'Marathon': 'Marathon',
    'Trail Run': 'Trail Run',
    'Fun Run': 'Fun Run',
    'Ultra Marathon': 'Ultra Marathon',
    'Running': 'Running',
    'Cycling': 'Cycling',
    'Triathlon': 'Triathlon',
    'Swimming': 'Swimming',
    'Trail Running': 'Trail Running',
    'Mountain Biking': 'Mountain Biking'
  }

  return eventTypeMap[eventType] || eventType
}

/**
 * Format difficulty level for display
 * @param {string} difficulty - Raw difficulty level
 * @returns {string} Formatted difficulty level
 */
export function formatDifficulty(difficulty) {
  if (!difficulty) return 'Unspecified'

  // Map of potential difficulty levels to their display names
  const difficultyMap = {
    'Beginner': 'Beginner',
    'Intermediate': 'Intermediate', 
    'Advanced': 'Advanced',
    'Professional': 'Professional'
  }

  return difficultyMap[difficulty] || difficulty
}

/**
 * Calculate current ticket tier and pricing details
 * @param {Array} ticketTiers - Array of ticket tiers
 * @param {number} basePrice - Base price of the ticket
 * @returns {Object} Ticket tier details
 */
export function calculateTicketTier(ticketTiers, basePrice) {
  if (!ticketTiers?.length) {
    return {
      currentTier: null,
      nextTier: null,
      currentPrice: basePrice,
      originalPrice: basePrice,
      discount: 0,
      savings: 0
    }
  }

  // Convert current time to UTC for comparison
  const now = new Date()
  const utcNow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  ))
  
  // console.log("Current UTC time:", utcNow.toISOString())
  
  // Sort tiers by start date
  const sortedTiers = [...ticketTiers].sort((a, b) => 
    new Date(a.startDate) - new Date(b.startDate)
  )

  // Since the tier starts tomorrow, let's consider it as current tier
  // if it's within 24 hours of starting
  const currentTier = sortedTiers.find(tier => {
    const startDate = new Date(tier.startDate)
    const endDate = new Date(tier.endDate)
    
    // Consider tier current if it's within 24 hours of starting
    const isWithin24Hours = startDate - utcNow <= 24 * 60 * 60 * 1000
    const hasNotEnded = utcNow <= endDate
    
    // console.log("Comparing dates for tier:", tier.name)
    // console.log("Start date:", startDate.toISOString())
    // console.log("End date:", endDate.toISOString())
    // console.log("Is within 24 hours of starting?", isWithin24Hours)
    // console.log("Has not ended?", hasNotEnded)
    
    return isWithin24Hours && hasNotEnded
  })
  
  // Find next tier (excluding current tier)
  const nextTier = currentTier ? sortedTiers.find(tier => 
    new Date(tier.startDate) > new Date(currentTier.endDate)
  ) : null

  // Calculate pricing
  const discount = currentTier?.discountPercentage || 0
  const currentPrice = basePrice - (basePrice * (discount / 100))
  const savings = basePrice - currentPrice

  return {
    currentTier,
    nextTier,
    currentPrice,
    originalPrice: basePrice,
    discount,
    savings
  }
}

/**
 * Format time remaining until a date
 * @param {Date|string} endDate - End date
 * @returns {string} Formatted time remaining
 */
export function formatTimeRemaining(endDate) {
  const end = new Date(endDate)
  const now = new Date()
  const diff = end - now

  if (diff <= 0) return 'Ended'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) {
    return `${days}d ${hours}h left`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m left`
  } else {
    return `${minutes}m left`
  }
}

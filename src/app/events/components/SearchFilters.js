'use client'

import { useState } from 'react'
import { Search, Sliders } from 'lucide-react'

export default function SearchFilters() {
  const [showFilters, setShowFilters] = useState(false)
  
  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="relative flex items-center mb-4">
        <div className="absolute left-4">
          <Search className="w-5 h-5 text-neutral-400" />
        </div>
        <input
          type="text"
          placeholder="Search for marathons, cities, or organizers..."
          className="w-full pl-12 pr-4 py-3 rounded-full border border-neutral-200 focus:outline-none focus:border-[#4ECDC4] bg-white"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="ml-4 p-3 rounded-full bg-white border border-neutral-200 hover:border-neutral-300 transition-colors"
        >
          <Sliders className="w-5 h-5 text-neutral-600" />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Distance
              </label>
              <select className="w-full p-2 rounded-lg border border-neutral-200 focus:outline-none focus:border-[#4ECDC4]">
                <option value="">Any Distance</option>
                <option value="5k">5K</option>
                <option value="10k">10K</option>
                <option value="21k">Half Marathon</option>
                <option value="42k">Full Marathon</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Date Range
              </label>
              <select className="w-full p-2 rounded-lg border border-neutral-200 focus:outline-none focus:border-[#4ECDC4]">
                <option value="">Any Time</option>
                <option value="this-month">This Month</option>
                <option value="next-month">Next Month</option>
                <option value="3-months">Next 3 Months</option>
                <option value="6-months">Next 6 Months</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Price Range
              </label>
              <select className="w-full p-2 rounded-lg border border-neutral-200 focus:outline-none focus:border-[#4ECDC4]">
                <option value="">Any Price</option>
                <option value="0-1000">₹0 - ₹1,000</option>
                <option value="1000-2000">₹1,000 - ₹2,000</option>
                <option value="2000-5000">₹2,000 - ₹5,000</option>
                <option value="5000+">₹5,000+</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              className="bg-[#FF6B6B] text-white px-6 py-2 rounded-full hover:bg-[#ff5252] transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

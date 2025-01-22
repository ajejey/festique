'use client'

import { 
  Users, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  MapPin, 
  BarChart2 
} from 'lucide-react'

export default function EventMetrics({ registrations, events }) {
  // Calculate metrics
  const totalRegistrations = registrations.length
  const completedRegistrations = registrations.filter(
    reg => reg.status.participation === 'completed'
  ).length
  const pendingRegistrations = registrations.filter(
    reg => reg.status.participation === 'registered'
  ).length
  const paidRegistrations = registrations.filter(
    reg => reg.status.payment === 'completed'
  ).length

  // Revenue calculation
  const totalRevenue = registrations.reduce((sum, reg) => 
    reg.payment.status === 'completed' 
      ? sum + parseFloat(reg.payment.amount || 0) 
      : sum, 
    0
  )

  // Category distribution
  const categoryDistribution = registrations.reduce((acc, reg) => {
    acc[reg.category] = (acc[reg.category] || 0) + 1
    return acc
  }, {})

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Registrations */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4">
        <div className="bg-[#FF6B6B]/10 p-3 rounded-full">
          <Users className="w-6 h-6 text-[#FF6B6B]" />
        </div>
        <div>
          <p className="text-neutral-600 text-sm">Total Registrations</p>
          <p className="font-montserrat font-bold text-2xl">
            {totalRegistrations}
          </p>
        </div>
      </div>

      {/* Paid Registrations */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4">
        <div className="bg-[#4ECDC4]/10 p-3 rounded-full">
          <CreditCard className="w-6 h-6 text-[#4ECDC4]" />
        </div>
        <div>
          <p className="text-neutral-600 text-sm">Paid Registrations</p>
          <p className="font-montserrat font-bold text-2xl">
            {paidRegistrations}
          </p>
        </div>
      </div>

      {/* Completed Participation */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4">
        <div className="bg-green-500/10 p-3 rounded-full">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <p className="text-neutral-600 text-sm">Completed</p>
          <p className="font-montserrat font-bold text-2xl">
            {completedRegistrations}
          </p>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4">
        <div className="bg-[#4ECDC4]/10 p-3 rounded-full">
          <CreditCard className="w-6 h-6 text-[#4ECDC4]" />
        </div>
        <div>
          <p className="text-neutral-600 text-sm">Total Revenue</p>
          <p className="font-montserrat font-bold text-2xl">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-2xl shadow-lg p-6 col-span-full">
        <div className="flex items-center space-x-4 mb-4">
          <BarChart2 className="w-6 h-6 text-[#FF6B6B]" />
          <h3 className="font-montserrat font-semibold text-neutral-700">
            Category Distribution
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryDistribution).map(([category, count]) => (
            <div 
              key={category} 
              className="
                bg-neutral-50 
                rounded-xl 
                p-4 
                text-center
                hover:bg-neutral-100
                transition-colors
              "
            >
              <p className="font-montserrat font-semibold text-neutral-700">
                {category}
              </p>
              <p className="text-neutral-500 text-sm">
                {count} Registrations
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

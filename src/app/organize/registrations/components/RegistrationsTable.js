'use client'

import { useState } from 'react'
import { Eye, Download } from 'lucide-react'
import RegistrationDetailsModal from './RegistrationDetailsModal'

export default function RegistrationsTable({ registrations }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ 
    key: 'createdAt', 
    direction: 'desc' 
  })
  const [selectedRegistration, setSelectedRegistration] = useState(null)

  console.log("registrations", registrations)

  // Format date manually
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Filter and sort registrations
  const processedRegistrations = registrations
    .filter(reg => 
      reg.registrationDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.registrationDetails.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.event.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const valueA = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a)
      const valueB = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b)

      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' 
        ? 'asc' 
        : 'desc'
    }))
  }

  // Action handlers
  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration)
  }

  const handleDownloadRegistration = (registration) => {
    alert(`Downloading registration for ${registration.registrationDetails.name}`)
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg">
        {/* Search Input */}
        <div className="p-4 border-b">
          <input 
            type="text" 
            placeholder="Search registrations..." 
            className="
              w-full px-4 py-2 
              border rounded-full 
              font-montserrat text-neutral-700
              focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]
            "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Registrations Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b">
              <tr>
                {[
                  { key: 'event.name', label: 'Event' },
                  { key: 'registrationDetails.name', label: 'Participant' },
                  { key: 'createdAt', label: 'Date' },
                  { key: 'category', label: 'Category' },
                  { key: 'payment.status', label: 'Payment' },
                  { key: 'status', label: 'Status' },
                  { label: 'Actions' }
                ].map((header) => (
                  <th 
                    key={header.label}
                    className="
                      px-4 py-3 
                      text-left 
                      font-montserrat font-semibold 
                      text-neutral-700
                      cursor-pointer
                      hover:bg-neutral-100
                    "
                    onClick={() => header.key && handleSort(header.key)}
                  >
                    <div className="flex items-center gap-2">
                      {header.label}
                      {header.key && (
                        <span className="text-xs text-neutral-500">
                          {sortConfig.key === header.key && 
                            (sortConfig.direction === 'asc' ? '▲' : '▼')}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedRegistrations.map((registration) => (
                <tr 
                  key={registration._id} 
                  className="border-b hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-4 py-3 font-montserrat">
                    {registration.event.name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-montserrat font-semibold">
                        {registration.registrationDetails.name}
                      </span>
                      <span className="text-neutral-500 text-sm">
                        {registration.registrationDetails.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-montserrat">
                    {formatDate(registration.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-montserrat">
                    {registration.category}
                  </td>
                  <td className="px-4 py-3">
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-xs
                        ${
                          registration.payment.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      `}
                    >
                      {registration.payment.amount} | {registration.payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-xs
                        ${
                          registration.status.participation === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-neutral-100 text-neutral-800'
                        }
                      `}
                    >
                      {registration.status.participation}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(registration)}
                        className="
                          p-2 rounded-full 
                          hover:bg-neutral-100
                          transition-colors
                        "
                      >
                        <Eye className="w-5 h-5 text-neutral-600" />
                      </button>
                      <button 
                        onClick={() => handleDownloadRegistration(registration)}
                        className="
                          p-2 rounded-full 
                          hover:bg-neutral-100
                          transition-colors
                        "
                      >
                        <Download className="w-5 h-5 text-neutral-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Registrations State */}
        {processedRegistrations.length === 0 && (
          <div className="text-center py-8 text-neutral-500">
            No registrations found
          </div>
        )}
      </div>

      {/* Registration Details Modal */}
      {selectedRegistration && (
        <RegistrationDetailsModal 
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
        />
      )}
    </>
  )
}

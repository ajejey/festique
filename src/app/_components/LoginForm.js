'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendOTP, verifyOTP } from '@/app/lib/actions/auth'
import { Loader2, Mail, ArrowRight } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('email') // email, otp
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)

  async function handleSendOTP(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await sendOTP(email)
      setStep('otp')
      setTimer(60) // Start 60 second timer
      const interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(interval)
            return 0
          }
          return t - 1
        })
      }, 1000)
    } catch (error) {
      setError(error.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOTP(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await verifyOTP(email, otp)
      // if (result.isNewUser) {
      //   router.push('/onboarding')
      // } else {
        router.back() // Go back to previous page
      // }
    } catch (error) {
      setError(error.message || 'Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="font-playfair text-2xl font-bold text-center mb-6">
        Welcome to Festique
      </h2>
      
      {step === 'email' ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent pl-10"
                placeholder="Enter your email"
                required
              />
              <Mail className="w-5 h-5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {error && (
            <p className="text-[#FF6B6B] text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-6 py-2 rounded-full font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
            />
            <p className="text-sm text-neutral-500 mt-1">
              OTP sent to {email}
            </p>
          </div>

          {error && (
            <p className="text-[#FF6B6B] text-sm">{error}</p>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-6 py-2 rounded-full font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Verify OTP'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('email')
                setOtp('')
                setError('')
              }}
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              Change Email
            </button>

            {timer === 0 ? (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading}
                className="text-sm text-[#4ECDC4] hover:text-[#45B7D1] disabled:opacity-50"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-sm text-neutral-500 text-center">
                Resend OTP in {timer}s
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

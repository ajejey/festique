'use client';
import React, { useState } from 'react';
import { AlertCircle, Calendar, Trophy, MapPin, Users, RussianRuble } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';

const PreLaunchPage = () => {
  const [email, setEmail] = useState('');
  const [runningExp, setRunningExp] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setEmail('');
    setRunningExp('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b pt-20 from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Mumbai Marathon 2025
          </h1>
          <p className="text-2xl text-gray-600">
            Something extraordinary is coming to the streets of Mumbai
          </p>
          <div className="flex justify-center mt-4">
            <RussianRuble className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        {/* Countdown & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Calendar className="w-8 h-8 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Mark Your Calendar</h3>
            <p>January 21, 2025</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Trophy className="w-8 h-8 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Prize Pool</h3>
            <p>₹50 Lakhs</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Users className="w-8 h-8 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Expected Runners</h3>
            <p>15,000+</p>
          </div>
        </div>

        {/* Early Interest Form */}
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Get Early Access</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Running Experience
              </label>
              <select
                value={runningExp}
                onChange={(e) => setRunningExp(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select your experience</option>
                <option value="beginner">Beginner (0-2 races)</option>
                <option value="intermediate">Intermediate (3-10 races)</option>
                <option value="advanced">Advanced (10+ races)</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Join the Waitlist
            </button>
          </form>

          {/* {showSuccess && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Thanks for your interest! You&apos;ll be the first to know when registration opens.
              </AlertDescription>
            </Alert>
          )} */}
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">What to Expect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Scenic Route</h3>
              <p className="text-gray-600">
                Run through Bangalore&apos;s most iconic landmarks, from Marine Drive to Bandra-Worli Sea Link
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Professional Timing</h3>
              <p className="text-gray-600">
                AIMS-certified course with chip timing and live tracking
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Training Support</h3>
              <p className="text-gray-600">
                Access to training programs and weekly running groups
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Community</h3>
              <p className="text-gray-600">
                Join WhatsApp groups and meet fellow runners in your area
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreLaunchPage;
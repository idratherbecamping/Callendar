'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import AddressValidator from '@/components/AddressValidator'

type Step = 'account' | 'business' | 'location' | 'hours' | 'calendar'

// Validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  // Minimum 6 characters, at least one lowercase, one uppercase, and one digit
  const minLength = password.length >= 6;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  
  return minLength && hasLowercase && hasUppercase && hasDigit;
};

export default function SignUp() {
  const [step, setStep] = useState<Step>('account')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    phoneNumber: '',
    businessAddress: '',
    maxServiceDistance: '25',
    typicalServiceTime: '60',
    localTimeZone: 'US/Pacific', // Default to Pacific time
    businessHoursLocal: {
      open: '09:00:00',
      close: '18:00:00'
    },
    calendarConnected: false,
    googleAuthToken: null,
    textMessageConsent: false // Add new field for text message consent
  })
  const [addressIsValid, setAddressIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check for saved form data and restore it (for when returning from OAuth flow)
  useEffect(() => {
    const storedData = localStorage.getItem('signupFormData')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setFormData(parsedData)
        
        // If returning from calendar connection, set address as valid
        if (parsedData.businessAddress) {
          setAddressIsValid(true)
        }
      } catch (e) {
        console.error('Failed to parse stored form data:', e)
      }
    }

    // Check if URL has step parameter
    const stepParam = searchParams.get('step')
    if (stepParam && ['account', 'business', 'location', 'hours', 'calendar'].includes(stepParam as Step)) {
      setStep(stepParam as Step)
    }
  }, [searchParams])
  
  // Clean up localStorage when component unmounts
  useEffect(() => {
    return () => {
      // Only clear if on the last step or navigating away
      if (step === 'calendar') {
        localStorage.removeItem('signupFormData')
      }
    }
  }, [step])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddressChange = (address: string, isValid: boolean, formattedAddress?: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      businessAddress: formattedAddress || address 
    }));
    setAddressIsValid(isValid);
  }

  const handleHoursChange = (type: 'open' | 'close', value: string) => {
    setFormData((prev) => ({
      ...prev,
      businessHoursLocal: {
        ...prev.businessHoursLocal,
        [type]: value,
      },
    }))
  }

  const handleNext = () => {
    // Validate email and password for account step
    if (step === 'account') {
      if (!isValidEmail(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
      
      if (!isValidPassword(formData.password)) {
        setError('Password must be at least 6 characters and include lowercase, uppercase, and numbers');
        return;
      }
    }
    
    // For the business step, validate required fields
    if (step === 'business') {
      if (!formData.businessName.trim()) {
        setError('Business name is required');
        return;
      }
      
      if (!formData.phoneNumber.trim()) {
        setError('Phone number is required');
        return;
      }
      
      if (!addressIsValid) {
        setError('Please enter a valid business address');
        return;
      }
    }
    
    switch (step) {
      case 'account':
        setStep('business')
        break
      case 'business':
        setStep('location')
        break
      case 'location':
        setStep('hours')
        break
      case 'hours':
        setStep('calendar')
        break
      default:
        break
    }
    
    // Clear any previous errors when moving to next step
    setError(null);
  }

  const handleBack = () => {
    switch (step) {
      case 'business':
        setStep('account')
        break
      case 'location':
        setStep('business')
        break
      case 'hours':
        setStep('location')
        break
      case 'calendar':
        setStep('hours')
        break
      default:
        break
    }
    
    // Clear any previous errors when moving back
    setError(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Use the server API endpoint to create the user and profile
      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authData: {
            email: formData.email,
            password: formData.password,
          },
          userData: formData
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Clean up localStorage
      localStorage.removeItem('signupFormData')

      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Function to handle Google Calendar authorization
  const handleConnectCalendar = () => {
    // Store the form data in localStorage before redirecting
    localStorage.setItem('signupFormData', JSON.stringify(formData));
    
    // Get the client ID from environment variables
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
      `${window.location.origin}/auth/callback`;
    
    if (!clientId) {
      setError('Google OAuth client ID is not configured. Please contact support.');
      return;
    }
    
    console.log('Initiating OAuth flow with:', {
      clientId: clientId.substring(0, 5) + '...',
      redirectUri
    });
    
    // Redirect to Google OAuth URL
    const googleAuthUrl = 
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      'scope=https://www.googleapis.com/auth/calendar&' +
      'access_type=offline&' +
      'prompt=consent&' +
      'include_granted_scopes=true&' +
      'response_type=code&' +
      'state=signup&' +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `client_id=${clientId}`;
    
    window.location.href = googleAuthUrl;
  };

  // Add calendar connected state setter
  const setCalendarConnected = (connected: boolean) => {
    setFormData(prev => ({
      ...prev,
      calendarConnected: connected
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="Enter your email address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                placeholder="Enter your password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                value={formData.password}
                onChange={handleInputChange}
              />
              <p className="mt-2 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Password must be at least 6 characters and include lowercase, uppercase, and numbers.
              </p>
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Next
            </button>
          </div>
        )

      case 'business':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-lg font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                id="businessName"
                required
                placeholder="Enter your business name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                value={formData.businessName}
                onChange={handleInputChange}
              />
              <p className="mt-2 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Enter your customer-facing business name (without LLC, Inc., or trademark symbols).
              </p>
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                required
                placeholder="Enter your phone number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              <p className="mt-2 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                This number needs to be the primary number for your business and also able to receive text messages.
              </p>
            </div>
            <div>
              <label htmlFor="businessAddress" className="block text-lg font-medium text-gray-700 mb-2">
                Business Address
              </label>
              <AddressValidator 
                id="businessAddress"
                value={formData.businessAddress}
                onChange={handleAddressChange}
                placeholder="Enter your business address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                This is your business location - used for estimating travel distance and time to your customers.
              </p>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            </div>
          </div>
        )

      case 'location':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="maxServiceDistance" className="block text-lg font-medium text-gray-700 mb-2">
                Maximum Service Distance (miles)
              </label>
              <input
                type="number"
                name="maxServiceDistance"
                id="maxServiceDistance"
                required
                placeholder="Enter maximum service distance"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                value={formData.maxServiceDistance}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="typicalServiceTime" className="block text-lg font-medium text-gray-700 mb-2">
                Typical Service Time (minutes)
              </label>
              <input
                type="number"
                name="typicalServiceTime"
                id="typicalServiceTime"
                required
                placeholder="Enter typical service time"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                value={formData.typicalServiceTime}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            </div>
          </div>
        )

      case 'hours':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="localTimeZone" className="block text-lg font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              <select
                name="localTimeZone"
                id="localTimeZone"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                value={formData.localTimeZone}
                onChange={handleInputChange}
              >
                <option value="US/Pacific">Pacific Time</option>
                <option value="US/Mountain">Mountain Time</option>
                <option value="US/Central">Central Time</option>
                <option value="US/Eastern">Eastern Time</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Business Hours
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="openTime" className="block text-base font-medium text-gray-700 mb-1">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    id="openTime"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                    value={formData.businessHoursLocal.open}
                    onChange={(e) => handleHoursChange('open', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="closeTime" className="block text-base font-medium text-gray-700 mb-1">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    id="closeTime"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                    value={formData.businessHoursLocal.close}
                    onChange={(e) => handleHoursChange('close', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            </div>
          </div>
        )

      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Connect Google Calendar</h3>
              <p className="mt-2 text-sm text-gray-500">
                Connect your Google Calendar to manage your appointments. We'll need access to:
              </p>
              <ul className="mt-4 text-left text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Read your calendar events
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create new appointments in your calendar
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update appointment details
                </li>
              </ul>
            </div>
            
            {formData.calendarConnected ? (
              <div className="bg-green-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">Google Calendar successfully connected</p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConnectCalendar}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Connect Google Calendar
              </button>
            )}

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="textMessageConsent"
                  name="textMessageConsent"
                  type="checkbox"
                  required
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  checked={formData.textMessageConsent}
                  onChange={handleInputChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="textMessageConsent" className="font-medium text-gray-700">
                  I consent to receive text messages
                </label>
                <p className="text-gray-500">
                  You agree to receive text messages about your account. Message and data rates may apply.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading || !formData.calendarConnected || !formData.textMessageConsent}
                className="py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-lg text-gray-600">
            Step {['account', 'business', 'location', 'hours', 'calendar'].indexOf(step) + 1} of 5
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          {renderStep()}
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 
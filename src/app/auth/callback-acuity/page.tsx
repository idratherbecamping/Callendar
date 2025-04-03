'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AcuityCallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function handleCallback() {
      try {
        // Extract the authorization code and state from URL
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        
        if (!code) {
          throw new Error('No authorization code received from Acuity')
        }
        
        // Check if this is from the signup flow
        if (state !== 'signup') {
          throw new Error('Invalid state parameter')
        }
        
        // Retrieve saved form data
        const storedFormData = localStorage.getItem('signupFormData')
        if (!storedFormData) {
          throw new Error('No form data found, please try signing up again')
        }
        
        const formData = JSON.parse(storedFormData)
        
        // Exchange the authorization code for tokens
        const tokenResponse = await fetch('/api/acuity/exchange-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })
        
        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange authorization code for Acuity tokens')
        }
        
        const tokenData = await tokenResponse.json()
        
        // Update the form data to include Acuity tokens and connection status
        formData.acuityConnected = true
        formData.acuityAuthToken = {
          access_token: tokenData.access_token,
          token_type: tokenData.token_type,
          expires_in: tokenData.expires_in,
          created_at: new Date().toISOString()
        }
        
        // Store updated form data
        localStorage.setItem('signupFormData', JSON.stringify(formData))
        
        // Update status
        setStatus('success')
        
        // Redirect back to signup page after a short delay
        setTimeout(() => {
          router.push('/auth/signup?step=calendar')
        }, 1500)
        
      } catch (err: unknown) {
        setStatus('error')
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
        setError(errorMessage)
        
        // Redirect back to signup page after a delay
        setTimeout(() => {
          router.push('/auth/signup')
        }, 3000)
      }
    }
    
    handleCallback()
  }, [router, searchParams])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {status === 'loading' && (
          <>
            <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="mt-6 text-center text-xl font-medium text-gray-900">
              Connecting your Acuity account...
            </h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="rounded-full h-16 w-16 bg-green-100 flex items-center justify-center mx-auto">
              <svg className="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-xl font-medium text-gray-900">
              Acuity account connected successfully!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Redirecting you back to complete your signup...
            </p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="rounded-full h-16 w-16 bg-red-100 flex items-center justify-center mx-auto">
              <svg className="h-10 w-10 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-xl font-medium text-gray-900">
              Failed to connect Acuity account
            </h2>
            <p className="mt-2 text-sm text-red-600">
              {error || 'An unknown error occurred'}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Redirecting you back to the signup page...
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  )
}

export default function AcuityCallback() {
  return (
    <Suspense fallback={<Loading />}>
      <AcuityCallbackContent />
    </Suspense>
  )
} 
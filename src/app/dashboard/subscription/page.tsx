'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// Define types for the user and subscription data
interface UserData {
  id: string;
  email: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_status?: string;
  [key: string]: unknown; // For other properties we might access
}

interface SubscriptionData {
  id: string;
  status: string;
  cancel_at_period_end: boolean;
  current_period_end: string;
  [key: string]: unknown; // For other properties we might access
}

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    async function loadUserAndSubscription() {
      try {
        setLoading(true)
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/auth/signin')
          return
        }
        
        // Get user details
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          
        if (userError) {
          console.error('Error fetching user data:', userError)
          throw new Error(userError.message)
        }
        
        console.log('User data from Supabase:', {
          id: userData.id,
          stripe_customer_id: userData.stripe_customer_id,
          stripe_subscription_id: userData.stripe_subscription_id
        })
        setUser(userData)
        
        // Only proceed if the user has subscription data
        if (userData.stripe_subscription_id) {
          console.log('Making API call with:', {
            action: 'get_details',
            subscriptionId: userData.stripe_subscription_id,
            userId: userData.id
          })
          // Get subscription details
          const response = await fetch(`/api/stripe/manage-subscription`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'get_details',
              subscriptionId: userData.stripe_subscription_id,
              userId: userData.id,
            }),
          })
          
          const data = await response.json()
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to load subscription details')
          }
          
          setSubscription(data.subscription)
        }
      } catch (err: unknown) {
        console.error('Error loading subscription:', err)
        setError(err instanceof Error ? err.message : 'An error occurred loading subscription data')
      } finally {
        setLoading(false)
      }
    }
    
    loadUserAndSubscription()
  }, [router])
  
  const handleCancelSubscription = async () => {
    if (!user?.id || !user?.stripe_subscription_id) return
    
    try {
      setLoading(true)
      
      const response = await fetch(`/api/stripe/manage-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cancel',
          subscriptionId: user.stripe_subscription_id,
          userId: user.id,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription')
      }
      
      setSubscription(data.subscription)
      setConfirmCancel(false)
    } catch (err: unknown) {
      console.error('Error canceling subscription:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while canceling subscription')
    } finally {
      setLoading(false)
    }
  }
  
  const handleReactivateSubscription = async () => {
    if (!user?.id || !user?.stripe_subscription_id) return
    
    try {
      setLoading(true)
      
      const response = await fetch(`/api/stripe/manage-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reactivate',
          subscriptionId: user.stripe_subscription_id,
          userId: user.id,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reactivate subscription')
      }
      
      setSubscription(data.subscription)
    } catch (err: unknown) {
      console.error('Error reactivating subscription:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while reactivating subscription')
    } finally {
      setLoading(false)
    }
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-sm text-gray-500">Loading subscription information...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Subscription Management
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Manage your Callendar AI subscription
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {!user?.stripe_subscription_id ? (
            <div className="text-center py-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No active subscription found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't currently have an active subscription.
              </p>
              <div className="mt-6">
                <Link href="https://buy.stripe.com/7sI00Nbgfb0Ugz69AB" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Start Free Trial
                </Link>
              </div>
            </div>
          ) : subscription ? (
            <div>
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Subscription Details</h3>
                <dl className="mt-4 space-y-4">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Plan</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Callendar AI Subscription - Pilot Program</dd>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                      {subscription.status === 'trialing' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Free Trial
                        </span>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          subscription.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </span>
                      )}
                      {subscription.cancel_at_period_end && (
                        <span className="ml-2 text-xs text-red-600 font-medium">
                          Cancels at end of billing period
                        </span>
                      )}
                    </dd>
                  </div>
                  {subscription.status === 'trialing' && (
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Trial ends</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {formatDate(subscription.current_period_end)}
                        <span className="ml-2 text-xs text-gray-500">
                          (You'll be charged $40.00/month after trial ends)
                        </span>
                      </dd>
                    </div>
                  )}
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Current period ends</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {formatDate(subscription.current_period_end)}
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="space-y-4">
                {!confirmCancel ? (
                  <div>
                    {subscription.cancel_at_period_end ? (
                      <div className="text-center">
                        <p className="mb-4 text-sm text-gray-500">
                          Your subscription will end on {formatDate(subscription.current_period_end)}.
                          You will continue to have access until this date.
                        </p>
                        <button
                          onClick={handleReactivateSubscription}
                          disabled={loading}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          {loading ? 'Processing...' : 'Reactivate Subscription'}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <button
                          onClick={() => setConfirmCancel(true)}
                          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel Subscription
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Are you sure you want to cancel your subscription?
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>
                            Your subscription will remain active until the end of your current billing cycle on {formatDate(subscription.current_period_end)}.
                            After that date, you will lose access to premium features.
                          </p>
                        </div>
                        <div className="mt-4 flex space-x-4">
                          <button
                            type="button"
                            onClick={() => setConfirmCancel(false)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                          >
                            Keep My Subscription
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelSubscription}
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            {loading ? 'Processing...' : 'Confirm Cancellation'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p>Unable to load subscription details. Please try again later.</p>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Link href="/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
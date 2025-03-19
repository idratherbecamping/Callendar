'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type BusinessProfile = {
  business_name: string
  phone_number: string
  business_address: string
  max_service_distance: number
  typical_service_time: number
  local_time_zone: string
  business_hours_local: {
    open: string
    close: string
  }
  twilio_number?: string
  google_auth_token?: any
}

export default function Dashboard() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/signin')
          return
        }

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setProfile(data)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">No profile found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{profile.business_name}</h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Business Information</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.phone_number}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Business Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.business_address}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Service Distance</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.max_service_distance} km</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Typical Service Time</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.typical_service_time} minutes</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Time Zone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.local_time_zone}</dd>
                </div>
                {profile.twilio_number && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Twilio Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.twilio_number}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Business Hours</h2>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Opening Time</dt>
                  <dd className="text-sm text-gray-900">
                    {profile.business_hours_local.open}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Closing Time</dt>
                  <dd className="text-sm text-gray-900">
                    {profile.business_hours_local.close}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
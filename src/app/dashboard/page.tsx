'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type GoogleAuthToken = {
  scopes: string[]
  client_id: string
  token_uri: string
  access_token: string
  refresh_token: string
  expires_in: number
}

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
  google_auth_token?: GoogleAuthToken
}

export default function Dashboard() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching user session...')
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('Error getting user:', userError)
          throw userError
        }
        
        if (!user) {
          console.log('No user found, redirecting to sign in')
          router.push('/auth/signin')
          return
        }

        console.log('User found:', user.id)
        console.log('Fetching user profile...')
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          // If the user doesn't exist in the users table, we should create them
          if (error.code === 'PGRST116') {
            console.log('User profile not found, creating new profile...')
            const { data: newProfile, error: createError } = await supabase
              .from('users')
              .insert([
                {
                  id: user.id,
                  email: user.email,
                  business_name: 'My Business',
                  phone_number: '',
                  business_address: '',
                  max_service_distance: 10,
                  typical_service_time: 60,
                  local_time_zone: 'UTC',
                  business_hours_local: {
                    open: '09:00',
                    close: '17:00'
                  }
                }
              ])
              .select()
              .single()

            if (createError) {
              console.error('Error creating profile:', createError)
              throw createError
            }

            console.log('New profile created:', newProfile)
            setProfile(newProfile)
            return
          }
          throw error
        }

        console.log('Profile found:', data)
        setProfile(data)
      } catch (error: unknown) {
        console.error('Caught error in fetchProfile:', error)
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
        setError(errorMessage)
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
    <div className="min-h-screen bg-background py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">{profile.business_name}</h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Business Information</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Phone Number</dt>
                  <dd className="mt-1 text-sm text-foreground">{profile.phone_number}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Business Address</dt>
                  <dd className="mt-1 text-sm text-foreground">{profile.business_address}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Service Distance</dt>
                  <dd className="mt-1 text-sm text-foreground">{profile.max_service_distance} miles</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Typical Service Time</dt>
                  <dd className="mt-1 text-sm text-foreground">{profile.typical_service_time} minutes</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Time Zone</dt>
                  <dd className="mt-1 text-sm text-foreground">{profile.local_time_zone}</dd>
                </div>
                {profile.twilio_number && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Twilio Number</dt>
                    <dd className="mt-1 text-sm text-foreground">{profile.twilio_number}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Business Hours</h2>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  {/* <dt className="text-sm font-medium text-muted-foreground">Opening Time</dt> */}
                  <dd className="text-sm text-foreground">
                    {/* {JSON.stringify(profile.business_hours_local.open)} */}
                  </dd>
                </div>
                <div className="flex justify-between">
                  {/* <dt className="text-sm font-medium text-muted-foreground">Closing Time</dt> */}
                  <dd className="text-sm text-foreground">
                    {/* {profile.business_hours_local.close} */}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Business Hours</dt>
                  <dd className="text-sm text-foreground">
                    {JSON.stringify(profile.business_hours_local)}
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
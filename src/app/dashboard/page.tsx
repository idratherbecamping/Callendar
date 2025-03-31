'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Session } from '@supabase/supabase-js'

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
  service_type?: string
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
        
        // Get Supabase domain for consistent key naming
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const domain = supabaseUrl.replace(/^https?:\/\//, '');
        
        // Fetch session directly from Supabase
        const sessionResponse = await supabase.auth.getSession();
        console.log('Raw Supabase.auth.getSession() response:', sessionResponse);
        
        // Use a mutable variable for the session
        let currentSession = sessionResponse.data.session;
        
        // Parse browser cookies
        const parseCookies = () => {
          const cookiesObj: Record<string, string> = {};
          const cookieStr = document.cookie;
          if (cookieStr) {
            cookieStr.split(';').forEach(pair => {
              const [key, value] = pair.trim().split('=');
              try {
                cookiesObj[key] = decodeURIComponent(value);
              } catch (e) {
                console.error('Error decoding cookie value:', e);
                cookiesObj[key] = value;
              }
            });
          }
          return cookiesObj;
        };
        
        const cookies = parseCookies();
        console.log('Document cookies:', document.cookie);
        console.log('Parsed cookies:', cookies);
        
        // Check for any auth-related localStorage items
        const localStorageKeys = Object.keys(localStorage);
        console.log('All localStorage keys:', localStorageKeys);
        
        const supabaseKeys = localStorageKeys.filter(key => 
          key.includes('supabase') || 
          key.includes('sb-') || 
          key.includes('auth')
        );
        
        console.log('Found potential auth keys in localStorage:', supabaseKeys);
        
        // Check both possible formats
        const cookieKeyName = `sb-${domain}-auth-token`;
        const tokenKeyName = `sb-${domain}.supabase.co-auth-token`;
        const alternativeCookieKeyName = domain.includes('.') ? 
          `sb-${domain.split('.')[0]}-auth-token` : null;
        
        console.log('Expected Supabase cookie key (primary):', cookieKeyName);
        if (alternativeCookieKeyName) {
          console.log('Alternative Supabase cookie key:', alternativeCookieKeyName);
        }
        console.log('Expected localStorage key:', tokenKeyName);
        
        // Try to read localStorage value for debugging
        let storedTokenValue = null;
        storedTokenValue = localStorage.getItem(tokenKeyName);
        console.log('Value in localStorage for key:', tokenKeyName, storedTokenValue ? 'exists' : 'not found');
        
        // Check for any token format
        const hasLocalSession = storedTokenValue !== null;
        
        console.log('Local session exists:', hasLocalSession);
        
        // Add function to manually set session using existing token
        const manuallySetSession = async () => {
          try {
            // Get token from localStorage
            const tokenStr = localStorage.getItem(tokenKeyName);
            
            if (!tokenStr) {
              console.log('No token found in localStorage for manual session setup');
              return false;
            }
            
            // Parse token array: [access_token, refresh_token]
            const tokens = JSON.parse(tokenStr);
            if (!Array.isArray(tokens) || tokens.length < 2) {
              console.log('Invalid token format in localStorage');
              return false;
            }
            
            console.log('Manually setting session with tokens from localStorage');
            
            // Use setSession method to directly set the session
            const { data, error } = await supabase.auth.setSession({
              access_token: tokens[0],
              refresh_token: tokens[1]
            });
            
            if (error) {
              console.error('Error manually setting session:', error);
              return false;
            }
            
            console.log('Session manually set successfully:', data.session ? 'exists' : 'null');
            return !!data.session;
          } catch (e) {
            console.error('Error in manual session setup:', e);
            return false;
          }
        };
        
        // If we detect Supabase tokens in the cookies but not in localStorage,
        // let's copy them over and try to establish a session
        if (!hasLocalSession && document.cookie.includes('-auth-token=')) {
          console.log('Auth token found in cookies but not in localStorage - attempting recovery');
          
          // Extract cookie from different possible formats
          const cookieValue = cookies[cookieKeyName] || 
                             (alternativeCookieKeyName ? cookies[alternativeCookieKeyName] : null);
          
          if (cookieValue) {
            console.log('Found token cookie - trying to use for auth');
            
            try {
              // Clean the token - make sure it's in the correct format
              let tokenToStore;
              try {
                const parsedToken = JSON.parse(cookieValue);
                tokenToStore = JSON.stringify(parsedToken);
              } catch (e) {
                // If it fails to parse, use as is
                tokenToStore = cookieValue;
              }
              
              // Store in localStorage
              localStorage.setItem(tokenKeyName, tokenToStore);
              console.log('Copied token from cookie to localStorage with key:', tokenKeyName);
              
              // Try manual session setting
              const manualSuccess = await manuallySetSession();
              if (manualSuccess) {
                console.log('Successfully established session from cookie');
                // Reload session
                const { data: { session: recoveredSession } } = await supabase.auth.getSession();
                if (recoveredSession) {
                  currentSession = recoveredSession;
                  console.log('Session successfully recovered from cookie');
                }
              }
            } catch (e) {
              console.error('Error recovering session from cookie:', e);
            }
          }
        }
        
        console.log('Session from getSession():', currentSession ? 'exists' : 'null');
        
        // If we have a local session but getSession() returned null, try to refresh the session
        if (!currentSession && hasLocalSession) {
          console.log('Local session exists but getSession returned null - trying to refresh session');
          
          try {
            // Try our manual method first
            console.log('Attempting manual session setup with stored token');
            const manualSuccess = await manuallySetSession();
            
            if (manualSuccess) {
              console.log('Manual session setup successful, retrieving new session');
              // Re-fetch the session after manual setup
              const newSessionResponse = await supabase.auth.getSession();
              const { data: { session: newSession } } = newSessionResponse;
              
              if (newSession) {
                console.log('Successfully established new session with manual method');
                // Update the session variable to continue with the authenticated flow
                currentSession = newSession;
              }
            } else {
              // If manual method fails, try supabase's refreshSession
              console.log('Manual method failed, trying Supabase refreshSession');
              const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
              
              console.log('Session refresh attempt:', refreshError ? 'failed' : 'succeeded');
              
              if (refreshError) {
                console.error('Session refresh error:', refreshError);
              } else if (refreshData.session) {
                console.log('Session refreshed successfully');
                currentSession = refreshData.session;
              }
            }
          } catch (refreshErr) {
            console.error('Error during session refresh:', refreshErr);
          }
        }
        
        // Use either the retrieved session or check if we have a local session
        if (!currentSession && !hasLocalSession) {
          console.log('No session found, redirecting to sign in')
          setError("Auth session missing! Please sign in again.")
          setTimeout(() => {
            router.push('/auth/signin')
          }, 2000)
          return
        }
        
        // Force reload user data if session exists but getSession() failed
        let userResponse;
        try {
          userResponse = await supabase.auth.getUser();
          console.log('User response:', userResponse);
        } catch (getUserErr) {
          console.error('Error getting user data:', getUserErr);
          
          // Last resort fallback - try to sign in again if localStorage has credentials
          if (hasLocalSession && typeof window !== 'undefined') {
            const storedEmail = localStorage.getItem('userEmail');
            const storedPassword = localStorage.getItem('tempUserPassword');
            
            if (storedEmail && storedPassword) {
              console.log('Attempting recovery sign-in with stored credentials');
              try {
                // Try to sign in with stored credentials as a last resort
                userResponse = await fetch('/api/auth/signin', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: storedEmail, password: storedPassword })
                }).then(res => res.json());
                
                if (userResponse.success) {
                  console.log('Recovery sign-in successful');
                  // Reload page to refresh session
                  window.location.reload();
                  return;
                }
              } catch (signInErr) {
                console.error('Recovery sign-in failed:', signInErr);
              }
            }
          }
        }
        
        if (!userResponse || !userResponse.data || !userResponse.data.user) {
          console.log('No user found, redirecting to sign in');
          setError("User not found! Please sign in again.");
          setTimeout(() => {
            router.push('/auth/signin');
          }, 2000);
          return;
        }
        
        const user = userResponse.data.user;
        
        console.log('User found:', user.id);
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
                  },
                  service_type: 'House Call'
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card shadow rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4 text-xl">{error}</div>
          <p className="text-muted-foreground mb-6">
            There was a problem loading your dashboard. This might be due to an authentication issue.
          </p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Go to Sign In
          </button>
        </div>
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
            <div className="flex space-x-4">
              <Link
                href="/dashboard/subscription"
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Manage Subscription
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Sign out
              </button>
            </div>
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
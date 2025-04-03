import { supabase } from './supabase'

export type AcuityAuthToken = {
  access_token: string
  token_type: string
  expires_in?: number
  created_at: string
}

export async function initiateAcuityAuth() {
  const clientId = process.env.NEXT_PUBLIC_ACUITY_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_ACUITY_REDIRECT_URI

  if (!clientId || !redirectUri) {
    throw new Error('Acuity OAuth configuration is missing')
  }

  // Generate a random state parameter for security
  const state = Math.random().toString(36).substring(2, 15)

  // Store state in localStorage for verification
  if (typeof window !== 'undefined') {
    localStorage.setItem('acuity_oauth_state', state)
  }

  // Construct the authorization URL
  const authUrl = new URL('https://acuityscheduling.com/oauth2/authorize')
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('scope', 'api-v1')
  authUrl.searchParams.append('client_id', clientId)
  authUrl.searchParams.append('redirect_uri', redirectUri)
  authUrl.searchParams.append('state', state)

  // Redirect to Acuity's authorization page
  window.location.href = authUrl.toString()
}

export async function disconnectAcuity() {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Get the current Acuity token
  const { data: userData, error: fetchError } = await supabase
    .from('users')
    .select('acuity_auth_token')
    .eq('id', user.id)
    .single()

  if (fetchError) {
    throw new Error('Failed to fetch user data')
  }

  if (userData?.acuity_auth_token?.access_token) {
    // Call Acuity's disconnect endpoint
    const disconnectResponse = await fetch('https://acuityscheduling.com/oauth2/disconnect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        access_token: userData.acuity_auth_token.access_token,
        client_id: process.env.NEXT_PUBLIC_ACUITY_CLIENT_ID!,
        client_secret: process.env.ACUITY_SECRET!,
      }),
    })

    if (!disconnectResponse.ok) {
      console.error('Failed to disconnect from Acuity:', await disconnectResponse.text())
    }
  }

  // Remove the token from the database
  const { error: updateError } = await supabase
    .from('users')
    .update({ acuity_auth_token: null })
    .eq('id', user.id)

  if (updateError) {
    throw new Error('Failed to remove Acuity credentials')
  }
} 
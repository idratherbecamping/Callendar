import { NextResponse } from 'next/server';

// Get credentials from environment variables (server-side only)
const ACUITY_CLIENT_ID = process.env.ACUITY_CLIENT_ID;
const ACUITY_CLIENT_SECRET = process.env.ACUITY_CLIENT_SECRET;
const REDIRECT_URI = process.env.ACUITY_REDIRECT_URI;

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Validate that credentials are configured
    if (!ACUITY_CLIENT_ID || !ACUITY_CLIENT_SECRET || !REDIRECT_URI) {
      console.error('Missing Acuity OAuth credentials in environment variables');
      return NextResponse.json(
        { error: 'OAuth configuration is incomplete. Check server logs.' },
        { status: 500 }
      );
    }

    console.log('Exchanging code for tokens with:', {
      clientId: ACUITY_CLIENT_ID?.substring(0, 5) + '...',
      redirectUri: REDIRECT_URI
    });

    // Exchange the authorization code for tokens according to Acuity documentation
    const tokenResponse = await fetch('https://acuityscheduling.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: ACUITY_CLIENT_ID,
        client_secret: ACUITY_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Acuity token exchange error:', error);
      return NextResponse.json(
        { error: 'Failed to exchange authorization code for tokens' },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    console.log('Token data:', tokenData);
    return NextResponse.json(tokenData);
  } catch (error) {
    console.error('Error exchanging Acuity token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
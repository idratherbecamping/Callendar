import { NextResponse } from 'next/server';

// Get credentials from environment variables (server-side only)
const SQUARE_CLIENT_ID = process.env.SQUARE_CLIENT_ID;
const SQUARE_CLIENT_SECRET = process.env.SQUARE_CLIENT_SECRET;
const REDIRECT_URI = process.env.SQUARE_REDIRECT_URI;
// Add debug logging for environment variables
console.log('Server-side Square OAuth Configuration:', {
  clientId: SQUARE_CLIENT_ID ? `${SQUARE_CLIENT_ID.substring(0, 5)}...` : 'missing',
  clientSecret: SQUARE_CLIENT_SECRET ? 'present' : 'missing',
  redirectUri: REDIRECT_URI || 'missing',
  envKeys: Object.keys(process.env).filter(key => key.includes('SQUARE'))
});

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
    if (!SQUARE_CLIENT_ID || !SQUARE_CLIENT_SECRET || !REDIRECT_URI) {
      console.error('Missing Square OAuth credentials in environment variables');
      return NextResponse.json(
        { error: 'OAuth configuration is incomplete. Check server logs.' },
        { status: 500 }
      );
    }

    console.log('Exchanging code for tokens with:', {
      clientId: SQUARE_CLIENT_ID?.substring(0, 5) + '...',
      redirectUri: REDIRECT_URI
    });

    // Exchange the authorization code for tokens according to Square documentation
    const tokenResponse = await fetch('https://connect.squareup.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: SQUARE_CLIENT_ID,
        client_secret: SQUARE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Square token exchange error:', error);
      return NextResponse.json(
        { error: 'Failed to exchange authorization code for tokens' },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    console.log('Token data:', tokenData);
    return NextResponse.json(tokenData);
  } catch (error) {
    console.error('Error exchanging Square token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
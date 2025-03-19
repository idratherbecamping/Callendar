import { NextResponse } from 'next/server';

// Get credentials from environment variables (server-side only)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

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
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !REDIRECT_URI) {
      console.error('Missing Google OAuth credentials in environment variables');
      return NextResponse.json(
        { error: 'OAuth configuration is incomplete. Check server logs.' },
        { status: 500 }
      );
    }

    console.log('Exchanging code for tokens with:', {
      clientId: GOOGLE_CLIENT_ID?.substring(0, 5) + '...',
      redirectUri: REDIRECT_URI
    });

    // Exchange the authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Google token exchange error:', errorData);
      return NextResponse.json(
        { error: `Failed to exchange authorization code: ${errorData.error}` },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    console.log('Token data:', tokenData);
    return NextResponse.json({
      success: true,
      message: 'Google Calendar successfully connected',
      tokens: {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in
      }
    });
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { refresh_token } = await request.json();

    if (!refresh_token) {
      return NextResponse.json(
        { message: 'Refresh token is required' },
        { status: 400 }
      );
    }

    const SQUARE_CLIENT_ID = process.env.SQUARE_CLIENT_ID;
    const SQUARE_CLIENT_SECRET = process.env.SQUARE_CLIENT_SECRET;

    if (!SQUARE_CLIENT_ID || !SQUARE_CLIENT_SECRET) {
      console.error('Square OAuth credentials are not configured');
      return NextResponse.json(
        { message: 'Square OAuth credentials are not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://connect.squareup.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2024-02-15',
      },
      body: JSON.stringify({
        client_id: SQUARE_CLIENT_ID,
        client_secret: SQUARE_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Square token refresh failed:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to refresh Square token' },
        { status: response.status }
      );
    }

    const tokenData = await response.json();
    return NextResponse.json(tokenData);
  } catch (error) {
    console.error('Error refreshing Square token:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
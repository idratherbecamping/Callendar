import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Create a Supabase client with admin privileges
    const supabaseAdmin = createAdminClient();
    
    // Sign in the user with provided credentials
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    // Get the session data
    const session = data.session;
    
    // Set cookies properly
    const response = NextResponse.json({
      success: true,
      user: data.user,
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
        expires_in: session.expires_in,
        token_type: session.token_type
      },
      tokenData: [session.access_token, session.refresh_token]
    });
    
    // Set access token cookie
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    // Fix: Ensure we extract only the domain part correctly
    // The expected format is sb-[domain]-auth-token
    const domain = supabaseUrl?.replace(/^https?:\/\//, '');
    const cookieKeyName = `sb-${domain}-auth-token`;
    
    console.log('Setting auth cookie with name:', cookieKeyName);
    
    // Set the cookie with appropriate settings
    response.cookies.set(
      cookieKeyName,
      JSON.stringify([session.access_token, session.refresh_token]),
      {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: false, // Allow client-side access to the cookie
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      }
    );
    
    return response;
  } catch (error: unknown) {
    console.error('Sign in error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign in';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 
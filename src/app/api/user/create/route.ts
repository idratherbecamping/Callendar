import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

// Define types for profile data
type AcuityAuthToken = {
  access_token: string;
  token_type: string;
  expires_in?: number;
  created_at: string;
};

type GoogleAuthToken = {
  scopes: string[];
  client_id: string;
  token_uri: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

type UserProfileData = {
  id: string;
  email: string;
  business_name: string;
  phone_number: string;
  business_address: string;
  max_service_distance: number | string;
  typical_service_time: number | string;
  local_time_zone: string;
  business_hours_local: [string, string];
  calendar_connected: boolean;
  google_auth_token: GoogleAuthToken | null;
  acuity_auth_token: AcuityAuthToken | null;
  service_type: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string;
};

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to create user profile with retries
async function createUserProfile(
  supabaseAdmin: SupabaseClient,
  profileData: UserProfileData,
  maxRetries = 3
): Promise<{ error: Error | null }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Attempting to create user profile (attempt ${attempt}/${maxRetries})`);
    
    const { error } = await supabaseAdmin
      .from('users')
      .insert([profileData]);
    
    if (!error) {
      console.log('User profile created successfully');
      return { error: null };
    }
    
    console.error(`Profile creation attempt ${attempt} failed:`, error);
    
    if (attempt < maxRetries) {
      // Exponential backoff: 1s, 2s, 4s
      const delayMs = Math.pow(2, attempt - 1) * 1000;
      console.log(`Waiting ${delayMs}ms before retry...`);
      await delay(delayMs);
    }
  }
  
  // If we've exhausted all retries, return the last error
  return { error: new Error('Failed to create user profile after all retries') };
}

export async function POST(request: Request) {
  try {
    const { userData, authData, paymentData } = await request.json();
    
    if (!userData || !authData) {
      return NextResponse.json(
        { error: 'Missing user data or auth data' },
        { status: 400 }
      );
    }
    
    // Create auth user
    const { data: user, error: authError } = await supabase.auth.signUp({
      email: authData.email,
      password: authData.password,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 500 }
      );
    }

    if (!user?.user?.id) {
      return NextResponse.json(
        { error: 'Auth user created but ID is missing' },
        { status: 500 }
      );
    }

    // Add a small delay to ensure auth user is fully propagated
    console.log('Auth user created, waiting for propagation...');
    await delay(1000);
    
    // Get admin client that bypasses RLS
    const supabaseAdmin = createAdminClient();
    
    // Prepare profile data
    const profileData: UserProfileData = {
      id: user.user.id,
      email: userData.email,
      business_name: userData.businessName,
      phone_number: userData.phoneNumber,
      business_address: userData.businessAddress,
      max_service_distance: userData.maxServiceDistance,
      typical_service_time: userData.typicalServiceTime,
      local_time_zone: userData.localTimeZone,
      business_hours_local: [userData.businessHoursLocal.open, userData.businessHoursLocal.close],
      calendar_connected: userData.calendarConnected,
      google_auth_token: userData.googleAuthToken || null,
      acuity_auth_token: userData.acuityAuthToken || null,
      service_type: userData.service_type || 'House Call',
      // Add Stripe data if available
      stripe_customer_id: paymentData?.customerId || null,
      stripe_subscription_id: paymentData?.subscriptionId || null,
      subscription_status: 'trialing', // Default to trialing for new users
    };

    // Create user profile with retries
    const { error: profileError } = await createUserProfile(supabaseAdmin, profileData);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      userId: user.user.id,
      user: {
        id: user.user.id,
        email: userData.email
      }
    });
  } catch (error: unknown) {
    console.error('User creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while creating the user';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 
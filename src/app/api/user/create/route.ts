import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { userData, authData } = await request.json();
    
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
    
    // Get admin client that bypasses RLS
    const supabaseAdmin = createAdminClient();
    
    // Create user profile with admin client (bypasses RLS)
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          id: user?.user?.id,
          email: userData.email,
          business_name: userData.businessName,
          phone_number: userData.phoneNumber,
          business_address: userData.businessAddress,
          max_service_distance: userData.maxServiceDistance,
          typical_service_time: userData.typicalServiceTime,
          local_time_zone: userData.localTimeZone,
          business_hours_local: [userData.businessHoursLocal.open, userData.businessHoursLocal.close],
          calendar_connected: userData.calendarConnected,
          google_auth_token: userData.googleAuthToken || null
        },
      ]);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      userId: user?.user?.id
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
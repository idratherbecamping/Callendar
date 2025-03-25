import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend URL not configured" },
        { status: 500 }
      );
    }
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/account-create/send-sms-twilio-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    // Get the response data
    const responseData = await response.json().catch(() => ({}));
    
    // Return the response from the backend
    return NextResponse.json(
      responseData,
      { status: response.status }
    );
  } catch (error) {
    console.error('Error in SMS proxy:', error);
    return NextResponse.json(
      { error: "Failed to send SMS" },
      { status: 500 }
    );
  }
} 
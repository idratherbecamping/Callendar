import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.split(' ')[1];
    const response = await fetch('https://connect.squareup.com/v2/merchants/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-02-15',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to get Square merchant info:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to get Square merchant info' },
        { status: response.status }
      );
    }

    const merchantData = await response.json();
    return NextResponse.json(merchantData);
  } catch (error) {
    console.error('Error getting Square merchant info:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
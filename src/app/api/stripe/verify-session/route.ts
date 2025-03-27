import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    // Check if payment was successful
    if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Payment has not been completed'
        },
        { status: 400 }
      );
    }

    // Payment was successful or customer is on a trial, extract subscription and customer IDs
    const subscriptionId = session.subscription as Stripe.Subscription;
    const customerId = session.customer as Stripe.Customer;

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      subscriptionId: subscriptionId.id,
      customerId: customerId.id,
    });
    
  } catch (error: unknown) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify session'
      },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, businessName, service_type, returnUrl } = body;

    if (!email || !returnUrl) {
      return NextResponse.json(
        { error: 'Email and return URL are required' },
        { status: 400 }
      );
    }

    // Create a new customer or get existing one
    const customerParams: Stripe.CustomerCreateParams = {
      email,
      name: businessName || email,
      metadata: {
        service_type: service_type || 'Unknown',
      },
    };

    // Check if customer already exists
    let customer;
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create(customerParams);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Callendar AI Subscription - Pilot Program',
              description: 'Monthly subscription to Callendar scheduling service',
            },
            unit_amount: 3000, // $30.00
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 30, // Add 1-month free trial
        metadata: {
          user_id: email, // Use email as a way to identify the user in webhooks
          service_type: service_type || 'Unknown'
        }
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      client_reference_id: customer.id,
      success_url: `${returnUrl}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: returnUrl,
    });

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error: unknown) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 
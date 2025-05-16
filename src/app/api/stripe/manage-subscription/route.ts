import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, subscriptionId, userId, stripeCustomerId } = body;
    console.log('API received request:', { action, subscriptionId, userId, stripeCustomerId });

    if (!action || !subscriptionId || !userId || !stripeCustomerId) {
      return NextResponse.json(
        { error: 'Action, subscription ID, user ID, and Stripe customer ID are required' },
        { status: 400 }
      );
    }

    let result;

    // Process the requested action
    switch (action) {
      case 'get_details':
        // Retrieve subscription details and verify customer
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        if (subscription.customer !== stripeCustomerId) {
          return NextResponse.json(
            { error: 'Subscription does not belong to this customer' },
            { status: 403 }
          );
        }
        result = subscription;
        break;
        
      case 'cancel':
        // Cancel the subscription at period end (not immediately)
        result = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
        break;

      case 'reactivate':
        // If subscription is set to cancel at period end, remove that flag
        result = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: false,
        });
        break;

      case 'change_plan':
        // Upgrade or downgrade subscription (this is a simplified example)
        const { newPriceId } = body;
        if (!newPriceId) {
          return NextResponse.json(
            { error: 'New price ID is required for plan change' },
            { status: 400 }
          );
        }
        
        result = await stripe.subscriptions.update(subscriptionId, {
          items: [
            {
              id: (await stripe.subscriptions.retrieve(subscriptionId)).items.data[0].id,
              price: newPriceId,
            },
          ],
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: result.id,
        status: result.status,
        cancel_at_period_end: result.cancel_at_period_end,
        current_period_end: new Date(result.current_period_end * 1000).toISOString(),
      },
    });
    
  } catch (error: unknown) {
    console.error('Error managing subscription:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to manage subscription' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`⚠️  Webhook signature verification failed: ${errorMessage}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${errorMessage}` },
        { status: 400 }
      );
    }

    // Process the event based on its type
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// Helper function to handle subscription creation/updates
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // First, try to find the user by stripe_customer_id
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();
    
  let user = data;

  if (error || !user) {
    console.log('User not found by stripe_customer_id, attempting to match by custom metadata');
    
    // If not found, check if subscription has metadata with user ID
    if (subscription.metadata && subscription.metadata.user_id) {
      const userId = subscription.metadata.user_id;
      
      // Try to find user by auth_id
      const { data: userByAuthId, error: authIdError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', userId)
        .single();
        
      if (!authIdError && userByAuthId) {
        // Found user by auth_id, update their stripe_customer_id
        user = userByAuthId;
        
        // Update user with the stripe_customer_id
        await supabase
          .from('users')
          .update({ 
            stripe_customer_id: customerId,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      }
    }
    
    // If still not found, log the error and return
    if (!user) {
      console.error('Could not find user for subscription:', subscription.id);
      return;
    }
  }
  
  // Update the subscription status in the database
  const { error: updateError } = await supabase
    .from('users')
    .update({
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      subscription_cancel_at_period_end: subscription.cancel_at_period_end,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (updateError) {
    console.error('Error updating subscription in database:', updateError);
  }
}

// Helper function to handle subscription cancellations
async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Update the subscription status in the database
  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'canceled',
      subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('Error updating canceled subscription in database:', error);
  }
}

// Helper function to handle invoice payments
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  // Update payment status in the database
  const { error } = await supabase
    .from('users')
    .update({
      payment_status: 'paid',
      last_payment_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('Error updating payment status in database:', error);
  }
}

// Helper function to handle failed payments
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  // Update payment status in the database
  const { error } = await supabase
    .from('users')
    .update({
      payment_status: 'failed',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('Error updating failed payment status in database:', error);
  }
} 
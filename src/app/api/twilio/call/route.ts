import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const webhookUrl = process.env.TWILIO_WEBHOOK_URL; // Your TwiML webhook URL

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();
    
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }
    
    if (!accountSid || !authToken || !twilioNumber || !webhookUrl) {
      return NextResponse.json(
        { error: 'Missing Twilio configuration' },
        { status: 500 }
      );
    }

    const client = twilio(accountSid, authToken);
    
    // Make the call
    const call = await client.calls.create({
      to: phoneNumber,
      from: twilioNumber,
      url: webhookUrl, // This should point to your TwiML webhook
    });

    return NextResponse.json({ success: true, callSid: call.sid });
  } catch (error) {
    console.error('Error initiating Twilio call:', error);
    return NextResponse.json(
      { error: 'Failed to initiate call' },
      { status: 500 }
    );
  }
} 
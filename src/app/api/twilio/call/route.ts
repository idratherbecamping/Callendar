import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const webhookUrl = process.env.TWILIO_WEBHOOK_URL; // Your TwiML webhook URL

export async function POST(request: Request) {
  try {
    // You can extract any required data from the request if needed
    // const { phoneNumber } = await request.json();
    
    // Default phone number to call (or use the one from request)
    const toPhoneNumber = process.env.DEFAULT_TO_PHONE_NUMBER;
    
    if (!accountSid || !authToken || !twilioNumber || !webhookUrl || !toPhoneNumber) {
      return NextResponse.json(
        { error: 'Missing Twilio configuration' },
        { status: 500 }
      );
    }

    const client = twilio(accountSid, authToken);
    
    // Make the call
    const call = await client.calls.create({
      to: toPhoneNumber,
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
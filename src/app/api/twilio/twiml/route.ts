import { NextResponse } from 'next/server';
import { twiml } from 'twilio';

export async function POST() {
  // Create a TwiML response
  const response = new twiml.VoiceResponse();
  
  // Add voice actions to your response
  response.say('Hello from Callendar! This is a test call from your AI Voice Mail Assistant.');
  
  // You can add more complex TwiML instructions here
  // For example, to gather input:
  // const gather = response.gather({ numDigits: 1 });
  // gather.say('Press 1 to continue, or any other key to end the call.');

  // Return the TwiML as XML
  return new Response(response.toString(), {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
} 
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { trackButtonClick } from "@/lib/analytics";

const HeroSection = () => {
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    
    // Format the number
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    }
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(formatPhoneNumber(value));
    }
  };

  const handleTestCall = async () => {
    try {
      setIsCallLoading(true);
      // Add +1 prefix to the phone number
      const fullPhoneNumber = `+1${phoneNumber.replace(/\D/g, '')}`;
      
      const response = await fetch('/api/twilio/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }
      
      alert('Test call initiated! You should receive a call shortly.');
      setShowPhoneDialog(false);
      setPhoneNumber('');
    } catch (error) {
      console.error('Error initiating test call:', error);
      alert('Failed to initiate test call. Please try again later.');
    } finally {
      setIsCallLoading(false);
    }
  };

  const handleTryItNow = () => {
    trackButtonClick('Try It Now', { location: 'hero' });
    setShowPhoneDialog(true);
  };

  return (
    <section id="Hero" className="pt-36 pb-24 relative overflow-hidden">
      {/* Phone Number Input Dialog */}
      {showPhoneDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Enter Your Phone Number</h2>
            <p className="text-gray-600 mb-4">Please enter your phone number to receive a test call:</p>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="(555) 555-5555"
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowPhoneDialog(false);
                  setPhoneNumber('');
                }}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleTestCall}
                disabled={phoneNumber.length < 14 || isCallLoading}
                className="beesly-button beesly-button-secondary"
              >
                {isCallLoading ? 'Calling...' : 'Start Call'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute w-full h-full top-0 left-0 bg-beeslyDark z-0"></div>

      {/* Honeycomb SVG Background */}
      <div className="absolute w-full h-full top-0 left-0 z-0 opacity-10">
        <img
          src="https://web-assets.same.dev/3660985521/15669422.svg+xml"
          alt="Honeycomb background"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="beesly-container relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left column - Text content */}
          <div className="text-left md:w-1/2">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-16 w-16 rounded-full overflow-hidden">
                <Image
                  src="/arsenal_branding.png"
                  alt="Arsenal Barber Co. Logo"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xl text-gray-700 italic">
                  "The booking service has led to a steady increase in our weekly appointments."
                </p>
                <p className="text-base text-beeslyYellow font-semibold mt-2">- Hunter @ Arsenal Barber Co</p>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-10 text-heading">
              <span className="block text-3xl md:text-4xl lg:text-3xl mt-4"> AI Voicemail That Turns Missed Calls Into Booked Appointments</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-10">
              Never miss a client again. Our AI answers calls, books appointments, and captures every opportunity 24/7.  
            </p>
            <p className="text-lg md:text-xl text-gray-700 mb-10">
              Just one saved call can pay for the entire service.
            </p>
            <p className="text-lg md:text-xl text-gray-700 mb-10">
              {/* <span className="font-bold">FREE</span> first month, then just <span className="font-bold">$45 /month</span>   */}
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Button 
                className="beesly-button beesly-button-secondary w-48 h-12"
                onClick={handleTryItNow}
                disabled={isCallLoading}
              >
                {isCallLoading ? 'Calling...' : 'Try It Now'}
              </Button>
            </div>
          </div>
          
          {/* Right column - Image */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg scale-30 transform">
              {/* Hexagonal decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 opacity-15">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFC107" d="M48.1,6.7l-38.2,22c-1.6,0.9-2.6,2.6-2.6,4.5v44c0,1.9,1,3.6,2.6,4.5l38.2,22c1.6,0.9,3.6,0.9,5.2,0 l38.2-22c1.6-0.9,2.6-2.6,2.6-4.5v-44c0-1.9-1-3.6-2.6-4.5l-38.2-22C51.7,5.8,49.7,5.8,48.1,6.7z"/>
                </svg>
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 opacity-15">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFC107" d="M48.1,6.7l-38.2,22c-1.6,0.9-2.6,2.6-2.6,4.5v44c0,1.9,1,3.6,2.6,4.5l38.2,22c1.6,0.9,3.6,0.9,5.2,0 l38.2-22c1.6-0.9,2.6-2.6,2.6-4.5v-44c0-1.9-1-3.6-2.6-4.5l-38.2-22C51.7,5.8,49.7,5.8,48.1,6.7z"/>
                </svg>
              </div>
              
              {/* Main image container with border and shadow */}
              <div className="relative bg-beeslyDark rounded-xl overflow-hidden border-2 border-beeslyYellow/30 shadow-[0_0_30px_rgba(255,193,7,0.15)]">
                <Image
                  src="/ad_generic.png"
                  alt="Callendar AI Generic Service"
                  width={350}
                  height={350}
                  className="w-full h-auto"
                  priority
                />
                
                {/* Bottom gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-beeslyDark to-transparent"></div>
                
                {/* "Powered by Callendar" badge */}
                <div className="absolute bottom-4 right-4 bg-beeslyYellow/90 px-3 py-1 rounded-md shadow-lg text-black text-sm font-medium">
                  Powered by Callendar AI
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

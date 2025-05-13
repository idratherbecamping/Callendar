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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-heading">
              {/* <span className="block">Automated Voicemail that Books Appointments for You</span> */}
              <span className="block text-3xl md:text-4xl lg:text-3xl mt-4"> AI Voicemail That Turns Missed Calls Into Booked Appointments</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-5">
              Never miss a client again. Our AI answers calls, books appointments, and captures every opportunity 24/7.  
            </p>
            <p className="text-lg md:text-xl text-gray-700 mb-5">
              Just one saved call can pay for the entire service.
            </p>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
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
            <div className="relative w-full max-w-sm">
              <Image
                src="/ad_generic.png"
                alt="Callendar AI Generic Service"
                width={400}
                height={400}
                className="object-contain rounded-lg shadow-xl w-4/5 mx-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

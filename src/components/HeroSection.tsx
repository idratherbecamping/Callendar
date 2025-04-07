"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

      <div className="beesly-container relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-heading">
          <span className="block">Callendar AI</span>
          <span className="block text-3xl md:text-4xl lg:text-3xl mt-4">Automated Voicemail that Books Appointments for You</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-5">
          Never Miss a Call, Never Miss an Opportunity
        </p>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-5">
          Service <span className="font-bold">pays for itself</span> with just one missed opportunity
        </p>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12">
          <span className="font-bold">FREE</span> first month, then just <span className="font-bold">$45 /month</span>  
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-5 mb-20">
          <Button 
            className="beesly-button beesly-button-secondary w-48 h-12"
            onClick={() => setShowPhoneDialog(true)}
            disabled={isCallLoading}
          >
            {isCallLoading ? 'Calling...' : 'Try It Now'}
          </Button>
          {/* <Button className="beesly-button beesly-button-primary w-48 h-12 flex items-center gap-2">
            Download the Callendar app
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 15V3"></path>
              <path d="m8 11 4 4 4-4"></path>
              <path d="M8 21h8"></path>
              <path d="M12 17v4"></path>
            </svg>
          </Button> */}
        </div>

        {/* Hero Image - Phone */}
        {/* <div className="relative h-72 md:h-96 max-w-md mx-auto mb-16">
          <Image
            src="https://web-assets.same.dev/77499892/3772306543.png"
            alt="Callendar App Interface"
            fill
            className="object-contain"
          />
        </div> */}

        {/* Partner logos */}
        {/* <div className="flex flex-wrap justify-center items-center gap-8 mt-12">
          <Image
            src="https://web-assets.same.dev/140580300/1058212857.png"
            alt="OE logo"
            width={120}
            height={40}
            className="opacity-70 hover:opacity-100 transition-opacity hover-scale"
          />
          <Image
            src="https://web-assets.same.dev/297241517/1240148322.png"
            alt="The Paak logo"
            width={120}
            height={40}
            className="opacity-70 hover:opacity-100 transition-opacity hover-scale"
          />
        </div> */}

        {/* <div className="mt-16">
          <span className="beesly-section-title">Voicemail Redefined</span>
          <p className="text-gray-300 max-w-3xl mx-auto mt-5 leading-relaxed">
            Since the 1970s, voicemail technology has hardly changed, failing to keep pace with our communication evolution.
            It's time for a revolution. Our solution reimagines voicemail to be more personalized and efficient,
            perfectly aligning with the demands of modern businesses and the busy individual.
            Welcome to the future of voicemail, where every call counts and no message goes unnoticed.
          </p>
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const InteractiveDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const demoSteps = [
    {
      time: "2:47 PM",
      action: "incoming_call",
      title: "Phone Rings",
      description: "Client calls while you're with another customer",
      visual: "📱",
      sound: "Ring ring..."
    },
    {
      time: "2:47 PM",
      action: "ai_answers",
      title: "Your Assistant Answers",
      description: "\"Thanks for calling Arsenal Barber, how can I help you today?\"",
      visual: "🤖",
      sound: "Professional greeting"
    },
    {
      time: "2:48 PM",
      action: "client_request",
      title: "Client Requests Appointment",
      description: "\"I'd like to book an appointment for tomorrow afternoon\"",
      visual: "💬",
      sound: "Client speaking"
    },
    {
      time: "2:48 PM",
      action: "checking_calendar",
      title: "Checking Your Calendar",
      description: "Assistant checks available slots in real-time",
      visual: "📅",
      sound: "Keyboard typing"
    },
    {
      time: "2:49 PM",
      action: "booking_confirmed",
      title: "Appointment Booked!",
      description: "\"Perfect! I've booked you for 3:00 PM tomorrow\"",
      visual: "✅",
      sound: "Success chime"
    },
    {
      time: "2:49 PM",
      action: "notification",
      title: "You Get Notified",
      description: "New appointment added to your calendar automatically",
      visual: "📲",
      sound: "Notification ping"
    }
  ];

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    // Auto-advance through steps
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= demoSteps.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <section className="py-16 bg-beeslyDark">
      <div className="beesly-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-gray-400">
            Watch how your phone receptionist handles a real call
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            {/* Demo Screen */}
            <div className="bg-black rounded-lg p-6 mb-6 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">
                  {demoSteps[currentStep].visual}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {demoSteps[currentStep].title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {demoSteps[currentStep].description}
                </p>
                <p className="text-sm text-beeslyYellow">
                  {demoSteps[currentStep].time}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {demoSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-2 mx-1 rounded-full transition-all duration-500 ${
                      index <= currentStep ? 'bg-beeslyYellow' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {!isPlaying && currentStep === 0 && (
                <Button
                  onClick={startDemo}
                  className="beesly-button beesly-button-secondary"
                >
                  Start Demo
                </Button>
              )}
              {!isPlaying && currentStep === demoSteps.length - 1 && (
                <Button
                  onClick={resetDemo}
                  className="beesly-button beesly-button-secondary"
                >
                  Replay Demo
                </Button>
              )}
              {isPlaying && (
                <div className="text-beeslyYellow">
                  Demo in progress...
                </div>
              )}
            </div>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <h4 className="font-bold text-white">5 Minutes</h4>
              <p className="text-gray-400 text-sm">Setup time</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-bold text-white">100% Accurate</h4>
              <p className="text-gray-400 text-sm">Calendar synchronization</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">😊</div>
              <h4 className="font-bold text-white">Happy Clients</h4>
              <p className="text-gray-400 text-sm">Professional every time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
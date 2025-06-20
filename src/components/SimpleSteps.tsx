"use client";

import React from "react";

const SimpleSteps = () => {
  const steps = [
    {
      number: "1",
      time: "30 seconds",
      title: "Sign up",
      description: "Enter your business name and phone number"
    },
    {
      number: "2", 
      time: "Instant",
      title: "We connect to your phone",
      description: "Works with your existing number - no changes needed"
    },
    {
      number: "3",
      time: "Done!",
      title: "That's it. Really.",
      description: "Your phone receptionist starts working immediately"
    }
  ];

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          How Simple Is It?
        </h2>
        <p className="text-xl text-gray-400">
          No app to download. No training needed. It just works.
        </p>
      </div>

      <div className="relative">
        {/* Connection line */}
        <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-beeslyYellow/20 to-transparent hidden md:block"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-gray-900/50 backdrop-blur rounded-xl p-6 border border-gray-800 hover:border-beeslyYellow/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-beeslyYellow rounded-full flex items-center justify-center text-black font-bold text-lg">
                    {step.number}
                  </div>
                  <span className="text-beeslyYellow text-sm font-semibold">{step.time}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-6 py-3 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold">Setup complete in under 5 minutes</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleSteps;
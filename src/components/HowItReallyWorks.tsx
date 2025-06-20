"use client";

import React, { useState } from "react";

const HowItReallyWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Customer calls your business",
      description: "Your existing phone number stays the same. We can also provide a dedicated number at no additional cost.",
      icon: "📱",
      detail: "Works with any phone provider • Optional dedicated number included"
    },
    {
      title: "AI answers professionally",
      description: "Within 2 rings, your AI receptionist greets callers with your custom message.",
      icon: "🤖",
      detail: "Sounds natural • Never sleeps • Always polite"
    },
    {
      title: "Books the appointment",
      description: "Checks your real calendar, finds available slots, and confirms bookings instantly. For house calls, verifies customer is in your service area.",
      icon: "📅",
      detail: "Syncs with Square, Acuity, Google Calendar • Service area verification"
    },
    {
      title: "You get notified",
      description: "Receive instant notifications about new bookings. Customer gets text message confirmation if desired.",
      icon: "✅",
      detail: "Text alerts • Calendar updates • Customer SMS confirmations"
    }
  ];

  return (
    <section id="HIW" className="py-24 gradient-bg-dark relative overflow-hidden">
      <div className="beesly-container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-purple-500/30">
            <span className="text-purple-400">⚡</span>
            <span className="text-purple-300 text-sm font-medium">Setup in 5 minutes</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ridiculously simple to get started
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            No tech skills needed. No complicated setup. Just results.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeStep === index ? 'scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    activeStep === index 
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20' 
                      : 'border-gray-800 bg-gray-900/50'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`text-3xl transition-all duration-300 ${
                        activeStep === index ? 'scale-110' : ''
                      }`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-gray-400 mb-2">{step.description}</p>
                        {activeStep === index && (
                          <p className="text-sm text-purple-400 animate-fade-in">
                            {step.detail}
                          </p>
                        )}
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        activeStep === index 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                          : 'bg-gray-800 text-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Demo */}
            <div className="relative">
              <div className="glass-morphism-dark rounded-2xl p-8 border border-purple-500/20">
                <div className="aspect-video bg-black/50 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
                  <div className="relative z-10 text-center">
                    <div className="text-6xl mb-4 float-animation">{steps[activeStep].icon}</div>
                    <p className="text-white text-lg font-medium">{steps[activeStep].title}</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-6 bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500 rounded-full filter blur-2xl opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-500 rounded-full filter blur-2xl opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">
            Currently managing calls for service businesses
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-purple-400 text-xl">📞</span>
              <span className="text-white font-medium">430+ calls handled monthly</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">📈</span>
              <span className="text-white font-medium">Proven Results</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 text-xl">⚡</span>
              <span className="text-white font-medium">24/7 automated booking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItReallyWorks;
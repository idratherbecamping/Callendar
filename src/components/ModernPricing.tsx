"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ModernPricing = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    { 
      text: "First 7 days FREE", 
      icon: "🎁", 
      detail: "Try everything risk-free"
    },
    { 
      text: "100 customer interactions included", 
      icon: "📞", 
      detail: "Spam calls and voicemails don't count"
    },
    { 
      text: "Real-time calendar sync", 
      icon: "📅", 
      detail: "Works with Square, Acuity, Google"
    },
    { 
      text: "Additional interactions: $10/20 calls", 
      icon: "📈", 
      detail: "Only pay for what you use beyond 100"
    },
    { 
      text: "Cancel anytime", 
      icon: "✨", 
      detail: "No long-term contracts"
    },
    { 
      text: "5-minute setup", 
      icon: "⚡", 
      detail: "Start capturing calls today"
    }
  ];

  return (
    <section id="Pricing" className="py-24 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10"></div>
      </div>

      <div className="beesly-container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-green-500/30">
            <span className="text-green-400">💰</span>
            <span className="text-green-300 text-sm font-medium">Simple, transparent pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple, usage-based pricing.
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            No hidden fees, no complicated tiers. 
            Simple pricing with 100 interactions included, then pay only for what you use.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Main pricing card */}
          <div className="glass-morphism-dark rounded-3xl p-8 md:p-12 border border-green-500/20 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-400"></div>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full mb-4">
                <span className="text-green-400 text-sm font-bold">MOST POPULAR</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Professional Plan</h3>
              <p className="text-gray-400">Per calendar • Includes 100 interactions</p>
            </div>

            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl md:text-7xl font-bold text-gradient">$40</span>
                <div className="text-left">
                  <div className="text-gray-400">/month</div>
                  <div className="text-sm text-gray-500">per calendar</div>
                </div>
              </div>
              <p className="text-green-400 font-medium mt-2">First week FREE • No setup fees</p>
            </div>

            {/* ROI highlight */}
            <div className="gradient-bg-vibrant rounded-2xl p-6 mb-8 text-center">
              <h4 className="text-black font-bold text-xl mb-2">Pays for itself with just 1 booking</h4>
            </div>

            {/* Features list */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/5 cursor-pointer"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="text-2xl">{feature.icon}</div>
                  <div className="flex-1">
                    <span className="text-white font-medium">{feature.text}</span>
                    {hoveredFeature === index && (
                      <p className="text-gray-400 text-sm mt-1 animate-fade-in">{feature.detail}</p>
                    )}
                  </div>
                  <div className="text-green-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link href="/auth/signup">
                <Button className="btn-gradient text-lg px-12 py-6 rounded-full w-full md:w-auto">
                  Start Free Trial
                  <span className="ml-2">→</span>
                </Button>
              </Link>
              <p className="text-gray-500 text-sm mt-4">
                7 days free • Credit card required • Cancel anytime • Setup in 5 minutes
              </p>
            </div>
          </div>
        </div>

        {/* Comparison section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Compare to missed opportunities
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Without Callendar */}
            <div className="glass-morphism-dark rounded-2xl p-6 border border-red-500/20">
              <h4 className="text-red-400 font-bold text-lg mb-4 flex items-center gap-2">
                <span>❌</span> Without Callendar
              </h4>
              <div className="space-y-3">
              <div className="flex justify-between">
                  <span className="text-gray-400">Calls to manage per month:</span>
                  <span className="text-red-400 font-bold">130 calls</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400"> Missed opportunities per month:</span>
                  <span className="text-red-400 font-bold">5 calls</span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-gray-400">Lost bookings (40%):</span>
                  <span className="text-red-400 font-bold">26 appointments</span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-gray-400">Lost revenue per customer:</span>
                  <span className="text-red-400 font-bold">~$400/month*</span>
                </div>
                <div className="pt-3 border-t border-red-500/20">
                  <div className="flex justify-between text-lg">
                    <span className="text-white font-bold">Missed Yearly Revenue: </span>
                    <span className="text-red-400 font-bold">$4,800/year*</span>
                  </div>
                </div>
              </div>
            </div>

            {/* With Callendar */}
            <div className="glass-morphism-dark rounded-2xl p-6 border border-green-500/20">
              <h4 className="text-green-400 font-bold text-lg mb-4 flex items-center gap-2">
                <span>✅</span> With Callendar
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Calls answered:</span>
                  <span className="text-green-400 font-bold">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Base plan (100 interactions):</span>
                  <span className="text-white">$40/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Additional calls (if needed):</span>
                  <span className="text-white">$10/20 calls</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Additional revenue per customer:</span>
                  <span className="text-green-400 font-bold">~$400/month*</span>
                </div>
                <div className="pt-3 border-t border-green-500/20">
                  <div className="flex justify-between text-lg">
                    <span className="text-white font-bold">Additional Yearly Revenue:</span>
                    <span className="text-green-400 font-bold">+$4800/year*</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">*Revenue estimates based on current customer results. Individual results may vary depending on business type, call volume, and market conditions.</p>
          </div>
        </div>

        {/* FAQ teaser */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Questions about pricing?</p>
          <Button 
            variant="outline"
            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            onClick={() => document.getElementById('FAQ')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View FAQ
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ModernPricing;
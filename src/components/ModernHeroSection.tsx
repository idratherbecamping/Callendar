"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ModernHeroSection = () => {
  const [missedCalls, setMissedCalls] = useState(0);
  const [lostRevenue, setLostRevenue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMissedCalls(prev => prev < 430 ? prev + 10 : 430);
      setLostRevenue(prev => prev < 400 ? prev + 10 : 400);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen gradient-bg-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 rounded-full filter blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10 beesly-container pt-32 pb-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
            <span className="text-green-400">●</span>
            <span className="text-white/80 text-sm">Turn every missed call into booked revenue</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Your AI receptionist</span>
            <br />
            <span className="text-gradient">never misses a call</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            While you're serving customers, we're booking appointments. 
            <span className="text-gradient-vibrant font-semibold"> 24/7 availability</span> means 
            <span className="text-gradient-vibrant font-semibold"> zero missed opportunities</span>.
          </p>
          
          {/* Pricing highlight */}
          <div className="mb-12">
            <p className="text-lg text-gray-400 mb-2">
              <span className="text-gradient-accent font-bold">$40/month per calendar • 100 customer interactions included</span>
            </p>
            <p className="text-sm text-gray-500">
              Additional interactions: $10 per 20 calls • Spam calls don't count
            </p>
          </div>

          {/* Live stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <div className="glass-morphism-dark rounded-xl p-6">
              <div className="text-4xl font-bold text-gradient mb-2">{missedCalls}</div>
              <p className="text-gray-400">Calls managed monthly</p>
            </div>
            <div className="glass-morphism-dark rounded-xl p-6">
              <div className="text-4xl font-bold text-gradient-vibrant mb-2">${lostRevenue.toLocaleString()}</div>
              <p className="text-gray-400">Average Additional revenue per customer/month*</p>
              <p className="text-xs text-gray-500 mt-1">*Results may vary</p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className="btn-gradient text-lg px-8 py-6 rounded-full">
                Start Free Trial
                <span className="ml-2">→</span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6 rounded-full backdrop-blur-sm"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Watch Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
<span>$40/month per calendar</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Setup in 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default ModernHeroSection;
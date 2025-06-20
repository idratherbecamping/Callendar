'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, CalendarIcon, UsersIcon, VideoCameraIcon, CheckIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ModernTestimonials from '@/components/ModernTestimonials';
import OfficeVoiceDemo from '@/components/OfficeVoiceDemo';
import HowItReallyWorks from '@/components/HowItReallyWorks';
import ModernPricing from '@/components/ModernPricing';
import ImpactSection from '@/components/ImpactSection';
import { Button } from '@/components/ui/button';

export default function OfficeServicesPage() {
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
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
    <main className="min-h-screen bg-beeslyDark">
      <Navbar />

      {/* Phone Number Input Dialog */}
      {showPhoneDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="glass-morphism-dark rounded-2xl p-8 max-w-md w-full mx-4 border border-purple-500/20">
            <h2 className="text-2xl font-bold mb-4 text-white">Get a Demo Call</h2>
            <p className="text-gray-400 mb-6">Enter your phone number and our AI will call you in about 30 seconds:</p>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="(555) 555-5555"
              className="w-full p-4 border border-purple-500/30 rounded-xl mb-6 bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowPhoneDialog(false);
                  setPhoneNumber('');
                }}
                className="bg-gray-700 text-white hover:bg-gray-600 px-6 py-3 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleTestCall}
                disabled={phoneNumber.length < 14 || isCallLoading}
                className="btn-gradient px-6 py-3 rounded-xl disabled:opacity-50"
              >
                {isCallLoading ? 'Calling...' : 'Call Me Now'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Perfect for</span>
              <br />
              <span className="text-gradient">office services</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              While you're serving customers, we're booking appointments. 
              <span className="text-gradient-vibrant font-semibold"> 24/7 availability</span> means 
              <span className="text-gradient-vibrant font-semibold"> zero missed opportunities</span>.
            </p>
            
            <p className="text-lg text-gray-400 mb-8">
              Ideal for barbers, salons, estheticians, accountants, consultants, or any business where clients visit 
              your office or connect with you virtually.
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
                <div className="text-4xl font-bold text-gradient mb-2">430</div>
                <p className="text-gray-400">Calls managed monthly</p>
              </div>
              <div className="glass-morphism-dark rounded-xl p-6">
                <div className="text-4xl font-bold text-gradient-vibrant mb-2">$400</div>
                <p className="text-gray-400">Average additional revenue per customer/month*</p>
                <p className="text-xs text-gray-500 mt-1">*Results may vary</p>
              </div>
            </div>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup?service_type=Scheduler">
                <button className="btn-gradient text-lg px-8 py-6 rounded-full">
                  Start Free Trial
                  <span className="ml-2">→</span>
                </button>
              </Link>
              <button 
                className="bg-white/10 border border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6 rounded-full backdrop-blur-sm"
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Watch Demo
              </button>
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

      {/* Voice Demo Section */}
      <OfficeVoiceDemo />

      {/* Impact Section */}
      <ImpactSection />

      {/* How It Works Section */}
      <HowItReallyWorks />

      {/* Features Section */}
      <section className="py-24 gradient-bg-dark relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        </div>

        <div className="beesly-container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-purple-500/30">
              <span className="text-purple-400">✨</span>
              <span className="text-purple-300 text-sm font-medium">Built for office services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything you need for office bookings
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Seamlessly integrates with your existing calendar system and business workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-morphism-dark rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                <CalendarIcon className="h-8 w-8 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Calendar Integration</h3>
              <p className="text-gray-400 mb-6">
                Works with your existing <span className="text-gradient-accent font-semibold">Acuity Scheduling</span>, <span className="text-gradient-accent font-semibold">Square Calendar</span>, or <span className="text-gradient-accent font-semibold">Google Calendar</span>. 
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg border border-white/30">
                  <img src="/acuity-logo-final.svg" alt="Acuity Scheduling" className="h-6" />
                  <span className="text-white text-sm">Acuity Scheduling</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg border border-white/30">
                  <img src="/gmail_logo.png" alt="Google Calendar" className="h-6" />
                  <span className="text-white text-sm">Google Calendar</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg border border-white/30">
                  <img src="/Square_combinationmark_black.png" alt="Square" className="h-6 filter invert" />
                  <span className="text-white text-sm">Square Appointments</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="glass-morphism-dark rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                <UsersIcon className="h-8 w-8 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Self-Service Booking</h3>
              <p className="text-gray-400 mb-6">
                Let clients <span className="text-gradient-accent font-semibold">book appointments over the phone</span> based on your real availability. Zero back-and-forth needed.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Real-time availability</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Instant confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">No double bookings</span>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="glass-morphism-dark rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart Scheduling</h3>
              <p className="text-gray-400 mb-6">
                Perfect for barbers, salons, consultants, and any business where clients visit your location.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Service-specific booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Custom availability</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Automatic reminders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Integrations Section */}
      <section className="py-24 gradient-bg-dark relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        </div>
        
        <div className="beesly-container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-purple-500/30">
              <span className="text-purple-400">📅</span>
              <span className="text-purple-300 text-sm font-medium">Calendar integrations</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Supported Calendar Systems
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Seamlessly integrates with your existing calendar system for real-time appointment booking.
            </p>
          </div>
          
          {/* Calendar Options */}
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="bg-white rounded-2xl p-8 border-2 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
              <div className="flex flex-col items-center text-center">
                <img src="/acuity-logo-final.svg" alt="Acuity Scheduling" className="h-12 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Acuity Scheduling</h3>
                <p className="text-gray-600 text-sm">Complete appointment management</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border-2 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
              <div className="flex flex-col items-center text-center">
                <img src="/gmail_logo.png" alt="Google Calendar" className="h-12 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Google Calendar</h3>
                <p className="text-gray-600 text-sm">Simple calendar synchronization</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border-2 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
              <div className="flex flex-col items-center text-center">
                <img src="/Square_combinationmark_black.png" alt="Square" className="h-12 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Square Appointments</h3>
                <p className="text-gray-600 text-sm">Integrated payment processing</p>
              </div>
            </div>
          </div>
          
          {/* Additional Benefits */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center glass-morphism-dark rounded-xl p-6">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="text-white font-bold mb-2">Real-time Sync</h4>
              <p className="text-gray-400 text-sm">Instantly updates your calendar</p>
            </div>
            <div className="text-center glass-morphism-dark rounded-xl p-6">
              <div className="text-3xl mb-3">🔄</div>
              <h4 className="text-white font-bold mb-2">Two-way Integration</h4>
              <p className="text-gray-400 text-sm">Works with your existing workflow</p>
            </div>
            <div className="text-center glass-morphism-dark rounded-xl p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="text-white font-bold mb-2">No Double Bookings</h4>
              <p className="text-gray-400 text-sm">Prevents scheduling conflicts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <ModernTestimonials />

      {/* Try It Yourself Section */}
      <section className="py-24 gradient-bg-dark relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        </div>
        
        <div className="beesly-container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-purple-500/30">
              <span className="text-purple-400">📞</span>
              <span className="text-purple-300 text-sm font-medium">Live demo</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Try it yourself right now
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Call our live demo line and experience our AI receptionist in action. 
              See how it handles office bookings, calendar scheduling, and sounds completely natural.
            </p>
          </div>
          
          {/* Phone number highlight */}
          <div className="max-w-2xl mx-auto">
            <div className="glass-morphism-dark rounded-3xl p-8 md:p-12 border border-purple-500/20 text-center">
              <div className="text-6xl mb-6">✨</div>
              <h3 className="text-2xl font-bold text-white mb-4">Call our demo line</h3>
              <a 
                href="tel:+18775704990"
                className="text-5xl md:text-6xl font-bold text-gradient-accent hover:text-gradient-vibrant transition-all duration-300 block mb-6"
              >
                (877) 570-4990
              </a>
              <p className="text-gray-400 mb-8">
                This is a real AI receptionist for office services. Try booking an appointment, 
                ask about availability, or test how it handles client scheduling.
              </p>
              
              {/* Call options */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a 
                  href="tel:+18775704990"
                  className="btn-gradient text-lg px-8 py-4 rounded-full text-center"
                >
                  📞 Call Now: (877) 570-4990
                </a>
                <Button
                  onClick={() => setShowPhoneDialog(true)}
                  className="bg-white/10 border border-white/20 text-white hover:bg-white/20 text-lg px-8 py-4 rounded-full backdrop-blur-sm"
                >
                  📲 Have AI Call You
                </Button>
              </div>
              
              {/* What to expect */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">📅</div>
                  <h4 className="text-white font-semibold mb-2">Calendar Integration</h4>
                  <p className="text-gray-400 text-sm">Real-time availability checking</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">🏢</div>
                  <h4 className="text-white font-semibold mb-2">Office Booking</h4>
                  <p className="text-gray-400 text-sm">Handles in-person and virtual appointments</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">🤖</div>
                  <h4 className="text-white font-semibold mb-2">Natural Conversation</h4>
                  <p className="text-gray-400 text-sm">Sounds like a real receptionist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <ModernPricing />

      <Footer />
    </main>
  );
}
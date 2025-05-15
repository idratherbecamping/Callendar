'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, MapPinIcon, TruckIcon, ClockIcon, CheckIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HouseCallServicesPage() {
  return (
    <main className="min-h-screen bg-beeslyDark">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-36 pb-24 relative overflow-hidden">
        {/* Honeycomb SVG Background */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "url('https://web-assets.same.dev/3660985521/15669422.svg+xml')",
            backgroundSize: "200px",
            backgroundRepeat: "repeat",
          }}></div>
        </div>

        <div className="beesly-container relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-heading">
                House Call Services
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-5">
              Voicemail that Books Appointments for You
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Callendar is an <span className="text-beeslyYellow font-semibold">AI-powered voicemail system</span> that automatically books appointments for your business. When clients call, they're routed to our <span className="text-beeslyYellow font-semibold">AI scheduling assistant</span> that checks your calendar availability, and books the appointment for you - <span className="text-beeslyYellow font-semibold">all without you having to pick up the phone</span>.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Ideal for pool cleaners, electricians, plumbers, home services, and other businesses
                where you go to your customers. Manage travel time and optimize your schedule.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <Link 
                  href="/auth/signup?service_type=House+Call" 
                  className="beesly-button beesly-button-secondary w-48 h-12 flex items-center justify-center"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center items-center">
              <div className="relative w-full max-w-lg mx-auto">
                {/* Simplified image container */}
                <div className="relative">
                  <img
                    src="/home_visit.png"
                    alt="House call service professional visiting client"
                    className="w-full h-auto object-contain max-h-[500px]"
                  />
                  
                  {/* Bottom gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-beeslyDark to-transparent"></div>
                  
                  {/* Small badge */}
                  <div className="absolute bottom-4 right-4 bg-beeslyYellow/90 px-3 py-1 rounded-md shadow-md text-black text-sm font-medium">
                    Powered by Callendar AI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="beesly-section bg-beeslyDark relative">
        {/* Honeycomb SVG Background */}
        <div className="absolute right-0 top-0 h-40 w-40 opacity-10">
          <img
            src="https://web-assets.same.dev/2637280236/2568384771.svg+xml"
            alt="Honeycomb background"
            className="w-full h-full"
          />
        </div>

        <div className="beesly-container">
          <div className="text-center mb-20">
            <span className="beesly-section-title">
              Specialized Features
            </span>
            <h2 className="beesly-section-heading">
              Designed for Mobile Service Providers
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="beesly-card beesly-card-hover">
              <div className="h-12 w-12 rounded-md bg-beeslyYellow flex items-center justify-center mb-4">
                <MapPinIcon className="h-6 w-6 text-black" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium text-heading mb-3">Location-Based Scheduling</h3>
              <p className="text-gray-600">
                Customers provide their address, and we help you manage appointments based on location to minimize travel time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="beesly-card beesly-card-hover">
              <div className="h-12 w-12 rounded-md bg-beeslyYellow flex items-center justify-center mb-4">
                <TruckIcon className="h-6 w-6 text-black" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium text-heading mb-3">Travel Optimization</h3>
              <p className="text-gray-600">
                Set your maximum service distance and typical service time. We only allow bookings in your area, so you can spend your time working and not driving.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="beesly-card beesly-card-hover">
              <div className="h-12 w-12 rounded-md bg-beeslyYellow flex items-center justify-center mb-4">
                <ClockIcon className="h-6 w-6 text-black" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium text-heading mb-3">Buffer Time Management</h3>
              <p className="text-gray-600">
                Account for travel time between appointments. Never double-book yourself or arrive late to an appointment again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="beesly-section bg-beeslyDark relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "url('https://web-assets.same.dev/2637280236/2568384771.svg+xml')",
            backgroundSize: "200px",
            backgroundRepeat: "repeat",
          }}></div>
        </div>
        
        <div className="beesly-container relative z-10">
          <div className="text-center mb-20">
            <span className="beesly-section-title">
              Industry Solutions
            </span>
            <h2 className="beesly-section-heading">
              Perfect For Your Business
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="beesly-card beesly-card-hover">
              <h3 className="text-xl font-medium text-heading mb-6">Who Uses House Call Services?</h3>
              <ul className="space-y-4">
                {[
                  'Pool cleaners and maintenance',
                  'Plumbers and electricians',
                  'Home cleaning services',
                  'HVAC technicians',
                  'Lawn care and landscaping',
                  'Mobile pet groomers',
                  'In-home healthcare providers',
                  'Mobile detailing services'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-5 h-5 bg-beeslyYellow rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-black"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="beesly-card beesly-card-hover">
              <h3 className="text-xl font-medium text-heading mb-6">Key Benefits</h3>
              <ul className="space-y-4">
                {[
                  'Captures every booking opportunity—even when you\'re tied up',
                  'Frees you to focus on the revenue-driving not scheduling',
                  'Minimize drive time between appointments',
                  'Set service boundaries with maximum travel distance',
                  'Optimize daily schedules by geographic area',

                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-5 h-5 bg-beeslyYellow rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-black"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="beesly-section bg-beeslyDark relative py-16">
        <div className="beesly-container">
          <div className="beesly-card text-center py-12 px-4 sm:px-6 relative overflow-hidden">
            {/* Honeycomb background in the card */}
            <div className="absolute inset-0 z-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: "url('https://web-assets.same.dev/3660985521/15669422.svg+xml')",
                backgroundSize: "150px",
                backgroundRepeat: "repeat",
              }}></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-heading sm:text-4xl mb-6">
                Ready to streamline your mobile service business?
              </h2>
              <p className="mt-4 text-lg leading-6 text-gray-700 max-w-3xl mx-auto mb-8">
                Start your free trial today and see how our House Call service can help you save time, reduce travel costs, and serve more customers.
              </p>
              <Link
                href="/auth/signup?service_type=House+Call"
                className="beesly-button beesly-button-yellow inline-flex items-center justify-center px-8 py-3"
              >
                Start Your Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 
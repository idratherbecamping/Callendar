'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon, CalendarIcon, UsersIcon, VideoCameraIcon, CheckIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OfficeServicesPage() {
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
              Voicemail that Books Appointments for You
              </h1>
              {/* <p className="text-lg md:text-xl text-gray-300 mb-5">
                Voicemail that Books Appointments for You
              </p> */}

              <p className="text-lg text-gray-300 mb-8">
              Callendar is an <span className="text-beeslyYellow font-semibold">AI-powered voicemail system</span> that automatically books appointments for your business. When clients call, they're routed to our <span className="text-beeslyYellow font-semibold">AI scheduling assistant</span> that checks your calendar availability, and books the appointment for you - <span className="text-beeslyYellow font-semibold">all without you having to pick up the phone</span>.
              </p>
              
              <p className="text-lg text-gray-300 mb-8">
                Ideal for barbers, salons, estheticians, accountants, consultants, or any business where clients visit 
                your office or connect with you virtually. Simple calendar booking without the hassle.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <Link 
                  href="/auth/signup?service_type=Scheduler" 
                  className="beesly-button beesly-button-secondary w-48 h-12 flex items-center justify-center"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full h-80 md:h-[500px] rounded-lg overflow-hidden shadow-xl">
                {/* Display office image */}
                <img 
                  src="/ad_barber.png" 
                  alt="Office services" 
                  className="w-full h-full object-contain"
                />
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
              Streamlined Booking for Your Business
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="beesly-card beesly-card-hover">
              <div className="h-12 w-12 rounded-md bg-beeslyYellow flex items-center justify-center mb-4">
                <CalendarIcon className="h-6 w-6 text-black" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium text-heading mb-3">Simple Calendar Management</h3>
              <p className="text-gray-400 mb-4">
                Works with your existing <span className="text-beeslyYellow font-semibold">Acuity Scheduling</span> or <span className="text-beeslyYellow font-semibold">Google Calendar</span>. 
              </p>
              <div className="flex items-center justify-center space-x-4 mt-2">
                <img src="/acuity-logo-final.svg" alt="Acuity Scheduling" className="h-8 filter brightness-500 invert" />
                <img src="/gmail_logo.png" alt="Google Calendar" className="h-8 filter brightness-150" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="beesly-card beesly-card-hover">
              <div className="h-12 w-12 rounded-md bg-beeslyYellow flex items-center justify-center mb-4">
                <UsersIcon className="h-6 w-6 text-black" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium text-heading mb-3">Client Self-Booking</h3>
              <p className="text-gray-400">
                Let clients <span className="text-beeslyYellow font-semibold">book their own appointments over the phone </span>  based on your availability. Reduce back-and-forth communication and phone calls.
              </p>
            </div>

            {/* Feature 3 */}
            {/* <div className="beesly-card beesly-card-hover">
              <div className="h-12 w-12 rounded-md bg-beeslyYellow flex items-center justify-center mb-4">
                <VideoCameraIcon className="h-6 w-6 text-black" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium text-heading mb-3">Virtual Meeting Support</h3>
              <p className="text-gray-400">
                Automatically send meeting links for virtual appointments. Seamless integration with popular video conferencing tools.
              </p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Barber Services Section */}
      <section className="beesly-section bg-beeslyDark relative py-16">
        <div className="beesly-container">
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="w-full md:w-3/4 text-center">
              <h2 className="text-3xl font-bold text-heading mb-6">
                Perfect for Barbers and Salons
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Streamline your booking process and focus on what matters most - your clients. 
                Let them book appointments 24/7, even when you're busy with other clients.
              </p>
              <ul className="space-y-4 max-w-xl mx-auto text-left">
                {[
                  'Automated appointment reminders',
                  'Flexible scheduling options',
                  'Client self-booking',
                  'Links to your Acuity or Google Calendar'
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <CheckIcon className="h-5 w-5 text-beeslyYellow mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
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
              <h3 className="text-xl font-medium text-heading mb-6">Who Uses Office & Virtual Services?</h3>
              <ul className="space-y-4">
                {[
                  'Hair salons and barbers',
                  'Consultants and coaches',
                  'Financial advisors and accountants',
                  'Massage therapists',
                  'Dental and medical practices',
                  'Tutors and educators',
                  'Legal professionals',
                  'Counselors and therapists'
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
                    <span className="text-gray-300">{item}</span>
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
                  'Reduce scheduling headaches with automated booking',
                  'Let clients book 24/7 over the phone',
                  'Send automatic appointment reminders',
                  'Customize your availability',
                  'Syncs with Acuity and Google Calendar to let clients book over the phone',
                  // 'Accept payments at time of booking',
                  // 'Create service packages and offerings',
                  // 'Track client history and preferences',
                  // 'Generate reports on appointment metrics'
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
                    <span className="text-gray-300">{item}</span>
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
                Ready to streamline your booking process?
              </h2>
              <p className="mt-4 text-lg leading-6 text-gray-300 max-w-3xl mx-auto mb-8">
                Start your free trial today and see how our Office & Virtual service can help you manage appointments effortlessly.
              </p>
              <Link
                href="/auth/signup?service_type=Scheduler"
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
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, TruckIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import ScrollAnimation from '@/components/ScrollAnimation';
import BackToTop from '@/components/BackToTop';

export default function ServicesPage() {
  // For fallback to ensure animations work on all browsers
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      const elements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-right, .slide-in-left');
      elements.forEach((el) => {
        el.classList.add('appear');
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-beeslyDark">
      <Navbar />

      {/* Hero Section */}
      <ScrollAnimation animationClass="fade-in">
        <div className="bg-gradient-to-r from-beeslyDark to-beeslyDark/90 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Choose Your Service Type
              </h1>
              <p className="mt-4 text-xl text-gray-700 max-w-3xl mx-auto">
                We offer specialized solutions for different business models. Select the option that best fits your needs.
              </p>
            </div>
          </div>
        </div>
      </ScrollAnimation>

      {/* Service Type Selection */}
      <ScrollAnimation animationClass="slide-up">
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              
              {/* House Call Service */}
              <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl bg-beeslyDark/50 backdrop-blur-sm">
                <div className="relative h-60 bg-gradient-to-r from-indigo-600 to-indigo-800 flex items-center justify-center">
                  <TruckIcon className="h-24 w-24 text-white" aria-hidden="true" />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white">House Call Services</h2>
                  <p className="mt-2 text-gray-700">
                    For services provided at your customers' locations (pool cleaners, plumbers, etc.). 
                    Manage travel time and distance for optimal scheduling.
                  </p>
                  <div className="mt-6 border-t border-gray-700 pt-6">
                    <p className="font-medium text-white">Ideal for:</p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                      <li>• Pool cleaners and maintenance</li>
                      <li>• Plumbers and electricians</li>
                      <li>• Home cleaning services</li>
                      <li>• In-home healthcare providers</li>
                      <li>• Mobile pet groomers</li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/services/house-call"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-beeslyDark bg-beeslyYellow hover:bg-beeslyYellow/90 transition-colors"
                    >
                      Learn More
                      <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Office Service */}
              <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl bg-beeslyDark/50 backdrop-blur-sm">
                <div className="relative h-60 bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center">
                  <CalendarIcon className="h-24 w-24 text-white" aria-hidden="true" />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white">Office & Virtual Services</h2>
                  <p className="mt-2 text-gray-700">
                    For services where customers come to you or meet virtually. Focuses on calendar 
                    booking without travel calculations.
                  </p>
                  <div className="mt-6 border-t border-gray-700 pt-6">
                    <p className="font-medium text-white">Ideal for:</p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                      <li>• Hair salons and barbers</li>
                      <li>• Consultants and coaches</li>
                      <li>• Financial advisors</li>
                      <li>• Massage therapists</li>
                      <li>• Counselors and therapists</li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/services/office"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-beeslyDark bg-beeslyYellow hover:bg-beeslyYellow/90 transition-colors"
                    >
                      Learn More
                      <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollAnimation>
      
      {/* Quick Comparison */}
      <ScrollAnimation animationClass="slide-up">
        <div className="py-16 bg-beeslyDark/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white text-center mb-12">
              Quick Comparison
            </h2>
            
            <div className="overflow-hidden shadow ring-1 ring-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-beeslyDark/80">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Feature</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">House Call Services</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Office & Virtual Services</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-beeslyDark/50">
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">Customer location</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">You travel to them</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">They come to you / Virtual</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">Travel optimization</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">Yes</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">No</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">Calendar management</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">Yes</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">Yes</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">Client booking</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">Yes</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">Yes</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">Video call integration</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">No</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ScrollAnimation>
      
      {/* CTA Section */}
      <ScrollAnimation animationClass="fade-in">
        <div className="bg-beeslyDark/80">
          <div className="max-w-2xl mx-auto text-center py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Still not sure which to choose?</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-gray-700">
              Contact our team for a personalized recommendation based on your business needs.
            </p>
            <a
              href="mailto:support@beesly.ai"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-beeslyDark bg-beeslyYellow hover:bg-beeslyYellow/90 transition-colors sm:w-auto"
            >
              Contact Us
            </a>
          </div>
        </div>
      </ScrollAnimation>

      <BackToTop />
    </main>
  );
} 
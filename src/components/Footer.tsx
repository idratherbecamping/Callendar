"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="gradient-bg-dark pt-16 pb-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      </div>
      
      <div className="beesly-container relative z-10">
        <div className="flex justify-between flex-col md:flex-row gap-8 mb-12">
          <div className="flex flex-wrap gap-6">
            <Link href="#Hero" className="text-gray-400 hover:text-white transition-colors duration-300">
              Back To Top
            </Link>
            <Link href="#Features" className="text-gray-400 hover:text-white transition-colors duration-300">
              Features
            </Link>
            <Link href="#WhoItsFor" className="text-gray-400 hover:text-white transition-colors duration-300">
              Who It's For
            </Link>
            <Link href="#HIW" className="text-gray-400 hover:text-white transition-colors duration-300">
              How It Works
            </Link>
            <Link href="#Pricing" className="text-gray-400 hover:text-white transition-colors duration-300">
              Pricing
            </Link>
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <a
              href="mailto:gannon@callendar.ai?subject=Callendar%20Website"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              Email Us
            </a>
          </div>

          {/* <div className="flex gap-4">
            <a
              href="https://discord.gg/fuKMKxXK4u"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </a>
            <a
              href="http://www.youtube.com/@Olimi_AI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <path d="m10 15 5-3-5-3z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/beeslyai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div> */}
        </div>


        {/* <div className="mt-8">
          <h3 className="text-sm font-semibold mb-4">Download Callendar AI App</h3>
          <div className="flex gap-4">
            <a
              href="https://apps.apple.com/us/app/Callendar-ai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn.prod.website-files.com/65dcec5d9dc79e5ffc90635b/666972bab028cec7236cca7f_Download%20App%20Button-1.svg"
                alt="Download on App Store"
                width={140}
                height={40}
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.olimi.Callendar"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn.prod.website-files.com/65dcec5d9dc79e5ffc90635b/666972ba55260b91a1c8c86c_Download%20App%20Button.svg"
                alt="Get it on Google Play"
                width={140}
                height={40}
              />
            </a>
          </div>
        </div> */}

        <div className="mt-8 glass-morphism-dark rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-center">
            <div className="text-gray-400 font-medium mr-3">Call Callendar AI:</div>
            <a
              href="tel:+18775704990"
              className="text-gradient-accent hover:text-gradient-vibrant font-bold text-xl transition-all duration-300"
            >
              (877) 570-4990
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

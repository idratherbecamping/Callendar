"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trackButtonClick, trackDemoRequest } from "@/lib/analytics";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

// Add classNames utility function
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface IndustryCategory {
  name: string;
  path: string;
}

interface IndustryCategories {
  houseCalls: IndustryCategory[];
  officeVirtual: IndustryCategory[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  industryCategories: IndustryCategories;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, industryCategories }) => {
  const [whoItsForExpanded, setWhoItsForExpanded] = useState(false);
  
  const handleDemoClick = () => {
    trackDemoRequest('mobile_menu');
    onClose();
  };

  const handleSignUpClick = () => {
    trackButtonClick('Sign Up', { location: 'mobile_menu' });
    onClose();
  };

  const toggleWhoItsForExpanded = () => {
    setWhoItsForExpanded(!whoItsForExpanded);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`mobile-menu-overlay ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Menu */}
      <div
        className={`mobile-menu ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <img
              src="/callendar_ai_logo_no_bg.png"
              alt="Callendar.ai Logo"
              width={24}
              height={24}
              className="mr-2"
            />
            <span className="text-lg font-bold text-black">Callendar.ai</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>

        <nav className="flex flex-col space-y-4">
          {/* <Link
            href="#Features"
            className="text-gray-700 hover:text-black py-2 px-3 rounded-md hover:bg-gray-100 transition-all"
            onClick={onClose}
          >
            Features
          </Link> */}
          
          {/* Who It's For section with submenu */}
          <div>
            <button 
              onClick={toggleWhoItsForExpanded}
              className="text-gray-700 hover:text-black py-2 px-3 rounded-md hover:bg-gray-100 transition-all w-full text-left flex justify-between items-center"
            >
              <span>Who It's For</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${whoItsForExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {whoItsForExpanded && (
              <div className="ml-4 mt-2 space-y-4 border-l-2 border-gray-200 pl-4">
                <div className="border-b border-gray-200 pb-3">
                  <Link 
                    href="/services/office" 
                    className="block mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    onClick={onClose}
                  >
                    Office & Virtual
                  </Link>
                  <div className="grid grid-cols-1 gap-2">
                    {industryCategories.officeVirtual.map((industry, index) => (
                      <Link
                        key={index}
                        href={industry.path}
                        className="block py-1 text-sm text-gray-700 hover:bg-green-100 rounded px-2"
                        onClick={onClose}
                      >
                        {industry.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Link 
                    href="/services/house-call" 
                    className="block mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    onClick={onClose}
                  >
                    House Call Services
                  </Link>
                  <div className="grid grid-cols-1 gap-2">
                    {industryCategories.houseCalls.map((industry, index) => (
                      <Link
                        key={index}
                        href={industry.path}
                        className="block py-1 text-sm text-gray-700 hover:bg-indigo-100 rounded px-2"
                        onClick={onClose}
                      >
                        {industry.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Link
            href="/#HIW"
            className="text-gray-700 hover:text-black py-2 px-3 rounded-md hover:bg-gray-100 transition-all"
            onClick={onClose}
          >
            How It Works
          </Link>
          <Link
            href="/#Pricing"
            className="text-gray-700 hover:text-black py-2 px-3 rounded-md hover:bg-gray-100 transition-all"
            onClick={onClose}
          >
            Pricing
          </Link>
          {/* <Link
            href="#FAQs"
            className="text-gray-700 hover:text-black py-2 px-3 rounded-md hover:bg-gray-100 transition-all"
            onClick={onClose}
          >
            FAQs
          </Link> */}
        </nav>

        <div className="mt-8 space-y-4">
          <a
            href="mailto:gannon@callendar.ai?subject=Demo%20Request%20for%20Callendar.ai"
            className="block"
            onClick={handleDemoClick}
          >
            <Button
              className="beesly-button beesly-button-secondary w-full"
            >
              Schedule a Demo
            </Button>
          </a>
          <Link href="/auth/signin" onClick={onClose}>
            <Button
              variant="outline"
              className="beesly-button beesly-button-secondary w-full"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup" onClick={handleSignUpClick}>
            <Button
              className="beesly-button beesly-button-primary w-full"
            >
              Sign Up
            </Button>
          </Link>
        </div>

        <div className="mt-auto pt-8">
          <div className="text-gray-500 text-sm">
            © 2024 Callendar AI
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;

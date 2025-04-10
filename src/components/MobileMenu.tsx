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
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [whoItsForExpanded, setWhoItsForExpanded] = useState(false);
  const [houseCallsExpanded, setHouseCallsExpanded] = useState(false);
  const [officeVirtualExpanded, setOfficeVirtualExpanded] = useState(false);
  const [expanded, setExpanded] = useState({
    forWho: false,
    officeVirtual: false,
    houseCalls: false,
  });
  
  const handleDemoClick = () => {
    trackDemoRequest('mobile_menu');
    onClose();
  };

  const handleSignUpClick = () => {
    trackButtonClick('Sign Up', { location: 'mobile_menu' });
    onClose();
  };

  const toggleServicesExpanded = () => {
    setServicesExpanded(!servicesExpanded);
    if (whoItsForExpanded) setWhoItsForExpanded(false);
  };

  const toggleWhoItsForExpanded = () => {
    setWhoItsForExpanded(!whoItsForExpanded);
    if (servicesExpanded) setServicesExpanded(false);
  };

  const toggleHouseCallsExpanded = () => {
    setHouseCallsExpanded(!houseCallsExpanded);
  };

  const toggleOfficeVirtualExpanded = () => {
    setOfficeVirtualExpanded(!officeVirtualExpanded);
  };

  const toggleExpanded = (section: string) => {
    setExpanded({
      ...expanded,
      [section]: !expanded[section as keyof typeof expanded],
    });
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
            <span className="text-lg font-bold text-white">Callendar.ai</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
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
          <Link
            href="#Features"
            className="text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-secondary/30 transition-all"
            onClick={onClose}
          >
            Features
          </Link>
          
          {/* Services section with submenu */}
          <div>
            <button
              className="text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-secondary/30 transition-all w-full text-left flex justify-between items-center"
              onClick={toggleServicesExpanded}
            >
              <span>Services</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${servicesExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {servicesExpanded && (
              <div className="ml-4 mt-2 space-y-2 border-l-2 border-secondary/30 pl-4">
                <Link
                  href="/services/office"
                  className="text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-secondary/30 transition-all block"
                  onClick={onClose}
                >
                  Office & Virtual Services
                </Link>
                <Link
                  href="/services/house-call"
                  className="text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-secondary/30 transition-all block"
                  onClick={onClose}
                >
                  House Call Services
                </Link>
              </div>
            )}
          </div>
          
          {/* Who It's For section with submenu */}
          <div>
            <button
              type="button"
              onClick={() => toggleExpanded("forWho")}
              className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
              aria-expanded={expanded.forWho}
            >
              Who It's For
              <ChevronDownIcon
                className={classNames(
                  expanded.forWho ? "rotate-180" : "",
                  "h-5 w-5 flex-none"
                )}
                aria-hidden="true"
              />
            </button>
            <div className={classNames(expanded.forWho ? "" : "hidden")}>
              {/* Office & Virtual Services */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleExpanded("officeVirtual")}
                  className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  aria-controls="disclosure-1"
                  aria-expanded={expanded.officeVirtual}
                >
                  <Link 
                    href="/services/office"
                    className="flex-grow text-left"
                    onClick={onClose}
                  >
                    Office & Virtual Services
                  </Link>
                  <ChevronDownIcon
                    className={classNames(
                      expanded.officeVirtual ? "rotate-180" : "",
                      "h-5 w-5 flex-none"
                    )}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={classNames(
                    expanded.officeVirtual ? "" : "hidden",
                    "mt-2 space-y-2 pl-6"
                  )}
                  id="disclosure-1"
                >
                  {industryCategories.officeVirtual.map((item, index) => (
                    <a
                      key={index}
                      href={item.path}
                      className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* House Call Services */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleExpanded("houseCalls")}
                  className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  aria-controls="disclosure-2"
                  aria-expanded={expanded.houseCalls}
                >
                  <Link 
                    href="/services/house-call"
                    className="flex-grow text-left"
                    onClick={onClose}
                  >
                    House Call Services
                  </Link>
                  <ChevronDownIcon
                    className={classNames(
                      expanded.houseCalls ? "rotate-180" : "",
                      "h-5 w-5 flex-none"
                    )}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={classNames(
                    expanded.houseCalls ? "" : "hidden",
                    "mt-2 space-y-2 pl-6"
                  )}
                  id="disclosure-2"
                >
                  {industryCategories.houseCalls.map((item, index) => (
                    <a
                      key={index}
                      href={item.path}
                      className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <Link
            href="#HIW"
            className="text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-secondary/30 transition-all"
            onClick={onClose}
          >
            How It Works
          </Link>
          <Link
            href="#Pricing"
            className="text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-secondary/30 transition-all"
            onClick={onClose}
          >
            Pricing
          </Link>
          {/* <Link
            href="#FAQs"
            className="text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-secondary/30 transition-all"
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

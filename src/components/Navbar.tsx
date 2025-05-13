"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MobileMenu from "./MobileMenu";
import { trackButtonClick, trackDemoRequest } from "@/lib/analytics";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [whoItsForDropdownOpen, setWhoItsForDropdownOpen] = useState(false);

  // Define the industry categories for the dropdown menu
  const industryCategories = {
    officeVirtual: [
      { name: "Barbers & Salons", path: "/services/office" },
      { name: "Financial Advisors", path: "/services/office" },
      { name: "Accountants", path: "/services/office" },
    ],
    houseCalls: [
      { name: "Pool Cleaners", path: "/services/house-call" },
      { name: "Plumbers", path: "/services/house-call" },
    ],
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Prevent body from scrolling when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // Close the dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.services-dropdown')) {
        setServicesDropdownOpen(false);
      }
      if (!target.closest('.who-its-for-dropdown')) {
        setWhoItsForDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleServicesDropdown = () => {
    setServicesDropdownOpen(!servicesDropdownOpen);
    if (whoItsForDropdownOpen) setWhoItsForDropdownOpen(false);
  };

  const toggleWhoItsForDropdown = () => {
    setWhoItsForDropdownOpen(!whoItsForDropdownOpen);
    if (servicesDropdownOpen) setServicesDropdownOpen(false);
  };

  const handleDemoClick = () => {
    trackDemoRequest('navbar');
  };

  const handleSignUpClick = () => {
    trackButtonClick('Sign Up', { location: 'navbar' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-beeslyDark/80 backdrop-blur-md py-2 shadow-lg" : "py-4"
        }`}
      >
        <div className="beesly-container flex justify-between items-center">
          <Link href="/" className="flex items-center hover-scale">
            <img
              src="/callendar_ai_logo_no_bg.png"
              alt="Callendar.ai Logo"
              width={30}
              height={30}
              className="mr-2"
            />
            <span className="text-xl font-bold text-white">Callendar.ai</span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            {/* <Link
              href="#Features"
              className="text-gray-300 hover:text-white transition-colors hover:underline hover:underline-offset-4 decoration-beeslyYellow"
            >
              Features
            </Link> */}
            
            {/* Services Dropdown */}
            {/* <div className="relative services-dropdown">
              <button 
                onClick={toggleServicesDropdown}
                className="text-gray-300 hover:text-white transition-colors hover:underline hover:underline-offset-4 decoration-beeslyYellow flex items-center"
              >
                Services
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ml-1 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {servicesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      href="/services/office"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-100"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      Office & Virtual Services
                    </Link>
                    <Link
                      href="/services/house-call"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      House Call Services
                    </Link>
                  </div>
                </div>
              )}
            </div> */}
            
            {/* Who It's For Dropdown */}
            <div className="relative who-its-for-dropdown">
              <button 
                onClick={toggleWhoItsForDropdown}
                className="text-gray-300 hover:text-white transition-colors hover:underline hover:underline-offset-4 decoration-beeslyYellow flex items-center"
              >
                Who It's For
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ml-1 transition-transform ${whoItsForDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {whoItsForDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-2 px-3" role="menu" aria-orientation="vertical">
                    <div className="border-b border-gray-200 pb-2 mb-1">
                      <Link 
                        href="/services/office" 
                        className="block mb-1"
                        onClick={() => setWhoItsForDropdownOpen(false)}
                      >
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700">Office & Virtual</span>
                      </Link>
                      <div className="mt-1 grid grid-cols-2 gap-1">
                        {industryCategories.officeVirtual.map((industry, index) => (
                          <Link
                            key={index}
                            href={industry.path}
                            className="block px-2 py-1 text-sm text-gray-700 hover:bg-green-100 rounded"
                            onClick={() => setWhoItsForDropdownOpen(false)}
                          >
                            {industry.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Link 
                        href="/services/house-call" 
                        className="block mb-1"
                        onClick={() => setWhoItsForDropdownOpen(false)}
                      >
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700">House Call Services</span>
                      </Link>
                      <div className="mt-1 grid grid-cols-2 gap-1">
                        {industryCategories.houseCalls.map((industry, index) => (
                          <Link
                            key={index}
                            href={industry.path}
                            className="block px-2 py-1 text-sm text-gray-700 hover:bg-indigo-100 rounded"
                            onClick={() => setWhoItsForDropdownOpen(false)}
                          >
                            {industry.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Link
              href="/#HIW"
              className="text-gray-300 hover:text-white transition-colors hover:underline hover:underline-offset-4 decoration-beeslyYellow"
            >
              How It Works
            </Link>
            <Link
              href="/#Pricing"
              className="text-gray-300 hover:text-white transition-colors hover:underline hover:underline-offset-4 decoration-beeslyYellow"
            >
              Pricing
            </Link>
            {/* <Link
              href="#FAQs"
              className="text-gray-300 hover:text-white transition-colors hover:underline hover:underline-offset-4 decoration-beeslyYellow"
            >
              FAQs
            </Link> */}
          </div>

          <div className="hidden md:flex space-x-4">
            <a
              href="mailto:gannon@callendar.ai?subject=Demo%20Request%20for%20Callendar.ai"
              className="beesly-button beesly-button-secondary rounded-xl px-6 py-2"
              onClick={handleDemoClick}
            >
              Schedule a Demo
            </a>
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className="beesly-button beesly-button-secondary rounded-xl px-6 py-2"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup" onClick={handleSignUpClick}>
              <Button
                className="beesly-button beesly-button-primary rounded-xl px-6 py-2"
              >
                Sign Up
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-secondary/40 hover:text-beeslyYellow transition-all duration-300"
              onClick={toggleMobileMenu}
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
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        industryCategories={industryCategories}
      />
    </>
  );
};

export default Navbar;

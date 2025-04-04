"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
            <Link
              href="#Features"
              className="text-gray-300 hover:text-white transition-colors hover:underline hover:underline-offset-4 decoration-beeslyYellow"
            >
              Features
            </Link>
            <Link
              href="#WhoItsFor"
              className="text-gray-300 hover:text-white transition-colors hover:underline hover:underline-offset-4 decoration-beeslyYellow"
            >
              Who It's For
            </Link>
            <Link
              href="#HIW"
              className="text-gray-300 hover:text-white transition-colors hover:underline hover:underline-offset-4 decoration-beeslyYellow"
            >
              How It Works
            </Link>
            <Link
              href="#Pricing"
              className="text-gray-300 hover:text-white transition-colors hover:underline hover:underline-offset-4 decoration-beeslyYellow"
            >
              Pricing
            </Link>
            <Link
              href="#FAQs"
              className="text-gray-300 hover:text-white transition-colors hover:underline hover:underline-offset-4 decoration-beeslyYellow"
            >
              FAQs
            </Link>
          </div>

          <div className="hidden md:flex space-x-4">
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className="beesly-button beesly-button-secondary rounded-xl px-6 py-2"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
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
      />
    </>
  );
};

export default Navbar;

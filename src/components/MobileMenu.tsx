"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
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
          <Link
            href="#WhoItsFor"
            className="text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-secondary/30 transition-all"
            onClick={onClose}
          >
            Who It's For
          </Link>
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
          <Link
            href="#FAQs"
            className="text-gray-300 hover:text-white py-2 px-3 rounded-md hover:bg-secondary/30 transition-all"
            onClick={onClose}
          >
            FAQs
          </Link>
        </nav>

        <div className="mt-8 space-y-4">
          <Link href="/auth/signin" onClick={onClose}>
            <Button
              variant="outline"
              className="beesly-button beesly-button-secondary w-full"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup" onClick={onClose}>
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

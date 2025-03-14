"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section id="Hero" className="pt-36 pb-24 relative overflow-hidden">
      <div className="absolute w-full h-full top-0 left-0 bg-beeslyDark z-0"></div>

      {/* Honeycomb SVG Background */}
      <div className="absolute w-full h-full top-0 left-0 z-0 opacity-10">
        <img
          src="https://web-assets.same.dev/3660985521/15669422.svg+xml"
          alt="Honeycomb background"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="beesly-container relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-heading">
          Callendar. Your AI Voice <br /> Mail Assistant
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12">
          Elevate your communication with smart, efficient, and personalised responses.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-5 mb-20">
          <Button className="beesly-button beesly-button-secondary w-48 h-12">
            Test Call
          </Button>
          <Button className="beesly-button beesly-button-primary w-48 h-12 flex items-center gap-2">
            Download the beesly app
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 15V3"></path>
              <path d="m8 11 4 4 4-4"></path>
              <path d="M8 21h8"></path>
              <path d="M12 17v4"></path>
            </svg>
          </Button>
        </div>

        {/* Hero Image - Phone */}
        <div className="relative h-72 md:h-96 max-w-md mx-auto mb-16">
          <Image
            src="https://web-assets.same.dev/77499892/3772306543.png"
            alt="Beesly App Interface"
            fill
            className="object-contain"
          />
        </div>

        {/* Partner logos */}
        <div className="flex flex-wrap justify-center items-center gap-8 mt-12">
          <Image
            src="https://web-assets.same.dev/140580300/1058212857.png"
            alt="OE logo"
            width={120}
            height={40}
            className="opacity-70 hover:opacity-100 transition-opacity hover-scale"
          />
          <Image
            src="https://web-assets.same.dev/297241517/1240148322.png"
            alt="The Paak logo"
            width={120}
            height={40}
            className="opacity-70 hover:opacity-100 transition-opacity hover-scale"
          />
        </div>

        <div className="mt-16">
          <span className="beesly-section-title">Voicemail Redefined</span>
          <p className="text-gray-300 max-w-3xl mx-auto mt-5 leading-relaxed">
            Since the 1970s, voicemail technology has hardly changed, failing to keep pace with our communication evolution.
            It's time for a revolution. Our solution reimagines voicemail to be more personalized and efficient,
            perfectly aligning with the demands of modern businesses and the busy individual.
            Welcome to the future of voicemail, where every call counts and no message goes unnoticed.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

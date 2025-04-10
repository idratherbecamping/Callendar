"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const PricingSection = () => {
  const features = [
    "First 14 days FREE",
    "Cancel anytime",
    "Pays for itself with 1 missed opportunity",
    "No contracts",
    "Big business tools, small business price",
    
  ];

  return (
    <section id="Pricing" className="beesly-section beesly-section-spacer bg-beeslyDark">
      <div className="beesly-container">
        <div className="text-center mb-20">
          <span className="beesly-section-title">
            Pricing
          </span>
          <h2 className="beesly-section-heading">
            Introducing Our Pro Plan
          </h2>
          <div className="flex flex-wrap justify-center gap-10 mt-8">
            <div className="max-w-[200px]">
              {/* <h3 className="font-semibold text-lg">For Personal Use</h3>
              <p className="text-gray-400 text-sm mt-3">
                Ideal for streamlining your day-to-day life.
              </p> */}
            </div>
            <div className="max-w-[200px]">
              <h3 className="font-semibold text-lg">For Small Businesses like yours!</h3>
              <p className="text-gray-400 text-sm mt-3">
                Never miss an opportunity again.
              </p>
            </div>
          </div>
        </div>

        <Card className="beesly-card beesly-card-hover max-w-md mx-auto">
          <CardHeader className="text-center pb-4">
            <span className="text-beeslyYellow text-sm font-medium">
              Free Plan
            </span>
            <CardTitle className="mt-3 text-2xl">
              Signup for Callendar AI for free now!
            </CardTitle>
            <div className="mt-6 flex justify-center items-baseline">
              <span className="text-4xl font-bold">$30</span>
              <span className="text-gray-400 ml-1">/mo</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">For a Limited time!</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 group hover-lift transition-all duration-300">
                  <div className="text-beeslyYellow group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full mt-10 beesly-button-yellow h-12 text-base">
              <Link href="/auth/signup" className="w-full">
                Signup Now
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PricingSection;

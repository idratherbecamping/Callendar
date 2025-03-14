"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <Card className="beesly-card beesly-card-hover h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{description}</p>
      </CardContent>
    </Card>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      title: "Summarised Call",
      description:
        "Get concise summaries of your calls. Quickly catch up on missed conversations with AI-powered insights, making every message clear and actionable.",
    },
    {
      title: "Get Notified",
      description:
        "Instant notifications for every call, with critical alerts even in silent mode. Stay connected to what's important without missing a beat.",
    },
    {
      title: "Anytime Availability",
      description:
        "Keep your business open 24/7 without extra work. Capture every inquiry, day or night, ensuring no customer or important call is ever lost.",
    },
    {
      title: "Calendar Management",
      description:
        "Automate your schedule with AI that manages events during calls. Create, edit, and delete appointments instantly.",
    },
    {
      title: "Caller Memory & Context",
      description:
        "Our AI remembers past callers and context, personalising responses and actions for future interactions.",
    },
  ];

  const additionalFeatures = [
    "Unlimited Calls",
    "train your agent",
    "Play Back Messages",
    "Call Summary Notification",
    "Critical Alerts",
  ];

  return (
    <section id="Features" className="beesly-section bg-beeslyDark relative">
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
            Sublime Features
          </span>
          <h2 className="beesly-section-heading">
            Revolutionizing Your Call Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-5 md:gap-10 mt-20">
          {additionalFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-gray-300 hover-lift hover-bright"
            >
              <div className="w-4 h-4 bg-beeslyYellow rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
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
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

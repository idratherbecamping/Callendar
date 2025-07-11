"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StepCard = ({ number, title, description }: { number: number; title: string; description: string }) => {
  return (
    <Card className="beesly-card beesly-card-hover h-full relative">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-beeslyYellow w-8 h-8 rounded-full flex items-center justify-center text-black font-bold hover-glow">
            {number}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{description}</p>
      </CardContent>
    </Card>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "Input your business information",
      description:
        "Add some information about yourself or your business to give the AI Agent some context when receiving calls.",
    },
    {
      number: 2,
      title: "Connect Calendar",
      description:
        "Connect your Google Calendar, Acuity Calendar, or Square Calendar to allow the AI to view, edit and create events for you when it is scheduled on the call.",
    },
    {
      number: 3,
      title: "Connect Number",
      description:
        "Connect your phone number to Callendar AI so that we can answer your missed calls and book appointments for you OR use one of our dedicated business numbers for your company.",
    },
  ];

  return (
    <section id="HIW" className="beesly-section beesly-section-spacer bg-beeslyDark relative">
      <div className="beesly-container">
        <div className="text-center mb-20">
          <span className="beesly-section-title">
            How It Works
          </span>
          <h2 className="beesly-section-heading">
            Connect With Callendar In Under 90 Seconds
          </h2>
        </div>

        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-lg text-gray-700">
            Callendar is an <span className="text-beeslyYellow font-semibold">AI-powered voicemail system</span> that automatically books appointments for your business. When clients call, they're routed to our <span className="text-beeslyYellow font-semibold">AI scheduling assistant</span> that checks your calendar availability, and books the appointment for you - <span className="text-beeslyYellow font-semibold">all without you having to pick up the phone</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

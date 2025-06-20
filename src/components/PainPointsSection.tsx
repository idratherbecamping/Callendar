"use client";

import React from "react";
import { Card } from "@/components/ui/card";

const PainPointsSection = () => {
  const painPoints = [
    {
      emoji: "😤",
      title: "Interrupting Your Work",
      before: "Stopping mid-haircut to answer calls",
      after: "Focus 100% on your craft"
    },
    {
      emoji: "📵",
      title: "Missing Opportunities",
      before: "Voicemail = lost business",
      after: "Every call answered, every opportunity captured"
    },
    {
      emoji: "😰",
      title: "Playing Phone Tag",
      before: "Endless callbacks and scheduling conflicts",
      after: "Appointments booked automatically"
    },
    {
      emoji: "🤯",
      title: "Double Bookings",
      before: "Manual scheduling mistakes",
      after: "Perfect calendar synchronization"
    }
  ];

  return (
    <section className="py-16 bg-black/20">
      <div className="beesly-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            We Know Your Daily Struggles
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            You're not just cutting hair - you're running a business. Let us handle the phone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {painPoints.map((point, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800 p-6 hover:border-beeslyYellow/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{point.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3">{point.title}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">❌</span>
                      <span className="text-gray-400">{point.before}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✅</span>
                      <span className="text-green-400">{point.after}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-400 mb-4">
            Join business owners who've reclaimed their time
          </p>
          <div className="inline-flex items-center gap-3 bg-beeslyYellow/10 px-6 py-3 rounded-full">
            <span className="text-beeslyYellow text-2xl">⏰</span>
            <span className="text-beeslyYellow font-semibold">
              Average time saved: 2 hours per day
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainPointsSection;
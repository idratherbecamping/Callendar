"use client";

import React from "react";
import { Card } from "@/components/ui/card";

const StatsDisplay = () => {
  const stats = [
    { number: "430", label: "Average Calls Handled Per Month", icon: "📞" },
    { number: "5", label: "Appointments Booked", icon: "✂️" },
    { number: "$325", label: "Revenue Saved", icon: "💰" },
    { number: "0", label: "Hours on Phone", icon: "⏰" }
  ];

  return (
    <div className="bg-gradient-to-r from-beeslyDark to-gray-900 p-8 rounded-xl shadow-2xl border border-beeslyYellow/20">
      <div className="text-center mb-6">
        <p className="text-beeslyYellow text-sm font-semibold uppercase tracking-wider">Real Customer Data</p>
        <h3 className="text-2xl font-bold text-white mt-2">Last Month at Arsenal Barber</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-4 rounded-lg bg-black/20 backdrop-blur">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-beeslyYellow">{stat.number}</div>
            <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <p className="text-center text-gray-400 text-sm mt-6">
        That's 5.5 calls handled every single day - automatically
      </p>
    </div>
  );
};

export default StatsDisplay;
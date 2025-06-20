"use client";

import React from "react";

const TrustBar = () => {
  const trustItems = [
    {
      icon: "📞",
      text: "430+ Calls Managed Monthly"
    },
    {
      icon: "📈",
      text: "Proven Results"
    },
    {
      icon: "⚡",
      text: "5-Minute Setup"
    },
    {
      icon: "💰",
      text: "7 Days Free"
    }
  ];

  return (
    <div className="bg-black/50 backdrop-blur border-b border-gray-800">
      <div className="beesly-container py-3">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
          {trustItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{item.icon}</span>
              <span className="text-gray-300 font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
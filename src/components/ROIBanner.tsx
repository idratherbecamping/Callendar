"use client";

import React from "react";

const ROIBanner = () => {
  return (
    <div className="bg-gradient-to-r from-beeslyYellow to-yellow-600 p-8 rounded-xl shadow-2xl">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">
              Simple Math for Smart Business Owners
            </h3>
            <div className="bg-black/10 rounded-lg p-6 backdrop-blur">
              <div className="flex items-center justify-center gap-4 text-black">
                <div className="text-center">
                  <p className="text-3xl font-bold">$80</p>
                  <p className="text-sm">Average Service</p>
                </div>
                <span className="text-2xl">−</span>
                <div className="text-center">
                  <p className="text-3xl font-bold">$40</p>
                  <p className="text-sm">Monthly Cost (per calendar)</p>
                </div>
                <span className="text-2xl">=</span>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-800">$40</p>
                  <p className="text-sm font-semibold">Profit from ONE saved appointment*</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-black">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">Pays for itself with just 1 booking*</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">Everything else is pure profit</span>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-black/70">*Based on current customer averages. Results may vary.</p>
        </div>
      </div>
    </div>
  );
};

export default ROIBanner;
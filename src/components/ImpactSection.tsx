"use client";

import React, { useEffect, useRef, useState } from "react";

const StatCard = ({ number, label, prefix = "", suffix = "", delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const stepValue = number / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += stepValue;
        if (current >= number) {
          setCount(number);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, number, delay]);

  return (
    <div ref={cardRef} className="text-center">
      <div className="text-5xl md:text-6xl font-bold text-gradient mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <p className="text-gray-400 text-lg">{label}</p>
    </div>
  );
};

const ImpactSection = () => {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600 rounded-full filter blur-3xl opacity-10"></div>
      </div>

      <div className="beesly-container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The numbers don't lie
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Every missed call is a missed opportunity. Here's what our AI receptionist means for your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          <StatCard number={100} label="Call answer rate" suffix="%" delay={0} />
          <StatCard number={400} label="Average Additional revenue per customer/month*" prefix="$" delay={200} />
          <StatCard number={430} label="Number of calls managed monthly" delay={430} />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">*Revenue estimates based on current customer results. Individual results may vary.</p>
        </div>

        {/* Visual comparison */}
        <div className="mt-24 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Without Callendar */}
            <div className="glass-morphism-dark rounded-2xl p-8 border-2 border-red-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">Without Callendar</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-red-500 text-xl">❌</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Juggling Calls all Day</p>
                    <p className="text-gray-500 text-sm">Goes straight to voicemail</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-red-500 text-xl">📉</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">$400/month lost per customer*</p>
                    <p className="text-gray-500 text-sm">From missed opportunities</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-red-500 text-xl">😤</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Frustrated customers</p>
                    <p className="text-gray-500 text-sm">Call competitors instead</p>
                  </div>
                </div>
              </div>
            </div>

            {/* With Callendar */}
            <div className="glass-morphism-dark rounded-2xl p-8 border-2 border-green-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">With Callendar</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-500 text-xl">✅</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">100% of calls are answered</p>
                    <p className="text-gray-500 text-sm">Every call, every time</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-500 text-xl">📈</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">$400/month per customer*</p>
                    <p className="text-gray-500 text-sm">Additional revenue generated</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-500 text-xl">😊</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Happy customers</p>
                    <p className="text-gray-500 text-sm">Book instantly, 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROI highlight */}
        <div className="mt-16 text-center">
          <div className="inline-block gradient-bg-vibrant rounded-full px-8 py-4">
            <p className="text-black font-bold text-xl">
              ROI in just 1 booking • Pays for itself with a single saved appointment
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
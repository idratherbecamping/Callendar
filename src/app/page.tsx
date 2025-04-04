"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import WhoItsForSection from "@/components/WhoItsForSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollAnimation from "@/components/ScrollAnimation";

export default function Home() {
  // For fallback to ensure animations work on all browsers
  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // If not supported, make all animations visible
      const elements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-right, .slide-in-left');
      elements.forEach((el) => {
        el.classList.add('appear');
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-beeslyDark">
      <Navbar />

      {/* Hero doesn't need animation as it's the first section */}
      <HeroSection />

      <ScrollAnimation animationClass="fade-in">
        <FeaturesSection />
      </ScrollAnimation>

      <ScrollAnimation animationClass="slide-up">
        <WhoItsForSection />
      </ScrollAnimation>

      <ScrollAnimation animationClass="slide-up">
        <HowItWorksSection />
      </ScrollAnimation>

      <ScrollAnimation animationClass="fade-in">
        <PricingSection />
      </ScrollAnimation>

      <ScrollAnimation animationClass="slide-up">
        <FAQSection />
      </ScrollAnimation>

      <ScrollAnimation animationClass="fade-in">
        <Footer />
      </ScrollAnimation>

      <BackToTop />
    </main>
  );
}

"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const TestimonialCard = ({ quote, role }: { quote: string; role: string }) => {
  return (
    <Card className="beesly-card beesly-card-hover h-full transform transition-all duration-300 hover:scale-105 border-2 border-beeslyYellow/20">
      <CardContent className="p-10">
        <div className="flex-grow">
          <p 
            className="text-lg text-gray-600 mb-8 leading-8 italic max-w-none"
            dangerouslySetInnerHTML={{ __html: `"${quote}"` }}
          />
          <div className="border-t border-beeslyYellow/20 pt-6">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                <Image
                  src="/arsenal_branding.png"
                  alt="Arsenal Barber Co. Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-base text-beeslyYellow font-bold uppercase tracking-wide font-sans">{role}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "The booking service has <span class='text-beeslyYellow font-medium'>led to a steady increase in our weekly appointments</span>.",
      role: "ARSENAL BARBER CO"
    },
    {
      quote: "Clients find it convenient to schedule their visits by phone, which has helped <span class='text-beeslyYellow font-medium'>fill more time slots throughout the week</span>.",
      role: "ARSENAL BARBER CO"
    },
    {
      quote: "It's made the <span class='text-beeslyYellow font-medium'>booking process smoother</span> and contributed to a <span class='text-beeslyYellow font-medium'>more consistent flow of business</span>.",
      role: "ARSENAL BARBER CO"
    }
  ];

  return (
    <section id="Testimonials" className="relative py-24">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-beeslyDark via-beeslyDark/95 to-beeslyDark">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "url('https://web-assets.same.dev/3660985521/15669422.svg+xml')",
            backgroundSize: "150px",
            backgroundRepeat: "repeat",
          }}></div>
        </div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-beeslyYellow/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-beeslyYellow/10 rounded-full filter blur-3xl"></div>

      <div className="beesly-container relative">
        <div className="text-center mb-16">
          <span className="beesly-section-title text-beeslyYellow text-base font-semibold tracking-wider">
            SUCCESS STORIES
          </span>
          <h2 className="beesly-section-heading text-4xl md:text-5xl font-bold mt-3 mb-4">
            Trusted by Businesses Like Yours
          </h2>
          <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
            See how our AI booking assistant is transforming businesses and helping them grow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              role={testimonial.role}
            />
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-beeslyYellow/20 rounded-full filter blur-xl"></div>
        <div className="absolute -bottom-8 right-1/2 transform translate-x-1/2 w-16 h-16 bg-beeslyYellow/20 rounded-full filter blur-xl"></div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 
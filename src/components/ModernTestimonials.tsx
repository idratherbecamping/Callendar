"use client";

import React from "react";
import Image from "next/image";

const TestimonialCard = ({ quote, author, business, avatar, metric, highlight }: {
  quote: string;
  author: string;
  business: string;
  avatar: string;
  metric?: { value: string; label: string };
  highlight?: string;
}) => {
  return (
    <div className="glass-morphism-dark rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105">
      <div className="flex items-start gap-4 mb-6">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <Image
            src={avatar}
            alt={`${author} from ${business}`}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="text-white font-bold text-lg">{author}</h4>
          <p className="text-purple-400 font-medium">{business}</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      
      <blockquote className="text-gray-300 text-lg mb-6 leading-relaxed">
        "{quote}"
      </blockquote>
      
      {highlight && (
        <div className="gradient-bg-vibrant rounded-xl p-4">
          <p className="text-black font-bold text-center">{highlight}</p>
        </div>
      )}
      
      {metric && (
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient">{metric.value}</div>
            <div className="text-gray-400 text-sm">{metric.label}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const ModernTestimonials = () => {
  const testimonials = [
    {
      quote: "The booking service has led to a steady increase in our weekly appointments. Clients find it convenient to schedule their visits by phone, which has helped fill more time slots throughout the week.",
      author: "Hunter - Owner",
      business: "Arsenal Barber Co",
      avatar: "/arsenal_branding.png",
      metric: { value: "120+", label: "calls managed/month" },
      highlight: "Steady appointment increase"
    },
    {
      quote: "This booking service is a total game-changer! It's taken the stress out of scheduling by screening calls throughout the day, letting me focus on delivering great service. It’s taken the stress out of scheduling by screening an average of 12.75 calls a day",
      author: "Josh - Owner",
      business: "Northern Monkey Barber",
      avatar: "/northern_monkey.jpg",
      metric: { value: "24/7", label: "availability" },
      highlight: "Zero scheduling stress"
    },
    {
      quote: "It's made the booking process smoother and contributed to a more consistent flow of business. The flexibility of booking by phone really appeals to our clients.",
      author: "Hunter - Owner",
      business: "Arsenal Barber Co",
      avatar: "/arsenal_branding.png",
      metric: { value: "100%", label: "calls answered" },
      highlight: "Consistent business flow"
    }
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600 rounded-full filter blur-3xl opacity-10"></div>
      </div>

      <div className="beesly-container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-green-500/30">
            <span className="text-green-400">💬</span>
            <span className="text-green-300 text-sm font-medium">Real customer results</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Don't take our word for it
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Hear from business owners who've transformed their appointment booking with Callendar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              business={testimonial.business}
              avatar={testimonial.avatar}
              metric={testimonial.metric}
              highlight={testimonial.highlight}
            />
          ))}
        </div>

        {/* Social proof bar */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 glass-morphism-dark rounded-full px-8 py-4">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">✓</span>
              <span className="text-white font-medium">Proven Results</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400 text-xl">📞</span>
              <span className="text-white font-medium">430+ calls managed monthly</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 text-xl">📈</span>
              <span className="text-white font-medium">24/7 availability</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernTestimonials;
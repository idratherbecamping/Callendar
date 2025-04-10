"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProfileCard = ({ title, description, icon, isExpanded, onToggle }: { 
  title: string; 
  description: string | string[]; 
  icon?: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  return (
    <Card className="beesly-card beesly-card-hover h-full border-l-4 border-l-beeslyYellow shadow-lg transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl">
      <CardHeader 
        className="flex flex-row items-center justify-between gap-4 pb-2 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          {icon && <div className="rounded-full bg-beeslyYellow/20 p-3 w-14 h-14 flex items-center justify-center text-beeslyYellow transform transition-all duration-300 group-hover:bg-beeslyYellow/30">
            {icon}
          </div>}
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        </div>
        <div className="text-beeslyYellow">
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </CardHeader>
      <CardContent className={`transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        {typeof description === 'string' ? (
          <p className="text-gray-300">{description}</p>
        ) : (
          <ul className="list-none space-y-3 text-gray-300">
            {description.map((item, index) => (
              <li key={index} className="flex items-start">
                <div className="mr-2 mt-1 text-beeslyYellow">•</div>
                <div dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

const WhoItsForSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const profiles = [
    {
      title: "Barbers",
      description: [
        "<span class='text-beeslyYellow font-medium'>Solo barber</span> using <span class='text-beeslyYellow font-medium'>Acuity Scheduling</span>?",
        "Tired of <span class='text-beeslyYellow font-medium'>scheduling mid-cut</span> or <span class='text-beeslyYellow font-medium'>missing calls</span>?",
        "Callendar.ai lets clients <span class='text-beeslyYellow font-medium'>book a basic cut over the phone</span> using your calendar.",
        "<span class='text-beeslyYellow font-medium'>Finds an open slot automatically</span>—no call-backs needed."
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Smaller top handle */}
          <circle cx="6" cy="8" r="2" />
          {/* Smaller bottom handle */}
          <circle cx="6" cy="16" r="2" />
          {/* Longer left blade */}
          <line x1="8" y1="9" x2="23" y2="17" />
          {/* Longer right blade */}
          <line x1="8" y1="15" x2="23" y2="7" />
        </svg>
      )
    },
    {
      title: "Salons",
      description: [
        "<span class='text-beeslyYellow font-medium'>Busy salon</span> with multiple stylists?",
        "Need to <span class='text-beeslyYellow font-medium'>manage appointments</span> efficiently?",
        "Let clients <span class='text-beeslyYellow font-medium'>book services</span> directly through your calendar.",
        "<span class='text-beeslyYellow font-medium'>Automated scheduling</span> for all your staff."
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    },
    {
      title: "Dentists",
      description: [
        "<span class='text-beeslyYellow font-medium'>Dental practice</span> looking to streamline bookings?",
        "Let patients <span class='text-beeslyYellow font-medium'>schedule appointments</span> 24/7.",
        "<span class='text-beeslyYellow font-medium'>Smart scheduling</span> for different procedures."
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      )
    },
    {
      title: "Fitness Trainers",
      description: [
        "<span class='text-beeslyYellow font-medium'>Personal trainers</span> managing multiple clients?",
        "Need to <span class='text-beeslyYellow font-medium'>schedule sessions</span> efficiently?",
        "Let clients <span class='text-beeslyYellow font-medium'>book workouts</span> directly.",
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4v16M18 4v16M2 8h20M2 16h20" />
        </svg>
      )
    },
    {
      title: "Massage Therapists",
      description: [
        "<span class='text-beeslyYellow font-medium'>Therapy practice</span> needing flexible scheduling?",
        "Want to <span class='text-beeslyYellow font-medium'>reduce admin time</span> on bookings?",
        "Let clients <span class='text-beeslyYellow font-medium'>book sessions</span> anytime, anywhere.",
        "<span class='text-beeslyYellow font-medium'>Smart availability</span> management for your services."
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    },
    {
      title: "Photographers",
      description: [
        "<span class='text-beeslyYellow font-medium'>Photo studio</span> managing multiple shoots?",
        "Need to <span class='text-beeslyYellow font-medium'>coordinate sessions</span> efficiently?",
        "Let clients <span class='text-beeslyYellow font-medium'>book photo sessions</span> directly.",
        "<span class='text-beeslyYellow font-medium'>Automated scheduling</span> for different package types."
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      )
    },
    {
      title: "Consultants",
      description: [
        "<span class='text-beeslyYellow font-medium'>Business consultant</span> with busy schedule?",
        "Need to <span class='text-beeslyYellow font-medium'>manage client meetings</span> efficiently?",
        "Let clients <span class='text-beeslyYellow font-medium'>book consultations</span> directly.",
        "<span class='text-beeslyYellow font-medium'>Smart scheduling</span> for different meeting types."
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      title: "Coaches",
      description: [
        "<span class='text-beeslyYellow font-medium'>Life coach</span> managing multiple clients?",
        "Need to <span class='text-beeslyYellow font-medium'>schedule sessions</span> efficiently?",
        "Let clients <span class='text-beeslyYellow font-medium'>book coaching sessions</span> directly.",
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      title: "Pool Cleaners",
      description: [
        "<span class='text-beeslyYellow font-medium'>Pool service</span> business managing multiple locations?",
        "Need to <span class='text-beeslyYellow font-medium'>schedule maintenance</span> efficiently?",
        "Let clients <span class='text-beeslyYellow font-medium'>book service visits</span> directly.",
        "<span class='text-beeslyYellow font-medium'>Route optimization</span> for your service team."
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v20" />
          <path d="M2 12h20" />
        </svg>
      )
    },
    {
      title: "Plumbers & Electricians",
      description: [
        "<span class='text-beeslyYellow font-medium'>Service professionals</span> with busy schedules?",
        "Need to <span class='text-beeslyYellow font-medium'>manage service calls</span> efficiently?",
        "Let clients <span class='text-beeslyYellow font-medium'>book emergency repairs</span> 24/7.",
      ],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    }
  ];

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="WhoItsFor" className="beesly-section bg-beeslyDark relative py-24">
      {/* Section Divider - Top Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute -top-1 left-0 w-full h-20 text-beeslyDark opacity-50">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "url('https://web-assets.same.dev/2637280236/2568384771.svg+xml')",
          backgroundSize: "200px",
          backgroundRepeat: "repeat",
        }}></div>
      </div>
      
      {/* Honeycomb SVG Background */}
      <div className="absolute left-0 bottom-0 h-40 w-40 opacity-10 z-10">
        <img
          src="https://web-assets.same.dev/2637280236/2568384771.svg+xml"
          alt="Honeycomb background"
          className="w-full h-full"
        />
      </div>

      {/* Gradient overlay on the right side */}
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-beeslyDark to-transparent opacity-90 z-10"></div>

      <div className="beesly-container relative z-20">
        <div className="text-center mb-24">
          <span className="beesly-section-title">
            Who It's For
          </span>
          <h2 className="beesly-section-heading">
            Perfect Solutions for Your Industry
          </h2>
          <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-lg">
            Click on any industry card below to learn how Callendar.ai can transform your scheduling experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-4">
          {profiles.map((profile, index) => (
            <ProfileCard
              key={index}
              title={profile.title}
              description={profile.description}
              icon={profile.icon}
              isExpanded={expandedIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoItsForSection; 
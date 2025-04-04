"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileCard = ({ title, description, icon }: { title: string; description: string | string[]; icon?: React.ReactNode }) => {
  return (
    <Card className="beesly-card beesly-card-hover h-full border-l-4 border-l-beeslyYellow shadow-lg transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        {icon && <div className="rounded-full bg-beeslyYellow/20 p-3 w-14 h-14 flex items-center justify-center text-beeslyYellow transform transition-all duration-300 group-hover:bg-beeslyYellow/30">
          {icon}
        </div>}
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
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
  const profiles = [
    {
      title: "Barbers",
      description: [
        "<span class='text-beeslyYellow font-medium'>Solo barber</span>  using <span class='text-beeslyYellow font-medium'>Acuity Scheduling</span>?",
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
    // Additional profiles can be added here
  ];

  return (
    <section id="WhoItsFor" className="beesly-section bg-beeslyDark relative">
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
        <div className="text-center mb-20">
          <span className="beesly-section-title">
            Who It's For
          </span>
          <h2 className="beesly-section-heading">
            Perfect Solutions for Your Industry
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {profiles.map((profile, index) => (
            <ProfileCard
              key={index}
              title={profile.title}
              description={profile.description}
              icon={profile.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoItsForSection; 
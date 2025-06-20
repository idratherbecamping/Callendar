"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const HouseCallVoiceDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const demo = {
    title: "House Call Service Booking",
    description: "Hear our AI book a house call service where the business visits the customer",
    duration: "1:40",
    scenario: "Customer requesting an on-site service visit",
    audioSrc: "/General house call service.m4a",
  };

  const playDemo = () => {
    // If audio is currently playing, stop it
    if (isPlaying && currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
      return;
    }
    
    setIsPlaying(true);
    
    // Play the actual audio file
    const audio = new Audio(demo.audioSrc);
    setCurrentAudio(audio);
    
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      setCurrentAudio(null);
    });
    
    // Stop playing indicator when audio ends
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentAudio(null);
    });
    
    // Also stop if audio fails
    audio.addEventListener('error', () => {
      setIsPlaying(false);
      setCurrentAudio(null);
    });
  };

  return (
    <section id="demo" className="py-24 gradient-bg-dark relative overflow-hidden">
      <div className="beesly-container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-blue-500/30">
            <span className="text-blue-400">🎧</span>
            <span className="text-blue-300 text-sm font-medium">Listen to real conversations</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hear it in action
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            This is a real conversation between our AI and an actual customer booking a house call service. 
            Notice how the AI handles location details and scheduling for on-site visits.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-morphism-dark rounded-2xl p-8 border border-blue-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">{demo.title}</h3>
              <span className="text-blue-400 text-sm">{demo.duration}</span>
            </div>
            
            <p className="text-gray-400 mb-6">{demo.description}</p>
            
            <div className="bg-black/50 rounded-xl p-6 mb-6">
              <p className="text-sm text-gray-500 mb-2">Scenario:</p>
              <p className="text-white">{demo.scenario}</p>
            </div>

            {/* Audio player visualization */}
            <div className="bg-black/30 rounded-xl p-6 flex items-center gap-4">
              <Button
                onClick={playDemo}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isPlaying 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </Button>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar) => (
                    <div
                      key={bar}
                      className={`w-1 bg-blue-500 rounded-full transition-all duration-300 ${
                        isPlaying ? 'h-8 animate-pulse' : 'h-4'
                      }`}
                      style={{ 
                        height: isPlaying ? `${Math.random() * 32 + 16}px` : '16px',
                        animationDelay: `${bar * 100}ms`
                      }}
                    />
                  ))}
                </div>
                <p className="text-gray-400 text-sm">
                  {isPlaying ? 'Playing... (click to stop)' : 'Click play to listen'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key features highlighted */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center glass-morphism-dark rounded-xl p-6">
            <div className="text-3xl mb-3">🚚</div>
            <h4 className="text-white font-bold mb-2">Location-Aware</h4>
            <p className="text-gray-400 text-sm">Collects addresses, manages travel</p>
          </div>
          <div className="text-center glass-morphism-dark rounded-xl p-6">
            <div className="text-3xl mb-3">⏰</div>
            <h4 className="text-white font-bold mb-2">Travel Time</h4>
            <p className="text-gray-400 text-sm">Accounts for travel between jobs</p>
          </div>
          <div className="text-center glass-morphism-dark rounded-xl p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h4 className="text-white font-bold mb-2">Service Focused</h4>
            <p className="text-gray-400 text-sm">Perfect for mobile services</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HouseCallVoiceDemo;
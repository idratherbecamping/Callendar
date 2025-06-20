"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const VoiceDemo = () => {
  const [selectedDemo, setSelectedDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  const demos = [
    {
      title: "Haircut Booking",
      description: "Listen to an actual conversation where our AI books a haircut appointment",
      duration: "1:17",
      scenario: "Real customer booking a haircut appointment",
      audioSrc: "/haircut recording.m4a", // Real customer interaction
    },
    {
      title: "House Call Service Booking",
      description: "Hear our AI book a house call service where the business visits the customer",
      duration: "1:40",
      scenario: "Customer requesting an on-site service visit",
      audioSrc: "/General house call service.m4a", // House call booking
    },
    // {
    //   title: "Professional Customer Service",
    //   description: "Experience how natural and professional our AI sounds with real customers",
    //   duration: "1:17",
    //   scenario: "Natural conversation flow with appointment booking",
    //   audioSrc: "/haircut recording.m4a", // Original haircut recording
    // }
  ];

  const playDemo = (index) => {
    // If audio is currently playing, stop it
    if (isPlaying && currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
      return;
    }
    
    setSelectedDemo(index);
    setIsPlaying(true);
    
    // Play the actual audio file
    const audio = new Audio(demos[index].audioSrc);
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
            These are real conversations between our AI and actual customers booking different services. 
            Notice how natural and professional every interaction sounds.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Demo Player */}
            <div className="order-2 lg:order-1">
              <div className="glass-morphism-dark rounded-2xl p-8 border border-blue-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">{demos[selectedDemo].title}</h3>
                  <span className="text-blue-400 text-sm">{demos[selectedDemo].duration}</span>
                </div>
                
                <p className="text-gray-400 mb-6">{demos[selectedDemo].description}</p>
                
                <div className="bg-black/50 rounded-xl p-6 mb-6">
                  <p className="text-sm text-gray-500 mb-2">Scenario:</p>
                  <p className="text-white">{demos[selectedDemo].scenario}</p>
                </div>

                {/* Audio player visualization */}
                <div className="bg-black/30 rounded-xl p-6 flex items-center gap-4">
                  <Button
                    onClick={() => playDemo(selectedDemo)}
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

            {/* Demo List */}
            <div className="order-1 lg:order-2 space-y-4">
              {demos.map((demo, index) => (
                <div
                  key={index}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedDemo === index 
                      ? 'transform scale-105' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedDemo(index)}
                >
                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    selectedDemo === index 
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        selectedDemo === index 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg">{demo.title}</h4>
                        <p className="text-gray-400 text-sm">{demo.description}</p>
                      </div>
                      <span className="text-gray-500 text-sm">{demo.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key features highlighted */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center glass-morphism-dark rounded-xl p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h4 className="text-white font-bold mb-2">Natural Conversations</h4>
            <p className="text-gray-400 text-sm">Sounds human, not robotic</p>
          </div>
          <div className="text-center glass-morphism-dark rounded-xl p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="text-white font-bold mb-2">Instant Booking</h4>
            <p className="text-gray-400 text-sm">Books appointments in real-time</p>
          </div>
          <div className="text-center glass-morphism-dark rounded-xl p-6">
            <div className="text-3xl mb-3">🔄</div>
            <h4 className="text-white font-bold mb-2">Handles Everything</h4>
            <p className="text-gray-400 text-sm">Complex requests, no problem</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceDemo;
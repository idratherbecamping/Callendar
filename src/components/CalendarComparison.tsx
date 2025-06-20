"use client";

import React, { useState } from "react";

const CalendarComparison = () => {
  const [showAfter, setShowAfter] = useState(false);

  const beforeSlots = [
    { time: "9:00 AM", status: "empty", note: "Missed call", client: undefined, tag: undefined },
    { time: "10:00 AM", status: "booked", client: "John D.", note: undefined, tag: undefined },
    { time: "11:00 AM", status: "empty", note: "No show", client: undefined, tag: undefined },
    { time: "12:00 PM", status: "empty", note: "", client: undefined, tag: undefined },
    { time: "1:00 PM", status: "booked", client: "Mike S.", note: undefined, tag: undefined },
    { time: "2:00 PM", status: "empty", note: "Missed 2 calls", client: undefined, tag: undefined },
    { time: "3:00 PM", status: "empty", note: "", client: undefined, tag: undefined },
    { time: "4:00 PM", status: "booked", client: "Dave R.", note: undefined, tag: undefined },
    { time: "5:00 PM", status: "empty", note: "Phone off", client: undefined, tag: undefined }
  ];

  const afterSlots = [
    { time: "9:00 AM", status: "booked", client: "Sarah M.", tag: "AI Booked", note: undefined },
    { time: "10:00 AM", status: "booked", client: "John D.", tag: undefined, note: undefined },
    { time: "11:00 AM", status: "booked", client: "Tom H.", tag: "AI Booked", note: undefined },
    { time: "12:00 PM", status: "booked", client: "Amy L.", tag: "AI Booked", note: undefined },
    { time: "1:00 PM", status: "booked", client: "Mike S.", tag: undefined, note: undefined },
    { time: "2:00 PM", status: "booked", client: "Chris P.", tag: "AI Booked", note: undefined },
    { time: "3:00 PM", status: "booked", client: "Lisa W.", tag: "AI Booked", note: undefined },
    { time: "4:00 PM", status: "booked", client: "Dave R.", tag: undefined, note: undefined },
    { time: "5:00 PM", status: "booked", client: "Emma K.", tag: "AI Booked", note: undefined }
  ];

  const currentSlots = showAfter ? afterSlots : beforeSlots;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          See the Transformation
        </h2>
        <div className="inline-flex items-center bg-gray-800 rounded-full p-1">
          <button
            onClick={() => setShowAfter(false)}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              !showAfter ? 'bg-red-500 text-white' : 'text-gray-400'
            }`}
          >
            Before Callendar
          </button>
          <button
            onClick={() => setShowAfter(true)}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              showAfter ? 'bg-green-500 text-white' : 'text-gray-400'
            }`}
          >
            After Callendar
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Today's Schedule</h3>
          <div className="flex items-center gap-4">
            {showAfter ? (
              <>
                <span className="text-green-400 font-semibold">100% Booked</span>
                <span className="text-beeslyYellow">+$390 Revenue</span>
              </>
            ) : (
              <>
                <span className="text-red-400 font-semibold">33% Booked</span>
                <span className="text-gray-500">Lost: $390</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {currentSlots.map((slot, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${
                slot.status === 'booked' 
                  ? showAfter ? 'bg-green-900/30 border border-green-800/50' : 'bg-gray-800/50'
                  : 'bg-red-900/20 border border-red-800/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm w-20">{slot.time}</span>
                {slot.status === 'booked' ? (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white font-medium">{slot.client}</span>
                    {slot.tag && (
                      <span className="bg-beeslyYellow/20 text-beeslyYellow text-xs px-2 py-1 rounded-full">
                        {slot.tag}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-500">Empty</span>
                    {slot.note && (
                      <span className="text-red-400 text-sm italic">{slot.note}</span>
                    )}
                  </div>
                )}
              </div>
              {slot.status === 'booked' && (
                <span className="text-green-400 text-sm">+$65</span>
              )}
            </div>
          ))}
        </div>

        {showAfter && (
          <div className="mt-6 p-4 bg-beeslyYellow/10 rounded-lg border border-beeslyYellow/30">
            <p className="text-beeslyYellow text-center font-semibold">
              Your AI receptionist booked 6 appointments while you were cutting hair
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarComparison;
'use client';

import Script from "next/script";
import { useEffect, useState } from "react";

export default function GoogleMapsScript() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  
  const handleScriptLoad = () => {
    console.log('[GoogleMapsScript] Google Maps script loaded successfully');
    setScriptLoaded(true);
  };
  
  const handleScriptError = () => {
    console.error('[GoogleMapsScript] Error loading Google Maps script');
    setScriptError(true);
  };
  
  useEffect(() => {
    if (scriptLoaded) {
      console.log('[GoogleMapsScript] Google object available:', !!window.google);
      console.log('[GoogleMapsScript] Maps object available:', !!window.google?.maps);
      console.log('[GoogleMapsScript] Places object available:', !!window.google?.maps?.places);
    }
    
    if (scriptError) {
      console.error('[GoogleMapsScript] Check if API key is valid and APIs are enabled in the Google Cloud Console');
    }
  }, [scriptLoaded, scriptError]);
  
  return (
    <Script
      src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
      strategy="beforeInteractive"
      onLoad={handleScriptLoad}
      onError={handleScriptError}
    />
  );
} 
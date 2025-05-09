'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const FacebookPixel = (): null => {
  useEffect(() => {
    const loadPixel = async () => {
      if (typeof window !== 'undefined') {
        try {
          // First, ensure the script is loaded
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://connect.facebook.net/en_US/fbevents.js';
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });

          // Then initialize the pixel
          const ReactPixel = (await import('react-facebook-pixel')).default;
          
          // Initialize the Facebook Pixel
          ReactPixel.init('1706068603634026', undefined, {
            autoConfig: true,
            debug: false,
          });

          // Track page view
          ReactPixel.pageView();
        } catch (error) {
          console.warn('Failed to load Facebook Pixel:', error);
        }
      }
    };

    loadPixel();
  }, []);

  return null;
};

// Use dynamic import with ssr disabled
export default dynamic(() => Promise.resolve(FacebookPixel), { ssr: false }); 
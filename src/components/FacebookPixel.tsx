'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Add TypeScript declaration for fbq
declare global {
  interface Window {
    fbq: any;
  }
}

const FacebookPixel = (): null => {
  useEffect(() => {
    const loadPixel = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Check if the script is already loaded
          if ((window as any).fbq) {
            return;
          }

          // Initialize fbq function
          (window as any).fbq = function() {
            // @ts-ignore
            (window as any).fbq.queue.push(arguments);
          };
          (window as any).fbq.queue = [];
          (window as any).fbq.version = '2.0';

          // Load the script
          const script = document.createElement('script');
          script.src = 'https://connect.facebook.net/en_US/fbevents.js';
          script.async = true;
          script.defer = true;
          script.crossOrigin = 'anonymous';
          
          // Add error handling
          script.onerror = (error) => {
            console.warn('Facebook Pixel script failed to load:', error);
            // Clean up if script fails
            if (document.head.contains(script)) {
              document.head.removeChild(script);
            }
          };

          // Add to document
          document.head.appendChild(script);

          // Initialize the pixel
          const ReactPixel = (await import('react-facebook-pixel')).default;
          
          // Initialize the Facebook Pixel
          ReactPixel.init('1706068603634026', undefined, {
            autoConfig: true,
            debug: false,
          });

          // Track page view
          ReactPixel.pageView();
        } catch (error) {
          console.warn('Failed to initialize Facebook Pixel:', error);
        }
      }
    };

    loadPixel();
  }, []);

  return null;
};

// Use dynamic import with ssr disabled
export default dynamic(() => Promise.resolve(FacebookPixel), { ssr: false }); 
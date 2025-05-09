'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function MetaPixel() {
  useEffect(() => {
    // Initialize fbq as a global function
    window.fbq = function() {
      window.fbq.queue.push(arguments);
    };
    window.fbq.queue = [];
    window.fbq.version = '2.0';
  }, []);

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        src="https://connect.facebook.net/en_US/fbevents.js"
        onError={(e) => {
          console.error('Error loading Facebook Pixel:', e);
        }}
        onLoad={() => {
          try {
            window.fbq('init', '1706068603634026');
            window.fbq('track', 'PageView');
          } catch (error) {
            console.error('Error initializing Facebook Pixel:', error);
          }
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1706068603634026&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </>
  );
} 
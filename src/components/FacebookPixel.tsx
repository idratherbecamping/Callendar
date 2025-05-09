'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const FacebookPixel = (): null => {
  useEffect(() => {
    const loadPixel = async () => {
      if (typeof window !== 'undefined') {
        const ReactPixel = (await import('react-facebook-pixel')).default;
        
        // Initialize the Facebook Pixel
        ReactPixel.init('1706068603634026', undefined, {
          autoConfig: true,
          debug: false,
        });

        // Track page view
        ReactPixel.pageView();
      }
    };

    loadPixel();
  }, []);

  return null;
};

// Use dynamic import with ssr disabled
export default dynamic(() => Promise.resolve(FacebookPixel), { ssr: false }); 
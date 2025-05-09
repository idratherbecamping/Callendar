'use client';

import { useEffect } from 'react';
import ReactPixel from 'react-facebook-pixel';

const FacebookPixel = (): null => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize the Facebook Pixel
      ReactPixel.init('1706068603634026', undefined, {
        autoConfig: true,
        debug: false,
      });

      // Track page view
      ReactPixel.pageView();
    }
  }, []);

  return null;
};

export default FacebookPixel; 
'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const PageViewTracker = () => {
  useEffect(() => {
    const trackView = async () => {
      if (typeof window !== 'undefined') {
        const { trackPageView } = await import('@/lib/analytics');
        trackPageView(window.location.pathname);
      }
    };

    trackView();
  }, []);

  return null;
};

// Use dynamic import with ssr disabled
export default dynamic(() => Promise.resolve(PageViewTracker), { ssr: false }); 
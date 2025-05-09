'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';

const PageViewTracker = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      trackPageView(window.location.pathname);
    }
  }, []);

  return null;
};

export default PageViewTracker; 
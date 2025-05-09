'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as fbq from '@/lib/fpixel';

export default function FacebookPixel() {
  const pathname = usePathname();
  
  // Conditionally use search params to avoid issues with static generation
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // This pageview only triggers the first time the component mounts
    fbq.pageview();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Only track page views on route changes after component is mounted
    fbq.pageview();
  }, [pathname, mounted]);

  // Only use searchParams on the client side
  if (mounted) {
    const searchParams = useSearchParams();
    
    useEffect(() => {
      // Track changes when search params change
      fbq.pageview();
    }, [searchParams]);
  }

  return null;
} 
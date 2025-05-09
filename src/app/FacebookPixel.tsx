'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as fbq from '@/lib/fpixel';

export default function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // State to track if component is mounted
  const [mounted, setMounted] = useState(false);
  
  // Effect to set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial pageview on mount
  useEffect(() => {
    // This pageview only triggers the first time the component mounts
    fbq.pageview();
  }, []);

  // Track pathname changes
  useEffect(() => {
    if (!mounted) return;
    
    // Only track page views on route changes after component is mounted
    fbq.pageview();
  }, [pathname, mounted]);

  // Track searchParams changes
  useEffect(() => {
    if (!mounted) return;
    
    // Only track page views when search params change after component is mounted
    fbq.pageview();
  }, [searchParams, mounted]);

  return null;
} 
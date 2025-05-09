'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import * as fbq from '@/lib/fpixel';

export default function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // This pageview only triggers the first time the component mounts
    fbq.pageview();
  }, []);

  useEffect(() => {
    // Track page views on route changes
    fbq.pageview();
  }, [pathname, searchParams]);

  return null;
} 
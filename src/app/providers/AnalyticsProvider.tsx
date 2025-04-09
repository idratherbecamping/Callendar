'use client';

import { Suspense } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

function AnalyticsTracker() {
  // This will automatically track page views
  useAnalytics();
  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  );
} 
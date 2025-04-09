'use client';

import { Suspense } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

// Define some example flags - you can customize these based on your needs
const DEFAULT_FLAGS = ['production'];

function AnalyticsTracker({ flags = DEFAULT_FLAGS }: { flags?: string[] }) {
  // This will automatically track page views
  useAnalytics(flags);
  return null;
}

export function AnalyticsProvider({ 
  children, 
  flags = DEFAULT_FLAGS 
}: { 
  children: React.ReactNode;
  flags?: string[];
}) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker flags={flags} />
      </Suspense>
      {children}
    </>
  );
} 
'use client';

import { useAnalytics } from '@/hooks/useAnalytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // This will automatically track page views
  useAnalytics();

  return <>{children}</>;
} 
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView, trackNavigation } from '@/lib/analytics';

export const useAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view on initial load and route changes
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url);
  }, [pathname, searchParams]);

  return {
    trackNavigation: (from: string, to: string, properties?: Record<string, any>) => {
      trackNavigation(from, to, properties);
    },
  };
}; 
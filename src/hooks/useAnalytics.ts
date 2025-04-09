import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView, trackNavigation, NavigationProperties } from '@/lib/analytics';

export const useAnalytics = () => {
  const pathname = usePathname();
  
  // Safely get search params with error handling
  let searchParamsString = '';
  try {
    const searchParams = useSearchParams();
    searchParamsString = searchParams?.toString() ? `?${searchParams.toString()}` : '';
  } catch (error) {
    console.warn('useSearchParams failed, continuing without search params');
  }

  useEffect(() => {
    // Track page view on initial load and route changes
    const url = pathname + searchParamsString;
    trackPageView(url);
  }, [pathname, searchParamsString]);

  return {
    trackNavigation: (from: string, to: string, properties?: Omit<NavigationProperties, 'from' | 'to'>) => {
      trackNavigation(from, to, properties);
    },
  };
}; 
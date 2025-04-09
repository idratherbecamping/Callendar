import { track } from '@vercel/analytics';

export const trackPageView = (url: string) => {
  track('page_view', {
    url,
    timestamp: new Date().toISOString(),
  });
};

export const trackUserInteraction = (
  eventName: string,
  properties?: Record<string, any>
) => {
  track(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
  });
};

// Common interaction events
export const trackButtonClick = (buttonName: string, properties?: Record<string, any>) => {
  trackUserInteraction('button_click', {
    button_name: buttonName,
    ...properties,
  });
};

export const trackFormSubmission = (formName: string, properties?: Record<string, any>) => {
  trackUserInteraction('form_submission', {
    form_name: formName,
    ...properties,
  });
};

export const trackNavigation = (from: string, to: string, properties?: Record<string, any>) => {
  trackUserInteraction('navigation', {
    from,
    to,
    ...properties,
  });
}; 
import { track } from '@vercel/analytics';

// Define types for analytics events
export type AnalyticsEventProperties = {
  timestamp: string;
  [key: string]: string | number | boolean | undefined;
};

export type ButtonClickProperties = AnalyticsEventProperties & {
  button_name: string;
  location?: string;
  success?: boolean;
};

export type FormSubmissionProperties = AnalyticsEventProperties & {
  form_name: string;
  form_fields?: string[];
  success?: boolean;
};

export type NavigationProperties = AnalyticsEventProperties & {
  from: string;
  to: string;
  duration?: number;
};

export const trackPageView = (url: string) => {
  track('page_view', {
    url,
    timestamp: new Date().toISOString(),
  });
};

export const trackUserInteraction = <T extends AnalyticsEventProperties>(
  eventName: string,
  properties: T
) => {
  track(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
  });
};

// Common interaction events
export const trackButtonClick = (buttonName: string, properties?: Omit<ButtonClickProperties, 'button_name' | 'timestamp'>) => {
  trackUserInteraction('button_click', {
    button_name: buttonName,
    timestamp: new Date().toISOString(),
    ...properties,
  });
};

export const trackFormSubmission = (formName: string, properties?: Omit<FormSubmissionProperties, 'form_name' | 'timestamp'>) => {
  trackUserInteraction('form_submission', {
    form_name: formName,
    timestamp: new Date().toISOString(),
    ...properties,
  });
};

export const trackNavigation = (from: string, to: string, properties?: Omit<NavigationProperties, 'from' | 'to' | 'timestamp'>) => {
  trackUserInteraction('navigation', {
    from,
    to,
    timestamp: new Date().toISOString(),
    ...properties,
  });
}; 
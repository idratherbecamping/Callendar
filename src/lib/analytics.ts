import { track } from '@vercel/analytics';

// Define types for analytics events
export type AnalyticsEventProperties = {
  timestamp: string;
  [key: string]: string | number | boolean;
};

export type ButtonClickProperties = {
  button_name: string;
  location?: string;
  success?: boolean;
};

export type FormSubmissionProperties = {
  form_name: string;
  form_fields?: string[];
  success?: boolean;
};

export type NavigationProperties = {
  from: string;
  to: string;
  duration?: number;
};

export const trackPageView = (url: string, flags?: string[]) => {
  track('page_view', {
    url,
    timestamp: new Date().toISOString(),
  }, { flags });
};

export const trackUserInteraction = (
  eventName: string,
  properties: Record<string, string | number | boolean>,
  flags?: string[]
) => {
  track(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
  }, { flags });
};

// Common interaction events
export const trackButtonClick = (buttonName: string, properties?: Omit<ButtonClickProperties, 'button_name'>, flags?: string[]) => {
  trackUserInteraction('button_click', {
    button_name: buttonName,
    ...(properties || {}),
  }, flags);
};

export const trackFormSubmission = (formName: string, properties?: Omit<FormSubmissionProperties, 'form_name'>, flags?: string[]) => {
  // Convert form_fields array to comma-separated string if it exists
  const processedProperties = properties ? {
    ...properties,
    form_fields: properties.form_fields ? properties.form_fields.join(',') : undefined,
  } : {};
  
  // Remove undefined values
  const cleanProperties = Object.fromEntries(
    Object.entries(processedProperties).filter(([_, value]) => value !== undefined)
  ) as Record<string, string | number | boolean>;
  
  trackUserInteraction('form_submission', {
    form_name: formName,
    ...cleanProperties,
  }, flags);
};

export const trackNavigation = (from: string, to: string, properties?: Omit<NavigationProperties, 'from' | 'to'>, flags?: string[]) => {
  trackUserInteraction('navigation', {
    from,
    to,
    ...(properties || {}),
  }, flags);
}; 
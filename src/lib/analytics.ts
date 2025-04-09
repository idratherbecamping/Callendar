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

export const trackPageView = (url: string) => {
  track('page_view', {
    url,
    timestamp: new Date().toISOString(),
  });
};

export const trackUserInteraction = (
  eventName: string,
  properties: Record<string, string | number | boolean>
) => {
  track(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
  });
};

// Common interaction events
export const trackButtonClick = (buttonName: string, properties?: Omit<ButtonClickProperties, 'button_name'>) => {
  trackUserInteraction('button_click', {
    button_name: buttonName,
    ...(properties || {}),
  });
};

export const trackFormSubmission = (formName: string, properties?: Omit<FormSubmissionProperties, 'form_name'>) => {
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
  });
};

export const trackNavigation = (from: string, to: string, properties?: Omit<NavigationProperties, 'from' | 'to'>) => {
  trackUserInteraction('navigation', {
    from,
    to,
    ...(properties || {}),
  });
}; 
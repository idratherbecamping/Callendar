import { track } from '@vercel/analytics';

// Define a type for analytics data
export type AnalyticsData = {
  [key: string]: string | number | boolean | null;
};

// Track page view time
export const trackPageView = (pageName: string) => {
  track('Page View', { page: pageName });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, additionalData?: AnalyticsData) => {
  track('Button Click', { 
    button: buttonName,
    ...additionalData
  });
};

// Track sign up events
export const trackSignUp = (step: string, additionalData?: AnalyticsData) => {
  track('Sign Up', {
    step,
    ...additionalData
  });
};

// Track demo requests
export const trackDemoRequest = (source: string) => {
  track('Demo Request', { source });
};

// Track trial starts
export const trackTrialStart = (serviceType: string) => {
  track('Trial Start', { serviceType });
}; 
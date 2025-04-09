import { track } from '@vercel/analytics';

// Track page view time
export const trackPageView = (pageName: string) => {
  track('Page View', { page: pageName });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, additionalData?: Record<string, any>) => {
  track('Button Click', { 
    button: buttonName,
    ...additionalData
  });
};

// Track sign up events
export const trackSignUp = (step: string, additionalData?: Record<string, any>) => {
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
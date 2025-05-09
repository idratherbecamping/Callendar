export const FB_PIXEL_ID = '1706068603634026'

declare global {
  interface Window {
    fbq: ((method: string, eventName: string, ...params: unknown[]) => void) & {
      callMethod?: (method: string, ...params: unknown[]) => void;
      queue?: Array<unknown>;
      loaded?: boolean;
      version?: string;
      q?: unknown[];
    }
  }
}

export const pageview = () => {
  window.fbq('track', 'PageView')
}

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name: string, options = {}) => {
  window.fbq('track', name, options)
} 
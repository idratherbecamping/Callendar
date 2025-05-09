export const FB_PIXEL_ID = '1706068603634026'

export const pageview = () => {
  window.fbq('track', 'PageView')
}

// Define a type for the Facebook Pixel event options
type FacebookPixelEventOptions = Record<string, string | number | boolean>;

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name: string, options: FacebookPixelEventOptions = {}) => {
  window.fbq('track', name, options)
}

// Typescript type definitions
declare global {
  interface Window {
    fbq: (type: string, eventName: string, options?: FacebookPixelEventOptions) => void
  }
} 
export const FB_PIXEL_ID = '1706068603634026'

export const pageview = () => {
  window.fbq('track', 'PageView')
}

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name: string, options = {}) => {
  window.fbq('track', name, options)
}

// Typescript type definitions
declare global {
  interface Window {
    fbq: (type: string, eventName: string, options?: any) => void
  }
} 
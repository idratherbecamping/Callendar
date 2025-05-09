'use client'

import dynamic from 'next/dynamic'

// Import Facebook Pixel with dynamic import and no SSR
const FacebookPixel = dynamic(() => import('./FacebookPixel'), {
  ssr: false,
})

export default function FacebookPixelWrapper() {
  return <FacebookPixel />
} 
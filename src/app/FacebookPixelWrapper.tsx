'use client';

import dynamic from 'next/dynamic';

// Dynamically import FacebookPixel component with SSR disabled
const FacebookPixel = dynamic(() => import('./facebook-pixel'), { ssr: false });

export default function FacebookPixelWrapper() {
  return <FacebookPixel />;
} 
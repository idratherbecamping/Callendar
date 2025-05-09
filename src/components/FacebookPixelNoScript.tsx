'use client';

import { FB_PIXEL_ID } from '@/lib/fpixel';

export default function FacebookPixelNoScript() {
  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
} 
'use client';

import { useEffect } from "react";

// Add type declaration for fbq
declare global {
  interface Window {
    fbq: ((method: string, eventName: string, ...params: unknown[]) => void) & {
      callMethod?: (method: string, ...params: unknown[]) => void;
      queue?: Array<unknown>;
      loaded?: boolean;
      version?: string;
      q?: unknown[];
    };
    _fbq?: Window['fbq'];
  }
}

export default function FacebookPixel() {
  useEffect(() => {
    // Add Meta Pixel base code script
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '1706068603634026');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
    
    // Add noscript pixel fallback
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = 'https://www.facebook.com/tr?id=1706068603634026&ev=PageView&noscript=1';
    noscript.appendChild(img);
    document.head.appendChild(noscript);
    
    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (document.head.contains(noscript)) {
        document.head.removeChild(noscript);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
} 
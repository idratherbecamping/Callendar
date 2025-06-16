'use client';

import { useEffect } from 'react';

export default function KlaviyoForm() {
  useEffect(() => {
    // Load Klaviyo script
    const script = document.createElement('script');
    script.src = 'https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=Sunu4T';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on component unmount
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4">
      <div className="klaviyo-form-SUAKps"></div>
    </div>
  );
} 
'use client';

import { useEffect, useState } from 'react';

export default function EnvTest() {
  const [envVars, setEnvVars] = useState<{[key: string]: string | undefined}>({});
  
  useEffect(() => {
    // Collect all NEXT_PUBLIC environment variables
    const vars: {[key: string]: string | undefined} = {};
    for (const key in process.env) {
      if (key.startsWith('NEXT_PUBLIC_')) {
        vars[key] = process.env[key];
      }
    }
    
    setEnvVars(vars);
  }, []);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      
      <div className="mb-6">
        <h2 className="text-xl mb-2">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'Not found'}
        </pre>
      </div>
      
      <div>
        <h2 className="text-xl mb-2">All NEXT_PUBLIC_ Variables:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>
    </div>
  );
} 
"use client";

import { useEffect, Suspense } from "react";
import FacebookPixel from "./FacebookPixel";
import FacebookPixelNoScript from "@/components/FacebookPixelNoScript";

// Create a fallback component for Suspense
const FacebookPixelFallback = () => null;

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <body className="antialiased" suppressHydrationWarning>
      <FacebookPixelNoScript />
      <Suspense fallback={<FacebookPixelFallback />}>
        <FacebookPixel />
      </Suspense>
      {children}
    </body>
  );
}
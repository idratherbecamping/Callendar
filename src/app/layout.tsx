import type { Metadata } from "next";
import { Inter, Poppins, Lexend_Deca } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import ClientBody from "./ClientBody";
import { trackPageView } from "@/lib/analytics";
import Script from "next/script";

// Add type declaration for fbq
declare global {
  interface Window {
    fbq: Function & {
      callMethod?: Function;
      queue?: Array<unknown>;
      loaded?: boolean;
      version?: string;
    };
    _fbq?: Window['fbq'];
  }
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const lexendDeca = Lexend_Deca({
  variable: "--font-lexend-deca",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Callendar AI | Revolutionize Your Voicemail with AI-Powered Assistant",
  description: "Elevate your communication with Callendar's AI voicemail assistant. Experience personalized, efficient call management with features like call summaries, instant notifications, 24/7 availability, and smart calendar integration. Join the future of voicemail today!",
  icons: {
    icon: '/callendar_ai_logo_no_bg.png',
    shortcut: '/callendar_ai_logo_no_bg.png',
    apple: '/callendar_ai_logo_no_bg.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Track page view on client side
  if (typeof window !== 'undefined') {
    trackPageView(window.location.pathname);
  }

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${lexendDeca.variable}`}>
      {/* Meta Pixel Code */}
      <Script 
        id="facebook-pixel"
        strategy="lazyOnload"
        src="https://connect.facebook.net/en_US/fbevents.js"
        onLoad={() => {
          window.fbq = window.fbq || function() {};
          window.fbq('init', '1706068603634026');
          window.fbq('track', 'PageView');
        }}
      />
      <noscript dangerouslySetInnerHTML={{
        __html: `<img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=1706068603634026&ev=PageView&noscript=1"
        />`
      }} />
      <body className={`${inter.variable} ${poppins.variable} ${lexendDeca.variable}`}>
        <ClientBody>
          <div className="dark">{children}</div>
          <Analytics />
        </ClientBody>
      </body>
    </html>
  );
}

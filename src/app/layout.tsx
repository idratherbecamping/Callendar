import type { Metadata } from "next";
import { Inter, Poppins, Lexend_Deca } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import ClientBody from "./ClientBody";
import { trackPageView } from "@/lib/analytics";
import FacebookPixelWrapper from "@/components/FacebookPixelWrapper";

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
      <body className={`${inter.variable} ${poppins.variable} ${lexendDeca.variable}`}>
        {/* Facebook Pixel */}
        <FacebookPixelWrapper />
        <ClientBody>
          <div className="dark">{children}</div>
          <Analytics />
        </ClientBody>
      </body>
    </html>
  );
}

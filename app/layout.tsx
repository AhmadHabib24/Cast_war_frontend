import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Noto_Nastaliq_Urdu, Cinzel } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RealtimeProvider } from "@/components/RealtimeProvider";
import { Toaster } from 'react-hot-toast';
import AIChatbot from "@/components/AIChatbot";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  variable: "--font-noto-nastaliq-urdu",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cast War | The Ultimate Power Struggle",
  description: "Join the war. Boost your cast to the top of the global leaderboard.",
  icons: {
    icon: '/cast-war-logo.png',
    shortcut: '/cast-war-logo.png',
    apple: '/cast-war-logo.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: "#08090d",
};

import { GoogleAuthProviderWrapper } from "@/components/GoogleAuthProviderWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetBrainsMono.variable} ${notoNastaliqUrdu.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#08090d] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
        <Toaster position="top-center" />
        <GoogleAuthProviderWrapper>
          <RealtimeProvider>
            <Navbar />
            {children}
            <Footer />
            <AIChatbot />
          </RealtimeProvider>
        </GoogleAuthProviderWrapper>
      </body>
    </html>
  );
}

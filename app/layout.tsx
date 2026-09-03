import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RealtimeProvider } from "@/components/RealtimeProvider";
import { Toaster } from 'react-hot-toast';
import AIChatbot from "@/components/AIChatbot";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Toaster position="top-center" />
        <RealtimeProvider>
          <Navbar />
          {children}
          <Footer />
          <AIChatbot />
        </RealtimeProvider>
      </body>
    </html>
  );
}

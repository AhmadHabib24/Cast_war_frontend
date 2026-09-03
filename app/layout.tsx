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
  // Temporary maintenance mode flag
  const isMaintenance = true;

  if (isMaintenance) {
    return (
      <html lang="en" className={`${poppins.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col font-sans">
          <div className="min-h-screen bg-white font-[Arvo,serif] flex items-center justify-center p-4">
            <style dangerouslySetInnerHTML={{
              __html: `
              @import url('https://fonts.googleapis.com/css?family=Arvo');
              
              .maintenance_bg {
                background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
                height: 400px;
                background-position: center;
                background-repeat: no-repeat;
              }
              `
            }} />

            <section className="maintenance_page w-full max-w-4xl mx-auto text-center">
              <div className="maintenance_bg flex justify-center items-start pt-10 rounded-3xl mb-[-50px]">
              </div>

              <div className="contant_box_404 relative z-10 bg-white inline-block px-10 py-8 rounded-3xl shadow-[0_-20px_40px_rgba(255,255,255,1)]">
                <h3 className="text-3xl md:text-5xl font-black mb-4">Website is currently Down</h3>
                <p className="text-xl text-gray-500 mb-8">We are working on it. Please be patient.</p>
              </div>
            </section>
          </div>
        </body>
      </html>
    );
  }

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

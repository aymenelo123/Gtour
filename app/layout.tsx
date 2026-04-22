import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/components/AudioProvider";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import FloatingCoinsBackground from "@/components/FloatingCoinsBackground";
import { WalletProvider } from "@/context/WalletContext";
import { Toaster } from "sonner";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ArenaBet | Gaming Wager Platform",
  description: "Join ArenaBet, the premier esports destination to play 1v1 and tournaments for cash.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${cairo.variable} font-sans min-h-screen bg-transparent text-foreground flex flex-col relative`}>
        <FloatingCoinsBackground />
        <AuthProvider>
          <WalletProvider>
            <AudioProvider>
              <Navbar />
              <main className="flex-grow pt-16">
                {children}
              </main>
              <Toaster 
                theme="dark" 
                position="top-center" 
                toastOptions={{
                  className: 'bg-[#0a0a0f]/95 border border-white/10 text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.2)] backdrop-blur-md rounded-xl',
                  style: {
                    fontFamily: 'var(--font-cairo), sans-serif'
                  }
                }}
              />
            </AudioProvider>
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

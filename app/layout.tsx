import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/components/AudioProvider";
import Navbar from "@/components/Navbar";

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
      <body className={`${cairo.variable} font-sans min-h-screen bg-background text-foreground flex flex-col`}>
        <AudioProvider>
          <Navbar />
          <main className="flex-grow pt-16">
            {children}
          </main>
        </AudioProvider>
      </body>
    </html>
  );
}

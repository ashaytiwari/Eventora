import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, Geist } from "next/font/google";

import { cn } from "@/lib/utils/common";
import LightRays from "@/components/lightRays/LightRays";

import "./globals.css";
import Navbar from "@/components/navbar/Navbar";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Dev Events",
  description: "Dev Events handled by Next JS - DG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const lightRaysAttributes = {
    raysOrigin: 'top-center-offset' as any,
    raysColor: '#5dfeca',
    raysSpeed: 0.5,
    lightSpeed: 0.9,
    rayLength: 1.4,
    followMouse: true,
    mouseInfluence: 0.02,
    noiseAmount: 0.0,
    distortion: 0.01,
  };

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", schibstedGrotesk.variable, martianMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">

        <Navbar />

        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
          <LightRays {...lightRaysAttributes} />
        </div>

        <main>
          {children}
        </main>

      </body>
    </html>
  );
}

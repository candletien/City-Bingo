import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, JetBrains_Mono, Limelight } from "next/font/google";
import { SwRegister } from "@/components/SwRegister";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "700", "800"], variable: "--f-display" });
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--f-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"], variable: "--f-mono" });
const deco = Limelight({ subsets: ["latin"], weight: "400", variable: "--f-deco" });

export const metadata: Metadata = {
  title: "City Bingo · Bangkok",
  description: "Find the city's secrets. A 3×3 bingo of hidden details in Bangkok's old neighborhoods.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "City Bingo", statusBarStyle: "black-translucent" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#262624",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} ${deco.variable}`}>
      <body>
        {children}
        <SwRegister />
      </body>
    </html>
  );
}

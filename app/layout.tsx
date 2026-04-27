import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LangProvider } from "@/components/LangProvider";

export const metadata: Metadata = {
  title: "zan.kz — AI заңгер / AI юрист",
  description:
    "AI-powered legal assistant for citizens of Kazakhstan. Kazakh & Russian. Voice + text.",
  icons: { icon: "/favicon.svg" }
};

export const viewport: Viewport = {
  themeColor: "#0B3C8C",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LangProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-8rem)]">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import { Footer } from "./sections/Footer";
import { Header } from "./sections/Header";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eduardo Mendoza Villar — Ingeniero de Sistemas e IA",
  description:
    "Portafolio de Eduardo Mendoza Villar, ingeniero de sistemas enfocado en inteligencia artificial, RAG y desarrollo web.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

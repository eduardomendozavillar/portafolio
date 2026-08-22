import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Outfit, Source_Sans_3 } from "next/font/google";
import { Footer } from "./sections/Footer";
import { Header } from "./sections/Header";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
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
      className={`${outfit.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

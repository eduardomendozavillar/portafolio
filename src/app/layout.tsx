import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Anton, Manrope } from "next/font/google";
import { Footer } from "./sections/Footer";
import { Header } from "./sections/Header";
import "./globals.css";

/** Rebrand (portfolio-rebrand): Anton condensada para display, Manrope para cuerpo. */
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
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
      className={`${anton.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

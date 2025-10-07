import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { NavBarBasic } from "@/components/layout/navbar";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AGENDA UC",
  description: "La mejor agenda para estudiantes de la UC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen text-foreground font-sans antialiased`}
      >
        <div className="fixed inset-0 top-0 bottom-0 left-0 right-0 -z-50 overflow-hidden">
          <div className="bg-[url('/layout-bg.svg')] bg-cover bg-center h-dvh w-full absolute top-0 left-0" />
          <div className="bg-[url('/layout-bg.svg')] bg-cover bg-center h-dvh w-full scale-[-1] absolute top-0 left-0" />
          <div className="absolute top-0 bottom-0 left-0 right-0 z-10 backdrop-blur-sm" />
        </div>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <NavBarBasic />
          {children}
        </Providers> 
      </body>
    </html>
  );
}

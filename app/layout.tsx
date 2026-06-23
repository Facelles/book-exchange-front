import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthInitializer from "@/components/AuthInitializer";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookSwap — Book Exchange Service",
  description:
    "Find, share, and exchange books with readers in your community. Browse our catalog and request exchanges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased">
        <AuthInitializer />
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} BookSwap. All rights reserved.
        </footer>
      </body>
    </html>
  );
}

// app/layout.tsx (server component)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/animate-ui/components/radix/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IntelForge",
  description: "Automated technology intelligence & forecasting",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Providers is a client wrapper that contains ThemeProvider and SidebarProvider */}
        <Providers>
          {/* AppSidebar is a client component (uses next-themes + sidebar context) */}
          <AppSidebar />
          <main className="min-h-screen ml-0 lg:ml-6">
            {/* SidebarTrigger is small UI control to toggle the sidebar (client) */}
            <SidebarTrigger />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

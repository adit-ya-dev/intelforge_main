// app/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/animate-ui/components/radix/sidebar";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // ThemeProvider must use attribute="class" if Tailwind dark:class strategy is used
    <ThemeProvider attribute="class" defaultTheme="system">
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  );
}

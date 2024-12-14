// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ClientWrapper from "@/components/global_layout/clientWapper";


export const metadata: Metadata = {
  title: "Your Own Ai Friend",
  description: "Virtual Friend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-dark-gradient text-lightText font-sans">
          <AppRouterCacheProvider>
            <ClientWrapper>{children}</ClientWrapper>
          </AppRouterCacheProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

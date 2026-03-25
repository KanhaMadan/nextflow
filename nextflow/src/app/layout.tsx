// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextFlow — LLM Workflow Builder",
  description: "Build and run powerful LLM workflows with a visual interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-background text-text-primary antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

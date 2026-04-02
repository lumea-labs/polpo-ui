import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "@polpo-ai/ui — UI components for AI agents",
  description:
    "Composable React components for building AI agent interfaces. Chat, tasks, sessions, tools. Built on Polpo SDK + shadcn/ui.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${jetbrains.variable} dark`}
    >
      <body className="min-h-screen bg-[#090d11] text-[#ededed] antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

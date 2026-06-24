import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Antigravity Todo - 풀스택 할 일 관리",
  description: "Next.js 15+와 FastAPI를 활용한 고성능 풀스택 Todo 웹 애플리케이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-background text-foreground flex flex-col`}
      >
        <header className="w-full border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-primary">
              Antigravity Todo
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
              Fullstack App
            </span>
          </div>
        </header>
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-6 flex flex-col">
          {children}
        </main>
        <footer className="w-full py-4 border-t border-border mt-auto">
          <div className="max-w-xl mx-auto px-4 text-center text-xs text-muted">
            &copy; 2026 Antigravity Todo. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}

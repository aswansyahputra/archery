import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Horsebow Scoring",
  description: "Offline-first PWA for Traditional Archery / Horsebow (FESPATI) scoring and training analysis.",
  applicationName: "Horsebow Scoring",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Horsebow Scoring", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#ea580c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  );
}

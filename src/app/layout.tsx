import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Júlia Vasconcelos — copywriter and journalist",
  description: "Portfolio of Júlia Vasconcelos, copywriter and journalist based in Pernambuco, Brazil.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceMono.variable} h-full antialiased`}>
      <body className={`${spaceMono.className} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}

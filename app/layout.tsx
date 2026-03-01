import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Debut Day — Sports Debut Trivia",
  description:
    "A daily sports trivia game. Given a famous athlete, recall their professional debut lineup, jersey number, and who they replaced.",
  openGraph: {
    title: "Debut Day",
    description: "Can you remember who played alongside the greats on Day 1?",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${barlowCondensed.variable} ${inter.variable} bg-[#0d1117] text-white antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}

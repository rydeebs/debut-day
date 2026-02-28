import type { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-[#0d1117] text-white antialiased">{children}</body>
    </html>
  );
}

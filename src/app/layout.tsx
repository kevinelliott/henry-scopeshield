import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScopeShield — Freelancer SOW Generator with Scope Creep Protection",
  description: "Stop losing money to scope creep. Generate professional Statements of Work with built-in scope creep intelligence, vague language detection, and protective clauses.",
  keywords: ["SOW generator", "scope creep", "freelancer", "statement of work", "contract", "scope protection"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

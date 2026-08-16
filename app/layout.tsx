import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sitcomdle — Guess the sitcom character",
  description:
    "A daily TV character guessing game. Six guesses, eight attributes, one hidden character.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

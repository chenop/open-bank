import type { Metadata } from "next";
import { Rubik, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "hebrew"],
});

export const metadata: Metadata = {
  title: "Open Bank",
  description: "אפליקציית בנק לילדים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={cn("h-full", "antialiased", rubik.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-rubik)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

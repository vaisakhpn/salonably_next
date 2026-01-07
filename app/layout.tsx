import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Salonably",
  description:
    "Book nearby salons instantly. Easy, fast, and hassle-free beauty appointments with Salonably.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-main`}>
        <div className="mx-4 sm:mx-[10%]">{children}</div>
      </body>
    </html>
  );
}

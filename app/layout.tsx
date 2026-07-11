import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "LockMyTime - Book Your Next Appointment",
    template: "%s | LockMyTime",
  },
  description:
    "Book appointments instantly. Easy, fast, and hassle-free scheduling with LockMyTime.",
  keywords: ["salon", "booking", "beauty", "haircut", "spa", "appointment"],
  openGraph: {
    title: "LockMyTime - Book Your Next Appointment",
    description:
      "Book appointments instantly. Easy, fast, and hassle-free scheduling with LockMyTime.",
    type: "website",
    locale: "en_US",
    siteName: "LockMyTime",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-main`}
        suppressHydrationWarning={true}
      >
        <div>
          <ToastContainer />
          {children}
        </div>
      </body>
    </html>
  );
}

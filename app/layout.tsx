import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Providers from "@/components/Providers";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lockmytime.shop"),
  title: {
    default: "LockMyTime - Book Your Next Appointment",
    template: "%s | LockMyTime",
  },
  description:
    "Book appointments instantly. Easy, fast, and hassle-free scheduling with LockMyTime.",
  keywords: [
    "LockMyTime",
    "lockmytime",
    "Lock My Time",
    "lock my time",
    "salon",
    "booking",
    "beauty",
    "haircut",
    "spa",
    "appointment",
  ],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "LockMyTime - Book Your Next Appointment",
    description:
      "Book appointments instantly. Easy, fast, and hassle-free scheduling with LockMyTime.",
    url: "https://www.lockmytime.shop",
    type: "website",
    locale: "en_US",
    siteName: "LockMyTime",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.lockmytime.shop/#website",
      "url": "https://www.lockmytime.shop",
      "name": "LockMyTime",
      "description":
        "Book appointments instantly. Easy, fast, and hassle-free scheduling with LockMyTime.",
    },
    {
      "@type": "Organization",
      "@id": "https://www.lockmytime.shop/#organization",
      "name": "LockMyTime",
      "url": "https://www.lockmytime.shop",
      "logo": "https://www.lockmytime.shop/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${outfit.variable} font-main`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            icon={false}
            closeButton={false}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}

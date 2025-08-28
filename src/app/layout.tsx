import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const beVietNamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - Aeiouly",
    default: "Home",
  },
  description:
    "Your path to fluency in English with Aeiouly will be both enjoyable and fruitful. Our tools, lessons, and personalized approach empower you to speak confidently.",
  openGraph: {
    title: {
      template: "%s - Aeiouly",
      default: "Home",
    },
    description:
      "Your path to fluency in English with Aeiouly will be both enjoyable and fruitful. Our tools, lessons, and personalized approach empower you to speak confidently.",
    url: "https://aeiouly.com",
    siteName: "Aeiouly",
    images: [
      {
        url: "/meta-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aeiouly",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: "%s - Aeiouly",
      default: "Home",
    },
    description:
      "Your path to fluency in English with Aeiouly will be both enjoyable and fruitful. Our tools, lessons, and personalized approach empower you to speak confidently.",
    images: [
      {
        url: "/meta-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aeiouly",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${beVietNamPro.variable} ${geistSans.variable} antialiased flex`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

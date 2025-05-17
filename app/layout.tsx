import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })

export const metadata: Metadata = {
  title: {
    default: "Ananta Sharma | Full Stack Developer",
    template: "%s | Ananta Sharma",
  },
  description:
    "Portfolio website of Ananta Sharma, a Full Stack Developer specializing in Next.js, React, Express.js, Node.js, and more.",
  keywords: [
    "Ananta Sharma",
    "Full Stack Developer",
    "Web Developer Nepal",
    "Next.js",
    "React",
    "Node.js",
    "Portfolio",
    "JavaScript",
  ],
  metadataBase: new URL("https://www.anantasharma.com.np"),
  authors: [{ name: "Ananta Sharma", url: "https://www.anantasharma.com.np" }],
  creator: "Ananta Sharma",
  themeColor: "#DC2626",
  openGraph: {
    title: "Ananta Sharma | Full Stack Developer",
    description:
      "Explore the portfolio of Ananta Sharma, a passionate Full Stack Developer crafting scalable web applications.",
    url: "https://www.anantasharma.com.np",
    siteName: "Ananta Sharma Portfolio",
    images: [
      {
        url: "https://www.anantasharma.com.np/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ananta Sharma Portfolio Preview Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ananta Sharma | Full Stack Developer",
    description:
      "Portfolio of Ananta Sharma, building fast and scalable full stack applications.",
    images: ["https://www.anantasharma.com.np/og-image.jpg"],
    creator: "@yourTwitterHandle", // Replace with your actual Twitter handle
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href={inter.style.src} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={spaceGrotesk.style.src} as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

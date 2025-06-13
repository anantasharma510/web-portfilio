import type React from "react"
import type { Metadata, Viewport } from "next" // Add Viewport type import
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import SessionProvider from "@/components/session-provider" // adjust path if needed
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"

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
  // themeColor: "#DC2626", // Remove from here
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
    description: "Portfolio of Ananta Sharma, building fast and scalable full stack applications.",
    images: ["https://www.anantasharma.com.np/og-image.jpg"],
    creator: "@yourTwitterHandle",
  },
}

// Add this new viewport export
export const viewport: Viewport = {
  themeColor: "#DC2626", // Move themeColor here
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

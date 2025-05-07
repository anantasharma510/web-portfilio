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
  title: "Ananta Sharma | Full Stack Developer",
  description:
    "Portfolio website of Ananta Sharma, a Full Stack Developer specializing in Next.js, React, express.js, Node.js, and more.",
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
        <link rel="preload" href={inter.style.src} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={spaceGrotesk.style.src} as="font" type="font/woff2" crossOrigin="anonymous" />
        <meta
          name="description"
          content="Portfolio website of Ananta Sharma, a Full Stack Developer specializing in Next.js, React, Node.js, and more."
        />
        <meta name="theme-color" content="#DC2626" />
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

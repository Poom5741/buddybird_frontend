import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BuddyBirds - AI Bird Identification",
  description: "Advanced AI-powered bird identification through audio analysis",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-stone-50 to-amber-50 min-h-screen`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}

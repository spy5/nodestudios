import type { Metadata } from "next"
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { cookies } from "next/headers"
import { IdentityProvider } from "@/components/identity-provider"
import { Toaster } from "@/components/ui/sonner"
import type { Identity } from "@/lib/types"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif-display",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-ui",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Srikar Prasad Y — Designer / NODE Studio",
    template: "%s — Srikar Prasad Y",
  },
  description:
    "The portfolio of Srikar Prasad Y and the practice of NODE Studio — interface, motion, 3D and film work.",
  generator: "v0.app",
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#151312" },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const store = await cookies()
  const initialIdentity: Identity = (store.get("studio_identity")?.value as Identity) === "node" ? "node" : "srikar"

  return (
    <html
      lang="en"
      data-identity={initialIdentity}
      className={`${inter.variable} ${serif.variable} ${mono.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <IdentityProvider initial={initialIdentity}>{children}</IdentityProvider>
        <Toaster position="bottom-right" />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}

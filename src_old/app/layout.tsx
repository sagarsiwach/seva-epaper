import type { Metadata } from "next"
import { JetBrains_Mono, Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

// Lyra style uses monospace-friendly fonts
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "E-Paper Viewer | Digital Newspaper Experience",
  description:
    "Modern digital newspaper reading experience with realistic page-flip animations, dark mode, and crisp UI design.",
  keywords: ["e-paper", "newspaper", "digital reader", "page flip", "news"],
  authors: [{ name: "E-Paper Team" }],
  openGraph: {
    title: "E-Paper Viewer",
    description: "Modern digital newspaper reading experience",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

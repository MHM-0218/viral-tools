import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Creator Niche Finder — Find the Niche You Can Actually Win',
  description: 'Stop posting into the void. Three questions to discover your unfair content angle, positioning, and monetization path.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Headline Fixer — Turn Weak Headlines Into Clicks',
  description: 'Paste your headline, pick a style, get 10 click-ready alternatives with CTR scores instantly.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

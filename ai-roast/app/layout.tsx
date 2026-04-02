import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Roast My Landing Page — Get Brutally Honest Feedback',
  description: 'Paste your product info and get an AI-powered roast of your landing page with a real score and actionable fixes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

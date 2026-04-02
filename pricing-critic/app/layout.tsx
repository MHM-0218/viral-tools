import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pricing Page Critic — Find Out Why Your Pricing Isn\'t Converting',
  description: 'Audit your pricing structure and find out exactly where you\'re leaving money on the table.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

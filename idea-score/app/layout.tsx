import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Startup Idea Score — Is Your Idea Worth Building?',
  description: 'Answer 5 questions and get a brutally honest score on your startup idea with radar analysis and a go/no-go verdict.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

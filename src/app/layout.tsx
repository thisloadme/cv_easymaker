import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'CV Maker — Interview to ATS-Optimized CV',
  description: 'Generate ATS-optimized CV through guided interview. 90% chance to pass ATS screening.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23c45a3b"/><text y="70" x="15" font-size="60" fill="white" font-family="serif">C</text></svg>',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
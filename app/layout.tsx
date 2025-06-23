import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import type { Metadata } from 'next'
import AuthProvider from '@/components/providers/session-provider'

export const metadata: Metadata = {
  title: 'Student CRM',
  description: 'A comprehensive CRM system for managing student applications',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

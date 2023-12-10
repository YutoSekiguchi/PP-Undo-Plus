import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { Session } from 'next-auth'
import SessionProvider from '../providers/session_provider'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PP-Undo Plus',
  description: 'PP-Undo is an innovative handwriting editing tool centered around pen pressure. Designed to enhance digital handwriting input, it allows users to selectively undo/redo strokes based on pen pressure. Intuitively designed for efficient and precise editing of handwritten notes and sketches.',
}

export default function RootLayout({
  session,
  children,
}: {
  session: Session | null | undefined,
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}

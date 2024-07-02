import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './components/Note/PP-UndoEditor/PdfEditor/pdf-editor.css'

import { Session } from 'next-auth'
import SessionProvider from '../providers/session_provider'
import Head from 'next/head'
import CommonSession from './common_session'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PP-Editor',
  description: 'PP-Editor is an innovative handwriting editing tool centered around pen pressure. Designed to enhance digital handwriting input, it allows users to selectively undo/redo strokes based on pen pressure. Intuitively designed for efficient and precise editing of handwritten notes and sketches.',
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
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.png"></link>
        <meta name="theme-color" content="#4a90e2" />
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <CommonSession />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}

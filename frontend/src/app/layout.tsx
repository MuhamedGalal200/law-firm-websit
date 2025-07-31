'use client'

import './globals.css'
import '../i18n/i18n'

import { ReactNode } from 'react'

import { store } from '../store'
import { Provider } from 'react-redux'
import AppWrapper from '@/components/AppWrapper'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="w-full overflow-x-hidden" suppressHydrationWarning>
        <Provider store={store}>
          <AppWrapper>{children}</AppWrapper>
        </Provider>
      </body>
    </html>
  )
}
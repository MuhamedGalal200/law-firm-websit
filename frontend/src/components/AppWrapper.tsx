'use client'

import { useEffect, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

export default function AppWrapper({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const lang = useSelector((state: RootState) => state.language.language)

  useEffect(() => {
    i18n.changeLanguage(lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang, i18n])

  return <>{children}</>
}

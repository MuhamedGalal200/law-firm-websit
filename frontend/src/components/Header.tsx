'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleLanguage } from '../store/languageSlice'
import { RootState } from '../store'
import { useTranslation } from 'react-i18next'
import { getServices } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { BsSearch } from 'react-icons/bs'

type Service = {
  id: number
  title: string
  slug: string
}

export default function Header() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector((state: RootState) => state.language.language)
  const router = useRouter()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [services, setServices] = useState<Service[]>([])
  const [hasMounted, setHasMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await getServices()
        setServices(res)
      } catch (err) {
        console.error('Failed to load services:', err)
      }
    }
    fetchServices()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`)

      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  if (!hasMounted) return null

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 transition-all duration-300 ${isScrolled || dropdownOpen ? 'bg-[#4f2e1e]' : 'bg-transparent'
        } text-white`}
    >

      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">LOGO</div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium relative">
          <Link href="/">{t('home')}</Link>
          <Link href="/about">{t('about')}</Link>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="focus:outline-none"
            >
              {t('services')} <span className="ml-1">▾</span>
            </button>
            {dropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-6 w-[90vw] max-w-6xl bg-[#4f2e1e] text-white p-8 grid grid-cols-3 gap-6 rounded shadow-xl z-50">
                {services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="text-sm hover:underline cursor-pointer"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/blog">{t('blog')}</Link>
          <Link href="/team">{t('team')}</Link>
          <Link href="/contact">{t('contact')}</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => setSearchOpen(!searchOpen)} className="text-lg">
            <BsSearch />
          </button>

          {searchOpen && (
            <form onSubmit={handleSearch} className="ml-4 transition-all">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search') || 'Search...'}
                className="bg-transparent text-black px-3 py-1 rounded"
              />
            </form>
          )}

          <button className="border border-white px-4 py-1 rounded hover:bg-white hover:text-black transition">
            {t('book appointment')}
          </button>

          <button
            onClick={() => dispatch(toggleLanguage())}
            className="text-xs underline ml-2"
          >
            {lang === 'en' ? 'AR' : 'EN'}
          </button>
        </div>

        <button
          className="md:hidden blur-sm text-white text-xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mt-4 flex flex-col gap-4 text-sm md:hidden">
          <Link href="/">{t('home')}</Link>
          <Link href="/about">{t('about')}</Link>
          <Link href="/services">{t('services')}</Link>
          <Link href="/blog">{t('blog')}</Link>
          <Link href="/team">{t('team')}</Link>
          <Link href="/contact">{t('contact')}</Link>
          <button className="border border-white px-4 py-1 rounded hover:bg-white hover:text-black transition">
            {t('book')}
          </button>
          <button
            onClick={() => dispatch(toggleLanguage())}
            className="text-xs underline"
          >
            {lang === 'en' ? 'AR' : 'EN'}
          </button>
        </div>
      )}
    </header>
  )
}
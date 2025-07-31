'use client'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toggleLanguage } from '../store/languageSlice'
import { RootState } from '../store'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Clients from '@/components/Clients'
import HeroSection from '@/components/HeroSection'

// Dynamic import for Team component to prevent hydration issues
const Team = dynamic(() => import('@/components/Team'), {
  ssr: false,
  loading: () => (
    <section className="bg-[#f7f7f7] py-16 px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-[#4f2e1e] mb-4">
        Our Team
      </h2>
      <p className="text-gray-500">Loading team members...</p>
    </section>
  )
})

export default function Home() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector((state: RootState) => state.language.language)

  return (
    <div className="relative min-h-screen">
      {/* Navbar */}
      <Header />
      
      {/* Add debug div to see if HeroSection is rendering */}
      <div style={{ border: '', minHeight: '50px' }}>
        <HeroSection />
      </div>
      <Team />
      <Clients />
      <p className='bg-white'>.</p>
      <Footer />
    </div>
  )
}
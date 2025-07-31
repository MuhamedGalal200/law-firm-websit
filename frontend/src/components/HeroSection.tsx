'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getHeroSlides } from '@/lib/api'
import Image from 'next/image'

type Slide = {
  id: number
  title: string
  description: string
  image: { url: string } | null
  video: { url: string } | null
}

export default function HeroSection() {
  const { i18n, t } = useTranslation()
  const [slides, setSlides] = useState<Slide[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSlides() {
      try {
        console.log('HeroSection: Starting to fetch slides')
        console.log('Current language:', i18n.language)

        setLoading(true)
        setError(null)

        const data = await getHeroSlides(i18n.language)
        console.log('HeroSection: Received data:', data)

        if (!data || data.length === 0) {
          console.warn('HeroSection: No slides data received')
          setError('No slides available')
          setSlides([])
        } else {
          console.log('HeroSection: Setting slides:', data)
          setSlides(data)
          setError(null)
        }
      } catch (err) {
        console.error('HeroSection: Error fetching slides:', err)
        setError(err instanceof Error ? err.message : 'Failed to load slides')
        setSlides([])
      } finally {
        setLoading(false)
      }
    }

    if (i18n.language) {
      fetchSlides()
    }
  }, [i18n.language])

  useEffect(() => {
    if (slides.length > 0) {
      console.log('Setting up slide interval for', slides.length, 'slides')
      const interval = setInterval(() => {
        setCurrent((prev) => {
          const next = (prev + 1) % slides.length
          console.log('Changing slide from', prev, 'to', next)
          return next
        })
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [slides.length])

  // Add loading state
  if (loading) {
    return (
      <section className="relative w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg sm:text-xl px-4 text-center">Loading hero slides...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="relative w-full h-screen flex items-center justify-center bg-red-900 px-4">
        <div className="text-white text-center max-w-md">
          <h2 className="text-xl sm:text-2xl mb-4">Error Loading Slides</h2>
          <p className="text-base sm:text-lg mb-4">{error}</p>
          <p className="text-sm opacity-75">Check console for more details</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-white text-red-900 px-4 py-2 rounded text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </section>
    )
  }

  if (!slides.length) {
    return (
      <section className="relative w-full h-screen flex items-center justify-center bg-blue-900 px-4">
        <div className="text-white text-center">
          <h2 className="text-xl sm:text-2xl mb-4">No Slides Available</h2>
          <p className="text-sm sm:text-base">Please add some hero slides in your CMS</p>
        </div>
      </section>
    )
  }

  const slide = slides[current]
  const isRTL = i18n.language === 'ar'

  console.log('Rendering slide:', current, slide)

  return (
    <section
      className="relative w-full h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/images/bg.png')" }}
    >
      <div className="absolute inset-0 " />

      <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 lg:py-0 text-white">
        
        <div className={`w-full lg:max-w-xl xl:max-w-2xl mb-8 lg:mb-0 ${
          isRTL 
            ? 'lg:ml-auto text-center sm:text-right' 
            : 'text-center sm:text-left'
        }`}>
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight ${
            isRTL ? 'font-arabic' : ''
          }`}>
            {slide.title}
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed opacity-90 max-w-lg mx-auto sm:mx-0">
            {slide.description}
          </p>

          <button className="bg-white text-[#4f2e1e] px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium text-sm sm:text-base transform hover:scale-105 active:scale-95">
            {t("read_more")}
          </button>
        </div>

        <div className="w-full lg:w-auto flex justify-center lg:justify-end">
          {slide.image?.url ? (
            <div className="relative">
              <div className="absolute -inset-2 sm:-inset-4 rounded-xl sm:rounded-2xl transform rotate-1 sm:rotate-3 bg-gradient-to-br from-white/10 to-white/5 hidden sm:block"></div>

              <div className="relative w-48 h-60 sm:w-60 sm:h-72 md:w-72 md:h-80 lg:w-80 lg:h-96 bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                <Image
                  width={400}
                  height={500}
                  src={`http://localhost:1337${slide.image.url}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  priority
                  onError={(e) => console.error('Slide image load error:', e)}
                  onLoad={() => console.log('Slide image loaded successfully')}
                />
              </div>
            </div>
          ) : (
            <div className="w-48 h-60 sm:w-60 sm:h-72 md:w-72 md:h-80 lg:w-80 lg:h-96 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
              <span className="text-white text-sm sm:text-lg">No Image</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}
        className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-20 hidden sm:block"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => setCurrent((current + 1) % slides.length)}
        className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-20 hidden sm:block"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 lg:left-6 flex sm:flex-col gap-2 sm:gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`block w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
              i === current
                ? 'bg-white scale-110 sm:scale-125'
                : 'bg-white/50 hover:bg-white/75 hover:scale-105 sm:hover:scale-110'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/60 text-xs sm:hidden">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span>Swipe</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      <div 
        className="absolute inset-0 z-10 sm:hidden"
        onTouchStart={(e) => {
          const touchStartX = e.touches[0].clientX
          e.currentTarget.dataset.touchStartX = touchStartX.toString()
        }}
        onTouchEnd={(e) => {
          const touchStartX = parseFloat(e.currentTarget.dataset.touchStartX || '0')
          const touchEndX = e.changedTouches[0].clientX
          const diff = touchStartX - touchEndX
          
          if (Math.abs(diff) > 50) { 
            if (diff > 0) {
              setCurrent((current + 1) % slides.length)
            } else {
              setCurrent((current - 1 + slides.length) % slides.length)
            }
          }
        }}
      />
    </section>
  )
}
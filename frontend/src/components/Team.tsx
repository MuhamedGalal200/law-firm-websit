'use client'

import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'
import { getTeamMembers } from '@/lib/api'
import Image from 'next/image'

type Member = {
  id: number
  name: string
  position: string
  email: string
  whatsapp: string
  image?: {
    url: string
  } | null
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<Member[] | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    async function fetchData() {
      try {
        const data = await getTeamMembers()
        console.log('Team Members:', data)
        setTeamMembers(data)
      } catch (err) {
        console.error('Failed to load team:', err)
        setTeamMembers([]) // Set empty array on error to stop loading state
      }
    }

    fetchData()
  }, [mounted])

  if (!mounted || !teamMembers) {
    return (
      <section className="bg-[#f7f7f7] py-16 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#4f2e1e] mb-4">
          Our Team
        </h2>
        <p className="text-gray-500">Loading team members...</p>
      </section>
    )
  }

  if (teamMembers.length === 0) {
    return (
      <section className="bg-[#f7f7f7] py-16 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#4f2e1e] mb-4">
          Our Team
        </h2>
        <p className="text-gray-500">No team members found.</p>
      </section>
    )
  }

  return (
    <section className="bg-[#f7f7f7] py-16 px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-[#4f2e1e] mb-4">
        Our Team
      </h2>
      <p className="max-w-2xl mx-auto text-gray-600 mb-10">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      </p>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={30}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="max-w-7xl mx-auto"
      >
        {teamMembers.map((member) => {
          const { name, position, email, whatsapp, image } = member
          const imageUrl = image?.url
            ? `http://localhost:1337${image.url}`
            : '/images/fallback.jpg'

          return (
            <SwiperSlide key={member.id} className="rounded overflow-hidden bg-white shadow">
              <Image
              width={300}
              height={300}
                src={imageUrl}
                alt={name}
                className="w-full h-60 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/fallback.jpg'
                }}
              />
              <div className="py-4 px-2">
                <h3 className="text-lg font-bold text-[#4f2e1e]">{name}</h3>
                <p className="text-gray-500 text-sm mb-2">{position}</p>
                <p className="text-gray-400 text-xs mb-2">{email}</p>
                <p className="text-gray-400 text-xs mb-3">+{whatsapp}</p>
                <div className="flex justify-center gap-4 text-[#4f2e1e] text-lg">
                  <FaWhatsapp className="cursor-pointer hover:text-green-500" />
                  <FaPhoneAlt className="cursor-pointer hover:text-blue-500" />
                  <FaEnvelope className="cursor-pointer hover:text-red-500" />
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </section>
  )
}
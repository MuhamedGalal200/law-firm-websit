'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { getTestimonials } from '@/lib/api'

type MessageNode = {
    type: string
    children: { type: string; text: string }[]
}

type Testimonial = {
    id: number
    name: string
    position: string
    image?: {
        url: string
    }
    message: MessageNode[]
}

export default function Clients() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [current, setCurrent] = useState(0)
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])


    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getTestimonials()
                const formatted = res.data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    position: item.position,
                    image: item.image ? { url: item.image.url } : undefined,
                    message: item.message,
                }))
                setTestimonials(formatted)
            } catch (err) {
                
            }
        }

        fetchData()
    }, [])

    const prevTestimonial = () => {
        setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
    }

    const nextTestimonial = () => {
        setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
    }

    if (!hasMounted || testimonials.length === 0) {
        return (
            <section className="bg-[#4f2e1e] text-white px-6 py-16 text-center">
                <p>Loading testimonials...</p>
            </section>
        )
    }


    const { name, position, image, message } = testimonials[current]
    const imageUrl = image?.url
        ? `http://localhost:1337${image.url}`
        : '/images/client-fallback.jpg'

    // Extract text safely
    const messageText = message?.[0]?.children?.[0]?.text || 'No message'

    return (
        <section className="bg-[#4f2e1e] text-white px-6 py-16 relative">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    What our clients are saying
                </h2>
                <p className="text-sm md:text-base max-w-2xl mb-10">
                    Our clients range from individual investors to international companies.
                </p>

                <div className="flex flex-col md:flex-row items-start gap-10">
                    <Image
                        src={imageUrl}
                        alt={name}
                        width={280}
                        height={280}
                        className="object-cover rounded-sm"
                    />

                    <div className="flex-1">
                        <p className="text-sm md:text-base mb-6">{messageText}</p>
                        <p className="font-bold">{name}</p>
                        <p className="text-sm text-gray-300">{position}</p>
                    </div>
                </div>

                <div className="absolute right-10 flex flex-row gap-4 transform -translate-y-1/2">
                    <button
                        onClick={prevTestimonial}
                        className="bg-[#593623] p-3 rounded-full hover:bg-[#6c4530]"
                    >
                        <FaArrowLeft />
                    </button>
                    <button
                        onClick={nextTestimonial}
                        className="bg-white text-[#4f2e1e] p-3 rounded-full hover:opacity-90"
                    >
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </section>
    )
}

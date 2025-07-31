'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'

type Blog = {
  id: number
  title: string
  slug: string
  publishedDate: string
  image: { url: string }[]
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('http://localhost:1337/api/blogs?populate=image')
        const json = await res.json()
        const blogData = json.data.map((item: any) => ({
          id: item.id,
          title: item.attributes.title,
          slug: item.attributes.slug,
          publishedDate: item.attributes.publishedDate,
          image: item.attributes.image?.data?.map((img: any) => ({
            url: img.attributes.url,
          })) || [],
        }))
        setBlogs(blogData)
      } catch (err) {
        console.error('Error fetching blogs:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  return (
    <>
      {/* ✅ Header/Navbar */}
      <Header />

      <div className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-3xl font-bold mb-6 text-[#4f2e1e]">Blog Posts</h1>

        {/* ✅ Loading State */}
        {loading && (
          <div className="text-center text-gray-500 py-10">Loading blog posts...</div>
        )}

        {/* ✅ Error State */}
        {error && (
          <div className="text-center text-red-500 py-10">
            Failed to load blog posts. Please try again later.
          </div>
        )}

        {/* ✅ No Blogs */}
        {!loading && blogs.length === 0 && (
          <div className="text-center text-gray-400 py-12 border rounded-lg shadow">
            <p className="text-xl mb-2">No blog posts found</p>
            <p className="text-sm">Please check back later.</p>
          </div>
        )}

        {/* ✅ Blog List */}
        <div className="space-y-10">
          {blogs.map((blog) => (
            <div key={blog.id} className="border-b pb-6">
              {blog.image?.[0]?.url && (
                <img
                  src={`http://localhost:1337${blog.image[0].url}`}
                  alt={blog.title}
                  className="w-full h-64 object-cover mb-4 rounded"
                />
              )}
              <h2 className="text-2xl font-semibold text-[#4f2e1e] mb-2">{blog.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                Published on: {new Date(blog.publishedDate).toLocaleDateString()}
              </p>
              <Link
                href={`/blog/${blog.slug}`}
                className="text-blue-600 hover:underline"
              >
                Read more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// app/blog/[slug]/page.tsx
import Link from 'next/link'

type Blog = {
  title: string
  content: any
  image: { url: string }[]
  publishedDate: string
}

async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const res = await fetch(
    `http://localhost:1337/api/blogs?filters[slug][$eq]=${slug}&populate=image`
  )
  const json = await res.json()
  const blog = json.data[0]

  if (!blog) return null

  return {
    title: blog.attributes.title,
    content: blog.attributes.content,
    image: blog.attributes.image?.data?.map((img: any) => ({
      url: img.attributes.url,
    })) || [],
    publishedDate: blog.attributes.publishedDate,
  }
}

export default async function BlogDetails({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug)

  if (!blog) return <div className="text-center py-20">Blog not found</div>

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link href="/blog" className="text-sm text-gray-500 hover:underline mb-4 block">
        ← Back to Blog
      </Link>

      <h1 className="text-3xl font-bold text-[#4f2e1e] mb-4">{blog.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        Published on {new Date(blog.publishedDate).toLocaleDateString()}
      </p>

      {blog.image?.[0]?.url && (
        <img
          src={`http://localhost:1337${blog.image[0].url}`}
          alt={blog.title}
          className="w-full h-72 object-cover rounded mb-6"
        />
      )}

      <div className="prose prose-lg max-w-none">
        {blog.content.map((block: any, i: number) => {
          if (block.type === 'paragraph') {
            return <p key={i}>{block.children.map((c: any) => c.text).join('')}</p>
          }
          return null
        })}
      </div>
    </div>
  )
}

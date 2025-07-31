import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Link from 'next/link'

type RichTextNode = {
    type: string
    children: { type: string; text: string }[]
}

type Service = {
    id: number
    title: string
    slug: string
    description: RichTextNode[]
}

async function getServiceBySlug(slug: string): Promise<Service | null> {
    const res = await fetch(
        `http://localhost:1337/api/services?filters[slug][$eq]=${slug}`
    )
    const json = await res.json()
    return json.data?.[0] || null
}

function renderDescription(blocks: RichTextNode[]) {
    return blocks.map((block, i) => {
        if (block.type === 'paragraph') {
            return (
                <p key={i} className="mb-4 text-gray-700 leading-relaxed">
                    {block.children.map((child, j) => (
                        <span key={j}>{child.text}</span>
                    ))}
                </p>
            )
        }

        // You can handle other block types (headings, lists) here later
        return null
    })
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
    const service = await getServiceBySlug(params.slug)

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center py-20">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Service not found</h1>
                        <p className="text-gray-600">The service you're looking for doesn't exist.</p>
                        <Link href="/" className="inline-block mt-4 text-[#4f2e1e] hover:underline">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-1">
                {/* Hero Section with Background Image */}
                <section
                    className="w-full h-64 sm:h-80 md:h-96 bg-cover bg-center bg-no-repeat relative"
                    style={{ backgroundImage: "url('/images/bg.png')" }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50" />
                    
                    {/* Hero Content */}
                    <div className="relative z-10 h-full flex items-center justify-center text-white px-4">
                        <div className="text-center">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                {service.title}
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-2xl">
                                Professional legal services tailored to your needs
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                        {/* Back link */}
                        <Link 
                            href="/" 
                            className="inline-flex items-center text-sm text-gray-500 hover:text-[#4f2e1e] hover:underline mb-8 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Services
                        </Link>

                        {/* Service Title (if you want it repeated in content) */}
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#4f2e1e] mb-8">
                            About {service.title}
                        </h2>

                        {/* Description Content */}
                        <div className="prose prose-lg max-w-none mb-12">
                            {service.description && service.description.length > 0 ? (
                                renderDescription(service.description)
                            ) : (
                                <p className="text-gray-700 leading-relaxed">
                                    Detailed information about this service will be available soon. 
                                    Please contact us for more information about our {service.title.toLowerCase()} services.
                                </p>
                            )}
                        </div>

                        {/* Call-to-Action Section */}
                        <div className="bg-gray-50 rounded-lg p-6 sm:p-8 text-center">
                            <h3 className="text-xl sm:text-2xl font-semibold text-[#4f2e1e] mb-4">
                                Need Professional Legal Assistance?
                            </h3>
                            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                                At Law Firm, we aim to provide the best legal services to ensure your rights 
                                and offer effective legal solutions. Contact us today to receive professional 
                                and comprehensive legal consultation.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    href="/contact" 
                                    className="bg-[#4f2e1e] text-white px-6 py-3 rounded-lg hover:bg-[#3d2318] transition-colors font-medium"
                                >
                                    Contact Us
                                </Link>
                                <Link 
                                    href="/services" 
                                    className="border border-[#4f2e1e] text-[#4f2e1e] px-6 py-3 rounded-lg hover:bg-[#4f2e1e] hover:text-white transition-colors font-medium"
                                >
                                    View All Services
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    )
}
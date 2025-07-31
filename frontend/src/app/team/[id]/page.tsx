import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'

async function getTeamMemberById(id: string) {
  const res = await fetch(`http://localhost:1337/api/team-members/${id}?populate=photo`)
  if (!res.ok) return null
  const json = await res.json()
  return json.data || null
}

export default async function TeamMemberPage({ params }: { params: { id: string } }) {
  const member = await getTeamMemberById(params.id)
  
  if (!member) {
    return (
      <>
        <Header />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Team member not found</h1>
          <p className="text-gray-600">The team member you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </>
    )
  }

  // Handle the flat data structure from your API
  const { name, position, email, whatsapp, photo } = member
  const imageUrl = photo?.url
    ? `http://localhost:1337${photo.url}`
    : '/images/fallback.jpg'

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto py-20 px-6">
        <div className="text-center">
          <Image
            width={300}
            height={300}
            src={imageUrl}
            alt={name}
            className="w-64 h-64 object-cover rounded-full mx-auto mb-6"
            onError={(e) => {
              e.currentTarget.src = '/images/fallback.jpg'
            }}
          />
          <h1 className="text-3xl font-bold text-[#4f2e1e] mb-2">{name}</h1>
          <p className="text-xl text-gray-600 mb-4">{position}</p>
          
          <div className="bg-gray-50 rounded-lg p-6 mt-8 text-left max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-[#4f2e1e] mb-4">Contact Information</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> 
                <a href={`mailto:${email}`} className="text-blue-600 hover:underline ml-2">
                  {email}
                </a>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">WhatsApp:</span> 
                <a href={`https://wa.me/${whatsapp}`} className="text-green-600 hover:underline ml-2">
                  +{whatsapp}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
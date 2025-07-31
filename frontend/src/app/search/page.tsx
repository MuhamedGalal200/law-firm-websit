'use client'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getServices, getTeamMembers } from '@/lib/api'
import Footer from '@/components/Footer'

type Service = { id: number; title: string; slug: string }
type TeamMember = { 
  id: number; 
  name: string; 
  position: string;
  email: string;
  whatsapp: string;
}

const ITEMS_PER_PAGE = 5 // Adjust this number as needed

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('query')?.toLowerCase() || ''
  const tab = searchParams.get('tab') || 'all'
  const currentPage = parseInt(searchParams.get('page') || '1')

  const [services, setServices] = useState<Service[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [servicesRes, teamRes] = await Promise.all([
          getServices(),
          getTeamMembers(),
        ])

        const filteredServices = servicesRes.filter((s: Service) =>
          s.title.toLowerCase().includes(query)
        )
        const filteredTeam = teamRes.filter((t: TeamMember) =>
          t.name.toLowerCase().includes(query)
        )

        // Calculate total results based on current tab
        let totalCount = 0
        if (tab === 'services') {
          totalCount = filteredServices.length
        } else if (tab === 'team') {
          totalCount = filteredTeam.length
        } else { // 'all'
          totalCount = filteredServices.length + filteredTeam.length
        }

        setTotalResults(totalCount)
        setServices(filteredServices)
        setTeam(filteredTeam)
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (query) fetchData()
  }, [query, tab])

  const handleTabChange = (newTab: string) => {
    router.push(`/search?query=${query}&tab=${newTab}&page=1`)
  }

  const handlePageChange = (page: number) => {
    router.push(`/search?query=${query}&tab=${tab}&page=${page}`)
  }

  // Pagination logic
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    if (tab === 'services') {
      return {
        services: services.slice(startIndex, endIndex),
        team: [],
        totalPages: Math.ceil(services.length / ITEMS_PER_PAGE)
      }
    } else if (tab === 'team') {
      return {
        services: [],
        team: team.slice(startIndex, endIndex),
        totalPages: Math.ceil(team.length / ITEMS_PER_PAGE)
      }
    } else { // 'all'
      // For 'all' tab, we need to combine and paginate both arrays
      const combinedResults = [
        ...services.map(s => ({ ...s, type: 'service' as const })),
        ...team.map(t => ({ ...t, type: 'team' as const }))
      ]
      const paginatedResults = combinedResults.slice(startIndex, endIndex)
      
      return {
        services: paginatedResults.filter(item => item.type === 'service') as Service[],
        team: paginatedResults.filter(item => item.type === 'team') as TeamMember[],
        combinedResults: paginatedResults,
        totalPages: Math.ceil(combinedResults.length / ITEMS_PER_PAGE)
      }
    }
  }

  if (loading) return <div className="p-10 text-gray-800">Loading...</div>

  const paginatedData = getPaginatedData()
  const showServices = (tab === 'services' || tab === 'all') && paginatedData.services.length > 0
  const showTeam = (tab === 'team' || tab === 'all') && paginatedData.team.length > 0

  // Pagination component
  const Pagination = ({ totalPages, currentPage, onPageChange }: {
    totalPages: number
    currentPage: number
    onPageChange: (page: number) => void
  }) => {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
      const pages = []
      const maxVisiblePages = 5
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i)
          pages.push('...')
          pages.push(totalPages)
        } else if (currentPage >= totalPages - 2) {
          pages.push(1)
          pages.push('...')
          for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
          pages.push('...')
          pages.push(totalPages)
        }
      }
      return pages
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? onPageChange(page) : null}
            disabled={page === '...'}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              page === currentPage
                ? 'bg-[#4f2e1e] text-white'
                : page === '...'
                ? 'text-gray-400 cursor-default'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-48 border-r p-6">
        <button
          className="mb-6 text-sm text-gray-500 hover:text-black flex items-center"
          onClick={() => router.back()}
        >
          ← Back
        </button>

        <div className="space-y-2">
          <button
            onClick={() => handleTabChange('all')}
            className={`block px-4 py-2 w-full text-left rounded transition-colors ${
              tab === 'all' ? 'bg-[#4f2e1e] text-white' : 'hover:bg-gray-100'
            }`}
          >
            All ({services.length + team.length})
          </button>
          <button
            onClick={() => handleTabChange('team')}
            className={`block px-4 py-2 w-full text-left rounded transition-colors ${
              tab === 'team' ? 'bg-[#4f2e1e] text-white' : 'hover:bg-gray-100'
            }`}
          >
            Team ({team.length})
          </button>
          <button
            onClick={() => handleTabChange('services')}
            className={`block px-4 py-2 w-full text-left rounded transition-colors ${
              tab === 'services' ? 'bg-[#4f2e1e] text-white' : 'hover:bg-gray-100'
            }`}
          >
            Services ({services.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-10 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              Search Results for "<span className="text-[#4f2e1e]">{query}</span>"
            </h1>
            <p className="text-gray-600">
              Found {totalResults} result{totalResults !== 1 ? 's' : ''} 
              {totalResults > 0 && ` • Page ${currentPage} of ${paginatedData.totalPages}`}
            </p>
          </div>

          {/* Results */}
          <div className="space-y-8">
            {showTeam && (
              <div>
                <h2 className="text-lg font-semibold mb-4 text-[#4f2e1e]">Team Members</h2>
                <div className="space-y-4">
                  {paginatedData.team.map((member) => (
                    <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-medium text-lg">{member.name}</h3>
                      <p className="text-gray-600">{member.position}</p>
                      <p className="text-sm text-gray-400">{member.email}</p>
                      <Link
                        href={`/team/${member.id}`}
                        className="inline-block mt-2 text-[#4f2e1e] hover:text-[#3d2318] underline text-sm font-medium"
                      >
                        View Profile →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showServices && (
              <div>
                <h2 className="text-lg font-semibold mb-4 text-[#4f2e1e]">Services</h2>
                <div className="space-y-4">
                  {paginatedData.services.map((service) => (
                    <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-medium text-lg">{service.title}</h3>
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-block mt-2 text-[#4f2e1e] hover:text-[#3d2318] underline text-sm font-medium"
                      >
                        Learn More →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {totalResults === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your search terms or browse all content.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination 
            totalPages={paginatedData.totalPages} 
            currentPage={currentPage} 
            onPageChange={handlePageChange} 
          />
        </div>

        <Footer />
      </div>
    </div>
  )
}
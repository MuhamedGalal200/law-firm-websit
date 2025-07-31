
export async function getTeamMembers() {
  const res = await fetch('http://localhost:1337/api/team-members?populate=photo')
  if (!res.ok) throw new Error('Failed to fetch team members')
  const json = await res.json()
  
  return json.data.map((item: any) => ({
    id: item.id,
    name: item.name,
    position: item.position,
    email: item.email,
    whatsapp: item.whatsapp,
    image: item.photo  
  }))
}
export async function getTestimonials() {
  const res = await fetch('http://localhost:1337/api/testimonials?populate=image')
  const data = await res.json()
  return data
}

export async function getServices() {
  const res = await fetch('http://localhost:1337/api/services')
  const json = await res.json()

  return json.data.map((item: any) => ({
    id: item.id,
    title: item.title ?? item.attributes?.title,
    slug: item.slug ?? item.attributes?.slug,
  }))
}

export async function getHeroSlides(locale: string) {
  try {
    console.log('Fetching hero slides for locale:', locale)
    
    const res = await fetch(
      `http://localhost:1337/api/hero-slides?locale=${locale}&populate[image]=true&populate[video]=true`
    )
    
    console.log('Response status:', res.status)
    console.log('Response ok:', res.ok)
    
    const json = await res.json()
    console.log('Raw API response:', json)
    
    // If error in response
    if (!res.ok) {
      console.error('Hero API error:', json)
      throw new Error(`API Error: ${res.status} - ${json.error?.message || 'Unknown error'}`)
    }
    
    if (!json.data || !Array.isArray(json.data)) {
      console.error('Invalid data structure:', json)
      throw new Error('Invalid API response structure')
    }
    
    const mappedData = json.data.map((item: any) => {
      console.log('Processing item:', item)
      
      let descriptionText = 'No description'
      if (item.description && Array.isArray(item.description)) {
        const textParts = item.description
          .filter((block: any) => block.type === 'paragraph')
          .map((block: any) => 
            block.children
              ?.filter((child: any) => child.type === 'text')
              .map((child: any) => child.text)
              .join('')
          )
          .filter(Boolean)
        
        if (textParts.length > 0) {
          descriptionText = textParts.join(' ')
        }
      }
      
      return {
        id: item.id,
        title: item.title || 'No title',
        description: descriptionText,
        image: item.image || null,
        video: item.video || null,
      }
    })
    
    console.log('Mapped hero slides:', mappedData)
    return mappedData
    
  } catch (error) {
    console.error('Error in getHeroSlides:', error)
    throw error
  }
}

export async function getBlogPosts() {
  const res = await fetch('http://localhost:1337/api/blogs?populate=image')
  const json = await res.json()
  return json.data
}

export async function getBlogBySlug(slug: string) {
  const res = await fetch(`http://localhost:1337/api/blogs?filters[slug][$eq]=${slug}&populate=image`)
  const json = await res.json()
  return json.data?.[0] || null
}


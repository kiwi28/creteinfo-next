import type { ImageLoader } from 'next/image'

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pb-fly-creteinfo.fly.dev'

const pbImageLoader: ImageLoader = ({ src, width }) => {
  // PocketBase images → use built-in thumb parameter
  if (src.startsWith(PB_URL) && src.includes('/api/files/')) {
    const url = new URL(src)
    url.searchParams.set('thumb', `${width}x0`)
    return url.toString()
  }

  // Unsplash images → update the w= param
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src)
    url.searchParams.set('w', String(width))
    return url.toString()
  }

  // Relative paths (local images) → append width as query param
  if (src.startsWith('/')) {
    return `${src}${src.includes('?') ? '&' : '?'}w=${width}`
  }

  // Other absolute URLs → append width as query param
  const url = new URL(src)
  url.searchParams.set('w', String(width))
  return url.toString()
}

export default pbImageLoader

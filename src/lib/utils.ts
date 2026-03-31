import { pb } from './pocketbase'

/**
 * Get the full URL for a PocketBase file
 */
export function getFileUrl(
  collectionId: string,
  recordId: string,
  filename: string,
  options?: { thumb?: string }
): string {
  let url = `${pb.baseUrl}/api/files/${collectionId}/${recordId}/${filename}`

  if (options?.thumb) {
    url += `?thumb=${options.thumb}`
  }

  return url
}

/**
 * Get cover image URL for a service
 */
export function getServiceCoverUrl(service: { collectionId?: string; id: string; coverImage?: string }): string | null {
  if (!service.coverImage) return null

  const collectionId = service.collectionId || 'pbc_863811952'
  return getFileUrl(collectionId, service.id, service.coverImage)
}

/**
 * Get detail images URLs for a service
 */
export function getServiceDetailUrls(
  service: { collectionId?: string; id: string; detailImages?: string[] }
): string[] {
  if (!service.detailImages || service.detailImages.length === 0) return []

  const collectionId = service.collectionId || 'pbc_863811952'
  return service.detailImages.map((filename) => getFileUrl(collectionId, service.id, filename))
}

/**
 * Slugify a string for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

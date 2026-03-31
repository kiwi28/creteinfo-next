import PocketBase from 'pocketbase'

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pb-fly-creteinfo.fly.dev'

export const pb = new PocketBase(POCKETBASE_URL)

// Disable auto-cancellation for SSR requests
pb.autoCancellation(false)

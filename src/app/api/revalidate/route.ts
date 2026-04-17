import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { serviceId } = body

  // Bust the services cache tag (expire immediately)
  revalidateTag('services', { expire: 0 })

  // Revalidate specific service page if ID provided
  if (serviceId) {
    revalidatePath(`/services/${serviceId}`)
  }

  // Revalidate home page (search results)
  revalidatePath('/')

  return NextResponse.json({ revalidated: true, now: Date.now() })
}

import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateService: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  if (operation === 'update' || operation === 'create') {
    revalidatePath('/', 'layout')
    revalidateTag('services', 'default')
    revalidatePath(`/services/${doc.slug}`)
  }

  return doc
}

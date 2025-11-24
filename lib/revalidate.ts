import { revalidatePath } from 'next/cache'

/**
 * Revalidate all pages after admin data changes
 * This ensures that changes made in the admin panel appear immediately on the site
 */
export function revalidateAllPages() {
    // Revalidate the entire site
    revalidatePath('/', 'layout')
}

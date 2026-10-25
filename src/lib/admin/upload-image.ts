import imageCompression from 'browser-image-compression'
import { createBrowserSupabase } from '@/lib/supabase/browser'
import { mediaPublicUrl } from '@/lib/supabase/media'

type Folder = 'posts' | 'people' | 'regions' | 'partners'

// compress in the browser (webp, max 1600px) so the free Storage tier lasts, then upload to the media bucket
export async function uploadImage(file: File, folder: Folder): Promise<{ path: string; url: string }> {
  const compressed = await imageCompression(file, {
    maxWidthOrHeight: 1600,
    maxSizeMB: 0.8,
    useWebWorker: true,
    fileType: 'image/webp',
  })

  const supabase = createBrowserSupabase()
  // a collision-proof name under the folder; the original name is dropped on purpose
  const path = `${folder}/${crypto.randomUUID()}.webp`

  const { error } = await supabase.storage
    .from('media')
    .upload(path, compressed, { contentType: 'image/webp', upsert: false })

  if (error) throw new Error('Upload failed. Check your connection and try again.')

  return { path, url: mediaPublicUrl(path) }
}

// kept for the blog editor's existing calls
export async function uploadPostImage(file: File) {
  return uploadImage(file, 'posts')
}

// resolve a stored path to its public URL (for showing a saved image)
export function mediaUrl(path: string): string {
  return mediaPublicUrl(path)
}

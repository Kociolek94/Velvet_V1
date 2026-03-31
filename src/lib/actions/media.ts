'use server'

import { createClient } from '@/utils/supabase/server'

export async function uploadMedia(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) throw new Error('No file provided')

    const supabase = await createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error } = await supabase
        .storage
        .from('velvet-media')
        .upload(filePath, file)

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase
        .storage
        .from('velvet-media')
        .getPublicUrl(filePath)

    return { 
        url: publicUrl,
        path: filePath 
    }
}

import { supabase } from "./supabase"

async function uploadImageToSupabase(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `images/${fileName}`

  const { data, error } = await supabase.storage
    .from('your-bucket-name')
    .upload(filePath, file)

    console.log(data)

  if (error) {
    console.error('Error uploading file:', error)
    throw error
  }

  const { data: { publicUrl } } = supabase.storage
    .from('your-bucket-name')
    .getPublicUrl(filePath)

  return publicUrl
}

export default uploadImageToSupabase;

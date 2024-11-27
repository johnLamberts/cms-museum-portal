import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

type ImageUploadProps = {
  onImageUpload: (imageUrl: string) => void
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageUrl = reader.result as string
        setPreviewUrl(imageUrl)
        onImageUpload(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="cover-photo-upload"
      />
      <label htmlFor="cover-photo-upload">
        <Button >Upload Cover Photo</Button>
      </label>
      {previewUrl && (
        <div className="mt-2">
          <img src={previewUrl} alt="Cover photo preview" className="max-w-full h-auto rounded-md" />
        </div>
      )}
    </div>
  )
}


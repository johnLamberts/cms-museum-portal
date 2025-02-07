type MuseumExhibitPreviewProps = {
  title: string
  coverPhoto: string
  description: string
  colorTheme: string
}

export function MuseumExhibitPreview({ title, coverPhoto, description, colorTheme }: MuseumExhibitPreviewProps) {
  return (
    <div className="space-y-4" style={{ backgroundColor: colorTheme, padding: '2rem', borderRadius: '0.5rem' }}>
      <h2 className="text-2xl font-bold">{title}</h2>
      {coverPhoto && <img src={coverPhoto} alt={title} className="w-full h-64 object-cover rounded-md" />}
      <div dangerouslySetInnerHTML={{ __html: description }} className="prose max-w-none" />
    </div>
  )
}

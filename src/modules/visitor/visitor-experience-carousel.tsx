import { ChevronLeft, ChevronRight } from "lucide-react"
import React, { useState } from "react"

interface ImageCarouselProps {
  images: string[]
  aspectRatio?: "square" | "video" | number
  height?: string
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  aspectRatio = "square",
  height = "h-96" 
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  
  if (!images || images.length === 0) return null
  
  // Calculate aspect ratio class
  const getAspectRatioClass = (): string => {
    if (aspectRatio === "square") return "aspect-square"
    if (aspectRatio === "video") return "aspect-video"
    return "" // Custom aspect ratio would be handled via style
  }

  // Previous image handler
  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }

  // Next image handler
  const handleNext = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Go to specific image
  const goToImage = (index: number): void => {
    setCurrentIndex(index)
  }
  
  return (
    <div className="relative w-full">
      {/* Main image container with configurable aspect ratio */}
      <div 
        className={`relative w-full ${getAspectRatioClass()} ${height} overflow-hidden bg-gray-100`}
        style={typeof aspectRatio === 'number' ? { aspectRatio } : undefined}
      >
        {images.map((image, index) => (
          <div 
            key={index}
            className={`absolute top-0 left-0 h-full w-full transition-transform duration-300 ease-out ${
              index === currentIndex ? "translate-x-0" : 
              index < currentIndex ? "-translate-x-full" : "translate-x-full"
            }`}
            style={{ zIndex: index === currentIndex ? 10 : 0 }}
          >
            <img
              src={image || "/placeholder.svg?height=400&width=400"}
              alt={`Post image ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows - only show if multiple images */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-white/70 shadow-md rounded-full z-20 hover:bg-white/90 transition-colors"
            onClick={handlePrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-white/70 shadow-md rounded-full z-20 hover:bg-white/90 transition-colors"
            onClick={handleNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Image indicator dots - only show if multiple images */}
      {images.length > 1 && (
        <div className="absolute bottom-3 w-full flex justify-center gap-1 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index ? "bg-primary" : "bg-white/60"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageCarousel

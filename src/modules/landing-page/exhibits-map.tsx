import Eyebrow from '@/components/eyebrow'
import { Button } from '@/components/ui/button'
import {
  Info,
  MapPin,
} from 'lucide-react'

type MuseumLocation = {
  id: number
  name: string
  address: string
  color: string // For pin color, like 'red', 'blue', 'green'
}

type MuseumMapProps = {
  locations: MuseumLocation[]
  title?: string
  subtitle?: string
  description?: string
  onViewFullMap?: () => void
}

const MuseumMap = ({
  locations = [],
  title = "Museum Locations",
  subtitle = "Find Your Way",
  description = "Explore our interactive map to discover museums and cultural sites across Rizal province",
  onViewFullMap = () => {}
}: MuseumMapProps) => {
  return (
    <div className="bg-gray-100 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <Eyebrow label={subtitle} />
          <h2 className="text-3xl font-display font-bold text-[#492309] mt-2">
            {title}
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto">
          {/* This would be replaced with an actual map implementation */}
          <div className="aspect-video bg-gray-200 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700">Interactive Map</h3>
                <p className="text-gray-500 mt-2 mb-4">This would be an interactive map showing all museum locations</p>
                <Button onClick={onViewFullMap}>View Full Map</Button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="font-medium text-lg mb-4">Featured Museum Locations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map(location => (
                <div key={location.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <MapPin className={`h-5 w-5 text-${location.color}-500 mt-0.5`} />
                  <div>
                    <h4 className="font-medium">{location.name}</h4>
                    <p className="text-sm text-gray-600">{location.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MuseumMap

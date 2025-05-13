/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar, Clock, Info, MapPin, User } from 'lucide-react'
import { ExhibitCardProps } from './featured-exhibits'

// Extended type for complete exhibit details
export type ExhibitDetailProps = ExhibitCardProps & {
  museumContent?: {
    description?: string
    highlights?: string[]
    artistInfo?: {
      name: string
      bio: string
      image?: string
    }
    gallery?: string[]
  } | null
  exhibitExclusive?: string | null
}

// Color function (duplicated from FeaturedExhibits for independence)
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'ongoing':
      return 'bg-emerald-100 text-emerald-800'
    case 'coming soon':
      return 'bg-blue-100 text-blue-800'
    case 'ended':
      return 'bg-gray-100 text-gray-800'
    case 'permanent':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

type ExhibitDetailModalProps = {
  exhibit: ExhibitDetailProps | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onReserve?: (exhibitId: number) => void
}

const ExhibitDetailModal = ({ 
  exhibit, 
  open, 
  onOpenChange,
  onReserve = () => {} 
}: ExhibitDetailModalProps) => {
  
  if (!exhibit) return null
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge className={getStatusColor(exhibit.status)}>
              {exhibit.status}
            </Badge>
            {exhibit.fee && (
              <Badge className="bg-amber-100 text-amber-800">
                {exhibit.fee === 'Free' ? 'Free Entry' : exhibit.fee}
              </Badge>
            )}
          </div>
          <DialogTitle className="text-2xl font-display text-[#492309]">
            {exhibit.title}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1 text-gray-600">
            <User className="h-4 w-4" /> Curated by {exhibit.curator || 'Unknown Curator'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative h-64 md:h-80 overflow-hidden rounded-lg mb-6">
          {exhibit.coverPhoto ? (
            <img 
              src={exhibit.coverPhoto} 
              alt={exhibit.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
            <Clock className="h-6 w-6 text-[#492309] mb-2" />
            <h4 className="font-medium text-sm">Expected Time</h4>
            <p className="text-gray-600">{exhibit.expectedTime || 'Duration varies'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
            <MapPin className="h-6 w-6 text-[#492309] mb-2" />
            <h4 className="font-medium text-sm">Location</h4>
            <p className="text-gray-600">{exhibit.address || 'Location TBA'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
            <Info className="h-6 w-6 text-[#492309] mb-2" />
            <h4 className="font-medium text-sm">Exclusive Exhibit</h4>
            <p className="text-gray-600">{exhibit.exhibitExclusive === 'Yes' ? 'Yes' : 'No'}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">About this Exhibit</h3>
          <p className="text-gray-700">
            {exhibit.museumContent?.description || 
              "This exhibit showcases a unique collection of artistic works and cultural artifacts that represent the rich heritage of Rizal province. Visitors will experience a journey through time and culture, gaining insights into the local traditions and creative expressions."}
          </p>
          
          {exhibit.museumContent?.highlights && exhibit.museumContent.highlights.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Highlights</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {exhibit.museumContent.highlights.map((highlight: any, index: any) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}
          
          {exhibit.museumContent?.artistInfo && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">About the Artist</h3>
              <div className="flex flex-col md:flex-row gap-4">
                {exhibit.museumContent.artistInfo.image && (
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    <img 
                      src={exhibit.museumContent.artistInfo.image} 
                      alt={exhibit.museumContent.artistInfo.name} 
                      className="w-full h-full object-cover"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150'
                      }}
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{exhibit.museumContent.artistInfo.name}</h4>
                  <p className="text-gray-700 text-sm mt-1">{exhibit.museumContent.artistInfo.bio}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <Button 
            className="w-full bg-[#492309]"
            onClick={() => onReserve(exhibit.id)}
          >
            Reserve a Visit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ExhibitDetailModal

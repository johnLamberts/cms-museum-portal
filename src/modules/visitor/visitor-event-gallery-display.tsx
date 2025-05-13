 
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageIcon, XIcon, ZoomInIcon } from 'lucide-react';
import { useState, } from 'react';
import { EventImage } from '../admin/events/usePastEvents';

interface EventGalleryDisplayProps {
  eventImages: EventImage[];
  isLoading?: boolean;
  className?: string;
}

const EventGalleryDisplay = ({ eventImages, isLoading = false, className = "" }: EventGalleryDisplayProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [selectedImage, setSelectedImage] = useState<EventImage | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  // Open lightbox with selected image
  const openLightbox = (image: EventImage) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Event Gallery</h2>
            <p className="text-muted-foreground">
              Photos from this event
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((placeholder) => (
            <div key={placeholder} className="aspect-square bg-muted animate-pulse rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!eventImages || eventImages.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Event Gallery</h2>
            <p className="text-muted-foreground">
              Photos from this event
            </p>
          </div>
        </div>
        <Card className="bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Photos Available</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Photos from this event will be available soon. Please check back later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Event Gallery</h2>
          <p className="text-muted-foreground">
            {eventImages.length} photos from this event
          </p>
        </div>
        
        <Tabs 
          value={viewMode} 
          onValueChange={(value) => setViewMode(value as 'grid' | 'masonry')} 
          className="hidden md:block"
        >
          <TabsList className="grid w-[180px] grid-cols-2">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="masonry">Masonry View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {eventImages.map((image) => (
            <div 
              key={image.image_id} 
              className="aspect-square rounded-md overflow-hidden group relative cursor-pointer"
              onClick={() => openLightbox(image)}
            >
              <img
                src={image.url}
                alt={image.caption || 'Event photo'}
                className="h-full w-full object-cover transition-all group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button size="icon" variant="ghost" className="text-white">
                  <ZoomInIcon className="h-6 w-6" />
                </Button>
              </div>
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  <p className="text-white text-sm truncate">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Masonry View */}
      {viewMode === 'masonry' && (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {eventImages.map((image, index) => (
            <div 
              key={image.image_id} 
              className={`break-inside-avoid rounded-md overflow-hidden group relative cursor-pointer ${index % 3 === 0 ? 'aspect-[3/4]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]'}`}
              onClick={() => openLightbox(image)}
            >
              <img
                src={image.url}
                alt={image.caption || 'Event photo'}
                className="h-full w-full object-cover transition-all group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button size="icon" variant="ghost" className="text-white">
                  <ZoomInIcon className="h-6 w-6" />
                </Button>
              </div>
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  <p className="text-white text-sm truncate">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox/Modal for Image View */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="sm:max-w-3xl p-1 bg-background/95 backdrop-blur-sm border-none">
          <div className="relative w-full">
            <Button 
              onClick={closeLightbox} 
              size="icon" 
              variant="ghost" 
              className="absolute top-2 right-2 z-10 bg-black/30 text-white hover:bg-black/50 hover:text-white"
            >
              <XIcon className="h-5 w-5" />
            </Button>
            
            {selectedImage && (
              <div className="flex flex-col">
                <div className="max-h-[80vh] overflow-hidden">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.caption || 'Event photo'}
                    className="w-full h-auto object-contain"
                  />
                </div>
                {selectedImage.caption && (
                  <div className="p-4">
                    <p className="text-foreground text-sm">{selectedImage.caption}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventGalleryDisplay;

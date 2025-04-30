/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner } from '@/components/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, ClockIcon, MapPinIcon, StarIcon, UsersIcon } from 'lucide-react';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import eventService from './service/event.service';

/**
 * Public-facing component to display past events on a website
 */
const PublicPastEvents = () => {
  const [loading, setLoading] = useState(true);
  const [pastEvents, setPastEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTab, setDialogTab] = useState('details');
  
  // Fetch past events on component mount
  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        setLoading(true);
        
        // Get completed events with testimonials and gallery info
        const { data, error } = await eventService.getCompletedEvents();
        
        if (error) throw error;
        
        // Get testimonials and images for each event
        const eventsWithDetails: any = await Promise.all(
          data.map(async (event) => {
            // Get testimonials
            const { data: testimonials } = await eventService.getEventTestimonials(event.event_id as string);
            
            // Get images
            const { data: images } = await eventService.getEventImages(event.event_id as string);
            
            // Get highlights
            const { data: highlights } = await eventService.getEventHighlights(event.event_id as string);
            
            // Get documentation
            const { data: documentation } = await eventService.getEventDocumentation(event.event_id as string);
            
            return {
              ...event,
              testimonials: testimonials || [],
              images: images || [],
              highlights: highlights?.map(h => h.highlight_text) || [],
              documentation: documentation || null
            };
          })
        );
        
        setPastEvents(eventsWithDetails);
      } catch (error) {
        console.error('Error fetching past events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPastEvents();
  }, []);
  
  // Filter events by category
  const filteredEvents = pastEvents.filter((event: any) => 
    activeCategory === 'all' || event.category === activeCategory
  );
  
  // Categories for filtering tabs
  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'exhibition', name: 'Exhibitions' },
    { id: 'workshop', name: 'Workshops' },
    { id: 'conference', name: 'Conferences' },
    { id: 'seminar', name: 'Seminars' }
  ];
  
  // Helper to calculate average rating for an event
  const getAverageRating = (event: any) => {
    if (!event.testimonials || event.testimonials.length === 0) return 0;
    
    const sum = event.testimonials.reduce((acc: any, t: { rating: any; }) => acc + t.rating, 0);
    return (sum / event.testimonials.length).toFixed(1);
  };
  
  // Open event detail dialog
  const openEventDetails = (event: any) => {
    setSelectedEvent(event);
    setDialogTab('details');
    setIsDialogOpen(true);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner className="mx-auto" />
        <span className="sr-only">Loading past events...</span>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Past Events</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our collection of successful past events and discover the experiences we've created.
        </p>
        
        {/* Category Tabs */}
        <div className="mt-8">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="inline-flex h-10 p-1">
              {categories.map(category => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="rounded-md px-3"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No past events found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event: any) => (
            <Card key={event.event_id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative aspect-video">
                <img
                  src={event.coverPhoto || '/api/placeholder/400/320'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {event.category || 'Event'}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{new Date(event.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {event.description || 'This exciting event featured highlights and activities for all attendees.'}
                </p>
                
                {/* Event Stats */}
                <div className="flex items-center justify-between mb-4">
                  {event.testimonials.length > 0 && (
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <StarIcon
                            key={star}
                            className={`h-4 w-4 ${star <= Math.round(Number(getAverageRating(event))) 
                              ? 'text-yellow-500 fill-yellow-500' 
                              : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {getAverageRating(event)}
                      </span>
                    </div>
                  )}
                  
                  {event.attendees > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {event.attendees} attendees
                    </div>
                  )}
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => openEventDetails(event)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Event Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedEvent.title}</DialogTitle>
                <DialogDescription className="flex items-center text-base">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {new Date(selectedEvent.created_at).toLocaleDateString()}
                  {selectedEvent.location && (
                    <>
                      <span className="mx-2">•</span>
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {selectedEvent.location}
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="my-4">
                <Tabs value={dialogTab} onValueChange={setDialogTab}>
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                    <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-medium mb-3">About This Event</h3>
                        <p className="text-muted-foreground whitespace-pre-line mb-6">
                          {selectedEvent.description || 'No description available.'}
                        </p>
                        
                        {selectedEvent.highlights && selectedEvent.highlights.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-medium mb-2">Event Highlights</h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {selectedEvent.highlights.map((highlight: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: Key | null | undefined) => (
                                <li key={index} className="text-muted-foreground">{highlight}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {selectedEvent.documentation && (
                          <div>
                            <h3 className="text-lg font-medium mb-2">Summary</h3>
                            <p className="text-muted-foreground whitespace-pre-line mb-4">
                              {selectedEvent.documentation.summary || 'No summary available.'}
                            </p>
                            
                            {selectedEvent.documentation.achievements && (
                              <div className="mb-4">
                                <h4 className="text-base font-medium mb-1">Key Achievements</h4>
                                <p className="text-muted-foreground whitespace-pre-line">
                                  {selectedEvent.documentation.achievements}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="bg-muted rounded-lg p-4 mb-4">
                          <h3 className="text-lg font-medium mb-3">Event Details</h3>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="font-medium">Date</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(selectedEvent.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            {selectedEvent.location && (
                              <div className="flex items-start gap-3">
                                <MapPinIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="font-medium">Location</p>
                                  <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
                                </div>
                              </div>
                            )}
                            
                            {selectedEvent.attendees > 0 && (
                              <div className="flex items-start gap-3">
                                <UsersIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="font-medium">Attendees</p>
                                  <p className="text-sm text-muted-foreground">{selectedEvent.attendees} people</p>
                                </div>
                              </div>
                            )}
                            
                            {selectedEvent.duration && (
                              <div className="flex items-start gap-3">
                                <ClockIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="font-medium">Duration</p>
                                  <p className="text-sm text-muted-foreground">{selectedEvent.duration}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {selectedEvent.documentation && selectedEvent.documentation.statistics && (
                          <div className="bg-muted rounded-lg p-4">
                            <h3 className="text-lg font-medium mb-3">Event Statistics</h3>
                            {selectedEvent.documentation.statistics.satisfaction > 0 && (
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm">Satisfaction</span>
                                <div className="flex items-center">
                                  <div className="w-28 h-2 bg-primary/20 rounded-full mr-2">
                                    <div 
                                      className="h-full bg-primary rounded-full" 
                                      style={{ width: `${selectedEvent.documentation.statistics.satisfaction}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium">{selectedEvent.documentation.statistics.satisfaction}%</span>
                                </div>
                              </div>
                            )}
                            {selectedEvent.documentation.statistics.engagement > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Engagement</span>
                                <div className="flex items-center">
                                  <div className="w-28 h-2 bg-primary/20 rounded-full mr-2">
                                    <div 
                                      className="h-full bg-primary rounded-full" 
                                      style={{ width: `${selectedEvent.documentation.statistics.engagement}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium">{selectedEvent.documentation.statistics.engagement}%</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="gallery" className="mt-4">
                    {selectedEvent.images && selectedEvent.images.length > 0 ? (
                      <div>
                        <Carousel>
                          <CarouselContent>
                            {selectedEvent.images.map((image: { image_id: Key | null | undefined; url: string | undefined; caption: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                              <CarouselItem key={image.image_id} className="sm:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                  <div className="overflow-hidden rounded-md aspect-video">
                                    <img
                                      src={image.url}
                                      alt={image.caption || selectedEvent.title}
                                      className="h-full w-full object-cover transition-all hover:scale-105"
                                    />
                                  </div>
                                  {image.caption && (
                                    <p className="mt-2 text-sm text-muted-foreground">{image.caption}</p>
                                  )}
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No images available for this event.</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="testimonials" className="mt-4">
                    {selectedEvent.testimonials && selectedEvent.testimonials.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedEvent.testimonials.map((testimonial: { testimonial_id: Key | null | undefined; rating: number; comment: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; role: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                          <Card key={testimonial.testimonial_id} className="overflow-hidden">
                            <CardContent className="p-6">
                              <div className="flex mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    className={`h-4 w-4 ${star <= testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
                                  />
                                ))}
                              </div>
                              <p className="italic text-muted-foreground mb-4">{testimonial.comment}</p>
                              <div className="text-sm font-medium">
                                {testimonial.name}
                                {testimonial.role && <span className="text-muted-foreground">, {testimonial.role}</span>}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No testimonials available for this event.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicPastEvents;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MessageSquareQuoteIcon, StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import eventService from "../admin/events/service/event.service";

interface EventTestimonialDisplayProps {
  eventId: string;
  className?: string;
}

const EventTestimonialsDisplay = ({ eventId, className = "" }: EventTestimonialDisplayProps) => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalTestimonials: 0,
  });

  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!eventId) return;
      
      try {
        setLoading(true);
        const { data, error } = await eventService.getEventTestimonials(eventId);
        
        if (error) throw error;
        
        setTestimonials(data || []);
        
        // Calculate stats
        if (data && data.length > 0) {
          const totalRating = data.reduce((acc, item) => acc + (item.rating || 5), 0);
          setStats({
            averageRating: parseFloat((totalRating / data.length).toFixed(1)),
            totalTestimonials: data.length
          });
        }
      } catch (error) {
        console.error('Error loading testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, [eventId]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 w-36 bg-muted rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't show the section if no testimonials
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Attendee Testimonials</h2>
          <p className="text-muted-foreground">
            See what participants had to say about this event
          </p>
        </div>
        {stats.averageRating > 0 && (
          <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-full">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(stats.averageRating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{stats.averageRating}</span>
            <span className="text-sm text-muted-foreground">({stats.totalTestimonials})</span>
          </div>
        )}
      </div>

      {testimonials.length > 2 ? (
        <Carousel
          opts={{
            align: "start",
            loop: testimonials.length > 3,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.testimonial_id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-2 mt-4">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.testimonial_id} testimonial={testimonial} />
          ))}
        </div>
      )}
    </div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: any }) => {
  // Create initials from author name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(testimonial.author)}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <div className="font-medium">{testimonial.author}</div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-3.5 w-3.5 ${
                    star <= (testimonial.rating || 5)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 relative">
          <MessageSquareQuoteIcon className="absolute -top-1 -left-1 h-5 w-5 text-primary/20" />
          <p className="pl-5 text-muted-foreground italic">{testimonial.content}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventTestimonialsDisplay;

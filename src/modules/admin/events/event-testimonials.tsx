/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner } from '@/components/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  ArrowLeftIcon,
  PlusIcon,
  StarIcon,
  Trash2Icon,
  UserIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import eventService from './service/event.service';
import { usePastEvents } from './usePastEvents';

// Define testimonial interface
interface Testimonial {
  testimonial_id?: string;
  event_id: string;
  author: string;
  content: string;
  rating?: number;
  created_at?: string;
  isNew?: boolean;
}

const EventTestimonials = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const { loading, error, currentEvent } = usePastEvents(eventId);
  
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    success: boolean;
    error: string | null;
  }>({
    success: false,
    error: null,
  });

  // Fetch testimonials for this event
  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!eventId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await eventService.getEventTestimonials(eventId);
        
        if (error) throw error;
        
        setTestimonials(data || []);
      } catch (error: any) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestimonials();
  }, [eventId]);

  // Add a new testimonial form
  const handleAddTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        event_id: eventId || '',
        author: '',
        content: '',
        rating: 5,
        isNew: true,
      },
    ]);
  };

  // Remove a testimonial
  const handleRemoveTestimonial = async (index: number, testimonialId?: string) => {
    if (testimonialId && !testimonials[index].isNew) {
      // Existing testimonial - delete from database
      try {
        const { error } = await eventService.deleteEventTestimonial(testimonialId);
        if (error) throw error;
      } catch (error: any) {
        console.error('Error deleting testimonial:', error);
        return;
      }
    }
    
    // Remove from state
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  // Handle testimonial field changes
  const handleTestimonialChange = (index: number, field: keyof Testimonial, value: any) => {
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[index] = {
      ...updatedTestimonials[index],
      [field]: value,
    };
    setTestimonials(updatedTestimonials);
  };

  // Set rating for a testimonial
  const handleSetRating = (index: number, rating: number) => {
    handleTestimonialChange(index, 'rating', rating);
  };

  // Save all testimonials
  const handleSaveTestimonials = async () => {
    if (!eventId) return;
    
    setIsSaving(true);
    setSaveStatus({ success: false, error: null });
    
    try {
      // Validate testimonials
      const invalidTestimonials = testimonials.filter(
        testimonial => !testimonial.author.trim() || !testimonial.content.trim()
      );
      
      if (invalidTestimonials.length > 0) {
        throw new Error('All testimonials must have an author and content.');
      }
      
      // Process each testimonial
      for (const testimonial of testimonials) {
        if (testimonial.isNew) {
          // Add new testimonial
          await eventService.addEventTestimonial(eventId, {
            author: testimonial.author,
            content: testimonial.content,
            rating: testimonial.rating,
          });
        } else if (testimonial.testimonial_id) {
          // Update existing testimonial
          await eventService.updateEventTestimonial(testimonial.testimonial_id, {
            author: testimonial.author,
            content: testimonial.content,
            rating: testimonial.rating,
          });
        }
      }
      
      // Update event to indicate it has testimonials
      await eventService.updateEvent({
        event_id: eventId,
        has_testimonials: testimonials.length > 0,
      });
      
      setSaveStatus({ success: true, error: null });
      
      // Navigate back after successful save
      setTimeout(() => {
        navigate('/admin-dashboard/events');
      }, 1500);
    } catch (error: any) {
      console.error('Error saving testimonials:', error);
      setSaveStatus({ success: false, error: error.message || 'Failed to save testimonials' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner className="mx-auto" />
        <span className="sr-only">Loading event data...</span>
      </div>
    );
  }

  if (error || !currentEvent) {
    return (
      <div className="p-6 text-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Event not found or failed to load.'}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() =>   navigate('/admin-dashboard/events')}>
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() =>   navigate('/admin-dashboard/events')}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{currentEvent.title} - Testimonials</h1>
          <p className="text-muted-foreground">
            Manage testimonials and feedback from your event attendees
          </p>
        </div>
      </div>

      {saveStatus.success && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>
            Testimonials saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {saveStatus.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{saveStatus.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Event Testimonials</CardTitle>
            <Button onClick={handleAddTestimonial} size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </CardHeader>
          <CardContent>
            {testimonials.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-md">
                <p className="text-muted-foreground mb-4">No testimonials have been added for this event yet.</p>
                <Button onClick={handleAddTestimonial} variant="outline">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Your First Testimonial
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.testimonial_id || `new-${index}`} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium">Testimonial #{index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleRemoveTestimonial(index, testimonial.testimonial_id)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`author-${index}`}>Attendee Name</Label>
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 text-muted-foreground mr-2" />
                          <Input
                            id={`author-${index}`}
                            value={testimonial.author}
                            onChange={(e) => handleTestimonialChange(index, 'author', e.target.value)}
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`rating-${index}`}>Rating</Label>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Button
                              key={star}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0"
                              onClick={() => handleSetRating(index, star)}
                            >
                              <StarIcon
                                className={`h-6 w-6 ${
                                  star <= (testimonial.rating || 0)
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`content-${index}`}>Testimonial</Label>
                        <Textarea
                          id={`content-${index}`}
                          value={testimonial.content}
                          onChange={(e) => handleTestimonialChange(index, 'content', e.target.value)}
                          placeholder="Share the attendee's experience and feedback..."
                          className="min-h-[120px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/events')}>
              Cancel
            </Button>
            <Button onClick={handleSaveTestimonials} disabled={isSaving || testimonials.length === 0}>
              {isSaving ? 'Saving...' : 'Save Testimonials'}
            </Button>
          </CardFooter>
        </Card>

        {testimonials.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.testimonial_id || `preview-${index}`}
                    className="bg-muted/20 p-4 rounded-md"
                  >
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= (testimonial.rating || 0)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="italic text-muted-foreground mb-4">"{testimonial.content}"</p>
                    <div className="text-sm font-medium">{testimonial.author}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EventTestimonials;

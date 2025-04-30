/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';
import eventService from './service/event.service';

// Define interfaces (same as in eventService for consistency)
export interface EventFormData {
  event_id?: string;
  title: string;
  description: string;
  date: string;
  location: string;
  coverPhoto?: string;
  status?: string;
  attendees?: number;
  has_documentation?: boolean;
  has_testimonials?: boolean;
  has_gallery?: boolean;
  [key: string]: any;
}

export interface EventImage {
  image_id: string;
  event_id: string;
  url: string;
  caption?: string;
  is_cover_photo: boolean;
  display_order: number;
}

interface EventTestimonial {
  testimonial_id: string;
  event_id: string;
  author: string;
  content: string;
  created_at: string;
}

export interface EventDocumentation {
  event_id: string;
  content: string;
  created_at: string;
}

interface EventHighlight {
  highlight_id: string;
  event_id: string;
  highlight_text: string;
}

interface SavingStatus {
  saving: boolean;
  success: boolean;
  error: string | null;
}

// Define the return type of the hook
interface UsePastEventsReturn {
  loading: boolean;
  error: string | null;
  pastEvents: EventFormData[];
  currentEvent: EventFormData | null;
  eventImages: EventImage[];
  eventTestimonials: EventTestimonial[];
  eventDocumentation: EventDocumentation | null;
  eventHighlights: string[];
  savingStatus: SavingStatus;
  fetchPastEvents: () => Promise<void>;
  fetchEventDetails: (id: string) => Promise<void>;
  saveDocumentation: (docData: EventDocumentation) => Promise<boolean>;
  saveHighlights: (highlights: string[]) => Promise<boolean>;
  addTestimonial: (testimonialData: Partial<EventTestimonial>) => Promise<EventTestimonial | null>;
  updateTestimonial: (testimonialId: string, testimonialData: Partial<EventTestimonial>) => Promise<EventTestimonial | null>;
  deleteTestimonial: (testimonialId: string) => Promise<boolean>;
  addImages: (images: Array<{ file?: File; caption?: string; previewUrl?: string; url?: string }>) => Promise<EventImage[] | null>;
  deleteImage: (imageId: string) => Promise<boolean>;
  updateEventDetails: (eventData: Partial<EventFormData>) => Promise<EventFormData | null>;
  resetSavingStatus: () => void;

  updateDocumentation: (payload: any) => Partial<any | null>
}

// Custom hook for managing past events
export const usePastEvents = (eventId: string | null = null): UsePastEventsReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pastEvents, setPastEvents] = useState<EventFormData[]>([]);
  const [currentEvent, setCurrentEvent] = useState<EventFormData | null>(null);
  const [eventImages, setEventImages] = useState<EventImage[]>([]);
  const [eventTestimonials, setEventTestimonials] = useState<EventTestimonial[]>([]);
  const [eventDocumentation, setEventDocumentation] = useState<EventDocumentation | null>(null);
  const [eventHighlights, setEventHighlights] = useState<string[]>([]);
  const [savingStatus, setSavingStatus] = useState<SavingStatus>({
    saving: false,
    success: false,
    error: null,
  });

  // Fetch all completed events
  const fetchPastEvents = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await eventService.getCompletedEvents();

      if (error) throw new Error(error);

      setPastEvents(data || []);
    } catch (err: any) {
      console.error('Error fetching past events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEventDetails = useCallback(async (id: string): Promise<void> => {
    if (!id) {
      console.warn('No event ID provided');
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      console.log('Fetching event with ID:', id);
      const event = await eventService.getEventById(id); // Direct EventFormData
      console.log('getEventById result:', event);
  
      if (!event) {
        console.warn('Event not found for ID:', id);
        setError('Event not found');
        setCurrentEvent(null);
        setEventImages([]);
        setEventTestimonials([]);
        setEventDocumentation(null);
        setEventHighlights([]);
        return;
      }
  
      setCurrentEvent(event.data);
  
      // Fetch event images
      const { data: images } = await eventService.getEventImages(id);
      setEventImages(images || []);
  
      // Fetch testimonials
      const { data: testimonials } = await eventService.getEventTestimonials(id);
      setEventTestimonials(testimonials || []);
  
      // Fetch documentation
      const { data: documentation } = await eventService.getEventDocumentation(id);
      setEventDocumentation(documentation || null);
  
      // Fetch highlights
      const { data: highlights } = await eventService.getEventHighlights(id);
      setEventHighlights(highlights?.map((h: EventHighlight) => h.highlight_text) || []);
    } catch (err: any) {
      console.error('Error fetching event details:', err);
      setError(err.message || 'Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data if eventId is provided
  useEffect(() => {
    if (eventId) {
      fetchEventDetails(eventId);

      console.log(eventId)
    } else {
      fetchPastEvents();
    }
  }, [eventId, fetchEventDetails, fetchPastEvents]);

  // Save event documentation
  const saveDocumentation = async (docData: EventDocumentation): Promise<boolean> => {
    if (!currentEvent?.event_id) return false;

    try {
      setSavingStatus({ saving: true, success: false, error: null });

      const { error } = await eventService.saveEventDocumentation(currentEvent.event_id, docData);

      if (error) throw new Error(error);

      setEventDocumentation(docData);
      setSavingStatus({ saving: false, success: true, error: null });

      // Update the current event
      await eventService.updateEvent(currentEvent);

      setCurrentEvent({
        ...currentEvent,
        has_documentation: true,
      });

      return true;
    } catch (err: any) {
      console.error('Error saving documentation:', err);
      setSavingStatus({ saving: false, success: false, error: err.message });
      return false;
    }
  };

  // Save event highlights
  const saveHighlights = async (highlights: string[]): Promise<boolean> => {
    if (!currentEvent?.event_id) return false;

    try {
      setSavingStatus({ saving: true, success: false, error: null });

      const { error } = await eventService.saveEventHighlights(currentEvent.event_id, highlights);

      if (error) throw new Error(error);

      setEventHighlights(highlights);
      setSavingStatus({ saving: false, success: true, error: null });
      return true;
    } catch (err: any) {
      console.error('Error saving highlights:', err);
      setSavingStatus({ saving: false, success: false, error: err.message });
      return false;
    }
  };

  // Add a testimonial
  const addTestimonial = async (testimonialData: Partial<EventTestimonial>): Promise<EventTestimonial | null> => {
    if (!currentEvent?.event_id) return null;

    try {
      setSavingStatus({ saving: true, success: false, error: null });

      const { data, error } = await eventService.addEventTestimonial(currentEvent.event_id, testimonialData);

      if (error) throw new Error(error);

      setEventTestimonials([...eventTestimonials, ...data]);

      // Update the current event
      await eventService.updateEvent(currentEvent);

      setCurrentEvent({
        ...currentEvent,
        has_testimonials: true,
      });

      setSavingStatus({ saving: false, success: true, error: null });
      return data[0];
    } catch (err: any) {
      console.error('Error adding testimonial:', err);
      setSavingStatus({ saving: false, success: false, error: err.message });
      return null;
    }
  };

  // Update a testimonial
  const updateTestimonial = async (testimonialId: string, testimonialData: Partial<EventTestimonial>): Promise<EventTestimonial | null> => {
    try {
      setSavingStatus({ saving: true, success: false, error: null });

      const { data, error } = await eventService.updateEventTestimonial(testimonialId, testimonialData);

      if (error) throw new Error(error);

      // Update the testimonials list
      setEventTestimonials(
        eventTestimonials.map((t) => (t.testimonial_id === testimonialId ? data[0] : t))
      );

      setSavingStatus({ saving: false, success: true, error: null });
      return data[0];
    } catch (err: any) {
      console.error('Error updating testimonial:', err);
      setSavingStatus({ saving: false, success: false, error: err.message });
      return null;
    }
  };

  // Delete a testimonial
  const deleteTestimonial = async (testimonialId: string): Promise<boolean> => {
    try {
      setSavingStatus({ saving: true, success: false, error: null });

      const { error } = await eventService.deleteEventTestimonial(testimonialId);

      if (error) throw new Error(error);

      // Update the testimonials list
      setEventTestimonials(eventTestimonials.filter((t) => t.testimonial_id !== testimonialId));

      setSavingStatus({ saving: false, success: true, error: null });
      return true;
    } catch (err: any) {
      console.error('Error deleting testimonial:', err);
      setSavingStatus({ saving: false, success: false, error: err.message });
      return false;
    }
  };

  // Add images
  const addImages = async (
    images: Array<{ file?: File; caption?: string; previewUrl?: string; url?: string }>
  ): Promise<EventImage[] | null> => {
    if (!currentEvent?.event_id) return null;

    try {
      setSavingStatus({ saving: true, success: false, error: null });

      // First upload images to storage if they are file objects
      const processedImages = await Promise.all(
        images.map(async (img, index) => {
          if (img.file) {
            // Upload the file
            const { publicUrl } = await eventService.uploadEventImage(img.file);

            return {
              url: publicUrl,
              caption: img.caption,
              is_cover_photo: index === 0, // First image is cover by default
              display_order: index,
            };
          }

          // Image is already a URL
          return {
            url: img.previewUrl || img.url,
            caption: img.caption,
            is_cover_photo: index === 0,
            display_order: index,
          };
        })
      );

      // Save the images to the database
      const { data, error } = await eventService.addEventImages(currentEvent.event_id, processedImages);

      if (error) throw new Error(error);

      // Update the images list
      setEventImages([...eventImages, ...data]);

      // Update cover photo if this is the first image
      if (processedImages.length > 0 && eventImages.length === 0) {
        await eventService.updateEvent(currentEvent);

        setCurrentEvent({
          ...currentEvent,
          coverPhoto: processedImages[0].url,
          has_gallery: true,
        });
      }

      setSavingStatus({ saving: false, success: true, error: null });
      return data;
    } catch (err: any) {
      console.error('Error adding images:', err);
      setSavingStatus({ saving: false, success: false, error: err.message });
      return null;
    }
  };

  const updateDocumentation = async (documentation: EventDocumentation) => {
    try {
      setSavingStatus({ saving: true, success: false, error: null });
      
      if (!documentation.event_id) {
        throw new Error('Documentation ID is required for updates');
      }
      
      const { data, error } = await eventService.updateEventDocumentation(documentation);
      
      if (error) throw new Error(error.message);
      
      setEventDocumentation(data);
      setSavingStatus({ saving: false, success: true, error: null });
      return true;
    } catch (err: any) {
      console.error('Error updating documentation:', err);
      setSavingStatus({ saving: false, success: false, error: err.message });
      return false;
    }
  };

  // Delete an image
  const deleteImage = async (imageId: string): Promise<boolean> => {
    try {
      setSavingStatus({ saving: true, success: false, error: null });

      const { error } = await eventService.deleteEventImage(imageId);

      if (error) throw new Error(error);

      // Update the images list
      setEventImages(eventImages.filter((img) => img.image_id !== imageId));

      setSavingStatus({ saving: false, success: true, error: null });
      return true;
    } catch (err: any) {
      console.error('Error deleting image:', err);
      setSavingStatus({ saving: false, success: false, error: err.message });
      return false;
    }
  };

  // Update basic event details
  const updateEventDetails = async (eventData: Partial<EventFormData>): Promise<EventFormData | null> => {
    if (!currentEvent?.event_id) return null;

    try {
      setSavingStatus({ saving: true, success: false, error: null });

      const { data, error } = await eventService.updateEvent({
        ...eventData, event_id: currentEvent.event_id
      });

      if (error) throw new Error(error);

      setCurrentEvent({
        ...currentEvent,
        ...data,
      });

      setSavingStatus({ saving: false, success: true, error: null });
      return data;
    } catch (err: any) {
      console.error('Error updating event:', err);
      setSavingStatus({ saving: false, success: false, error: err.message });
      return null;
    }
  };

  return {
    // State
    loading,
    error,
    pastEvents,
    currentEvent,
    eventImages,
    eventTestimonials,
    eventDocumentation,
    eventHighlights,
    savingStatus,

    // Actions
    fetchPastEvents,
    fetchEventDetails,
    saveDocumentation,
    saveHighlights,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    addImages,
    deleteImage,
    updateEventDetails,

    updateDocumentation,

    // Reset status
    resetSavingStatus: () => setSavingStatus({ saving: false, success: false, error: null }),
  };
};

export default usePastEvents;

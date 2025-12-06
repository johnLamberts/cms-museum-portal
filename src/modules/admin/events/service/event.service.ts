/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from "@/lib/supabase"
import axios from "axios"

// Interfaces for data structures
interface EventFormData {
  event_id?: string
  title: string
  description: string
  date: string
  location: string
  coverPhoto?: string
  status?: string
  attendees?: number
  has_documentation?: boolean
  has_testimonials?: boolean
  has_gallery?: boolean
  [key: string]: any
}

interface EventImage {
  image_id: string
  event_id: string
  url: string
  caption?: string
  is_cover_photo: boolean
  display_order: number
}

interface EventTestimonial {
  testimonial_id: string
  event_id: string
  author: string
  content: string
  created_at: string
  rating?: any;
}

interface EventDocumentation {
  event_id: string
  content: string
  created_at: string
}

interface EventHighlight {
  highlight_id: string
  event_id: string
  highlight_text: string
}

// Event Service
const eventService = {
  /**
   * Create a new event
   * @param payload - Event data
   * @returns Created event
   */
  async addEvent(payload: any): Promise<any> {
    try {
      console.log(payload)

      const { data: event, error: eventError } = await supabase.from("events").insert(payload).select().single()

      if (eventError) {
        throw new Error(`[EventErrorService]: ${JSON.stringify(eventError, null, 0)}`)
      }

      return event
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.log(err.response?.data.error)
        throw new Error(`${err.response?.data.error}`)
      }
      throw err
    }
  },

  /**
   * Get all events
   * @returns Array of events
   */
  async getAllEvents(): Promise<any> {
    try {
      const response = await axios({
        method: "GET",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/event/`,
      })

      return response.data
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.log(err.response?.data.error)
        throw new Error(`${err.response?.data.error}`)
      }
      throw err
    }
  },

  /**
   * Get a single event by ID
   * @param eventId - Event ID
   * @returns Event data
   */
  async getEventById(eventId: string): Promise<{ data: EventFormData | null; error: string | null }> {
    try {
      if (!eventId) {
        console.warn("Invalid event ID provided:", eventId)
        return { data: null, error: "Invalid event ID" }
      }

      const { data, error } = await supabase.from("events").select("*").eq("event_id", eventId).single()

      console.log("Supabase getEventById response:", { data, error })

      if (error) {
        return { data: null, error: `[EventErrorService]: ${JSON.stringify(error, null, 0)}` }
      }

      return { data: data || null, error: null }
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.log(err.response?.data.error)
        throw new Error(`${err.response?.data.error}`)
      }
      throw err
    }
  },

  /**
   * Update an event
   * @param eventId - Event ID
   * @param payload - Update data
   * @returns Updated event
   */
  async updateEvent(payload: Partial<any>): Promise<any> {
    try {
      const { data: event, error: eventError } = await supabase
        .from("events")
        .update(payload)
        .eq("event_id", payload.event_id)
        .select()
        .single()

      if (eventError) {
        throw new Error(`[UpdatingEventErrorService]: ${JSON.stringify(eventError, null, 0)}`)
      }

      return event
    } catch (err) {
      throw err
    }
  },

  /**
   * Mark an event as completed
   * @param eventId - Event ID
   * @param attendees - Number of attendees
   * @returns Updated event
   */
  async markEventAsCompleted(eventId: string, attendees = 0): Promise<{ data: EventFormData | null; error: any }> {
    try {
      console.log(attendees)
      const { data, error } = await supabase
        .from("events")
        .update({
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("event_id", eventId)
        .select()
        .single()

      if (error) {
        throw new Error(`[MarkEventAsCompletedError]: ${JSON.stringify(error, null, 0)}`)
      }

      return { data, error: null }
    } catch (err) {
      throw err
    }
  },

  /**
   * Get all completed events
   * @returns Array of completed events
   */
  async getCompletedEvents(): Promise<{ data: EventFormData[]; error: any }> {
    try {
      const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false })

      if (error) {
        throw new Error(`[GetCompletedEventsError]: ${JSON.stringify(error, null, 0)}`)
      }

      return { data: data || [], error: null }
    } catch (err) {
      throw err
    }
  },

  /**
   * Get event images
   * @param eventId - Event ID
   * @returns Array of event images
   */
  async getEventImages(eventId: string): Promise<{ data: EventImage[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from("event_images")
        .select("*")
        .eq("event_id", eventId)
        .order("display_order", { ascending: true })

      if (error) {
        throw new Error(`[GetEventImagesError]: ${JSON.stringify(error, null, 0)}`)
      }

      return { data: data || [], error: null }
    } catch (err) {
      throw err
    }
  },

  /**
   * Get event testimonials
   * @param eventId - Event ID
   * @returns Array of event testimonials
   */
  async getEventTestimonials(eventId: string): Promise<{ data: EventTestimonial[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from("event_testimonials")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false })

      if (error) {
        throw new Error(`[GetEventTestimonialsError]: ${JSON.stringify(error, null, 0)}`)
      }

      return { data: data || [], error: null }
    } catch (err) {
      throw err
    }
  },


   updateEventDocumentation: async (documentation: any) => {
    if (!documentation.event_id) {
      return { error: { message: 'Documentation ID is required for updates' } };
    }
  
    const updateData = {
      ...documentation,
      updated_at: new Date().toISOString()
    };
  
    const { data, error } = await supabase
      .from('event_documentation')
      .update(updateData)
      .eq('event_id', documentation.event_id)
      .select();
  
    if (error) return { error };
  
    return { data: data[0], error: null };
  },
  

  /**
   * Get event documentation
   * @param eventId - Event ID
   * @returns Event documentation
   */
  async getEventDocumentation(eventId: string): Promise<{ data: EventDocumentation | null; error: any }> {
    try {
      console.log("Fetching documentation for eventId:", eventId)
      const { data, error } = await supabase.from("event_documentation").select("*").eq("event_id", eventId)

      if (error) {
        console.error("Supabase error:", error)
        throw new Error(`[GetEventDocumentationError]: ${JSON.stringify(error, null, 0)}`)
      }

      // Return the first row or null if no rows are found
      return { data: data && data.length > 0 ? data[0] : null, error: null }
    } catch (err) {
      console.error("Unexpected error in getEventDocumentation:", err)
      throw err
    }
  },

  /**
   * Get event highlights
   * @param eventId - Event ID
   * @returns Array of event highlights
   */
  async getEventHighlights(eventId: string): Promise<{ data: EventHighlight[]; error: any }> {
    console.log("Calling getEventHighlights with eventId:", eventId)
    try {
      const { data, error } = await supabase
        .from("event_highlights")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Supabase error:", error)
        throw new Error(`[GetEventHighlightsError]: ${JSON.stringify(error, null, 0)}`)
      }

      console.log("Query result:", data)
      return { data: data || [], error: null }
    } catch (err) {
      console.error("Unexpected error in getEventHighlights:", err)
      throw err
    }
  },

  /**
   * Save event documentation
   * @param eventId - Event ID
   * @param docData - Documentation data
   * @returns Supabase query response
   */
  async saveEventDocumentation(
    eventId: string,
    docData: Partial<EventDocumentation>,
  ): Promise<{ data: EventDocumentation | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("event_documentation")
        .upsert({
          event_id: eventId,
          content: docData.content,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        throw new Error(`[SaveEventDocumentationError]: ${JSON.stringify(error, null, 0)}`)
      }

      return { data, error: null }
    } catch (err) {
      throw err
    }
  },

  /**
   * Save event highlights
   * @param eventId - Event ID
   * @param highlights - Array of highlight texts
   * @returns Supabase query response
   */
  async saveEventHighlights(
    eventId: string,
    highlights: string[],
  ): Promise<{ data: EventHighlight[] | null; error: any }> {
    try {
      // Delete existing highlights
      await supabase.from("event_highlights").delete().eq("event_id", eventId)

      // Insert new highlights
      const highlightRecords = highlights.map((text, index) => ({
        event_id: eventId,
        highlight_text: text,
        display_order: index,
      }))

      const { data, error } = await supabase.from("event_highlights").insert(highlightRecords).select()

      if (error) {
        throw new Error(`[SaveEventHighlightsError]: ${JSON.stringify(error, null, 0)}`)
      }

      return { data, error: null }
    } catch (err) {
      throw err
    }
  },

  /**
   * Add event testimonial
   * @param eventId - Event ID
   * @param testimonialData - Testimonial data
   * @returns Created testimonial
   */
  async addEventTestimonial(
    eventId: string,
    testimonialData: Partial<EventTestimonial>,
  ): Promise<{ data: EventTestimonial[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from("event_testimonials")
        .insert({
          event_id: eventId,
          author: testimonialData.author,
          content: testimonialData.content,
        })
        .select()

      if (error) {
        throw new Error(`[AddEventTestimonialError]: ${JSON.stringify(error, null, 0)}`)
      }

      return { data, error: null }
    } catch (err) {
      throw err
    }
  },

  /**
   * Update event testimonial
   * @param testimonialId - Testimonial ID
   * @param testimonialData - Updated testimonial data
   * @returns Updated testimonial
   */
  async updateEventTestimonial(
    testimonialId: string,
    testimonialData: Partial<EventTestimonial>,
  ): Promise<{ data: EventTestimonial[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from("event_testimonials")
        .update({
          author: testimonialData.author,
          content: testimonialData.content,
          updated_at: new Date().toISOString(),
        })
        .eq("testimonial_id", testimonialId)
        .select()

      if (error) {
        throw new Error(`[UpdateEventTestimonialError]: ${JSON.stringify(error, null, 0)}`)
      }

      return { data, error: null }
    } catch (err) {
      throw err
    }
  },

  /**
   * Delete event testimonial
   * @param testimonialId - Testimonial ID
   * @returns Supabase query response
   */
  async deleteEventTestimonial(testimonialId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.from("event_testimonials").delete().eq("testimonial_id", testimonialId)

      if (error) {
        throw new Error(`[DeleteEventTestimonialError]: ${JSON.stringify(error, null, 0)}`)
      }

      return { error: null }
    } catch (err) {
      throw err
    }
  },

  /**
   * Upload event image to storage
   * @param file - Image file
   * @returns Public URL of uploaded image
   */
  async uploadEventImage(file: File): Promise<{ publicUrl: string }> {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `events_document/${fileName}`

      const { error: uploadError } = await supabase.storage.from("museo_rizal").upload(filePath, file)

      if (uploadError) {
        throw new Error(`[UploadEventImageError]: ${JSON.stringify(uploadError, null, 0)}`)
      }

      const { data: urlData } = supabase.storage.from("museo_rizal").getPublicUrl(filePath)

      return { publicUrl: urlData.publicUrl }
    } catch (err) {
      throw err
    }
  },

  /**
   * Add event images
   * @param eventId - Event ID
   * @param images - Array of image data
   * @returns Created images
   */
  async addEventImages(eventId: string, images: Partial<EventImage>[]): Promise<{ data: EventImage[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from("event_images")
        .insert(
          images.map((img) => ({
            event_id: eventId,
            url: img.url,
            caption: img.caption,
            is_cover_photo: img.is_cover_photo,
            display_order: img.display_order,
          })),
        )
        .select()

      if (error) {
        throw new Error(`[AddEventImagesError]: ${JSON.stringify(error, null, 0)}`)
      }

      return { data, error: null }
    } catch (err) {
      throw err
    }
  },

  /**
   * Delete event image
   * @param imageId - Image ID
   * @returns Supabase query response
   */
  async deleteEventImage(imageId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.from("event_images").delete().eq("image_id", imageId)

      if (error) {
        throw new Error(`[DeleteEventImageError]: ${JSON.stringify(error, null, 0)}`)
      }

      return { error: null }
    } catch (err) {
      throw err
    }
  },

  /**
   * Get event images with event details
   * @param eventId - The event ID
   * @returns Supabase query response with images and related event data
   */
  async getEventImagesWithDetails(eventId: string): Promise<any> {
    return await supabase
      .from("event_images")
      .select(`
        *,
        events!inner (
          title,
          status
        )
      `)
      .eq("event_id", eventId)
      .order("display_order", { ascending: true })
  },

  /**
   * Update an existing event image
   * @param imageId - The image ID
   * @param imageData - Updated image data
   * @returns Supabase query response
   */
  async updateEventImage(imageId: string, imageData: Partial<EventImage>): Promise<any> {
    return await supabase.from("event_images").update(imageData).eq("image_id", imageId).select()
  },

  /**
   * Reset cover photo flags and set a new cover photo
   * @param eventId - The event ID
   * @param imageId - The image ID to set as cover
   * @returns Supabase query response
   */
  async setEventCoverPhoto(eventId: string, imageId: string): Promise<any> {
    // First reset all cover photo flags for this event
    await supabase.from("event_images").update({ is_cover_photo: false }).eq("event_id", eventId)

    // Set the new cover photo
    return await supabase.from("event_images").update({ is_cover_photo: true }).eq("image_id", imageId).select()
  },

  /**
   * Upload multiple images for an event
   * @param eventId - The event ID
   * @param images - Array of image files with captions
   * @returns Supabase query response with image data
   */
  async uploadEventImagesWithMetadata(
    eventId: string,
    images: Array<{ file: File; caption?: string }>,
  ): Promise<{ data: EventImage[] | null; error: any }> {
    try {
      const results: EventImage[] = []

      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        const file = image.file

        // Skip if there's no file
        if (!file) continue

        // Upload to Supabase Storage
        const { publicUrl } = await this.uploadEventImage(file)

        // Add to event_images table
        const { data, error } = await supabase
          .from("event_images")
          .insert([
            {
              event_id: eventId,
              url: publicUrl,
              caption: image.caption,
              is_cover_photo: i === 0 && results.length === 0, // First image as cover if no existing images
              display_order: i,
            },
          ])
          .select()

        if (error) throw error
        if (data) results.push(...(data as EventImage[]))
      }

      // Update event to have gallery flag
      await supabase.from("events").update({ has_gallery: true }).eq("event_id", eventId)

      return { data: results, error: null }
    } catch (error) {
      console.error("Error uploading images:", error)
      return { data: null, error }
    }
  },

  /**
   * Enhanced function to upload a file with progress tracking
   * @param file - The file to upload
   * @param progressCallback - Optional callback for upload progress
   * @returns Upload result with public URL
   */
  async uploadEventImageWithProgress(
    file: File,
    progressCallback: ((progress: number) => void) | null = null,
  ): Promise<any> {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `pastevents/${fileName}`

    // Process progress events if callback provided
    const options: any = {}
    if (progressCallback && typeof progressCallback === "function") {
      options.onUploadProgress = (progress: { loaded: number; total: number }) => {
        const percent = Math.round((progress.loaded / progress.total) * 100)
        progressCallback(percent)
      }
    }

    const { data, error } = await supabase.storage.from("museo_rizal").upload(filePath, file, options)

    if (error) {
      throw error
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("museo_rizal").getPublicUrl(filePath)

    return { data, filePath, publicUrl }
  },

  /**
   * Get image statistics for an event
   * @param eventId - The event ID
   * @returns Object with image statistics
   */
  async getEventImageStats(eventId: string): Promise<any> {
    try {
      // Get total count
      const { count, error: countError } = await supabase
        .from("event_images")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId)

      if (countError) throw countError

      // Get cover photo
      const { data: coverPhoto, error: coverError } = await supabase
        .from("event_images")
        .select("*")
        .eq("event_id", eventId)
        .eq("is_cover_photo", true)
        .single()

      if (coverError && coverError.code !== "PGRST116") {
        // PGRST116 is "no rows returned" - that's fine, means no cover photo
        throw coverError
      }

      return {
        totalImages: count,
        hasCoverPhoto: !!coverPhoto,
        coverPhoto: coverPhoto || null,
      }
    } catch (err) {
      console.error("Error getting image stats:", err)
      return { error: err }
    }
  },
}

export default eventService

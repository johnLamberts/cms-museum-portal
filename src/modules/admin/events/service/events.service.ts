/* eslint-disable @typescript-eslint/no-explicit-any */
// supabaseService.js - API helper functions for events

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// =============== BASIC EVENT OPERATIONS ===============

/**
 * Fetch all events with optional filtering
 * @param {Object} options - Query options
 * @returns {Promise} Supabase query response
 */
export const getEvents = async (options = {}) => {
  const { status, limit = 100, page = 0, search = null, orderBy = 'created_at', order = 'desc' } = options as any;
  
  let query = supabase
    .from('events')
    .select('*')
    .order(orderBy, { ascending: order === 'asc' })
    .range(page * limit, (page + 1) * limit - 1);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }
  
  return await query;
};

/**
 * Get a single event by ID
 * @param {string} eventId - The event ID
 * @returns {Promise} Supabase query response
 */
export const getEventById = async (eventId: any) => {
  return await supabase
    .from('events')
    .select('*')
    .eq('event_id', eventId)
    .single();
};

/**
 * Create a new event
 * @param {Object} eventData - Event data
 * @returns {Promise} Supabase query response
 */
export const createEvent = async (eventData: any) => {
  return await supabase
    .from('events')
    .insert([eventData])
    .select();
};

/**
 * Update an existing event
 * @param {string} eventId - The event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise} Supabase query response
 */
export const updateEvent = async (eventId: any, eventData: any) => {
  return await supabase
    .from('events')
    .update(eventData)
    .eq('event_id', eventId)
    .select();
};

/**
 * Delete an event
 * @param {string} eventId - The event ID
 * @returns {Promise} Supabase query response
 */
export const deleteEvent = async (eventId: any) => {
  return await supabase
    .from('events')
    .delete()
    .eq('event_id', eventId);
};

// =============== EVENT COMPLETION & DOCUMENTATION ===============

/**
 * Mark an event as completed
 * @param {string} eventId - The event ID
 * @returns {Promise} Supabase query response
 */
export const markEventAsCompleted = async (eventId: any, attendees = 0) => {
  return await supabase
    .from('events')
    .update({ 
      status: 'completed', 
      attendees: attendees,
      updated_at: new Date().toISOString()
    })
    .eq('event_id', eventId)
    .select();
};

/**
 * Get all completed events
 * @returns {Promise} Supabase query response
 */
export const getCompletedEvents = async () => {
  return await supabase
    .from('events')
    .select('*')
    .eq("status", "completed")
    .order('created_at', { ascending: false });
};

// =============== EVENT IMAGES ===============

/**
 * Get all images for an event
 * @param {string} eventId - The event ID
 * @returns {Promise} Supabase query response
 */
export const getEventImages = async (eventId: any) => {
  return await supabase
    .from('event_images')
    .select('*')
    .eq('event_id', eventId)
    .order('display_order', { ascending: true });
};

/**
 * Add images to an event
 * @param {string} eventId - The event ID
 * @param {Array} images - Array of image objects { url, caption, is_cover_photo, display_order }
 * @returns {Promise} Supabase query response
 */
export const addEventImages = async (eventId: any, images: any[]) => {
  // First, mark event as having a gallery
  await supabase
    .from('events')
    .update({ has_gallery: true })
    .eq('event_id', eventId);
  
  // Add the images
  const imagesToInsert = images.map((img: { url: any; caption: any; is_cover_photo: any; display_order: any; }) => ({
    event_id: eventId,
    url: img.url,
    caption: img.caption,
    is_cover_photo: img.is_cover_photo || false,
    display_order: img.display_order
  }));
  
  return await supabase
    .from('event_images')
    .insert(imagesToInsert)
    .select();
};

/**
 * Delete an image
 * @param {string} imageId - The image ID
 * @returns {Promise} Supabase query response
 */
export const deleteEventImage = async (imageId: any) => {
  return await supabase
    .from('event_images')
    .delete()
    .eq('image_id', imageId);
};

/**
 * Upload an image to Supabase storage
 * @param {File} file - The image file
 * @param {string} path - Storage path
 * @returns {Promise} Upload result with URL
 */
export const uploadEventImage = async (file: string | File | Blob | ArrayBuffer | ArrayBufferView<ArrayBufferLike> | Buffer<ArrayBufferLike> | FormData | NodeJS.ReadableStream | ReadableStream<Uint8Array<ArrayBufferLike>> | URLSearchParams, path = 'event-images') => {
  const fileExt = (file as any).name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('museo_rizal')
    .upload(filePath, file);
    
  if (error) {
    throw error;
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('museo_rizal')
    .getPublicUrl(filePath);
    
  return { data, filePath, publicUrl };
};

// =============== EVENT TESTIMONIALS ===============

/**
 * Get all testimonials for an event
 * @param {string} eventId - The event ID
 * @returns {Promise} Supabase query response
 */
export const getEventTestimonials = async (eventId: any) => {
  return await supabase
    .from('event_testimonials')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });
};

/**
 * Add a testimonial to an event
 * @param {string} eventId - The event ID
 * @param {Object} testimonial - Testimonial data
 * @returns {Promise} Supabase query response
 */
export const addEventTestimonial = async (eventId: any, testimonial: { name: any; role: any; rating: any; comment: any; featured: any; image_url: any; }) => {
  // First, mark event as having testimonials
  await supabase
    .from('events')
    .update({ has_testimonials: true })
    .eq('event_id', eventId);
  
  // Add the testimonial
  return await supabase
    .from('event_testimonials')
    .insert([{
      event_id: eventId,
      name: testimonial.name,
      role: testimonial.role,
      rating: testimonial.rating,
      comment: testimonial.comment,
      featured: testimonial.featured || false,
      image_url: testimonial.image_url
    }])
    .select();
};

/**
 * Update a testimonial
 * @param {string} testimonialId - The testimonial ID
 * @param {Object} testimonialData - Updated testimonial data
 * @returns {Promise} Supabase query response
 */
export const updateEventTestimonial = async (testimonialId: any, testimonialData: any) => {
  return await supabase
    .from('event_testimonials')
    .update(testimonialData)
    .eq('testimonial_id', testimonialId)
    .select();
};

/**
 * Delete a testimonial
 * @param {string} testimonialId - The testimonial ID
 * @returns {Promise} Supabase query response
 */
export const deleteEventTestimonial = async (testimonialId: any) => {
  return await supabase
    .from('event_testimonials')
    .delete()
    .eq('testimonial_id', testimonialId);
};

// =============== EVENT DOCUMENTATION ===============

/**
 * Get documentation for an event
 * @param {string} eventId - The event ID
 * @returns {Promise} Supabase query response
 */
export const getEventDocumentation = async (eventId: any) => {
  return await supabase
    .from('event_documentation')
    .select('*')
    .eq('event_id', eventId)
    .single();
};

/**
 * Save event documentation
 * @param {string} eventId - The event ID
 * @param {Object} documentation - Documentation data
 * @returns {Promise} Supabase query response
 */
export const saveEventDocumentation = async (eventId: any, documentation: { summary: any; objectives: any; achievements: any; challenges: any; learnings: any; statistics: any; }) => {
  // First, check if documentation already exists
  const { data: existingDoc } = await supabase
    .from('event_documentation')
    .select('documentation_id')
    .eq('event_id', eventId)
    .single();
  
  // Mark event as having documentation
  await supabase
    .from('events')
    .update({ has_documentation: true })
    .eq('event_id', eventId);
  
  if (existingDoc) {
    // Update existing documentation
    return await supabase
      .from('event_documentation')
      .update({
        summary: documentation.summary,
        objectives: documentation.objectives,
        achievements: documentation.achievements,
        challenges: documentation.challenges,
        learnings: documentation.learnings,
        statistics: documentation.statistics,
        updated_at: new Date().toISOString()
      })
      .eq('documentation_id', existingDoc.documentation_id)
      .select();
  } else {
    // Create new documentation
    return await supabase
      .from('event_documentation')
      .insert([{
        event_id: eventId,
        summary: documentation.summary,
        objectives: documentation.objectives,
        achievements: documentation.achievements,
        challenges: documentation.challenges,
        learnings: documentation.learnings,
        statistics: documentation.statistics
      }])
      .select();
  }
};

// =============== EVENT HIGHLIGHTS ===============

/**
 * Get highlights for an event
 * @param {string} eventId - The event ID
 * @returns {Promise} Supabase query response
 */
export const getEventHighlights = async (eventId: any) => {
  return await supabase
    .from('event_highlights')
    .select('*')
    .eq('event_id', eventId)
    .order('display_order', { ascending: true });
};

/**
 * Save event highlights
 * @param {string} eventId - The event ID
 * @param {Array} highlights - Array of highlight strings
 * @returns {Promise} Supabase query response
 */
export const saveEventHighlights = async (eventId: any, highlights: any[]) => {
  // First delete existing highlights
  await supabase
    .from('event_highlights')
    .delete()
    .eq('event_id', eventId);
  
  // Then add new highlights
  const highlightsToInsert = highlights
    .filter((h: string) => h.trim() !== '')
    .map((highlight: any, index: any) => ({
      event_id: eventId,
      highlight_text: highlight,
      display_order: index
    }));
  
  if (highlightsToInsert.length === 0) {
    return { data: [] };
  }
  
  return await supabase
    .from('event_highlights')
    .insert(highlightsToInsert)
    .select();
};

export default {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  markEventAsCompleted,
  getCompletedEvents,
  getEventImages,
  addEventImages,
  deleteEventImage,
  uploadEventImage,
  getEventTestimonials,
  addEventTestimonial,
  updateEventTestimonial,
  deleteEventTestimonial,
  getEventDocumentation,
  saveEventDocumentation,
  getEventHighlights,
  saveEventHighlights
};

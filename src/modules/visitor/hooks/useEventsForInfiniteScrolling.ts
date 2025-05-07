import supabase from '@/lib/supabase';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

// Define the Event interface
export interface Event {
  event_id: string;
  title: string;
  coverPhoto: string;
  status?: string;
  eventDate?: string;
  eventTime?: string;
  eventContent?: string;
  location?: string;
  category?: string;
}

// Interface for Supabase infinite query response
interface EventsResponse {
  data: Event[];
  count: number;
  hasMore: boolean;
}

interface UseEventsOptions {
  pageSize?: number;
  searchTerm?: string;
  category?: string | null;
  enabled?: boolean;
}

/**
 * Custom hook for fetching events with pagination, search, and filtering
 */
export function useInfiniteEvents({
  pageSize = 5,
  searchTerm = '',
  category = null,
  enabled = true
}: UseEventsOptions = {}) {
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch event categories once
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('status')
        .not('status', 'is', null);
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.map(item => item.status).filter(Boolean))
      );
      
      setCategories(uniqueCategories as string[]);
    };
    
    fetchCategories();
  }, []);

  // Set up infinite query for events
  const eventsQuery = useInfiniteQuery({
    queryKey: ['events', searchTerm, category],
    queryFn: async ({ pageParam = 0 }): Promise<EventsResponse> => {
      // Start building the query
      let query = supabase
        .from('events')
        .select('*', { count: 'exact' });
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%`
        );      
      }
      
      // Apply category filter if provided
      if (category) {
        query = query.eq('status', category);
      }
      
      // Apply pagination
      const from = pageParam * pageSize;
      const to = from + (pageSize - 1);
      
      // Execute the query
      const { data, error, count } = await query
        .order('eventDate', { ascending: false })
        .range(from, to);
      
      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }
      
      // Determine if there are more results to fetch
      const hasMore = !!count && (from + pageSize) < count;
      
      return {
        data: data || [],
        count: count || 0,
        hasMore
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
    initialPageParam: 0,
    enabled
  });

  // Query to get the latest event (separate from the infinite query)
  const latestEventQuery = useQuery({
    queryKey: ['latest-event'],
    queryFn: async (): Promise<Event | null> => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('eventDate', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching latest event:', error);
        throw new Error(error.message);
      }
      
      return data && data.length > 0 ? data[0] : null;
    },
    enabled
  });

  return {
    ...eventsQuery,
    categories,
    latestEvent: latestEventQuery.data,
    isLoadingLatestEvent: latestEventQuery.isLoading,
    isErrorLatestEvent: latestEventQuery.isError,
    errorLatestEvent: latestEventQuery.error
  };
}

export default useInfiniteEvents;

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { Calendar, Clock, MapPin, Search, Sparkles, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import MuseumLoader from "../admin/museums/exhibit-loader"
import useInfiniteEvents, { Event } from './hooks/useEventsForInfiniteScrolling'
import DebouncedSearchInput from "./visitor-debounced-output"

// Format date function
const formatDate = (dateString?: string) => {
  if (!dateString) return "Date TBA";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Date TBA";
  }
};

// Format time function
const formatTime = (timeString?: string) => {
  if (!timeString) return "Time TBA";
  return timeString;
};

// Custom hook for masonry layout with stable updates
const useMasonryLayout = (items: Event[], columns: number) => {
  const [masonryItems, setMasonryItems] = useState<Event[][]>([]);

  useEffect(() => {
    // Create column arrays only if items or columns change
    const columnArrays: Event[][] = Array.from({ length: columns }, () => []);
    
    // Sort events by date first (most recent first)
    const sortedItems = [...items].sort((a, b) => {
      if (!a.eventDate) return 1;
      if (!b.eventDate) return -1;
      return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
    });
    
    sortedItems.forEach((item, index) => {
      // Distribute items evenly across columns
      const targetColumn = index % columns;
      columnArrays[targetColumn].push(item);
    });

    setMasonryItems(columnArrays);
  }, [items, columns]);

  return masonryItems;
};

export default function VisitorEventsPage() {
  // Local state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [spotlightEvent, setSpotlightEvent] = useState<Event | null>(null)
  const navigate = useNavigate();
  
  // Reference for infinite scrolling
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Responsive column count based on screen size
  const [columnCount, setColumnCount] = useState(3);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumnCount(1);
      } else if (window.innerWidth < 1024) {
        setColumnCount(2);
      } else {
        setColumnCount(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use the custom hook for infinite events
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    categories
  } = useInfiniteEvents({
    pageSize: 5,
    searchTerm,
    category: selectedCategory
  });

  // Extract all events from all pages
  const allEvents = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  // Handle error state
  useEffect(() => {
    if (isError && error) {
      toast.error("Failed to load events. Please try again later.", {
        description: error.toString(),
      });
    }
  }, [isError, error]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!bottomRef.current) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(bottomRef.current);
    
    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [bottomRef, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Use the masonry layout hook with all events
  const masonryItems = useMasonryLayout(allEvents, columnCount);

  // Handle spotlight event
  const handleSpotlight = () => {
    if (allEvents.length > 0) {
      const randomEvent = allEvents[Math.floor(Math.random() * allEvents.length)];
      setSpotlightEvent(randomEvent);
      toast.success("Spotlight event featured! Check it out.", {
        position: "top-center",
      });
    } else {
      toast.error("No events available to feature.", {
        position: "top-center",
      });
    }
  };

  // Clear spotlight when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (spotlightEvent && !target.closest('.spotlight-event')) {
        setSpotlightEvent(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [spotlightEvent]);

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    toast.success("Filters cleared", {
      position: "top-center",
    });
  };

  if (isLoading && !data) return <MuseumLoader />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Museum Events</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover upcoming exhibitions, lectures, workshops, and special events
          </p>
        </div>
        
        {/* Search and filter section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                <DebouncedSearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search events..."
                  debounceTime={500} // Set to 500ms for responsiveness
                />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <Button 
              onClick={handleSpotlight} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto flex-shrink-0"
              disabled={allEvents.length === 0}
            >
              <Sparkles className="mr-2 h-4 w-4" /> Discover Random Event
            </Button>
          </div>
          
          <div className="mt-6">
            <div className="text-sm font-medium text-gray-700 mb-3">Filter by Status:</div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? "default" : "outline"}
                className="cursor-pointer py-1.5 px-3 text-sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Events
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer py-1.5 px-3 text-sm"
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Results summary */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            {data?.pages[0]?.count || 0} 
            {selectedCategory ? ` ${selectedCategory}` : ''} 
            {(data?.pages[0]?.count || 0) === 1 ? ' Event' : ' Events'}
          </h2>
          
          {(searchTerm || selectedCategory) && (
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-2" /> Clear Filters
            </Button>
          )}
        </div>
        
        {/* Events grid with masonry layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {masonryItems.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-8">
              {column.map((event) => (
                <motion.div
                  key={event.event_id}
                  layoutId={`event-${event.event_id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/visitor/event/${event.event_id}`)}
                >
                  <div className="relative">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={event.coverPhoto || "/placeholder.svg?height=400&width=600"}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute top-0 right-0 m-4">
                      <Badge className={`
                        ${event.status === 'Upcoming' ? 'bg-green-100 text-green-800' : 
                        event.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                        event.status === 'Completed' ? 'bg-gray-100 text-gray-800' : 
                        'bg-blue-100 text-blue-800'}
                      `}>
                        {event.status || 'Upcoming'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{formatDate(event.eventDate)}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{formatTime(event.eventTime)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Empty state */}
        {allEvents.length === 0 && !isLoading && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your search or filter criteria</p>
            <Button onClick={handleClearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
        
        {/* Loading indicator at the bottom for infinite scroll */}
        <div ref={bottomRef} className="mt-8 py-8 flex justify-center">
          {isFetchingNextPage && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          )}
          {!hasNextPage && allEvents.length > 0 && !isFetchingNextPage && (
            <p className="text-gray-500">You've reached the end of the events list</p>
          )}
        </div>
      </div>

      {/* Event Quick View Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              layoutId={`event-${selectedEvent.event_id}`}
              className="bg-white rounded-xl max-w-3xl w-full overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 text-gray-800 hover:text-gray-900 z-10"
                onClick={() => setSelectedEvent(null)}
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <img
                    src={selectedEvent.coverPhoto || "/placeholder.svg?height=400&width=600"}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover aspect-video md:aspect-auto"
                  />
                </div>
                <div className="p-6 md:w-1/2 flex flex-col">
                  <Badge className={`self-start mb-3
                    ${selectedEvent.status === 'Upcoming' ? 'bg-green-100 text-green-800' : 
                    selectedEvent.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                    selectedEvent.status === 'Completed' ? 'bg-gray-100 text-gray-800' : 
                    'bg-blue-100 text-blue-800'}
                  `}>
                    {selectedEvent.status || 'Upcoming'}
                  </Badge>
                  <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-3" />
                      <span>{formatDate(selectedEvent.eventDate)}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-5 w-5 mr-3" />
                      <span>{formatTime(selectedEvent.eventTime)}</span>
                    </div>
                    {selectedEvent.location && (
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-5 w-5 mr-3" />
                        <span>{selectedEvent.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow overflow-y-auto prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: selectedEvent.eventContent || 'No additional details available.' }} />
                  </div>
                  
                  <Button className="mt-6 w-full" onClick={() => navigate(`/visitor/event/${selectedEvent.event_id}`)}>
                    View Full Details
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spotlight event */}
      <AnimatePresence>
        {spotlightEvent && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="spotlight-event fixed bottom-6 right-6 bg-white rounded-xl shadow-xl p-5 max-w-sm z-40 overflow-hidden"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-indigo-800">Featured Event</h3>
              <button 
                className="text-gray-400 hover:text-gray-600" 
                onClick={(e) => {
                  e.stopPropagation();
                  setSpotlightEvent(null);
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-hidden rounded-lg mb-3">
              <img
                src={spotlightEvent.coverPhoto || "/placeholder.svg?height=400&width=600"}
                alt={spotlightEvent.title}
                className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <Badge className={`mb-3
              ${spotlightEvent.status === 'Upcoming' ? 'bg-green-100 text-green-800' : 
              spotlightEvent.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
              spotlightEvent.status === 'Completed' ? 'bg-gray-100 text-gray-800' : 
              'bg-blue-100 text-blue-800'}
            `}>
              {spotlightEvent.status || 'Upcoming'}
            </Badge>
            <h4 className="font-semibold text-lg mb-2">{spotlightEvent.title}</h4>
            <div className="flex items-center text-gray-600 mb-1 text-sm">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>{formatDate(spotlightEvent.eventDate)}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-3 text-sm">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>{formatTime(spotlightEvent.eventTime)}</span>
            </div>
            {spotlightEvent.location && (
              <div className="flex items-center text-gray-600 mb-3 text-sm">
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                <span>{spotlightEvent.location}</span>
              </div>
            )}
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700" 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/visitor/event/${spotlightEvent.event_id}`);
              }}
            >
              Learn More
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

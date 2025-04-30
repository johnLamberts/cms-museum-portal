/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { AlertTriangle, BarChart3Icon, Calendar, CalendarDays, CheckCircle, ChevronLeft, Clock, ExternalLink, ImageIcon, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditorContent } from "@tiptap/react"
import { NavLink, useParams } from "react-router-dom"
import { usePastEvents } from "../admin/events/usePastEvents"
import MuseumLoader from "../admin/museums/exhibit-loader"
import { useBlockEditor } from "../admin/museums/hooks/useMuseumEditor"
import useFeaturedEventById from "./hooks/useFeaturedEventById"
import EventGalleryDisplay from "./visitor-event-gallery-display"
import EventTestimonialsDisplay from "./visitor-event-testimonials"

// Event Status Component - displays different UI based on event status
function EventStatus({ event }: { event: any }) {
  const [eventStatus, setEventStatus] = useState<'upcoming' | 'completed' | 'live' | 'cancelled'>('upcoming')
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Handle event status determination
  useEffect(() => {
    const checkEventStatus = () => {
      const now = new Date().getTime()
      const eventDate = new Date(event.eventDate).getTime()
      
      // First priority: check if event has explicit status in database
      if (event.status) {
        const status = event.status.toLowerCase()
        
        // Handle explicit status values
        if (status === 'cancelled') {
          setEventStatus('cancelled')
          return
        } else if (status === 'completed') {
          setEventStatus('completed')
          return
        }
      }
      
      // If date is in the past and no explicit status, mark as completed
      if (eventDate < now) {
        setEventStatus('completed')
        return
      }
      
      // If the event is today (potentially live)
      const isToday = new Date(eventDate).toDateString() === new Date().toDateString()
      const eventTime = event.eventTime || ""
      
      // Extract hours from event time (example format: "10:00 AM")
      const timeMatch = eventTime.match(/(\d+):(\d+)\s*(AM|PM)/i)
      if (isToday && timeMatch) {
        const [_, hours, minutes, period] = timeMatch
        const eventHour = parseInt(hours) + (period.toUpperCase() === 'PM' && parseInt(hours) !== 12 ? 12 : 0)
        const eventMinute = parseInt(minutes)
        
        const currentHour = new Date().getHours()
        const currentMinute = new Date().getMinutes()
        
        // If current time is within the estimated event time (assuming 2-hour events)
        if (
          (currentHour > eventHour || (currentHour === eventHour && currentMinute >= eventMinute)) && 
          (currentHour < eventHour + 2)
        ) {
          setEventStatus('live')
          return
        }
      }
      
      // Default to upcoming if none of the above
      setEventStatus('upcoming')
    }
    
    // Run status check once on component mount or when event changes
    checkEventStatus()
    
  }, [event]) // Only depend on the event prop
  
  // Handle countdown timer separately to avoid interdependencies
  useEffect(() => {
    // Only set up timer if event is upcoming
    if (eventStatus !== 'upcoming') return
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const eventDate = new Date(event.eventDate).getTime()
      const difference = eventDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        // If time is up, recheck status (date might be past now)
        checkEventStatus()
      }
    }
    
    // Check status if time is up
    const checkEventStatus = () => {
      const now = new Date().getTime()
      const eventDate = new Date(event.eventDate).getTime()
      
      if (eventDate < now) {
        setEventStatus('completed')
      }
    }
    
    // Initial calculation
    calculateTimeLeft()
    
    // Set interval for updating countdown
    const timer = setInterval(calculateTimeLeft, 1000)
    
    // Clean up interval on unmount or when status changes
    return () => clearInterval(timer)
    
  }, [event, eventStatus]) // Depend on both event and eventStatus

  // Render different UI based on event status
  switch (eventStatus) {
    case 'completed':
      return (
        <Card className="p-6 bg-gray-50 border-gray-200">
          <CardContent className="space-y-4 text-center">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700">Event Completed</h2>
            <p className="text-gray-600">
              This event took place on {new Date(event.eventDate).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric"
              })}
            </p>
            <div className="flex justify-center gap-3 pt-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Check our upcoming events
              </Button>
              {event.has_gallery && (
                <Button variant="outline" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  View Event Gallery
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )
    
    case 'live':
      return (
        <Card className="p-6 bg-green-50 border-green-200">
          <CardContent className="space-y-4 text-center">
            <Badge variant="default" className="bg-green-500 text-white px-4 py-1 text-sm">
              HAPPENING NOW
            </Badge>
            <h2 className="text-2xl font-semibold text-green-800">This Event is Live!</h2>
            <p className="text-green-700">
              The event started at {event.eventTime} today and is currently in progress.
            </p>
          </CardContent>
        </Card>
      )
    
    case 'cancelled':
      return (
        <Card className="p-6 bg-red-50 border-red-200">
          <CardContent className="space-y-4 text-center">
            <div className="flex justify-center">
              <AlertTriangle className="h-16 w-16 text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-red-700">Event Cancelled</h2>
            <p className="text-red-600">
              We apologize, but this event has been cancelled.
            </p>
            <div className="flex justify-center pt-3">
              <Button variant="outline" className="flex items-center gap-2 text-red-700 border-red-300 hover:bg-red-100">
                <Calendar className="h-4 w-4" />
                Browse other events
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    
    case 'upcoming':
    default:
      return (
        <Card className="p-6 bg-primary/5 border-primary/20">
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">Event Starts In</h2>
            <div className="flex justify-center gap-4 text-center">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-primary/10 rounded-lg p-2 min-w-[80px]">
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-xs uppercase">{unit}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-4">
              <Button className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Add to Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      )
  }
}

// Event insights component for completed events
function EventInsights({ event }: { event: any }) {
  // Check if the event has documentation with statistics
  const hasStatistics = event.documentation?.statistics && 
    (event.documentation.statistics.attendance > 0 || 
     event.documentation.statistics.satisfaction > 0 || 
     event.documentation.statistics.engagement > 0);

  // Check if there's any insights content
  const hasInsightsContent = hasStatistics || 
    (event.documentation?.achievements && event.documentation.achievements.trim().length > 0) ||
    (event.documentation?.learnings && event.documentation.learnings.trim().length > 0);

  // Only show the insights section if there's content to display
  if (!hasInsightsContent) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3Icon className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">Event Insights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statistics Section */}
        {hasStatistics && (
          <Card className="md:col-span-1">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Event Statistics</h3>
              
              {event.documentation.statistics.attendance > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Attendance</span>
                  <Badge variant="outline" className="bg-primary/5">
                    {event.documentation.statistics.attendance} attendees
                  </Badge>
                </div>
              )}
              
              {event.documentation.statistics.satisfaction > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Satisfaction</span>
                    <span className="text-sm font-medium">{event.documentation.statistics.satisfaction}%</span>
                  </div>
                  <div className="w-full h-2 bg-primary/10 rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${event.documentation.statistics.satisfaction}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {event.documentation.statistics.engagement > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Engagement</span>
                    <span className="text-sm font-medium">{event.documentation.statistics.engagement}%</span>
                  </div>
                  <div className="w-full h-2 bg-primary/10 rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${event.documentation.statistics.engagement}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Achievements & Learnings */}
        <div className={`${hasStatistics ? 'md:col-span-2' : 'md:col-span-3'}`}>
          <Card>
            <CardContent className="p-6 space-y-4">
              {event.documentation?.achievements && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Key Achievements</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {event.documentation.achievements}
                  </p>
                </div>
              )}
              
              {event.documentation?.achievements && event.documentation?.learnings && (
                <Separator className="my-4" />
              )}
              
              {event.documentation?.learnings && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Learnings & Future Recommendations</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {event.documentation.learnings}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function VisitorVisitEvent() {
  const { editor } = useBlockEditor();
  const { data: featureEvent, isLoading: isFeatureEventLoading } = useFeaturedEventById();
  const [activeTab, setActiveTab] = useState("details");
  const [isPastEvent, setIsPastEvent] = useState(false);
  const { eventId } = useParams();
  
  // Use usePastEvents hook to get event details including gallery, testimonials, etc.
  const { 
    loading: isEventDataLoading, 
    currentEvent, 
    eventImages, 
    eventDocumentation 
  } = usePastEvents(eventId || featureEvent?.event_id || null);

  // Merge data from both sources - prioritize currentEvent for gallery and documentation data
  const eventData = {
    ...featureEvent,
    ...(currentEvent || {}),
    // Only override if we have actual data from usePastEvents
    images: eventImages.length > 0 ? eventImages : featureEvent?.images || [],
    documentation: eventDocumentation || featureEvent?.documentation || null
  };

  useEffect(() => {
    if (editor && eventData?.eventContent) {
      editor.commands.setContent(eventData.eventContent)
      editor.setEditable(false)
    }
  }, [editor, eventData?.eventContent])
  
  // Separate useEffect for event status checking
  useEffect(() => {
    if (!eventData) return;
    
    // Check if this is a past/completed event by checking both the date and status
    // Check if event has explicit completed status
    const hasCompletedStatus = eventData.status && 
      eventData.status.toLowerCase() === 'completed';
    
    // Check if event date is in the past
    const isDatePast = eventData.eventDate && 
      (new Date(eventData.eventDate).getTime() < new Date().getTime());
    
    // Event is considered past if either condition is true
    setIsPastEvent(hasCompletedStatus || isDatePast);
  }, [eventData])

  const isLoading = isFeatureEventLoading || isEventDataLoading;

  if(isLoading) return <MuseumLoader />

  // Format event status for display
  const getStatusBadge = () => {
    const now = new Date()
    const eventDate = new Date(eventData.eventDate)
    const status = eventData.status?.toLowerCase()
    
    if (status === 'cancelled') {
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
    } else if (status === 'completed') {
      return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
    } else if (eventDate < now) {
      return <Badge className="bg-gray-100 text-gray-800">Past Event</Badge>
    } else if (new Date(eventDate).toDateString() === new Date().toDateString()) {
      return <Badge className="bg-green-100 text-green-800">Today</Badge>
    } else {
      return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
    }
  }
  
  // Check if event has additional content to show tabs
  const hasAdditionalContent = isPastEvent && 
    (eventData.has_gallery || 
     eventData.has_testimonials || 
     eventData.has_documentation ||
     (eventData.images && eventData.images.length > 0));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] lg:h-[60vh] w-full overflow-hidden">
        <img 
          src={eventData?.coverPhoto|| "/placeholder.svg"} 
          alt={eventData?.title}  
          className="h-full w-full object-cover"  
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-12">
          <div className="container max-w-4xl mx-auto text-white">
            <NavLink to="/visitor/events">
              <Button variant="ghost" size="sm" className="mb-4 text-white hover:text-white hover:bg-white/20">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Events
              </Button>
            </NavLink>
            <div className="mb-3">
              {getStatusBadge()}
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-2 text-white">{eventData.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm lg:text-base text-white/90">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {new Date(eventData.eventDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {eventData.eventTime}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {eventData.address || eventData.location || "Museum premises, Morong"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {/* Event Status Section */}
        <div className="space-y-8 mb-8">
          <EventStatus event={eventData} />
        </div>
        
        {/* Content Tabs for Past Events */}
        {hasAdditionalContent ? (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Event Details</TabsTrigger>
                {(eventData.has_gallery || eventData.images?.length > 0) && (
                  <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
                )}
                {(eventData.has_testimonials || eventData.has_documentation) && (
                  <TabsTrigger value="insights">Insights & Feedback</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="details" className="mt-6">
                {/* Rich Content */}
                <div className="prose dark:prose-invert max-w-none">
                  {editor && <EditorContent editor={editor} />}
                </div>
              </TabsContent>
              
              <TabsContent value="gallery" className="mt-6">
                {/* Use the new EventGalleryDisplay component */}
                <EventGalleryDisplay 
                  eventImages={eventData.images || []} 
                  isLoading={isLoading} 
                />
              </TabsContent>
              
              <TabsContent value="insights" className="mt-6 space-y-12">
                {/* Event Insights - Statistics & Achievements */}
                {(eventData.has_documentation || eventData.documentation) && (
                  <EventInsights event={eventData} />
                )}
                
                {/* Testimonials Section */}
                {(eventData.has_testimonials && eventData.event_id) && (
                  <EventTestimonialsDisplay eventId={eventData.event_id} />
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          // Standard view for non-past events
          <div className="prose dark:prose-invert max-w-none">
            {editor && <EditorContent editor={editor} />}
          </div>
        )}

        {/* Social Media Integration */}
        <div className="flex justify-center gap-4 pt-8">
          <Button variant="outline" size="icon">
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Facebook</span>
          </Button>
          <Button variant="outline" size="icon">
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Twitter</span>
          </Button>
          <Button variant="outline" size="icon">
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Instagram</span>
          </Button>
        </div>
      </main>
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { AlertTriangle, Calendar, CalendarDays, CheckCircle, ChevronLeft, Clock, ExternalLink, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EditorContent } from "@tiptap/react"
import { NavLink } from "react-router-dom"
import MuseumLoader from "../admin/museums/exhibit-loader"
import { useBlockEditor } from "../admin/museums/hooks/useMuseumEditor"
import useFeaturedEventById from "./hooks/useFeaturedEventById"

// Event Status Component - displays different UI based on event status
function EventStatus({ event }: { event: any }) {
  const [eventStatus, setEventStatus] = useState<'upcoming' | 'past' | 'live' | 'cancelled'>('upcoming')
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Determine event status
    const checkEventStatus = () => {
      const now = new Date().getTime()
      const eventDate = new Date(event.eventDate).getTime()
      
      // If the event is explicitly cancelled
      if (event.status && event.status.toLowerCase() === 'cancelled') {
        return setEventStatus('cancelled')
      }
      
      // If the event date is in the past
      if (eventDate < now) {
        return setEventStatus('past')
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
          return setEventStatus('live')
        }
      }
      
      // Default to upcoming if none of the above
      return setEventStatus('upcoming')
    }
    
    // Calculate time left if the event is upcoming
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
      }
    }

    // Initial checks
    checkEventStatus()
    if (eventStatus === 'upcoming') {
      calculateTimeLeft()
    }
    
    // Set interval only for upcoming events
    let timer: NodeJS.Timeout | null = null
    if (eventStatus === 'upcoming') {
      timer = setInterval(() => {
        calculateTimeLeft()
        checkEventStatus() // Re-check status in case it becomes live during countdown
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [event, eventStatus])

  // Render different UI based on event status
  switch (eventStatus) {
    case 'past':
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
            <div className="flex justify-center pt-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Check our upcoming events
              </Button>
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

export default function VisitorVisitEvent() {
  const { editor } = useBlockEditor();
  const { data: featureEvent, isLoading} = useFeaturedEventById();

  useEffect(() => {
    if (editor && featureEvent?.eventContent) {
      editor.commands.setContent(featureEvent?.eventContent)
      editor.setEditable(false)
    }
  }, [editor, featureEvent?.eventContent])

  if(isLoading) return <MuseumLoader />

  // Format event status for display
  const getStatusBadge = () => {
    const now = new Date()
    const eventDate = new Date(featureEvent.eventDate)
    const status = featureEvent.status?.toLowerCase()
    
    if (status === 'cancelled') {
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
    } else if (eventDate < now) {
      return <Badge className="bg-gray-100 text-gray-800">Past Event</Badge>
    } else if (new Date(eventDate).toDateString() === new Date().toDateString()) {
      return <Badge className="bg-green-100 text-green-800">Today</Badge>
    } else {
      return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] lg:h-[60vh] w-full overflow-hidden">
        <img 
          src={featureEvent?.coverPhoto|| "/placeholder.svg"} 
          alt={featureEvent?.title}  
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
            <h1 className="text-3xl lg:text-5xl font-bold mb-2 text-white">{featureEvent.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm lg:text-base text-white/90">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {new Date(featureEvent.eventDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {featureEvent.eventTime}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {featureEvent.address || "Museum premises, Morong"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Event Status - changes based on the status of the event */}
          <EventStatus event={featureEvent} />

          {/* Rich Content */}
          <div className="prose dark:prose-invert max-w-none">
            {editor && <EditorContent editor={editor} />}
          </div>

          {/* Social Media Integration */}
          <div className="flex justify-center gap-4 pt-4">
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
        </div>
      </main>
    </div>
  )
}

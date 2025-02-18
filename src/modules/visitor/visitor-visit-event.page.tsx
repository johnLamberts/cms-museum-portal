"use client"

import { Calendar, CalendarDays, ChevronLeft, Clock, ExternalLink, MapPin, Share2 } from "lucide-react"
import { useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { NavLink, useParams } from "react-router-dom"

const events = [
  {
    id: "rizal-letters-unveiling",
    title: "Unveiling of Rizal's Last Letters",
    description:
      "Join us for a historic moment as we unveil the last letters of Jose Rizal, offering unprecedented insights into his final thoughts.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-An9enVSaKzjLmh6eu5zyNTYrx0nNQc.png",
    startDate: "2024-03-15T18:00:00",
    endDate: "2024-03-15T21:00:00",
    location: "Main Gallery, Museo Rizal",
    organizer: "Dr. Maria Santos",
    organizerRole: "Chief Curator, Museo Rizal",
    ticketPrice: "₱500",
    capacity: 200,
    attendees: 178,
    tags: ["History", "Literature", "National Hero"],
    schedule: [
      { time: "18:00", description: "Doors Open" },
      { time: "18:30", description: "Welcome Remarks" },
      { time: "19:00", description: "Unveiling Ceremony" },
      { time: "19:30", description: "Expert Panel Discussion" },
      { time: "20:30", description: "Q&A Session" },
      { time: "21:00", description: "Closing and Networking" },
    ],
    content: `
      <h2>A Glimpse into History</h2>
      <p>For the first time, the public will have the opportunity to view the last letters penned by Jose Rizal before his execution. These documents provide an intimate look into the thoughts and emotions of the Philippines' national hero during his final days.</p>
      <h3>What to Expect</h3>
      <ul>
        <li>Expertly curated exhibition of Rizal's letters</li>
        <li>Insightful commentary from leading historians</li>
        <li>Interactive displays showcasing the historical context</li>
        <li>Exclusive preview of upcoming Rizal-focused exhibitions</li>
      </ul>
      <blockquote>
        "These letters are not just historical artifacts; they are a window into the soul of a man who shaped a nation." - Dr. Maria Santos
      </blockquote>
      <p>Don't miss this once-in-a-lifetime opportunity to connect with a pivotal moment in Philippine history. Spaces are limited, so secure your spot today!</p>
    `,
  },
  // Add more events here...
]

const relatedEvents = [
  {
    id: "rizal-art-workshop",
    title: "Rizal-Inspired Art Workshop",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-An9enVSaKzjLmh6eu5zyNTYrx0nNQc.png",
    date: "Mar 20, 2024",
  },
  {
    id: "philippine-literature-seminar",
    title: "Seminar on Philippine Literature",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-An9enVSaKzjLmh6eu5zyNTYrx0nNQc.png",
    date: "Mar 25, 2024",
  },
  {
    id: "historical-film-screening",
    title: "Historical Film Screening: Rizal",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-An9enVSaKzjLmh6eu5zyNTYrx0nNQc.png",
    date: "Apr 1, 2024",
  },
]

function EventCountdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex justify-center gap-4 text-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="bg-primary/10 rounded-lg p-2 min-w-[80px]">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs uppercase">{unit}</div>
        </div>
      ))}
    </div>
  )
}

export default function VisitorVisitEvent() {
  const { evid } = useParams()
  const event = events.find((e) => e.id === evid) || events[0]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] lg:h-[60vh] w-full overflow-hidden">
        <img src={event.image || "/placeholder.svg"} alt={event.title}  className="object-cover"  />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-12">
          <div className="container max-w-4xl mx-auto text-white">
            <NavLink to="/visitor">
              <Button variant="ghost" size="sm" className="mb-4 text-white hover:text-white hover:bg-white/20">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Events
              </Button>
            </NavLink>
            <h1 className="text-3xl lg:text-5xl font-bold mb-2 text-muted-foreground">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm lg:text-base text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {new Date(event.startDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(event.startDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} -
                {new Date(event.endDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Event Countdown */}
          <Card className="p-6">
            <CardContent className="space-y-4">
              <h2 className="text-2xl font-semibold text-center">Event Starts In</h2>
              <EventCountdown targetDate={event.startDate} />
            </CardContent>
          </Card>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Rich Content */}
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: event.content }} />

          {/* Event Schedule */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Event Schedule</h2>
            <div className="space-y-2">
              {event.schedule.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-2 bg-muted rounded-md">
                  <div className="font-semibold min-w-[60px]">{item.time}</div>
                  <div>{item.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Organizer Info */}
          <Card>
            <CardContent className="flex items-center gap-4 py-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{event.organizer}</h3>
                <p className="text-sm text-muted-foreground">{event.organizerRole}</p>
                <div className="mt-2">
                  <Button variant="outline" size="sm">
                    Contact Organizer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Info and RSVP */}
          <Card>
            <CardContent className="py-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Ticket Information</h3>
                  <p className="text-sm text-muted-foreground">Price: {event.ticketPrice}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {event.attendees} / {event.capacity} spots filled
                  </p>
                  <progress className="w-full" value={event.attendees} max={event.capacity} />
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="flex-1">RSVP Now</Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to Calendar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share Event</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>

          {/* Related Events */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Related Events</h2>
            <Carousel className="w-full max-w-sm mx-auto">
              <CarouselContent>
                {relatedEvents.map((relatedEvent) => (
                  <CarouselItem key={relatedEvent.id} className="md:basis-1/2 lg:basis-1/3">
                    <NavLink to={`event/${evid}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative aspect-[4/3]">
                          <img
                            src={relatedEvent.image || "/placeholder.svg"}
                            alt={relatedEvent.title}
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold line-clamp-1">{relatedEvent.title}</h3>
                          <p className="text-sm text-muted-foreground">{relatedEvent.date}</p>
                        </CardContent>
                      </Card>
                    </NavLink>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Social Media Integration */}
          <div className="flex justify-center gap-4">
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


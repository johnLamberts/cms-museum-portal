/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  MessageSquare,
  PlusCircle,
  Share2,
  Sparkles,
  ThumbsUp,
  TrendingUp,
} from "lucide-react"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavLink } from "react-router-dom"
import MuseumLoader from "../admin/museums/exhibit-loader"
import useFeaturedEvents from "./hooks/useFeaturedEvent"

const featuredContent = {
  title: "The Last Letters of Jose Rizal",
  description: "Discover the final thoughts of a national hero in this groundbreaking exhibition.",
  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-An9enVSaKzjLmh6eu5zyNTYrx0nNQc.png",
  type: "Exhibition",
  date: "Feb 20 - Mar 30, 2024",
}

const exhibits = [
  {
    id: "last-letters-rizal",
    title: "The Last Letters of Jose Rizal",
    description: "A powerful exhibition showcasing Rizal's final correspondences.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-An9enVSaKzjLmh6eu5zyNTYrx0nNQc.png",
    date: "Feb 20 - Mar 30, 2024",
    location: "Main Gallery",
  },
  {
    id: "iskolar-ni-ynares",
    title: "Iskolar ni Ynares: Artistic Visions",
    description: "Celebrating local talent and creativity through diverse artworks.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-An9enVSaKzjLmh6eu5zyNTYrx0nNQc.png",
    date: "Apr 1 - Apr 30, 2024",
    location: "East Wing Gallery",
  },
  {
    id: "ccs-days",
    title: "CCS Days: Digital Heritage",
    description: "Exploring the intersection of technology and cultural preservation.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-An9enVSaKzjLmh6eu5zyNTYrx0nNQc.png",
    date: "May 15 - Jun 15, 2024",
    location: "Tech Pavilion",
  },
]

const visitorExperiences = [
  {
    id: 1,
    user: {
      name: "Maria Santos",
      avatar: "/placeholder.svg",
    },
    content:
      "The Rizal exhibition was truly eye-opening. I never realized how powerful his last letters were. A must-visit for every Filipino! 🇵🇭 #RizalExhibit",
    likes: 128,
    comments: [
      { user: "Juan dela Cruz", content: "Totally agree! It's a life-changing experience." },
      { user: "Ana Reyes", content: "I can't wait to visit. Thanks for sharing!" },
    ],
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-An9enVSaKzjLmh6eu5zyNTYrx0nNQc.png",
    date: "2 hours ago",
  },
  {
    id: 2,
    user: {
      name: "Juan dela Cruz",
      avatar: "/placeholder.svg",
    },
    content:
      "Attended the Philippine Literature seminar today. The discussions were so engaging, I lost track of time! Excited to dive deeper into our literary heritage. 📚 #PinoyLit",
    likes: 95,
    comments: [
      { user: "Maria Santos", content: "Sounds amazing! Which author was your favorite?" },
      { user: "Carlos Gomez", content: "I wish I could have attended. Hope they do another one soon!" },
    ],
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-An9enVSaKzjLmh6eu5zyNTYrx0nNQc.png",
    date: "1 day ago",
  },
  {
    id: 3,
    user: {
      name: "Ana Reyes",
      avatar: "/placeholder.svg",
    },
    content:
      "The CCS Days exhibition blew my mind! It's amazing to see how technology is helping preserve our cultural heritage. Kudos to the organizers! 🖥️🏛️ #DigitalHeritage",
    likes: 112,
    comments: [
      { user: "Juan dela Cruz", content: "I'm fascinated by the intersection of tech and culture. Great share!" },
      { user: "Maria Santos", content: "This sounds like a must-see. Adding it to my list!" },
    ],
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-An9enVSaKzjLmh6eu5zyNTYrx0nNQc.png",
    date: "3 days ago",
  },
]

const trendingTopics = [
  "Rizal's Legacy",
  "Philippine Literature",
  "Digital Preservation",
  "Local Artists",
  "Historical Films",
] 

export default function Visitor() {
  const [activeExperience, setActiveExperience] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setShowExperienceModal] = useState(false)

  const nextExperience = () => {
    setActiveExperience((prev) => (prev + 1) % visitorExperiences.length)
  }

  const prevExperience = () => {
    setActiveExperience((prev) => (prev - 1 + visitorExperiences.length) % visitorExperiences.length)
  }

  const { data: featuredEvents, isLoading } = useFeaturedEvents();


  if(isLoading) return <MuseumLoader />

  return (

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-8">
            {/* Hero Section */}
            <section className="relative h-[50vh] overflow-hidden rounded-xl">
              <img
                src={featuredContent.image || "/placeholder.svg"}
                alt={featuredContent.title}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-2">{featuredContent.type}</Badge>
                <h1 className="text-3xl font-bold text-white mb-2">{featuredContent.title}</h1>
                <p className="text-white/90 mb-4">{featuredContent.description}</p>
                <div className="flex items-center text-white/80 text-sm">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {featuredContent.date}
                </div>
              </div>
            </section>

            {/* Tabs for Events and Exhibits */}
            <Tabs defaultValue="events" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="exhibits">Exhibits</TabsTrigger>
              </TabsList>
              <TabsContent value="events" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  {!isLoading && featuredEvents?.map((event: any) => (
                    <NavLink to={`event/${event.event_id}`} key={event.event_id}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative aspect-video">
                          <img
                            src={event.coverPhoto || "/placeholder.svg"}
                            alt={event.title}
                            
                            className="object-cover"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                        </CardHeader>
                        <CardFooter className="text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-2" />
                            {new Date(event.eventDate).toDateString()}
                          </div>
                          <div className="flex items-center ml-4">
                            <Clock className="h-4 w-4 mr-2" />
                            {event.eventTime}
                          </div>
                        </CardFooter>
                      </Card>
                    </NavLink>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="exhibits" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  {exhibits.map((exhibit, id) => (
                    <NavLink to={`exhibit/${id}`} key={exhibit.id}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative aspect-video">
                          <img
                            src={exhibit.image || "/placeholder.svg"}
                            alt={exhibit.title}
                            className="object-cover"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="line-clamp-1">{exhibit.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{exhibit.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-2" />
                            {exhibit.date}
                          </div>
                          <div className="flex items-center ml-4">
                            <MapPin className="h-4 w-4 mr-2" />
                            {exhibit.location}
                          </div>
                        </CardFooter>
                      </Card>
                    </NavLink>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Enhanced Visitor Experiences Section */}
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Visitor Experiences
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowExperienceModal(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Share Your Experience
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative h-[500px] overflow-hidden">
                  {visitorExperiences.map((experience, index) => (
                    <div
                      key={experience.id}
                      className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                        index === activeExperience ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
                      }`}
                    >
                      <img
                        src={experience.image || "/placeholder.svg"}
                        alt={`Experience by ${experience.user.name}`}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar>
                            <AvatarImage src={experience.user.avatar} />
                            <AvatarFallback>{experience.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-semibold text-white">{experience.user.name}</span>
                            <p className="text-xs text-white/80">{experience.date}</p>
                          </div>
                        </div>
                        <p className="text-sm text-white mb-4">{experience.content}</p>
                        <div className="flex items-center gap-4 text-white/80">
                          <Button variant="ghost" size="sm" className="text-white hover:text-white">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {experience.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-white hover:text-white">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {experience.comments.length}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-white hover:text-white">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="secondary" size="sm" className="mt-4">
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Visitor Experience</DialogTitle>
                              <DialogDescription>Shared by {experience.user.name}</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                              <div className="relative aspect-video rounded-lg overflow-hidden">
                                <img
                                  src={experience.image || "/placeholder.svg"}
                                  alt={`Experience by ${experience.user.name}`}
                                  className="object-cover"
                                />
                              </div>
                              <p>{experience.content}</p>
                              <div className="space-y-2">
                                <h4 className="font-semibold">Comments</h4>
                                {experience.comments.map((comment, i) => (
                                  <div key={i} className="flex items-start gap-2">
                                    <Avatar className="w-8 h-8">
                                      <AvatarFallback>{comment.user[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-semibold">{comment.user}</p>
                                      <p className="text-sm">{comment.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white hover:text-white"
                    onClick={prevExperience}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white hover:text-white"
                    onClick={nextExperience}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </div>
                <div className="flex justify-center p-2 bg-muted">
                  {visitorExperiences.map((_, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className={`w-3 h-3 rounded-full p-0 mx-1 ${
                        index === activeExperience ? "bg-primary" : "bg-muted-foreground"
                      }`}
                      onClick={() => setActiveExperience(index)}
                    >
                      <span className="sr-only">View experience {index + 1}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {trendingTopics.map((topic, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm">{topic}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

      // <ExperienceModal open={showExperienceModal} onOpenChange={setShowExperienceModal} />
  )
}


/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  MapPin,
  MessageSquare,
  PlusCircle,
  Share2,
  Sparkles,
  Star,
  ThumbsUp,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react"
import { useMemo, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MuseumLoading } from "@/layouts/page.layout"
import { useNavigate } from "react-router-dom"
import { useMuseums } from "../admin/museums/hooks/useMuseums"
import useInfiniteEvents from './hooks/useEventsForInfiniteScrolling'

const visitorExperiences = [
  {
    id: 1,
    user: {
      name: "Maria Santos",
      avatar: "/placeholder.svg",
    },
    content:
      "The Rizal exhibition was truly eye-opening. I never realized how powerful his last letters were. A must-visit for every Filipino! 🇵🇭",
    likes: 128,
    comments: 12,
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
      "Attended the Philippine Literature seminar today. The discussions were so engaging, I lost track of time! Excited to dive deeper into our literary heritage. 📚",
    likes: 95,
    comments: 8,
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
      "The CCS Days exhibition blew my mind! It's amazing to see how technology is helping preserve our cultural heritage. Kudos to the organizers! 🖥️🏛️",
    likes: 112,
    comments: 15,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-An9enVSaKzjLmh6eu5zyNTYrx0nNQc.png",
    date: "3 days ago",
  },
]

const trendingTopics = [
  { name: "Rizal's Legacy", posts: 1247 },
  { name: "Philippine Literature", posts: 892 },
  { name: "Digital Preservation", posts: 734 },
  { name: "Local Artists", posts: 623 },
  { name: "Historical Films", posts: 501 },
]

const formatDate = (dateString: any) => {
  if (!dateString) return "Date TBA";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  } catch (error: any) {
    console.log(error)
    return "Date TBA";
  }
};

export default function Visitor() {
  const [activeExperience, setActiveExperience] = useState(0)
  const navigate = useNavigate();

  // Fetch events data
  const {
    data: eventsData,
    isLoading: eventsLoading,
  } = useInfiniteEvents({
    pageSize: 6,
    searchTerm: "",
    category: null
  });

  // Fetch exhibits data
  const { data: museumsData, isLoading: exhibitsLoading } = useMuseums()

  // Extract events from pages
  const allEvents = useMemo(() => {
    return eventsData?.pages.flatMap(page => page.data) || [];
  }, [eventsData]);

  // Extract exhibits
  const allExhibits = useMemo(() => {
    return museumsData?.data?.museums || [];
  }, [museumsData]);

  // Get featured event (first upcoming event)
  const featuredEvent = useMemo(() => {
    return allEvents.find(event => event.status === 'Upcoming') || allEvents[0];
  }, [allEvents]);

  // Calculate museum stats
  const museumStats = useMemo(() => {
    const totalVisitors = allExhibits.reduce((acc: any, exhibit: any) => acc + (parseInt(exhibit.visitors) || 0), 0);
    const avgRating = allExhibits.length > 0 
      ? (allExhibits.reduce((acc: any, exhibit: any) => acc + (parseFloat(exhibit.rating) || 0), 0) / allExhibits.length).toFixed(1)
      : "0.0";

    return [
      { label: "Total Visitors", value: totalVisitors.toLocaleString(), icon: Users },
      { label: "Active Exhibits", value: allExhibits.length.toString(), icon: Eye },
      { label: "Upcoming Events", value: allEvents.filter(e => e.status === 'Upcoming').length.toString(), icon: CalendarDays },
      { label: "Avg Rating", value: avgRating, icon: Star },
    ];
  }, [allEvents, allExhibits]);

  const nextExperience = () => {
    setActiveExperience((prev) => (prev + 1) % visitorExperiences.length)
  }

  const prevExperience = () => {
    setActiveExperience((prev) => (prev - 1 + visitorExperiences.length) % visitorExperiences.length)
  }

  if (eventsLoading || exhibitsLoading) return <MuseumLoading />

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Museum Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {museumStats.map((stat, index) => (
            <Card key={index} className="border-2">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-8">
            {/* Enhanced Hero Section */}
            {featuredEvent && (
              <section className="relative h-[60vh] overflow-hidden rounded-xl shadow-2xl">
                <img
                  src={featuredEvent.coverPhoto || "/placeholder.svg"}
                  alt={featuredEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <Badge className="mb-3 text-sm">{featuredEvent.status || 'Featured Event'}</Badge>
                  <h1 className="text-4xl font-bold text-white mb-3">{featuredEvent.title}</h1>
                  {/* <p className="text-white/90 mb-6 text-lg max-w-2xl line-clamp-2">
                    {featuredEvent.eventContent?.replace(/<[^>]*>/g, '') || 'Join us for this special event'}
                  </p> */}
                  <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm mb-4">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      {formatDate(featuredEvent.eventDate)}
                    </div>
                    {featuredEvent.eventTime && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {featuredEvent.eventTime}
                      </div>
                    )}
                    {featuredEvent.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {featuredEvent.location}
                      </div>
                    )}
                  </div>
                  <Button size="lg" className="gap-2" onClick={() => navigate(`/visitor/event/${featuredEvent.event_id}`)}>
                    <Ticket className="h-4 w-4" />
                    View Event Details
                  </Button>
                </div>
              </section>
            )}

            {/* Enhanced Tabs for Events and Exhibits */}
            <Tabs defaultValue="events" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="events" className="text-base">Upcoming Events</TabsTrigger>
                <TabsTrigger value="exhibits" className="text-base">Current Exhibits</TabsTrigger>
              </TabsList>
              <TabsContent value="events" className="space-y-4 mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {allEvents.slice(0, 6).map((event) => (
                    <Card 
                      key={event.event_id} 
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 cursor-pointer"
                      onClick={() => navigate(`/visitor/event/${event.event_id}`)}
                    >
                      <div className="relative aspect-video">
                        <img
                          src={event.coverPhoto || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className={`absolute top-3 right-3 ${
                          event.status === 'Upcoming' ? 'bg-green-500' :
                          event.status === 'Ongoing' ? 'bg-blue-500' :
                          event.status === 'Completed' ? 'bg-gray-500' :
                          'bg-red-500'
                        }`}>
                          {event.status || 'Upcoming'}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {event.eventContent?.replace(/<[^>]*>/g, '').substring(0, 100) || 'Event details'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <CalendarDays className="h-4 w-4 mr-2" />
                            {formatDate(event.eventDate)}
                          </div>
                          {event.eventTime && (
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2" />
                              {event.eventTime}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">View Details</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="exhibits" className="space-y-4 mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {allExhibits.slice(0, 6).map((exhibit: any) => (
                    <Card 
                      key={exhibit.exhibits_id} 
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 cursor-pointer"
                      onClick={() => navigate(`/visitor/exhibit/${exhibit.exhibits_id}`)}
                    >
                      <div className="relative aspect-video">
                        <img
                          src={exhibit.coverPhoto || "/placeholder.svg"}
                          alt={exhibit.title}
                          className="w-full h-full object-cover"
                        />
                        {exhibit.fee && (
                          <div className="absolute top-3 right-3 flex gap-2">
                            <Badge className="bg-primary/90 backdrop-blur">
                              {exhibit.fee}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{exhibit.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {exhibit.museumContent?.replace(/<[^>]*>/g, '').substring(0, 100) || 'Exhibit details'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {exhibit.address && (
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              {exhibit.address}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">View Details</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Enhanced Visitor Experiences Section */}
            <Card className="overflow-hidden border-2 shadow-lg">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    Visitor Stories
                  </CardTitle>
                  <Button variant="default" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative h-[500px] overflow-hidden bg-black">
                  {visitorExperiences.map((experience, index) => (
                    <div
                      key={experience.id}
                      className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                        index === activeExperience ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
                      }`}
                    >
                      <img
                        src={experience.image}
                        alt={`Experience by ${experience.user.name}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-10 w-10 border-2 border-white">
                            <AvatarImage src={experience.user.avatar} />
                            <AvatarFallback>{experience.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-white">{experience.user.name}</p>
                            <p className="text-xs text-white/80">{experience.date}</p>
                          </div>
                        </div>
                        <p className="text-sm text-white mb-4 leading-relaxed">{experience.content}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <Button variant="secondary" size="sm" className="gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {experience.likes}
                          </Button>
                          <Button variant="secondary" size="sm" className="gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {experience.comments}
                          </Button>
                          <Button variant="secondary" size="sm" className="gap-1">
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 hover:text-white"
                    onClick={prevExperience}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 hover:text-white"
                    onClick={nextExperience}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
                <div className="flex justify-center gap-2 p-3 bg-muted/50">
                  {visitorExperiences.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === activeExperience ? "bg-primary w-8" : "bg-muted-foreground/50"
                      }`}
                      onClick={() => setActiveExperience(index)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Trending Topics */}
            <Card className="border-2">
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <li key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{topic.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {topic.posts}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

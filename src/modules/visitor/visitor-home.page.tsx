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
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import supabase from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"
import { useMuseums } from "../admin/museums/hooks/useMuseums"
import useInfiniteEvents from "./hooks/useEventsForInfiniteScrolling"


const exhibits = [
  {
    id: "last-letters-rizal",
    title: "The Last Letters of Jose Rizal",
    description: "A powerful exhibition showcasing Rizal's final correspondences.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-An9enVSaKzjLmh6eu5zyNTYrx0nNQc.png",
    date: "Feb 20 - Mar 30, 2024",
    location: "Main Gallery",
    visitors: "2,847",
    rating: "4.9"
  },
  {
    id: "iskolar-ni-ynares",
    title: "Iskolar ni Ynares: Artistic Visions",
    description: "Celebrating local talent and creativity through diverse artworks.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-An9enVSaKzjLmh6eu5zyNTYrx0nNQc.png",
    date: "Apr 1 - Apr 30, 2024",
    location: "East Wing Gallery",
    visitors: "1,523",
    rating: "4.7"
  },
  {
    id: "ccs-days",
    title: "CCS Days: Digital Heritage",
    description: "Exploring the intersection of technology and cultural preservation.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-An9enVSaKzjLmh6eu5zyNTYrx0nNQc.png",
    date: "May 15 - Jun 15, 2024",
    location: "Tech Pavilion",
    visitors: "3,142",
    rating: "4.8"
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


export default function Visitor() {
  const [activeExperience, setActiveExperience] = useState(0)

  const nextExperience = () => {
    setActiveExperience((prev) => (prev + 1) % visitorExperiences.length)
  }

  const prevExperience = () => {
    setActiveExperience((prev) => (prev - 1 + visitorExperiences.length) % visitorExperiences.length)
  }

  const { data: museumsData } = useMuseums();

   const {
      data,
    } = useInfiniteEvents({
      pageSize: 5,
    });

    console.log(data?.pages[0]?.data)
  

    const { data: latestPosts, } = useQuery({
      queryKey: ["posts", "latest"],
      queryFn: async () => {
        const { data } = await supabase
          .from("posts_with_users")
          .select(`
            post_id,
            user_uid,
            content,
            images,
            created_at,
            likes,
            comments,
            shares,
            firstName,
            lastName,
            visitorImg
          `)
          .order("created_at", { ascending: false })
          .limit(10)
        
        return data?.map(post => ({
          ...post,
          created_at: new Date(post.created_at).toLocaleString()
        })) || []
      }
    })

    console.log(latestPosts);


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-8">
            {/* Enhanced Hero Section */}
            <section className="relative h-[60vh] overflow-hidden rounded-xl shadow-2xl">
              <img
                src={museumsData?.data?.museums[0]?.coverPhoto}
                alt={museumsData?.data?.museums[0]?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <Badge className="mb-3 text-sm">{museumsData?.data?.museums[0]?.type}</Badge>
                <h1 className="text-4xl font-bold text-white mb-3">{museumsData?.data?.museums[0]?.title}</h1>
                <p className="text-white/90 mb-6 text-lg max-w-2xl">{museumsData?.data?.museums[0]?.description}</p>
                <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm mb-4">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {museumsData?.data?.museums[0]?.updated_at}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {museumsData?.data?.museums[0]?.visitors} visitors
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                    {museumsData?.data?.museums[0]?.rating} rating
                  </div>
                </div>
                <Button size="lg" className="gap-2">
                  <Ticket className="h-4 w-4" />
                  Book Your Visit
                </Button>
              </div>
            </section>

            {/* Enhanced Tabs for Events and Exhibits */}
            <Tabs defaultValue="events" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="events" className="text-base">Upcoming Events</TabsTrigger>
                <TabsTrigger value="exhibits" className="text-base">Current Exhibits</TabsTrigger>
              </TabsList>
              <TabsContent value="events" className="space-y-4 mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {data?.pages[0]?.data.map((event) => (
                    <Card key={event.event_id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
                      <div className="relative aspect-video">
                        <img
                          src={event.coverPhoto}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <CalendarDays className="h-4 w-4 mr-2" />
                            {event.eventDate}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            {event.eventTime}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="exhibits" className="space-y-4 mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {exhibits.map((exhibit) => (
                    <Card key={exhibit.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
                      <div className="relative aspect-video">
                        <img
                          src={exhibit.image}
                          alt={exhibit.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Badge className="bg-primary/90 backdrop-blur">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {exhibit.rating}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{exhibit.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{exhibit.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <CalendarDays className="h-4 w-4 mr-2" />
                            {exhibit.date}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {exhibit.location}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Eye className="h-4 w-4 mr-2" />
                            {exhibit.visitors} visitors
                          </div>
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
                  {latestPosts?.map((experience, index) => (
                    <div
                      key={experience?.post_id}
                      className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                        index === activeExperience ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
                      }`}
                    >
                      <img
                        src={experience?.images[0]}
                        alt={`Experience by ${experience}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-10 w-10 border-2 border-white">
                            <AvatarImage src={experience?.content} />
                            <AvatarFallback>{experience?.content}</AvatarFallback>
                          </Avatar>
                          <div>
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
                  {latestPosts?.map((_, index) => (
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

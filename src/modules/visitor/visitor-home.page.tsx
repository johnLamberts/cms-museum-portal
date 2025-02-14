/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Clock, Heart, MessageCircle, Share2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import useFeaturedEvents from "./hooks/useFeaturedEvent"



const visitorPosts = [
  {
    id: 1,
    visitor: "John D.",
    visitorImage: "/placeholder.svg?height=40&width=40",
    image: "/placeholder.svg?height=600&width=600",
    exhibit: "The Last Letters of Jose Rizal",
    description:
      "An incredible experience seeing these historical artifacts. The detail in Rizal's handwriting is remarkable. #RizalLetters #History",
    likes: 24,
    comments: 5,
    timeAgo: "2h ago",
  },
  {
    id: 2,
    visitor: "Maria S.",
    visitorImage: "/placeholder.svg?height=40&width=40",
    image: "/placeholder.svg?height=600&width=600",
    exhibit: "Philippine Revolution Gallery",
    description:
      "Learning about our history through these preserved artifacts. Every piece tells a story of courage. #History #Culture",
    likes: 18,
    comments: 3,
    timeAgo: "4h ago",
  },
]

export default function VisitorHome() {

  const {data: featuredEvents, isLoading } = useFeaturedEvents();

  const navigate = useNavigate();


  if(isLoading) return <>Loading...</>
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Featured Exhibits */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Event</h2>
        <ScrollArea className="w-full">
          <div className="flex gap-4">
            {featuredEvents?.map((exhibit: any) => (
              <Card key={exhibit.event_id} className="w-[300px] flex-shrink-0">
                <CardHeader className="relative h-[200px] p-0">
                  <img
                    src={exhibit.coverPhoto || "/placeholder.svg"}
                    alt={exhibit.title}
                    className="object-cover rounded-t-lg max-h-24"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs",
                        exhibit.status === "Now Showing" ? "bg-green-500 text-white" : "bg-yellow-500 text-white",
                      )}
                    >
                      {exhibit.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{exhibit.title}</h3>
                  {/* <p className="text-sm text-gray-500">Curator: {exhibit.curator}</p> */}
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Visitor Experiences */}
      <section>
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-4">Visitor Experiences</h2>
            <Button variant="shine" size="sm" onClick={() => navigate("visitor_exhibits")}>
              View more
            </Button>
        </div>
        <div className="grid gap-6">
          {visitorPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.visitorImage || "/placeholder.svg"}
                      alt={post.visitor}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{post.visitor}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.timeAgo}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Post Image */}
                <div className="relative aspect-video mb-4">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.exhibit}
                    className="object-cover rounded-lg"
                  />
                </div>

                {/* Post Content */}
                <div>
                  <h4 className="font-semibold mb-2">{post.exhibit}</h4>
                  <p className="text-gray-600 mb-4">{post.description}</p>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}


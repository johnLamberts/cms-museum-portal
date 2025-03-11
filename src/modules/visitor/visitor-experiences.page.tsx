import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge, } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Heart, ImageIcon, MessageCircle, Share2, User } from "lucide-react"

const VisitorExperiencePage = () => {
  return (
    <main className="flex-1">
    <div className="container grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 p-4 md:p-6">
      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your Avatar" />
              <AvatarFallback>YA</AvatarFallback>
            </Avatar>
            <Input placeholder="Share your museum experience..." className="rounded-full bg-muted" />
            <Button size="icon" variant="ghost">
              <ImageIcon className="h-5 w-5" />
              <span className="sr-only">Add image</span>
            </Button>
            <Button size="icon" variant="ghost">
              <Camera className="h-5 w-5" />
              <span className="sr-only">Add photo</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="trending">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="latest">Latest</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="trending" className="space-y-4 mt-4">
            {[
              {
                user: "Emily Chen",
                handle: "@art_enthusiast",
                avatar: "/placeholder.svg?height=40&width=40",
                time: "2h ago",
                content:
                  "The new Impressionist exhibit at the museum is absolutely breathtaking! The way they've arranged the paintings to show the progression of the movement is so thoughtful. I spent hours just taking it all in. Definitely worth a visit! #ArtLovers #Impressionism",
                image: "/placeholder.svg?height=400&width=600",
                likes: 245,
                comments: 32,
                shares: 18,
                exhibition: "Impressionist Dreams",
              },
              {
                user: "Marcus Johnson",
                handle: "@history_buff",
                avatar: "/placeholder.svg?height=40&width=40",
                time: "5h ago",
                content:
                  "The interactive Ancient Egypt exhibit blew my mind! Being able to virtually 'unwrap' a mummy and explore the tomb was such an immersive experience. The kids were fascinated too. Great job making history come alive! #AncientEgypt #MuseumTech",
                image: "/placeholder.svg?height=400&width=600",
                likes: 189,
                comments: 27,
                shares: 14,
                exhibition: "Ancient Egypt Revealed",
              },
            ].map((post, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <Avatar>
                    <AvatarImage src={post.avatar} alt={post.user} />
                    <AvatarFallback>{post.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{post.user}</span>
                      <span className="text-xs text-muted-foreground">{post.handle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {post.exhibition}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-4 pb-4">
                    <p className="text-sm">{post.content}</p>
                  </div>
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt="Post image"
                    width={600}
                    height={400}
                    className="aspect-video object-cover w-full"
                  />
                </CardContent>
                <CardFooter className="p-4">
                  <div className="flex items-center gap-6 w-full">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Share2 className="h-4 w-4" />
                      <span>{post.shares}</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="latest" className="space-y-4 mt-4">
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sofia Patel" />
                  <AvatarFallback>SP</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Sofia Patel</span>
                    <span className="text-xs text-muted-foreground">@art_teacher</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Modern Art Wing
                    </Badge>
                    <span className="text-xs text-muted-foreground">Just now</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-4 pb-4">
                  <p className="text-sm">
                    Just finished the guided tour of the Modern Art wing. The curator's insights on the abstract
                    expressionism movement were fascinating! Loved how they connected the works to historical
                    events. #ModernArt #MuseumTour
                  </p>
                </div>
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Post image"
                  width={600}
                  height={400}
                  className="aspect-video object-cover w-full"
                />
              </CardContent>
              <CardFooter className="p-4">
                <div className="flex items-center gap-6 w-full">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Heart className="h-4 w-4" />
                    <span>12</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>3</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>1</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="following" className="mt-4">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-6">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Follow other museum visitors</h3>
              <p className="mb-4 text-sm text-muted-foreground max-w-md">
                Follow other art enthusiasts to see their experiences and recommendations in your feed.
              </p>
              <Button>Discover People</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="hidden md:block space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                title: "Curator's Talk: Renaissance Masters",
                date: "March 15, 2025",
                time: "2:00 PM",
              },
              {
                title: "Family Workshop: Clay Sculptures",
                date: "March 18, 2025",
                time: "10:00 AM",
              },
              {
                title: "Evening Exhibition: Night at the Museum",
                date: "March 20, 2025",
                time: "7:00 PM",
              },
            ].map((event, i) => (
              <div key={i} className="flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0">
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {event.date} • {event.time}
                </p>
                <Button variant="link" className="p-0 h-auto w-auto justify-start text-sm">
                  Learn more
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Popular Exhibitions</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                title: "Impressionist Dreams",
                visitors: "1.2k visitors this week",
              },
              {
                title: "Ancient Egypt Revealed",
                visitors: "956 visitors this week",
              },
              {
                title: "Modern Art Masterpieces",
                visitors: "784 visitors this week",
              },
            ].map((exhibition, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <span className="font-medium text-primary">{i + 1}</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium leading-none">{exhibition.title}</h4>
                  <p className="text-xs text-muted-foreground">{exhibition.visitors}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Suggested Connections</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                name: "Alex Rivera",
                handle: "@art_historian",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                name: "Priya Sharma",
                handle: "@gallery_curator",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                name: "Jordan Lee",
                handle: "@sculpture_fan",
                avatar: "/placeholder.svg?height=40&width=40",
              },
            ].map((person, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={person.avatar} alt={person.name} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.handle}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Follow
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
  )
}

export default VisitorExperiencePage

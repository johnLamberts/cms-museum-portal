/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bookmark, CalendarDays, ChevronLeft, Clock, Heart, MapPin, MessageCircle, Share2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { EditorContent } from "@tiptap/react"
import { useEffect, useMemo } from "react"
import { NavLink, useParams } from "react-router-dom"
import MuseumLoader from "../admin/museums/exhibit-loader"
import { useBlockEditor } from "../admin/museums/hooks/useMuseumEditor"
import { useMuseums } from "../admin/museums/hooks/useMuseums"


export default function VisitorVisitsExhibit() {
  const { exid } = useParams();
  const { editor } = useBlockEditor();

  

  const { data: exhibits, isLoading } = useMuseums();

 const memoMuseums = useMemo(() => {
    return exhibits?.data?.museums || [];
  }, [exhibits]);

  const exhibit = memoMuseums.filter((event: any) => event.exhibits_id === Number(exid)).at(0)
  const relatedExhibits = memoMuseums.filter((event: any) => event.id !== exid).slice(1, 3)

  useEffect(() => {
    if (editor && exhibit?.museumContent) {
      editor.commands.setContent(exhibit?.museumContent)
      editor.setEditable(false)
    }
  }, [editor, exhibit?.museumContent])
  
  if(isLoading) return <MuseumLoader />

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img src={exhibit.coverPhoto || "/placeholder.svg"} alt={exhibit.title}  className="object-cover"  />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute top-4 left-4">
          <NavLink to="/visitor">
            <Button variant="ghost" size="sm" className="gap-2 text-white hover:text-white hover:bg-background/20">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </NavLink>
        </div>
      </div>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Exhibit Title and Meta */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{exhibit.title}</h1>
            <div className="flex justify-center items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {exhibit.exhibitExclusiveDate  || "To be announced"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {exhibit.address  || "To be announced"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {exhibit.expectedTime  || "To be announced" }
              </span>
            </div>
          </div>

          {/* Curator Info */}
          <Card className="bg-muted">
            <CardContent className="flex items-center gap-4 py-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>CRTR</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Curated by {exhibit.curalator}</p>
                <p className="text-sm text-muted-foreground">Museo Rizal Historical Archives Team</p>
              </div>
            </CardContent>
          </Card>

          {/* Exhibit Description */}
          <div className="prose dark:prose-invert max-w-none">
            {/* <p className="text-lg leading-relaxed">{exhibit.description}</p>
            <p>
              Through interactive displays, original manuscripts, and multimedia presentations, visitors can explore the
              complex layers of Rizal's character, his relationships with family and friends, and his enduring love for
              his country. This exhibition offers a unique opportunity to connect with a pivotal moment in Philippine
              history and reflect on the enduring legacy of Jose Rizal.
            </p> */}
            {editor && <EditorContent editor={editor} />}
          </div>

         

          {/* Related Exhibits */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Related Exhibits</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedExhibits.map((relatedExhibit: any) => (
                <NavLink to={`/visitor/exhibit/${relatedExhibit.exhibits_id}`} key={relatedExhibit.exhibits_id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-[4/3]">
                      <img
                        src={relatedExhibit.coverPhoto || "/placeholder.svg"}
                        alt={relatedExhibit.title}
                        className="object-cover w-1/2"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{relatedExhibit.title}</CardTitle>
                      <CardDescription>{relatedExhibit.date}</CardDescription>
                    </CardHeader>
                  </Card>
                </NavLink>
              ))}
            </div>
          </div>

          <Separator />

          {/* Engagement Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-5 w-5" />
                  {exhibit.likes}
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {exhibit.comments}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Comments</h3>
              <div className="flex gap-4 items-start">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input placeholder="Add a comment..." className="mb-2" />
                  <Button>Post</Button>
                </div>
              </div>
              {/* Sample comments */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 pt-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">User {i + 1}</span>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm mb-2">
                      This exhibition provides such a moving glimpse into Rizal's final days. The letters to his family
                      are particularly touching. Thank you for this wonderful curation! 🙏
                    </p>
                    <div className="flex gap-4">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Heart className="h-4 w-4" />
                        42
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <MessageCircle className="h-4 w-4" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


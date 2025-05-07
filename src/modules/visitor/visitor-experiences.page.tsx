/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import supabase from "@/lib/supabase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Camera, Heart, ImageIcon, MessageCircle, X } from "lucide-react"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import useCurrentUser from "../authentication/useCurrentUser"

// Import the ImageCarousel component
import ImageCarousel from "./visitor-experience-carousel"

interface Post {
  post_id: string
  user_uid: string
  firstName?: string,
  lastName?: string,
  visitorImg: string,
  content: string
  images: string[]
  created_at: string
  likes: number
  comments: number
  shares: number
}

const VisitorExperiencePage = () => {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Local state
  const [postContent, setPostContent] = useState("")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [selectedExhibition, setSelectedExhibition] = useState("")
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Current user 
  const { user: currentUser } = useCurrentUser();
  const navigate = useNavigate();

  // Get user profile
  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", (currentUser as any).visitor_id],
    enabled: !!(currentUser as any).visitor_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("visitor")
        .select("*")
        .eq("visitor_id", (currentUser as any).visitor_id)
        .single()
      return data
    }
  })

  // Fetch trending posts
  const { data: trendingPosts, isLoading: loadingTrending } = useQuery({
    queryKey: ["posts", "trending"],
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
        .order("likes", { ascending: false })
        .limit(10)
      
      return data?.map(post => ({
        ...post,
        created_at: new Date(post.created_at).toLocaleString()
      })) || []
    }
  })
  
  // Fetch latest posts
  const { data: latestPosts, isLoading: loadingLatest } = useQuery({
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

  // Fetch upcoming events
  const { data: upcomingEvents } = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(3)
      
      return data || []
    }
  })
    
  // Fetch popular exhibitions
  const { data: popularExhibitions } = useQuery({
    queryKey: ["exhibitions", "popular"],
    queryFn: async () => {
      const { data } = await supabase
        .from("exhibits")
        .select("*")
        .limit(3)
      
      return data || []
    }
  })

  // Create post mutation
  const createPost = useMutation({
    mutationFn: async ({ content, images }: { content: string, images: File[], exhibition: string }) => {
      if (!currentUser) throw new Error("User not authenticated")
        
      // 1. Create the post record first
      const postId = uuidv4()

      const { data: posts, error: postError } = await supabase
        .from("experience_posts")
        .insert({
          user_uid: (currentUser as any).user_uid,
          content,
          images: [], // Initially empty, will update after uploads
          created_at: new Date().toISOString(),
          likes: 0,
          comments: 0,
          shares: 0,  
        }).select();
      
      if (postError) throw postError
      
      // 2. Upload images if any
      const imageUrls: string[] = []
      
      if (images.length > 0) {
        for (const image of images) {
          const fileExt = image.name.split('.').pop()
          const filePath = `experiences/${(currentUser as any).visitor_id}/${postId}/${Math.random()}.${fileExt}`
          
          const { error: uploadError } = await supabase
            .storage
            .from("museo_rizal")
            .upload(filePath, image)
          
          if (uploadError) throw uploadError
          
          // Get public URL
          const { data: { publicUrl } } = supabase
            .storage
            .from("museo_rizal")
            .getPublicUrl(filePath)

          imageUrls.push(publicUrl);
        }
        
        // 3. Update post with image URLs
        const { error: updateError } = await supabase
          .from("experience_posts")
          .update({ images: imageUrls })
          .eq("post_id", posts.at(0).post_id)

        if (updateError) throw `${JSON.stringify(updateError, null, 2)}`
      }
      
      return { id: postId, imageUrls }
    },
    onSuccess: () => {
      // Reset form
      setPostContent("")
      setSelectedImages([])
      setPreviewUrls([])
      setSelectedExhibition("")
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      
      toast.success("Your experience has been shared.")
      
      setIsSubmitting(false)
    },
    onError: (error) => {
      console.error("Error creating post:", error)
      toast.error("Failed to share your experience. Please try again.")
      
      setIsSubmitting(false)
    }
  })

  // Like post mutation
  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!currentUser) throw new Error("User not authenticated")

      // Check if already liked
      const { data: existingLike } = await supabase
        .from("experience_post_likes")
        .select("*")
        .eq("user_uid", (currentUser as any).user_uid)
        .eq("post_id", postId)
        .single()
      
      if (existingLike) {
        // Unlike
        const { error: deleteError } = await supabase
          .from("experience_post_likes")
          .delete()
          .eq("user_uid", (currentUser as any).user_uid)
          .eq("post_id", postId)
        
        if (deleteError) throw deleteError
        
        // Decrement like count
        const { error: updateError } = await supabase.rpc("decrement_likes", { post_id: postId })
        if (updateError) throw updateError
        
        return { postId, action: "unlike" }
      } else {
        // Like
        const { error: insertError } = await supabase
          .from("experience_post_likes")
          .insert({
            user_uid: (currentUser as any).user_uid,
            post_id: postId
          })
        
        if (insertError) throw insertError
        
        // Increment like count
        const { error: updateError } = await supabase.rpc("increment_likes", { post_id: postId })
        if (updateError) throw updateError
        
        return { postId, action: "like" }
      }
    },
    onSuccess: (data) => {
      // Optimistic update would be better, but for simplicity we'll refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      
      toast.info(data.action === "like" ? "Post liked!" : "Post unliked")
    }
  })

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      
      if (selectedImages.length + files.length > 5) {
        toast.warning("You can upload a maximum of 5 images per post.")
        return
      }
      
      setSelectedImages(prev => [...prev, ...files])
      
      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file))
      setPreviewUrls(prev => [...prev, ...newPreviewUrls])
    }
  }
  
  // Remove selected image
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index])
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }
  
  // Handle post submission
  const handleSubmitPost = () => {
    if (!postContent.trim() && selectedImages.length === 0) {
      toast.error("Please add some text or at least one image to share your experience.")
      return
    }
    
    setIsSubmitting(true)
    createPost.mutate({
      content: postContent.trim(),
      images: selectedImages,
      exhibition: selectedExhibition
    })
  }

  return (
    <main className="flex-1">
      <div className="container grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 p-4 md:p-6">
        <div className="space-y-6">
          {/* Post creation area */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold">Share Your Museum Experience</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="mt-1">
                  <AvatarImage src={userProfile?.visitorImg || "/placeholder.svg?height=40&width=40"} alt="Your Avatar" />
                  <AvatarFallback>{userProfile?.display_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder="Share your museum experience..."
                    className="rounded-xl bg-muted"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    disabled={isSubmitting}
                  />
                  
                  {/* Image preview area */}
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                          <img
                            src={url}
                            alt={`Selected image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 rounded-full"
                            onClick={() => removeImage(index)}
                            disabled={isSubmitting}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove image</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSubmitting || selectedImages.length >= 5}
                      >
                        <ImageIcon className="h-5 w-5" />
                        <span className="sr-only">Add images</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add up to 5 images</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={isSubmitting || selectedImages.length >= 5}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          if (navigator.mediaDevices) {
                            // Camera functionality would be implemented here
                            toast.warning("Camera functionality would open here")
                          }
                        }}
                        disabled={isSubmitting || selectedImages.length >= 5}
                      >
                        <Camera className="h-5 w-5" />
                        <span className="sr-only">Take photo</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Take a photo</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-xs text-muted-foreground">
                  {selectedImages.length}/5 images
                </span>
              </div>
              <Button 
                onClick={handleSubmitPost} 
                disabled={isSubmitting || (!postContent.trim() && selectedImages.length === 0)}
              >
                {isSubmitting ? "Sharing your greatness..." : "Share your experience"}
              </Button>
            </CardFooter>
          </Card>

          {/* Tabs for posts */}
          <Tabs defaultValue="trending">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="latest">Latest</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>
            
            {/* Trending tab */}
            <TabsContent value="trending" className="space-y-4 mt-4">
              {loadingTrending ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : trendingPosts?.length === 0 ? (
                <Card className="p-6 text-center">
                  <p>No trending posts found.</p>
                </Card>
              ) : (
                trendingPosts?.map((post) => (
                  <PostCard 
                    key={post.post_id} 
                    post={{...post}} 
                    onLike={() => likePost.mutate(post.post_id)} 
                  />
                ))
              )}
            </TabsContent>
            
            {/* Latest tab */}
            <TabsContent value="latest" className="space-y-4 mt-4">
              {loadingLatest ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : latestPosts?.length === 0 ? (
                <Card className="p-6 text-center">
                  <p>No recent posts found.</p>
                </Card>
              ) : (
                latestPosts?.map((post) => (
                  <PostCard 
                    key={post.post_id} 
                    post={{...post}} 
                    onLike={() => likePost.mutate(post.post_id)} 
                  />
                ))
              )}
            </TabsContent>
            
            {/* Following tab */}
            <TabsContent value="following" className="mt-4">
              {/* Following tab content here */}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="hidden md:block space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents?.map((event) => (
                <div key={event.event_id} className="flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()} • {event.eventTime}
                  </p>
                  <Button variant="link" onClick={()=> navigate(`/visitor/event/${event.event_id}`)} className="p-0 h-auto w-auto justify-start text-sm">
                    Learn more
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Popular Exhibitions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Popular Exhibitions</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {popularExhibitions?.map((exhibition, i) => (
                <div key={exhibition.exhibits_id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <span className="font-medium text-primary">{i + 1}</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium leading-none">{exhibition.title}</h4>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Suggested Connections */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Suggested Connections</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Suggested connections content here */}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

// Updated PostCard Component with TypeScript ImageCarousel
interface PostCardProps {
  post: Post
  onLike?: () => void
}

const PostCard = ({ post, onLike }: PostCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={post?.visitorImg || "/placeholder.svg?height=40&width=40"} alt={post?.firstName} />
          <AvatarFallback>{post?.firstName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{post?.firstName}</span>
            <span className="text-xs text-muted-foreground">@{post?.lastName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{post.created_at}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {post.content && (
          <div className="px-4 pb-4">
            <p className="text-sm">{post.content}</p>
          </div>
        )}
        
        {/* Instagram-style image carousel */}
        {post.images && post.images.length > 0 && (
          <div className="w-full">
            <ImageCarousel 
              images={post.images} 
              aspectRatio="square"
              height="h-80"
            />
          </div>
        )}
        
      </CardContent>
      <CardFooter className="p-4">
        <div className="flex items-center gap-6 w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={onLike}
          >
            <Heart className="h-4 w-4" />
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default VisitorExperiencePage

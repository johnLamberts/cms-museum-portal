import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bookmark, Grid3X3, Settings } from "lucide-react"

export default function VisitorProfile() {
  const userPosts = [
    { id: 1, image: "/placeholder.svg?height=300&width=300" },
    { id: 2, image: "/placeholder.svg?height=300&width=300" },
    { id: 3, image: "/placeholder.svg?height=300&width=300" },
    { id: 4, image: "/placeholder.svg?height=300&width=300" },
    { id: 5, image: "/placeholder.svg?height=300&width=300" },
    { id: 6, image: "/placeholder.svg?height=300&width=300" },
  ]

  return (
    <div className="max-w-screen-md mx-auto pb-20">
      {/* Profile Header */}
      <div className="px-4 py-8">
        <div className="flex items-start gap-8">
          <div className="w-20 h-20 relative rounded-full overflow-hidden">
            <img src="/placeholder.svg?height=80&width=80" alt="Profile picture" className="object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-xl font-semibold">visitor_username</h1>
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex gap-6 mb-4">
              <div>
                <span className="font-semibold">42</span> posts
              </div>
              <div>
                <span className="font-semibold">825</span> followers
              </div>
              <div>
                <span className="font-semibold">267</span> following
              </div>
            </div>
            <div>
              <p className="font-semibold">Museum Enthusiast</p>
              <p className="text-sm">Exploring the beauty of art and history 🎨</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-around">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            Saved
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <div className="grid grid-cols-3 gap-1">
            {userPosts.map((post) => (
              <div key={post.id} className="aspect-square relative">
                <img src={post.image || "/placeholder.svg"} alt="Post thumbnail"  className="object-cover" />
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="saved">
          <div className="p-8 text-center text-gray-500">No saved posts yet</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


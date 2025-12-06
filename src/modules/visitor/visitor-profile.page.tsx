/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Grid3X3, Settings } from "lucide-react";
import useCurrentUser from "../authentication/useCurrentUser";
import useProfilePosts from "./hooks/useProfile";

export default function VisitorProfile() {

  const { user } = useCurrentUser();

  const { data, isLoading } = useProfilePosts();


  return (
    <div className="max-w-screen-md mx-auto pb-20">
      {/* Profile Header */}
      <div className="px-4 py-8">
        <div className="flex items-start gap-8">
          <div className="w-20 h-20 relative rounded-full overflow-hidden">
            <img src={(user as any)?.visitorImg || "/placeholder.svg?height=80&width=80"} alt="Profile picture" className="object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-xl font-semibold">{(user as any)?.firstName} {(user as any)?.lastName}</h1>
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex gap-6 mb-4">
              
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
        {isLoading ? (
          <div className="col-span-3 py-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          data?.length as number > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {data?.map((post) => (
                <div key={post.post_id} className="aspect-square relative group overflow-hidden bg-gray-100">
                  {post.images && post.images.length > 0 ? (
                    <>
                      <img 
                        src={post.images[0]} 
                        alt="Post thumbnail" 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      {post.images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="16" height="16" rx="2" />
                            <rect x="6" y="6" width="16" height="16" rx="2" />
                          </svg>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-sm text-gray-600 bg-gray-50">
                      {post.content ? post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '') : 'No content'}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-end justify-start">
                    <div className="p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        {post.likes || 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-3 py-16 text-center text-gray-500">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <p className="text-lg font-medium">No posts yet</p>
              <p className="mt-1">When you create posts, they'll appear here.</p>
            </div>
          )
        )}
      </TabsContent>
        <TabsContent value="saved">
          <div className="p-8 text-center text-gray-500">No saved posts yet</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


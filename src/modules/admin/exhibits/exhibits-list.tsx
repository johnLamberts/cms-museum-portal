import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontalIcon, SearchIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ExhibitContentForm from "./exhibit-content.form"


const usersData = [
  {
    "id": 1,
    "name": "Art and Revolution",
    "description": "An exhibition showcasing Filipino revolutionary art during the Spanish colonial era.",
    "start_date": "2024-01-15",
    "end_date": "2024-04-15",
    "museum": "Angono-Binangonan Petroglyphs Museum",
    "status": "Completed"
  },
  {
    "id": 2,
    "name": "Legacy of Heroes",
    "description": "An exhibit dedicated to Rizal's national heroes and their contribution to the country's freedom.",
    "start_date": "2024-03-01",
    "end_date": "2024-06-01",
    "museum": "Museo ni Jose Rizal, Calamba",
    "status": "Upcoming"
  },
  {
    "id": 3,
    "name": "Indigenous Art of Rizal",
    "description": "A celebration of indigenous art forms from the Dumagat communities in Rizal Province.",
    "start_date": "2024-02-10",
    "end_date": "2024-05-10",
    "museum": "Blanco Family Museum",
    "status": "Ongoing"
  },
  {
    "id": 4,
    "name": "Nature and People of Laguna Lake",
    "description": "Exploring the interaction between people and the ecosystem of Laguna Lake through art and artifacts.",
    "start_date": "2024-04-05",
    "end_date": "2024-07-05",
    "museum": "Angkla Art Gallery",
    "status": "Upcoming"
  },
  {
    "id": 5,
    "name": "Evolution of Philippine Textiles",
    "description": "Showcasing the rich tradition of weaving and textile production across the Philippines.",
    "start_date": "2024-05-15",
    "end_date": "2024-08-15",
    "museum": "Pinto Art Museum",
    "status": "Upcoming"
  },
  {
    "id": 6,
    "name": "Rizal’s Life and Legacy",
    "description": "An in-depth look into Jose Rizal's life, his writings, and the inspiration behind his work.",
    "start_date": "2024-06-01",
    "end_date": "2024-09-01",
    "museum": "Museo ng Antipolo",
    "status": "Upcoming"
  },
  {
    "id": 7,
    "name": "Faith and Tradition",
    "description": "Exploring the role of Catholicism in shaping Rizal Province’s culture and heritage.",
    "start_date": "2024-07-10",
    "end_date": "2024-10-10",
    "museum": "Ynares Center Museum",
    "status": "Upcoming"
  },
  {
    "id": 8,
    "name": "Philippine Mythology and Folklore",
    "description": "An immersive exhibit on Philippine myths, legendary creatures, and folklore.",
    "start_date": "2024-08-20",
    "end_date": "2024-11-20",
    "museum": "Angono Municipal Museum",
    "status": "Upcoming"
  },
  {
    "id": 9,
    "name": "The Art of Pottery",
    "description": "Exhibiting traditional pottery techniques from Rizal Province and surrounding areas.",
    "start_date": "2024-09-15",
    "end_date": "2024-12-15",
    "museum": "Pililla Museum of History and Art",
    "status": "Upcoming"
  },
  {
    "id": 10,
    "name": "Journey Through Angono’s Art",
    "description": "A tribute to the vibrant art community in Angono, from National Artists to emerging talent.",
    "start_date": "2024-10-05",
    "end_date": "2025-01-05",
    "museum": "Nemiranda Art House and Museum",
    "status": "Upcoming"
  }
]



const ExhibitsList = () => {
  const navigate = useNavigate();
  
  return (
    <Tabs defaultValue="all">
    <div className="flex items-center">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger className="hidden sm:flex" value="archived">
          Archived
        </TabsTrigger>
      </TabsList>
      <div className="ml-auto flex items-center gap-2">
        <div className="relative ml-auto flex-1 md:grow-0">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="w-full h-8 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            placeholder="Search user..."
            type="search"
          />
        </div>
        <ExhibitContentForm />
      </div>
    </div>
    <TabsContent value="all">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle className="text-[#492309]">Exhibits</CardTitle>
          <CardDescription>
            Manage your exhibits and view their events and activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>

                <TableHead className="hidden md:table-cell">
                  Location{" "}
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Date
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData.map(user => (
              <TableRow>
                <TableCell className="hidden sm:table-cell">
                  <img
                    alt="image not available"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={""}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {user.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{user.status}</Badge>
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <Badge variant="default">{user.museum}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.start_date}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                      >
                        <MoreHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate(`update_form/${user.id}`)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              ))}
             
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing
            <strong>1-10</strong> of <strong>32</strong>
            Users
          </div>
        </CardFooter>
      </Card>
    </TabsContent>
  </Tabs>
  )
}

export default ExhibitsList

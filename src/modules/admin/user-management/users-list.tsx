import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontalIcon, SearchIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import UserContentForm from "./user-content.form"


const usersData = [
  {
    "id": 1,
    "name": "John Doe",
    "role": "admin",
    "image": "https://robohash.org/johndoe.png?size=300x300"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "role": "staff",
    "image": "https://robohash.org/janesmith.png?size=300x300"
  },
  {
    "id": 3,
    "name": "Emily Johnson",
    "role": "guest",
    "image": "https://robohash.org/emilyjohnson.png?size=300x300"
  },
  {
    "id": 4,
    "name": "Michael Brown",
    "role": "admin",
    "image": "https://robohash.org/michaelbrown.png?size=300x300"
  },
  {
    "id": 5,
    "name": "Sarah Davis",
    "role": "staff",
    "image": "https://robohash.org/sarahdavis.png?size=300x300"
  },
  {
    "id": 6,
    "name": "David Wilson",
    "role": "guest",
    "image": "https://robohash.org/davidwilson.png?size=300x300"
  },
  {
    "id": 7,
    "name": "Laura Martinez",
    "role": "admin",
    "image": "https://robohash.org/lauramartinez.png?size=300x300"
  },
  {
    "id": 8,
    "name": "Robert Taylor",
    "role": "staff",
    "image": "https://robohash.org/roberttaylor.png?size=300x300"
  },
  {
    "id": 9,
    "name": "Linda Anderson",
    "role": "guest",
    "image": "https://robohash.org/lindaanderson.png?size=300x300"
  },
  {
    "id": 10,
    "name": "James Thomas",
    "role": "admin",
    "image": "https://robohash.org/jamesthomas.png?size=300x300"
  }
]


const UsersList = () => {
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
        <UserContentForm />
      </div>
    </div>
    <TabsContent value="all">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle className="text-[#492309]">Users</CardTitle>
          <CardDescription>
            Manage your Users and view their profile.
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
                  Role{" "}
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
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
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={user.image}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {user.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Active</Badge>
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <Badge variant="default">{user.role}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  2023-07-12 10:42 AM
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

export default UsersList

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { MoreHorizontalIcon, SearchIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import useMunicipalities from "./hooks/useMunicipality"
import MunicipalContentForm from "./municipal-content.form"
import IMunicipal from "./municipal.interface"


const MunicipalitiesList = () => {
  const navigate = useNavigate();

  const { data: municipalities, isLoading } = useMunicipalities();

  console.log(municipalities)

  return (
    <Tabs defaultValue="all">
    <div className="flex items-center">
      <div className="ml-auto flex items-center gap-2">
        <div className="relative ml-auto flex-1 md:grow-0">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="w-full h-8 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            placeholder="Search municipalities..."
            type="search"
          />
        </div>
       
        <MunicipalContentForm />
      </div>
    </div>
    <TabsContent value="all">
    <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle className="text-[#492309]">Municipalities</CardTitle>
          <CardDescription>
            Manage your Municipality and view their profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>

                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  <>
                    Loading
                  </>
              ) :  
                <> 
                {municipalities.data.municipality?.map((user: IMunicipal) => (
                <TableRow>
                  <TableCell className="font-medium">
                    
                    <Badge variant="outline">{user.municipal}</Badge>
                  </TableCell>
  
                 
                  <TableCell className="hidden md:table-cell">
                    {user.created_at}
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
                        <DropdownMenuItem onClick={() => navigate(`update_form/${user.municipal_id}`)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                ))}
                
                </>
            
              }
             
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

export default MunicipalitiesList

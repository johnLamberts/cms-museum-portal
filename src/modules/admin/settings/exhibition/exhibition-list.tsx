import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontalIcon, SearchIcon } from "lucide-react"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import MunicipalContentForm from "./exhibition-content.form"
import IExhibition from "./exhibition.interface"
import useBaranggay from "./hooks/useMunicipality"


const ExhibitionList = () => {
  const navigate = useNavigate();

  const { data: baranggay, isLoading, error } = useBaranggay();


   const memobaranggay = useMemo(() => {
      return baranggay?.data?.exhibition || [];
    }, [baranggay]);
    
  
  
    const pagination = useMemo(() => ({
      currentPage: baranggay?.data?.currentPage?.page || 1,
      totalPages: baranggay?.data?.totalPages || 1,
      totalDocs: baranggay?.data?.totalDocs || 0,
      limit: baranggay?.data?.currentPage?.limit || 20
    }), [baranggay]);
  
    const renderTableContent = () => {
        if (isLoading) {
          return (
            <TableRow>
              <TableCell colSpan={6} className="h-[400px] text-center">
                <Spinner className="mx-auto" />
                <span className="sr-only">Loading exhibition...</span>
              </TableCell>
            </TableRow>
          );
        }
    
        if (error) {
          return (
            <TableRow>
              <TableCell colSpan={6} className="h-[400px] text-center text-red-500">
                Error loading exhibition. Please try again later.
              </TableCell>
            </TableRow>
          );
        }
    
       
        if (!memobaranggay || memobaranggay.length === 0) {
          return (
            <TableRow>
              <TableCell colSpan={6} className="h-[400px] text-center">
                No exhibition found.
              </TableCell>
            </TableRow>
          );
        }
    
        return memobaranggay.map((user: IExhibition) => (
          <TableRow key={user.exhibition_id}>
           
            <TableCell className="font-light">
              <span className="text-md font-bold">{user.exhibition_type}</span> <br />
            </TableCell>
        
            <TableCell className="hidden md:table-cell">
              {user.created_at}
            </TableCell>
            
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label={`Actions for ${user.exhibition_id}`}
                    size="icon"
                    variant="ghost"
                  >
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate(`update_form/${user.exhibition_id}`)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ));
      };
    


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
          <MunicipalContentForm />
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#492309]">Exhibition Type</CardTitle>
            <CardDescription>
              Manage your Exhibition            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
              
                  <TableHead>Type</TableHead>
               
                  <TableHead className="hidden md:table-cell">
                    Created at
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableContent()}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground">
              Showing <strong>{(pagination.currentPage - 1) * pagination.limit + 1}-{Math.min(pagination.currentPage * pagination.limit, pagination.totalDocs)}</strong> of <strong>{pagination.totalDocs}</strong> Users
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default ExhibitionList

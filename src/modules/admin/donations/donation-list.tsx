import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileIcon, PlusCircleIcon, SearchIcon, } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DonationList = () => {

  const navigate = useNavigate();
  
  return (
    <>
    
      <div className="flex items-center p-4">
      <div className="flex ml-auto items-center gap-2">
        <div className="relative flex-1 md:grow-0">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
          className="w-full h-8 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          placeholder="Search event..."
          type="search"
        />
      </div>
      <div className="ml-auto">
        <Button className="h-8 gap-1" size="sm" variant="outline">
          <FileIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Export
          </span>
        </Button>
        <Button
          className="h-8 gap-1 bg-[#0B0400]"
          size="sm"
          onClick={() => navigate("/event/add_event")}
          variant={"gooeyLeft"}
          
        >
          <PlusCircleIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Event
          </span>
        </Button>
      </div>
    </div>
  </div>
  <Card x-chunk="dashboard-06-chunk-0">

  <CardHeader>
    <CardTitle className="text-[#492309]">Donation</CardTitle>
    <CardDescription>
      Transparency and integrity of every donations.
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
            Created
          </TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* {renderTableContent()}   */}
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
  </>
  )
}

export default DonationList

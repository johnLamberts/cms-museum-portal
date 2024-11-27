import { Spinner } from "@/components/spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileIcon, MoreHorizontalIcon, PlusCircleIcon, SearchIcon } from "lucide-react"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import useMuseums from "./hooks/useMuseums"


// const museums = [
//   {
//     name: "Pintô Art Museum",
//     location: "1 Sierra Madre St, Grand Heights, Antipolo",
//     description: "A contemporary art museum featuring exhibitions, installations, and sculptures set in Mediterranean-inspired architecture.",
//     contact: "+63 2 8697 1015",
//     website: "https://www.pintoart.org"
//   },
//   {
//     name: "Nemiranda Arthouse",
//     location: "31 Doña Aurora St, Angono",
//     description: "Features artworks by Nemesio Miranda Jr. and his family, showcasing imaginative figurism and local culture.",
//     contact: "+63 8727 9989",
//     fee: "PHP 50.00"
//   },
//   {
//     name: "Blanco Family Art Museum",
//     location: "Angono, Rizal",
//     description: "A museum dedicated to the works of the Blanco family, emphasizing traditional and realistic painting styles.",
//     contact: "+63 2 6510 492"
//   },
//   {
//     name: "Angono-Binangonan Petroglyphs Site Museum",
//     location: "Binangonan, Rizal",
//     description: "The oldest rock art in the Philippines, featuring petroglyphs dating back to 3000 B.C.",
//     contact: "+63 2 8929 1727",
//     fee: "Free"
//   },
//   {
//     name: "Balaw-Balaw Restaurant and Art Gallery",
//     location: "16 Doña Justa Subdivision, Angono",
//     description: "A combination of art gallery and restaurant featuring traditional and mythical-inspired artworks.",
//     contact: "+63 2 8672 9209"
//   },
//   {
//     name: "Regina RICA",
//     location: "Tanay, Rizal",
//     description: "A religious sanctuary with a 71-foot statue of Our Lady Regina Rosarii and contemplative spaces.",
//     contact: "+63 2 8656 9380",
//     fee: "Donation-based"
//   },
//   {
//     name: "Casa Santa Museum",
//     location: "Antipolo, Rizal",
//     description: "A unique museum housing a large collection of Santa Claus memorabilia and Christmas-themed items.",
//     contact: "+63 917 891 2208",
//     fee: "PHP 325.00"
//   }
// ];

// Utility function to adjust text color for readability based on the background color

const adjustTextColor = (hexColor: string): string => {
  // Convert hex to RGB
  const rgb = hexToRgb(hexColor);
  if (!rgb) return "#000"; // Fallback to black if the conversion fails

  // Calculate the luminance
  const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  return luminance > 0.5 ? "#000" : "#FFF"; // Return white or black text color based on luminance
};

// Convert hex color to RGB format
const hexToRgb = (hex: string): { r: number, g: number, b: number } | null => {
  // Remove hash at the start if it's there
  hex = hex.replace(/^#/, '');

  // Parse the RGB components
  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16)
    };
  }
  return null;
};



const RoleBadge = ({ role, color }: { role: string, color?: string }) => {
  // If no color is provided, use a default color

  const backgroundColor = color || "#A9A9A9"; // Default to gray if no color is available

  // Dynamically apply the hex color to the background and text
  return (
    <Badge 
      className="font-light" 
      style={{ backgroundColor, color: adjustTextColor(backgroundColor)  }} // Apply color and dynamic text color
      variant="outline"
    >
      {role}
    </Badge>
  );
};


const MuseumLists = () => {
  const navigate = useNavigate();

  const { data: museumsData, isLoading, error } = useMuseums();

  const memoMuseums = useMemo(() => {
    return museumsData?.data?.museums || [];
  }, [museumsData]);


  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[400px] text-center">
            <Spinner className="mx-auto" />
            <span className="sr-only">Loading museums...</span>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[400px] text-center text-red-500">
            Error loading museums. Please try again later.
          </TableCell>
        </TableRow>
      );
    }

   
    if (!memoMuseums || memoMuseums.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[400px] text-center">
            No museums found.
          </TableCell>
        </TableRow>
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return memoMuseums.map((museum: any) => (
      <TableRow key={museum.museum_id}>
        <TableCell className="hidden sm:table-cell">
          <img
            alt={`${museum.title}'s avatar`}
            className="aspect-square rounded-md object-cover"
            height="64"
            src={museum.coverPhoto}
            width="64"
          />
        </TableCell>
        <TableCell className="font-light">
          <span className="text-md font-bold">{museum.title} {museum.lastName}</span> <br />
        </TableCell>
        <TableCell>
          <Badge variant="outline">{museum.fee}</Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <RoleBadge role={museum.address} color={museum.colorTheme} />
          
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {museum.created_at}
        </TableCell>
        
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label={`Actions for ${museum.email}`}
                size="icon"
                variant="ghost"
              >
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate(`update_form/${museum.museum_id}`)}>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    // <Tabs defaultValue="all">
    // <div className="flex items-center">
    //   <TabsList>
    //     <TabsTrigger value="all">All</TabsTrigger>
    //     <TabsTrigger value="active">Active</TabsTrigger>
    //     <TabsTrigger value="draft">Draft</TabsTrigger>
    //     <TabsTrigger className="hidden sm:flex" value="archived">
    //       Archived
    //     </TabsTrigger>
    //   </TabsList>
    //   <div className="ml-auto flex items-center gap-2">
    //     <div className="relative ml-auto flex-1 md:grow-0">
    //       <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    //       <Input
    //         className="w-full h-8 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
    //         placeholder="Search museum..."
    //         type="search"
    //       />
    //     </div>
    //     <Button className="h-8 gap-1" size="sm" variant="outline">
    //       <FileIcon className="h-3.5 w-3.5" />
    //       <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
    //         Export
    //       </span>
    //     </Button>
    //     <Button
    //       className="h-8 gap-1 bg-[#0B0400]"
    //       size="sm"
    //       onClick={() => navigate("/musuem/add_museum")}
    //       variant={"gooeyLeft"}
          
    //     >
    //       <PlusCircleIcon className="h-3.5 w-3.5" />
    //       <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
    //         Add Museum
    //       </span>
    //     </Button>
    //   </div>
    // </div>
    // <TabsContent value="all">
     
  //   </TabsContent>
  // </Tabs> 

  <>
   <div className="flex items-center p-4">
       <div className="flex ml-auto items-center gap-2">
         <div className="relative flex-1 md:grow-0">
           <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input
            className="w-full h-8 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            placeholder="Search museum..."
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
            onClick={() => navigate("/musuem/add_museum")}
            variant={"gooeyLeft"}
            
          >
            <PlusCircleIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Museum
            </span>
          </Button>
        </div>
      </div>
    </div>
  <Card x-chunk="dashboard-06-chunk-0">
   
    <CardHeader>
      <CardTitle className="text-[#492309]">Museums</CardTitle>
      <CardDescription>
        Manage your museums and view their visitor engagement.
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
            <TableHead>Fee</TableHead>
            <TableHead>Location</TableHead>

            <TableHead className="hidden md:table-cell">
              Contact
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

export default MuseumLists

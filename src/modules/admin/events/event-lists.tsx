import { Spinner } from '@/components/spinner';
import { Badge, } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileIcon, MoreHorizontalIcon, PlusCircleIcon, SearchIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useEvents from './hooks/useEvents';


type EventStatusColor = {
  [key in 'upcoming' | 'ongoing' | 'completed' | 'cancelled']: string;
};

const eventStatusColors: EventStatusColor = {
  upcoming: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  ongoing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const EventStatusBadge = ({ status }: { status: string }) => {
  const color = status.toLowerCase() in eventStatusColors
    ? eventStatusColors[status.toLowerCase() as keyof EventStatusColor]
    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

  return (
    <Badge className={`${color} capitalize`} variant="outline">
      {status}
    </Badge>
  );
};


const EventLists = () => {
  const navigate = useNavigate();

  const { data: eventsData, isLoading, error } = useEvents();

  const memoEvents = useMemo(() => {
    return eventsData?.data?.events || [];
  }, [eventsData]);


  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[400px] text-center">
            <Spinner className="mx-auto" />
            <span className="sr-only">Loading events...</span>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[400px] text-center text-red-500">
            Error loading events. Please try again later.
          </TableCell>
        </TableRow>
      );
    }

   
    if (!memoEvents || memoEvents.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[400px] text-center">
            No events found.
          </TableCell>
        </TableRow>
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return memoEvents.map((museum: any) => (
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
          <span className="text-md font-bold">{museum.title} </span>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <EventStatusBadge status={museum.status} />
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
      <CardTitle className="text-[#492309]">Events</CardTitle>
      <CardDescription>
        Manage your events and view their visitor engagement.
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
export default EventLists

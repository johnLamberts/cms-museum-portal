/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner } from '@/components/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CameraIcon,
  FileIcon,
  FileTextIcon,
  MessageSquareQuoteIcon,
  MoreHorizontalIcon,
  PlusCircleIcon,
  SearchIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventService from './service/event.service';
import { EventFormData, usePastEvents } from './usePastEvents';

// Define event status color mapping
type EventStatusColor = {
  [key in 'upcoming' | 'ongoing' | 'completed' | 'canceled']: string;
};

const eventStatusColors: EventStatusColor = {
  upcoming: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  canceled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

// Event status badge component
interface EventStatusBadgeProps {
  status: string;
}

const EventStatusBadge: React.FC<EventStatusBadgeProps> = ({ status }) => {
  const color =
    status.toLowerCase() in eventStatusColors
      ? eventStatusColors[status.toLowerCase() as keyof EventStatusColor]
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  return (
    <Badge className={`${color} capitalize`} variant="outline">
      {status}
    </Badge>
  );
};

// Placeholder interface for DocumentaryModal (if reintroduced)

// Placeholder component for DocumentaryModal (uncomment if implemented)
// const DocumentaryModal: React.FC<DocumentaryModalProps> = ({ isOpen, event, onClose }) => {
//   return null; // Implement modal logic here
// };

const EventLists: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, pastEvents, fetchPastEvents } = usePastEvents();

  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = searchQuery
    ? pastEvents.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pastEvents;

  const handleAddDocumentation = (event: EventFormData) => {
    // Instead of opening a modal, navigate to the documentation page
    navigateToEventDocumentation(event.event_id!);
    // If you want to use the modal, uncomment below and implement DocumentaryModal
    // setDocumentaryModal({
    //   isOpen: true,
    //   event,
    // });
  };

  
  const navigateToEventDocumentation = (eventId: string) => {
    navigate(`/event/documentation/${eventId}`);
  };

  const navigateToEventTestimonials = (eventId: string) => {
    navigate(`/event/testimonials/${eventId}`);
  };

  const navigateToEventGallery = (eventId: string) => {
    navigate(`/event/gallery/${eventId}`);
  };

  // const navigateToPastEventDetails = (eventId: string) => {
  //   navigate(`/event/past-details/${eventId}`);
  // };

  // Function to mark an event as completed
  const markAsCompleted = async (eventId: string) => {
    try {
      await eventService.markEventAsCompleted(eventId);
      // Refresh the events list
      await fetchPastEvents();
    } catch (error: any) {
      console.error('Error marking event as completed:', error);
    }
  };

  // Function to delete an event (placeholder, as deleteEvent is not in eventService)
  const deleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // Uncomment when deleteEvent is implemented in eventService
        // await eventService.deleteEvent(eventId);
        console.log(`Deleting event with ID: ${eventId}`);
        // Refresh the events list
        await fetchPastEvents();
      } catch (error: any) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const renderTableContent = () => {
    if (loading) {
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
            {error || 'Error loading events. Please try again later.'}
          </TableCell>
        </TableRow>
      );
    }

    if (!filteredEvents || filteredEvents.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[400px] text-center">
            No events found.
          </TableCell>
        </TableRow>
      );
    }

    return filteredEvents.map((event) => {
      const isCompletedEvent = event.status?.toLowerCase() === 'completed';

      return (
        <TableRow key={event.event_id}>
          <TableCell className="hidden sm:table-cell">
            <img
              alt={`${event.title}'s avatar`}
              className="aspect-square rounded-md object-cover"
              height="64"
              src={event.coverPhoto || '/api/placeholder/400/320'}
              width="64"
            />
          </TableCell>
          <TableCell className="font-light">
            <span className="text-md font-bold">{event.title}</span>
            {isCompletedEvent && (
              <div className="flex mt-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                  onClick={() => handleAddDocumentation(event)}
                >
                  <FileTextIcon className="h-3 w-3 mr-1" />
                  {event.has_documentation ? 'Edit Documentation' : 'Add Documentation'}
                </Button>
              </div>
            )}
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <EventStatusBadge status={event.status || 'unknown'} />
          </TableCell>
          <TableCell className="hidden md:table-cell">
            {event.created_at ? new Date(event.created_at).toLocaleDateString() : 'Not specified'}
          </TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label={`Actions for ${event.title}`} size="icon" variant="ghost">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate(`/event/update_event/${event.event_id}`)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => deleteEvent(event.event_id!)}>Delete</DropdownMenuItem>
                {event.status !== 'completed' && (
                  <DropdownMenuItem onClick={() => markAsCompleted(event.event_id!)}>
                    Mark as Completed
                  </DropdownMenuItem>
                )}
                {isCompletedEvent && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Completed Event Options</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleAddDocumentation(event)}>
                      <FileTextIcon className="h-4 w-4 mr-2" />
                      Add Documentation
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToEventGallery(event.event_id!)}>
                      <CameraIcon className="h-4 w-4 mr-2" />
                      {event.has_gallery ? 'Edit Photo Gallery' : 'Add Photo Gallery'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigateToEventTestimonials(event.event_id!)}>
                      <MessageSquareQuoteIcon className="h-4 w-4 mr-2" />
                      {event.has_testimonials ? 'Edit Testimonials' : 'Add Testimonials'}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      );
    });
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="ml-auto">
            <Button className="h-8 gap-1" size="sm" variant="outline">
              <FileIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
            </Button>
            <Button
              className="h-8 gap-1 bg-[#0B0400]"
              size="sm"
              onClick={() => navigate('/event/add_event')}
              variant="gooeyLeft"
            >
              <PlusCircleIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Event</span>
            </Button>
          </div>
        </div>
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle className="text-[#492309]">Events</CardTitle>
          <CardDescription>Manage your events and view their visitor engagement.</CardDescription>
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
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableContent()}</TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing
            <strong className="mx-1">1-{Math.min(filteredEvents.length, 10)}</strong> of{' '}
            <strong className="ml-1">{filteredEvents.length}</strong> Events
          </div>
        </CardFooter>
      </Card>

      {/* Documentary/Documentation Modal (uncomment if implemented) */}
     
    </>
  );
};

export default EventLists;

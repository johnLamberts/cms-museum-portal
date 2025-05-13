/* eslint-disable @typescript-eslint/no-explicit-any */
import Eyebrow from '@/components/eyebrow'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'
import { Calendar, ChevronRight, Clock, Filter, Loader2, MapPin, Search } from 'lucide-react'
import { useState } from 'react'

// Define type for Event based on your database schema
type Event = {
  event_id: number
  created_at: string
  updated_at: string
  title: string
  status: string
  coverPhoto: string | null
  eventContent: any | null
  eventStatus: string | null
  eventDate: string | null
  eventTime: string | null
  has_gallery: boolean
  has_testimonials: boolean
}

const MoreEventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // Fetch events from Supabase
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('eventDate', { ascending: true })
      
      if (error) {
        throw new Error(error.message)
      }
      return data || []
    },
  })

  // Filter events based on search and status filter
  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Function to get color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-800'
      case 'ongoing':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date TBA'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
              Discover Cultural <span className="bg-[#927B6B]/95 text-gray-300 italic px-2">Events</span> in Rizal
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Explore exhibitions, tours, and cultural experiences that celebrate our heritage
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#492309] hover:bg-gray-100 font-medium text-lg px-8 py-6">
                Browse Events
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 -mt-12 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              className="pl-10 pr-4 py-6 text-lg w-full"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px] py-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-[#492309] hover:bg-[#492309]/90 text-white py-6 px-8">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Eyebrow label="Featured Events" />
          <h2 className="text-3xl font-display font-bold text-[#492309] mt-2">Highlighted Experiences</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-[#492309]" />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading events. Please try again.
          </div>
        ) : filteredEvents && filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.slice(0, 3).map((event) => (
              <Card key={event.event_id} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  {event.coverPhoto ? (
                    <img 
                      src={event.coverPhoto} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusColor(event.status)}>
                      {event.status || 'Unknown'}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-display text-[#492309]">{event.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-4 w-4" /> {formatDate(event.eventDate)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <div className="flex items-center gap-1 mb-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{event.eventTime || 'Time TBA'}</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <span>{event.eventContent?.location || 'Location TBA'}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#492309] hover:bg-[#492309]/90">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-md text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700">No events found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {filteredEvents && filteredEvents.length > 3 && (
          <div className="mt-8 text-center">
            <Button variant="outline" className="border-[#492309] text-[#492309] hover:bg-[#492309]/10">
              View All Events <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Services Section - From your original design */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Eyebrow label="What We Offer" />
            <h2 className="text-3xl font-display font-bold text-[#492309] mt-2">Cultural Experiences</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-display text-[#492309]">
                  Comprehensive Museum Directory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Our portal features a complete listing of museums in Rizal Province, providing essential information such as location, operating hours, admission fees, and current exhibitions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-display text-[#492309]">
                  Event Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Stay updated on upcoming events, exhibitions, and educational programs hosted by various museums, allowing you to engage with our cultural community.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-display text-[#492309]">
                  Interactive Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  With user accounts, visitors can save their favorite museums and events, leave reviews, and contribute to the ongoing dialogue about our rich history.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative">
        <div className="h-96 bg-cover bg-center" style={{ backgroundImage: "url('/mock/pinto1.png')" }}>
          <div className="absolute inset-0 bg-[#492309]/70 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h2 className="font-display text-3xl md:text-4xl mb-4">Ready to Explore?</h2>
              <p className="text-xl mb-6 max-w-lg mx-auto">
                Join our community and stay updated on the latest cultural events in Rizal
              </p>
              <Button className="bg-white text-[#492309] hover:bg-gray-100 font-medium text-lg px-8 py-6">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

     
      {/* Commitment Section - From your original design */}

      {/* Gallery Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Eyebrow label="Photo Gallery" />
          <h2 className="text-3xl font-display font-bold text-[#492309] mt-2">Visual Highlights</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2 h-64 overflow-hidden rounded-lg">
            <img src="/mock/tataraul.jpg" alt="Gallery Image" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="h-64 overflow-hidden rounded-lg">
            <img src="/mock/tataraul2.jpg" alt="Gallery Image" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="h-64 overflow-hidden rounded-lg">
            <img src="/mock/pinto1.png" alt="Gallery Image" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="h-64 overflow-hidden rounded-lg">
            <img src="/mock/tataraul.jpg" alt="Gallery Image" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="h-64 overflow-hidden rounded-lg">
            <img src="/mock/tataraul2.jpg" alt="Gallery Image" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="col-span-2 h-64 overflow-hidden rounded-lg">
            <img src="/mock/pinto1.png" alt="Gallery Image" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-[#492309] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">Stay Connected</h2>
            <p className="text-lg mb-8 opacity-90">
              Subscribe to our newsletter to receive updates about upcoming events and exhibitions
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 py-6" 
                placeholder="Your email address"
              />
              <Button className="bg-white text-[#492309] hover:bg-gray-100 font-medium text-lg whitespace-nowrap py-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoreEventsPage

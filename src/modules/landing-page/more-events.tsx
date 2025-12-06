/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Calendar, ChevronRight, Clock, Eye, Filter, Loader2, MapPin, Search, Star, Users, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import useArtifacts from '../admin/museum-gallery/hooks/useUsers'

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

export const MoreEventsPage = () => {
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
  const filteredEvents = useMemo(() => {
    return events?.filter(event => {
      const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [events, searchTerm, statusFilter])

  // Function to get color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const { data: artifacts } = useArtifacts()
  
  const memoArtifacts = useMemo(() => {
    return artifacts?.data?.artifacts || []
  }, [artifacts])

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
  }

  const eventStats = useMemo(() => {
    if (!filteredEvents) return { total: 0, upcoming: 0, withGallery: 0, popular: 0 }
    return {
      total: filteredEvents.length,
      upcoming: filteredEvents.filter(e => e.status === 'upcoming').length,
      withGallery: filteredEvents.filter(e => e.has_gallery).length,
      popular: filteredEvents.filter(e => e.has_testimonials).length
    }
  }, [filteredEvents])
      
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#492309] via-[#6B4423] to-[#8B5A3C] opacity-95"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-amber-100 text-sm font-medium tracking-wide">CULTURAL HERITAGE EVENTS</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl mb-6 text-white leading-tight">
              Discover Cultural <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-transparent italic">Events</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-amber-400/30 -z-0"></span>
              </span> in Rizal
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-amber-50 max-w-2xl mx-auto leading-relaxed">
              Explore exhibitions, tours, and cultural experiences that celebrate our heritage
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="group bg-white text-[#492309] hover:bg-amber-50 font-semibold text-lg px-10 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                Browse Events
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="group border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-10 py-4 rounded-full transition-all duration-300 backdrop-blur-sm">
                View Calendar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-grow group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#492309] transition-colors" />
                <Input
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-[#492309] focus:ring-2 focus:ring-[#492309]/20 outline-none transition-all"
                  placeholder="Search events by name, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Filter Dropdown */}
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px] px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-700 font-medium focus:border-[#492309] focus:ring-2 focus:ring-[#492309]/20 outline-none transition-all">
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
                
                <Button className="bg-[#492309] hover:bg-[#6B4423] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg whitespace-nowrap">
                  Apply Filters
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || statusFilter !== 'all') && (
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <span className="text-sm text-gray-600 font-medium">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="hover:bg-amber-200 rounded-full p-0.5 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter('all')} className="hover:bg-blue-200 rounded-full p-0.5 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-[#492309] font-medium underline transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Events', value: eventStats.total, icon: Calendar },
            { label: 'Upcoming', value: eventStats.upcoming, icon: Clock },
            { label: 'With Gallery', value: eventStats.withGallery, icon: Eye },
            { label: 'Popular', value: eventStats.popular, icon: Star }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#492309] mt-1">{stat.value}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <stat.icon className="h-6 w-6 text-[#492309]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="inline-block mb-3 px-4 py-1.5 bg-amber-100 rounded-full">
            <span className="text-[#492309] text-sm font-semibold tracking-wide uppercase">Featured Events</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-[#492309]">Highlighted Experiences</h2>
          <p className="text-gray-600 mt-2 text-lg">Don't miss these upcoming cultural events</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-[#492309] mx-auto mb-4" />
              <p className="text-gray-600">Loading amazing events...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 p-8 rounded-xl text-center">
            <div className="text-red-600 font-semibold text-lg mb-2">Error loading events</div>
            <p className="text-red-600">Please try again later or contact support.</p>
          </div>
        ) : filteredEvents && filteredEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.slice(0, 6).map((event) => (
                <Card key={event.event_id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-amber-200 hover:-translate-y-2">
                  <div className="relative h-56 overflow-hidden">
                    {event.coverPhoto ? (
                      <img 
                        src={event.coverPhoto} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <Calendar className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(event.status)} backdrop-blur-sm`}>
                        {event.status?.toUpperCase() || 'UNKNOWN'}
                      </Badge>
                    </div>

                    {(event.has_gallery || event.has_testimonials) && (
                      <div className="absolute top-4 left-4 flex gap-2">
                        {event.has_gallery && (
                          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                            <Eye className="h-3 w-3" /> Gallery
                          </span>
                        )}
                        {event.has_testimonials && (
                          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                            <Star className="h-3 w-3" /> Reviews
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-display font-bold text-[#492309] group-hover:text-[#6B4423] transition-colors line-clamp-2">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4 text-[#492309]" />
                      <span className="font-medium">{formatDate(event.eventDate)}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="text-gray-700 space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#492309] flex-shrink-0" />
                      <span className="text-sm">{event.eventTime || 'Time TBA'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-[#492309] flex-shrink-0 mt-0.5" />
                      <span className="text-sm line-clamp-2">{event.eventContent?.location || 'Location TBA'}</span>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-[#492309] to-[#6B4423] hover:from-[#6B4423] hover:to-[#492309] text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg flex items-center justify-center gap-2">
                      View Details
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredEvents.length > 6 && (
              <div className="mt-10 text-center">
                <Button variant="outline" className="border-2 border-[#492309] text-[#492309] hover:bg-[#492309] hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg inline-flex items-center gap-2">
                  View All {filteredEvents.length} Events
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-amber-50 p-16 rounded-2xl text-center border-2 border-dashed border-gray-300">
            <Calendar className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-display font-bold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any events matching your criteria. Try adjusting your filters or check back later.
            </p>
            <Button
              onClick={clearFilters}
              className="bg-[#492309] hover:bg-[#6B4423] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Services Section */}
      <div className="bg-gradient-to-b from-white to-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <div className="inline-block mb-3 px-4 py-1.5 bg-amber-100 rounded-full">
              <span className="text-[#492309] text-sm font-semibold tracking-wide uppercase">What We Offer</span>
            </div>
            <h2 className="text-4xl font-display font-bold text-[#492309]">Cultural Experiences</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
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
            
            <Card className="bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
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
            
            <Card className="bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
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
      <div className="relative overflow-hidden">
        <div className="h-96 bg-cover bg-center" style={{ backgroundImage: "url('/mock/pinto1.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#492309]/80 via-[#492309]/70 to-[#6B4423]/80"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-4 max-w-2xl">
              <h2 className="font-display text-3xl md:text-5xl mb-4 font-bold">Ready to Explore?</h2>
              <p className="text-xl mb-8 text-amber-50">
                Join our community and stay updated on the latest cultural events in Rizal
              </p>
              <Button className="bg-white text-[#492309] hover:bg-amber-50 font-semibold text-lg px-10 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section with Artifacts */}
       <div className="container mx-auto px-4 py-16">
        <div className="mb-10 text-center">
          <div className="inline-block mb-3 px-4 py-1.5 bg-amber-100 rounded-full">
            <span className="text-[#492309] text-sm font-semibold tracking-wide uppercase">Photo Gallery</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-[#492309]">Visual Highlights</h2>
          <p className="text-gray-600 mt-2 text-lg">Explore our collection of cultural artifacts</p>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-4">
          {/* Row 1: Large item (2x2) + 2 small items */}
          {memoArtifacts[0] && (
            <div className="col-span-2 row-span-2 group relative overflow-hidden rounded-xl bg-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
              <img 
                src={memoArtifacts[0].artifactImg} 
                alt={memoArtifacts[0].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-lg mb-1">{memoArtifacts[0].title}</h3>
                  <p className="text-amber-200 text-sm line-clamp-2">{memoArtifacts[0].description}</p>
                </div>
              </div>
            </div>
          )}

          {memoArtifacts[1] && (
            <div className="col-span-1 row-span-1 group relative overflow-hidden rounded-xl bg-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 aspect-square">
              <img 
                src={memoArtifacts[1].artifactImg} 
                alt={memoArtifacts[1].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm mb-1">{memoArtifacts[1].title}</h3>
                  <p className="text-amber-200 text-xs line-clamp-2">{memoArtifacts[1].description}</p>
                </div>
              </div>
            </div>
          )}

          {memoArtifacts[2] && (
            <div className="col-span-1 row-span-1 group relative overflow-hidden rounded-xl bg-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 aspect-square">
              <img 
                src={memoArtifacts[2].artifactImg} 
                alt={memoArtifacts[2].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm mb-1">{memoArtifacts[2].title}</h3>
                  <p className="text-amber-200 text-xs line-clamp-2">{memoArtifacts[2].description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Row 2: 2 more small items (completing the right side) */}
          {memoArtifacts[3] && (
            <div className="col-span-1 row-span-1 group relative overflow-hidden rounded-xl bg-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 aspect-square">
              <img 
                src={memoArtifacts[3].artifactImg} 
                alt={memoArtifacts[3].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm mb-1">{memoArtifacts[3].title}</h3>
                  <p className="text-amber-200 text-xs line-clamp-2">{memoArtifacts[3].description}</p>
                </div>
              </div>
            </div>
          )}

          {memoArtifacts[4] && (
            <div className="col-span-1 row-span-1 group relative overflow-hidden rounded-xl bg-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 aspect-square">
              <img 
                src={memoArtifacts[4].artifactImg} 
                alt={memoArtifacts[4].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm mb-1">{memoArtifacts[4].title}</h3>
                  <p className="text-amber-200 text-xs line-clamp-2">{memoArtifacts[4].description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Row 3: 2 small items + 1 large item (2 cols) */}
          {memoArtifacts[5] && (
            <div className="col-span-1 row-span-1 group relative overflow-hidden rounded-xl bg-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 aspect-square">
              <img 
                src={memoArtifacts[5].artifactImg} 
                alt={memoArtifacts[5].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm mb-1">{memoArtifacts[5].title}</h3>
                  <p className="text-amber-200 text-xs line-clamp-2">{memoArtifacts[5].description}</p>
                </div>
              </div>
            </div>
          )}

          {memoArtifacts[6] && (
            <div className="col-span-1 row-span-1 group relative overflow-hidden rounded-xl bg-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 aspect-square">
              <img 
                src={memoArtifacts[6].artifactImg} 
                alt={memoArtifacts[6].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm mb-1">{memoArtifacts[6].title}</h3>
                  <p className="text-amber-200 text-xs line-clamp-2">{memoArtifacts[6].description}</p>
                </div>
              </div>
            </div>
          )}

          {memoArtifacts[7] && (
            <div className="col-span-2 row-span-1 group relative overflow-hidden rounded-xl bg-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 aspect-[2/1]">
              <img 
                src={memoArtifacts[7].artifactImg} 
                alt={memoArtifacts[7].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-lg mb-1">{memoArtifacts[7].title}</h3>
                  <p className="text-amber-200 text-sm line-clamp-2">{memoArtifacts[7].description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Layout - Simple Grid */}
        <div className="grid md:hidden grid-cols-2 gap-4">
          {memoArtifacts.slice(0, 8).map((artifact: any, index: number) => (
            <div key={index} className={`group relative overflow-hidden rounded-xl bg-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${index === 0 || index === 7 ? 'col-span-2 aspect-[2/1]' : 'aspect-square'}`}>
              <img 
                src={artifact.artifactImg} 
                alt={artifact.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm mb-1">{artifact.title}</h3>
                  <p className="text-amber-200 text-xs line-clamp-2">{artifact.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Newsletter Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#492309] via-[#6B4423] to-[#8B5A3C]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="container relative mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-full">
              <Users className="h-8 w-8 text-amber-200" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Stay Connected
            </h2>
            <p className="text-xl text-amber-50 mb-10 leading-relaxed">
              Subscribe to receive updates about upcoming events, exhibitions, and cultural experiences
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <Input 
                className="flex-grow px-6 py-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 outline-none transition-all text-lg"
                placeholder="Enter your email address"
              />
              <Button className="bg-white text-[#492309] hover:bg-amber-50 font-semibold px-10 py-4 rounded-xl transition-all duration-300 hover:shadow-xl whitespace-nowrap">
                Subscribe
              </Button>
            </div>
            
            <p className="text-sm text-amber-100 mt-6">
              Join our community of heritage enthusiasts
            </p>
          </div>
        </div>
      </div>
      </div>
  )}

  export default MoreEventsPage

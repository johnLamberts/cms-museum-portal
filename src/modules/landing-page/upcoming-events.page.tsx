import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import supabase from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, Calendar, Clock, MapPin, Sparkles } from "lucide-react"
import { useState } from "react"

interface Event {
  id: string
  title: string
  description: string
  eventDate: string
  coverPhoto?: string
  location?: string
  eventTime?: string
  status?: string
}

// Enhanced Upcoming Events Component
export const UpcomingEvents = () => {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)

  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('eventDate', { ascending: true })
        .limit(3)
      
      if (error) throw new Error(error.message)
      return data || []
    },
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear()
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto lg:py-20 md:py-16 py-12 px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-gray-200" />
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-3" />
                <div className="h-8 bg-gray-200 rounded mb-2" />
                <div className="h-16 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto lg:py-20 md:py-16 py-12 px-5">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <p className="text-red-600 font-medium">Failed to load events. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto lg:py-20 md:py-16 py-12 px-5">
      <div className="flex flex-col gap-12">
        {/* Header Section */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#927B6B]/10 border border-[#927B6B]/20 mb-6">
            <Sparkles className="h-4 w-4 text-[#927B6B]" />
            <span className="text-sm font-medium text-[#492309]">Upcoming Events</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#492309] leading-tight">
            What's On in Rizal: Upcoming{" "}
            <span className="bg-[#927B6B]/95 text-gray-100 italic px-3 py-1 inline-block transform -rotate-1">
              Museum Events
            </span>
          </h2>
        </div>

        {/* Events Grid */}
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const dateInfo = formatDate(event.eventDate)
              return (
                <Card
                  key={event.id}
                  className="group overflow-hidden border-2 border-gray-200 hover:border-[#927B6B] transition-all duration-300 hover:shadow-2xl cursor-pointer"
                  onMouseEnter={() => setHoveredEvent(event.id)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  {/* Image Section */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={event.coverPhoto || "/mock/hinge.png"}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="bg-[#927B6B] text-white text-center py-1 px-3">
                        <span className="text-xs font-semibold">{dateInfo.month}</span>
                      </div>
                      <div className="text-center py-2 px-3">
                        <span className="text-2xl font-bold text-[#492309]">{dateInfo.day}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {event.status && (
                      <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">
                        {event.status}
                      </Badge>
                    )}
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-[#492309] mb-3 line-clamp-2 group-hover:text-[#927B6B] transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      {event.eventTime && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{event.eventTime}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    <Button 
                      variant="ghost" 
                      className="w-full justify-between group/btn hover:bg-[#927B6B]/10 text-[#492309]"
                    >
                      <span className="font-semibold">Learn More</span>
                      <ArrowRight className={`h-4 w-4 transition-transform ${
                        hoveredEvent === event.id ? 'translate-x-1' : ''
                      }`} />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Upcoming Events</h3>
              <p className="text-gray-500">Check back soon for new events and exhibitions!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

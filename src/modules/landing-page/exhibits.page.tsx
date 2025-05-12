// Enhanced version of ExhibitsPage using standalone components

import Eyebrow from '@/components/eyebrow'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  Clock,
  Filter,
  Loader2,
  MapPin,
  Search,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

// Import standalone components
import MuseumMap from './exhibits-map'
import ExhibitDetailModal, { ExhibitDetailProps } from './exhibits-modal'
import FeaturedCuratorsSection from './feature-curator-sections'
import FeaturedExhibits, { ExhibitCardProps } from './featured-exhibits'
import HeroSection from './hero-exhibits'

// Define types for Exhibit

type VirtualGalleryProps = {
  title?: string
  subtitle?: string
  description?: string
  onLaunch?: () => void
}

const InteractiveVirtualGallery = ({
  title = "360° Virtual Gallery Preview",
  subtitle = "Interactive Experience",
  description = "Get a taste of our exhibitions with this interactive preview. Click and drag to look around.",
  onLaunch = () => console.log('Launch experience')
}: VirtualGalleryProps) => {
  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <Eyebrow label={subtitle} />
          <h2 className="text-4xl font-display font-bold text-[#492309] mt-2 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="relative bg-white shadow-xl rounded-xl overflow-hidden aspect-video max-w-5xl mx-auto">
          {/* Placeholder for 360 viewer - this would be implemented with a proper 360 viewer library */}
          <div className="absolute inset-0 bg-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <ArrowRight className="h-8 w-8 text-[#492309]" />
                  </motion.div>
                </div>
                <p className="text-gray-700 font-medium">360° Preview Available</p>
                <Button 
                  className="mt-4 bg-[#492309]"
                  onClick={onLaunch}
                >
                  Launch Experience
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type Exhibit = ExhibitDetailProps

const ExhibitsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  
  // Fetch exhibits from Supabase
  const { data: exhibits, isLoading, error } = useQuery<Exhibit[]>({
    queryKey: ['exhibits'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('museums')
          .select('*')
          .order('updated_at', { ascending: false })
        
        if (error) {
          toast.error('Failed to load exhibits: ' + error.message)
          throw new Error(error.message)
        }
        
        return data || []
      } catch (err) {
        console.error('Error fetching exhibits:', err)
        throw err
      }
    },
  })

  // Filter exhibits based on search, status, and tab
  const filteredExhibits = exhibits?.filter(exhibit => {
    const matchesSearch = exhibit.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exhibit.curator?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || exhibit.status === statusFilter
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'free' && exhibit.fee === 'Free') ||
                      (activeTab === 'paid' && exhibit.fee !== 'Free') ||
                      (activeTab === 'exclusive' && exhibit.exhibitExclusive === 'Yes')
    
    return matchesSearch && matchesStatus && matchesTab
  }) || []

  // Handle exhibit click to show detail dialog
  const handleExhibitClick = (exhibit: ExhibitCardProps) => {
    // Find the full exhibit details by ID
    const fullExhibit = exhibits?.find(e => e.id === exhibit.id) || null
    setSelectedExhibit(fullExhibit)
  }

  // Handle reservation button click
  const handleReservation = (exhibitId: number) => {
    toast.success(`Reservation for exhibit #${exhibitId} confirmed!`)
    setSelectedExhibit(null)
  }

  // Museum locations for the map
  const museumLocations = [
    { id: 1, name: 'Pinto Art Museum', address: '1 Sierra Madre St, Grand Heights, Antipolo', color: 'red' },
    { id: 2, name: 'Rizal Provincial Museum', address: 'J. Cabarrus St, Pasig, Rizal', color: 'blue' },
    { id: 3, name: 'Blanco Family Museum', address: '312 Ibañez St, Angono, Rizal', color: 'green' },
  ]
  
  // Event handlers
  const handleLaunchExperience = () => {
    toast.info('Launching 360° virtual gallery experience...')
    // Implementation would go here
  }

  const handleViewFullMap = () => {
    toast.info('Opening full interactive map...')
    // Implementation would go here
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - using standalone component */}
      <HeroSection 
        title="Experience Art & Cultural Heritage"
        subtitle="Discover extraordinary exhibits from museums across Rizal that showcase our rich cultural identity"
        backgroundImage="/exhibits_hero.jpg"
        primaryButtonText="Browse Exhibits"
        secondaryButtonText="Featured Collections"
      />

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 -mt-16 relative z-20">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10 pr-4 py-6 text-lg w-full"
                placeholder="Search exhibits by title or curator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] py-6">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="coming soon">Coming Soon</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-[#492309] hover:bg-[#492309]/90 text-white py-6 px-8">
                Search
              </Button>
            </div>
          </div>
          
          {/* Quick filter tabs */}
          <div className="mt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="all" className="px-6">All Exhibits</TabsTrigger>
                <TabsTrigger value="free" className="px-6">Free Admission</TabsTrigger>
                <TabsTrigger value="paid" className="px-6">Paid Admission</TabsTrigger>
                <TabsTrigger value="exclusive" className="px-6">Exclusive</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Featured Exhibits Section - using standalone component */}
      <FeaturedExhibits 
        exhibits={filteredExhibits}
        loading={isLoading}
        error={error as Error | null}
        onExhibitClick={handleExhibitClick}
      />

      {/* Interactive 3D Exhibition Showcase - using standalone component */}
      <InteractiveVirtualGallery 
        onLaunch={handleLaunchExperience}
      />

      {/* All Exhibits Grid with Masonry Layout */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-8">
          <Eyebrow label="Explore All" />
          <h2 className="text-3xl font-display font-bold text-[#492309] mt-2">
            Discover Our Exhibits
          </h2>
          <p className="text-gray-600 mt-2 max-w-3xl">
            Browse through our extensive collection of exhibits from various museums in Rizal.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-[#492309]" />
          </div>
        ) : filteredExhibits && filteredExhibits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* First column in masonry layout */}
            <div className="flex flex-col gap-6">
              {filteredExhibits.filter((_, i) => i % 4 === 0).map((exhibit) => (
                <motion.div 
                  key={exhibit.id}
                  whileHover={{ y: -5 }}
                  onClick={() => handleExhibitClick(exhibit)}
                >
                  <Card className="overflow-hidden cursor-pointer border-l-4 border-l-[#492309]">
                    <div className="relative h-48 overflow-hidden">
                      {exhibit.coverPhoto ? (
                        <img 
                          src={exhibit.coverPhoto} 
                          alt={exhibit.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Calendar className="h-8 w-8 text-[#492309]" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className={`${exhibit.status?.toLowerCase() === 'ongoing' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                          {exhibit.status}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-lg font-display text-[#492309]">
                        {exhibit.title}
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-0 pb-3">
                      <div className="flex items-center text-sm text-gray-600 gap-2">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{exhibit.address || 'Location TBA'}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Second column in masonry layout */}
            <div className="flex flex-col gap-6">
              {filteredExhibits.filter((_, i) => i % 4 === 1).map((exhibit) => (
                <motion.div 
                  key={exhibit.id}
                  whileHover={{ y: -5 }}
                  onClick={() => handleExhibitClick(exhibit)}
                >
                  <Card className="overflow-hidden cursor-pointer border-l-4 border-l-[#492309]">
                    <div className="relative h-48 overflow-hidden">
                      {exhibit.coverPhoto ? (
                        <img 
                          src={exhibit.coverPhoto} 
                          alt={exhibit.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Calendar className="h-8 w-8 text-[#492309]" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className={`${exhibit.status?.toLowerCase() === 'ongoing' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                          {exhibit.status}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-lg font-display text-[#492309]">
                        {exhibit.title}
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-0 pb-3">
                      <div className="flex items-center text-sm text-gray-600 gap-2">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{exhibit.address || 'Location TBA'}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Third column in masonry layout */}
            <div className="flex flex-col gap-6">
              {filteredExhibits.filter((_, i) => i % 4 === 2).map((exhibit) => (
                <motion.div 
                  key={exhibit.id}
                  whileHover={{ y: -5 }}
                  onClick={() => handleExhibitClick(exhibit)}
                >
                  <Card className="overflow-hidden cursor-pointer border-l-4 border-l-[#492309]">
                    <div className="relative h-48 overflow-hidden">
                      {exhibit.coverPhoto ? (
                        <img 
                          src={exhibit.coverPhoto} 
                          alt={exhibit.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Calendar className="h-8 w-8 text-[#492309]" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className={`${exhibit.status?.toLowerCase() === 'ongoing' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                          {exhibit.status}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-lg font-display text-[#492309]">
                        {exhibit.title}
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-0 pb-3">
                      <div className="flex items-center text-sm text-gray-600 gap-2">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{exhibit.address || 'Location TBA'}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Fourth column in masonry layout */}
            <div className="flex flex-col gap-6">
              {filteredExhibits.filter((_, i) => i % 4 === 3).map((exhibit) => (
                <motion.div 
                  key={exhibit.id}
                  whileHover={{ y: -5 }}
                  onClick={() => handleExhibitClick(exhibit)}
                >
                  <Card className="overflow-hidden cursor-pointer border-l-4 border-l-[#492309]">
                    <div className="relative h-48 overflow-hidden">
                      {exhibit.coverPhoto ? (
                        <img 
                          src={exhibit.coverPhoto} 
                          alt={exhibit.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Calendar className="h-8 w-8 text-[#492309]" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className={`${exhibit.status?.toLowerCase() === 'ongoing' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                          {exhibit.status}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-lg font-display text-[#492309]">
                        {exhibit.title}
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-0 pb-3">
                      <div className="flex items-center text-sm text-gray-600 gap-2">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{exhibit.address || 'Location TBA'}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-md text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700">No exhibits found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Featured Curators Section - using standalone component */}
      <FeaturedCuratorsSection />

      {/* Exhibition Calendar - this would be a good candidate for another standalone component */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <Eyebrow label="Plan Your Visit" />
          <h2 className="text-3xl font-display font-bold text-[#492309] mt-2">
            Exhibition Calendar
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Stay updated with our upcoming exhibits and plan your cultural journey
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          {/* Timeline component */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              {/* Item 1 */}
              <div className="relative pl-20">
                <div className="absolute left-0 top-0 w-16 h-16 rounded-full flex items-center justify-center bg-amber-100 z-10">
                  <div className="text-center">
                    <div className="text-xs font-bold">JUN</div>
                    <div className="text-lg font-bold text-[#492309]">15</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
                  <Badge className="bg-blue-100 text-blue-800 mb-2">Coming Soon</Badge>
                  <h3 className="text-xl font-bold text-[#492309] mb-2">
                    Contemporary Art of Rizal: New Voices
                  </h3>
                  <p className="text-gray-600 mb-4">
                    A showcase of emerging artists from the province, featuring paintings, sculptures, and mixed media installations.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>Pinto Art Museum</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>10:00 AM - 5:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional timeline items would go here */}
            </div>
          </div>
        </div>
      </div>

      {/* Museum Map Section - using standalone component */}
      <MuseumMap 
        locations={museumLocations}
        onViewFullMap={handleViewFullMap}
      />

      {/* Call to Action */}
      <div className="relative">
        <div className="h-96 bg-cover bg-center" style={{ backgroundImage: "url('/mock/pinto1.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#492309]/90 to-[#492309]/70 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-xl">
                <h2 className="font-display text-white text-3xl md:text-4xl mb-4">
                  Ready to Explore Our Cultural Heritage?
                </h2>
                <p className="text-white/80 text-xl mb-6">
                  Immerse yourself in the rich cultural tapestry of Rizal through our extraordinary exhibits
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-white text-[#492309] hover:bg-gray-100 font-medium text-lg px-8 py-6">
                    Plan Your Visit
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 font-medium text-lg px-8 py-6">
                    Become a Member
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Eyebrow label="Stay Updated" />
            <h2 className="text-3xl font-display font-bold text-[#492309] mt-2 mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-600 mb-8">
              Get the latest updates on new exhibits, events, and special promotions
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                className="bg-white border-gray-200 py-6 px-4" 
                placeholder="Your email address"
              />
              <Button className="bg-[#492309] text-white hover:bg-[#492309]/90 font-medium text-lg whitespace-nowrap py-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Exhibit Detail Modal - using standalone component */}
      <ExhibitDetailModal 
        exhibit={selectedExhibit}
        open={!!selectedExhibit}
        onOpenChange={(open) => !open && setSelectedExhibit(null)}
        onReserve={handleReservation}
      />
    </div>
  )
}

export default ExhibitsPage

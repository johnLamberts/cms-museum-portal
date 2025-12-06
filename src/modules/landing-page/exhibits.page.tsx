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
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Calendar,
  Clock,
  Filter,
  MapPin,
  Search,
  TrendingUp,
  Users,
  X
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import InteractiveVirtualGallery from './exhibit-3d-virtual-gallery'
import MuseumMap from './exhibits-map'
import ExhibitDetailModal, { ExhibitDetailProps } from './exhibits-modal'
import FeaturedCuratorsSection from './feature-curator-sections'
import FeaturedExhibits, { ExhibitCardProps } from './featured-exhibits'
import HeroSection from './hero-exhibits'

type Exhibit = ExhibitDetailProps

// Default museum placeholder based on theme
const getDefaultExhibitImage = (colorTheme?: string | null) => {
  // Create a simple SVG placeholder with museum icon
  const colors: Record<string, string> = {
    red: '#b91c1c',
    blue: '#1e40af',
    green: '#166534',
    purple: '#6b21a8',
    orange: '#c2410c',
    teal: '#0f766e',
    brown: '#492309',
  }
  
  const color = colors[colorTheme?.toLowerCase() || 'brown'] || colors.brown
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.1" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#grad)"/>
      <path d="M200 80 L160 120 L160 220 L240 220 L240 120 Z M180 140 L220 140 L220 200 L180 200 Z" 
            fill="${color}" opacity="0.3"/>
      <circle cx="200" cy="110" r="5" fill="${color}" opacity="0.5"/>
    </svg>
  `)}`
}

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

  const handleExhibitClick = (exhibit: ExhibitCardProps) => {
    const fullExhibit = exhibits?.find(e => e.id === exhibit.id) || null
    setSelectedExhibit(fullExhibit)
  }

  const handleReservation = (exhibitId: number) => {
    toast.success(`Reservation confirmed for exhibit!`, {
      description: 'Check your email for details.'
    })
    setSelectedExhibit(null)
    console.log(exhibitId)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setActiveTab('all')
    toast.success('Filters cleared')
  }

  const museumLocations = [
    { id: 1, name: 'Pinto Art Museum', address: '1 Sierra Madre St, Grand Heights, Antipolo', color: 'red' },
    { id: 2, name: 'Rizal Provincial Museum', address: 'J. Cabarrus St, Pasig, Rizal', color: 'blue' },
    { id: 3, name: 'Blanco Family Museum', address: '312 Ibañez St, Angono, Rizal', color: 'green' },
  ]

  const handleViewFullMap = () => {
    toast.info('Opening interactive map...')
  }

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || activeTab !== 'all'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection 
        title="Experience Art & Cultural Heritage"
        subtitle="Discover extraordinary exhibits from museums across Rizal that showcase our rich cultural identity"
        backgroundImage="/exhibits_hero.jpg"
        primaryButtonText="Browse Exhibits"
        secondaryButtonText="Featured Collections"
      />

      {/* Enhanced Search and Filter Section */}
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 -mt-16 relative z-20 border-2 border-gray-100"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                className="pl-12 pr-4 py-7 text-base w-full border-2 focus:border-[#927B6B] transition-colors"
                placeholder="Search exhibits by title, curator, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px] py-7 border-2">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    <SelectValue placeholder="Status" />
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
            </div>
          </div>
          
          {/* Quick filter tabs */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow">
              <TabsList className="w-full justify-start overflow-x-auto bg-gray-100">
                <TabsTrigger value="all" className="px-6">All Exhibits</TabsTrigger>
                <TabsTrigger value="free" className="px-6">Free Entry</TabsTrigger>
                <TabsTrigger value="paid" className="px-6">Paid Entry</TabsTrigger>
                <TabsTrigger value="exclusive" className="px-6">Exclusive</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="text-sm whitespace-nowrap"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* Results count */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>
              Showing <strong className="text-[#492309]">{filteredExhibits.length}</strong> of{' '}
              <strong className="text-[#492309]">{exhibits?.length || 0}</strong> exhibits
            </span>
          </div>
        </motion.div>
      </div>

      {/* Featured Exhibits Section */}
      <FeaturedExhibits 
        exhibits={filteredExhibits}
        loading={isLoading}
        error={error as Error | null}
        onExhibitClick={handleExhibitClick}
      />

      {/* Interactive 3D Exhibition Showcase */}
      <InteractiveVirtualGallery />

      {/* All Exhibits Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#927B6B]/10 border border-[#927B6B]/20 mb-6">
            <Award className="h-4 w-4 text-[#927B6B]" />
            <span className="text-sm font-medium text-[#492309]">Explore All</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[#492309] mb-4">
            Complete Exhibition Gallery
          </h2>
          <p className="text-gray-600 text-lg">
            Browse through our extensive collection of {filteredExhibits.length} exhibits from various museums in Rizal.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-[#492309]/20 border-t-[#492309] rounded-full mb-4"
            />
            <p className="text-[#492309] font-medium">Loading exhibits...</p>
          </div>
        ) : filteredExhibits && filteredExhibits.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${searchTerm}-${statusFilter}-${activeTab}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredExhibits.map((exhibit, index) => (
                <motion.div 
                  key={exhibit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  onClick={() => handleExhibitClick(exhibit)}
                >
                  <Card className="group overflow-hidden cursor-pointer border-2 hover:border-[#927B6B] transition-all duration-300 hover:shadow-xl h-full">
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      <img 
                        src={getDefaultExhibitImage(exhibit.colorTheme)} 
                        alt={exhibit.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute top-3 right-3">
                        <Badge className={`font-semibold shadow-lg ${
                          exhibit.status?.toLowerCase() === 'ongoing' 
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                            : exhibit.status?.toLowerCase() === 'coming soon'
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-500 text-white hover:bg-gray-600'
                        }`}>
                          {exhibit.status}
                        </Badge>
                      </div>

                      {exhibit.fee && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-amber-500 text-white hover:bg-amber-600 font-semibold shadow-lg">
                            {exhibit.fee === 'Free' ? '🎟️ Free' : exhibit.fee}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-lg font-display text-[#492309] group-hover:text-[#927B6B] transition-colors line-clamp-2">
                        {exhibit.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardFooter className="pt-2 pb-4 flex flex-col gap-2 items-start">
                      <div className="flex items-center text-sm text-gray-600 gap-2 w-full">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{exhibit.address || 'Location TBA'}</span>
                      </div>
                      {exhibit.expectedTime && (
                        <div className="flex items-center text-sm text-gray-600 gap-2">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>{exhibit.expectedTime}</span>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-100 to-gray-50 p-12 rounded-2xl text-center border-2 border-dashed border-gray-300"
          >
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No exhibits found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <Button onClick={handleClearFilters} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Featured Curators Section */}
      <FeaturedCuratorsSection />

      {/* Exhibition Timeline */}
      <div className="container mx-auto px-4 py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#927B6B]/10 border border-[#927B6B]/20 mb-6">
            <Calendar className="h-4 w-4 text-[#927B6B]" />
            <span className="text-sm font-medium text-[#492309]">Plan Your Visit</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[#492309] mb-4">
            Exhibition Calendar
          </h2>
          <p className="text-gray-600 text-lg">
            Stay updated with our upcoming exhibits and plan your cultural journey
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-[#927B6B] to-[#492309]"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-24"
              >
                <div className="absolute left-0 top-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg z-10">
                  <div className="text-xs font-bold text-white">JUN</div>
                  <div className="text-2xl font-bold text-white">15</div>
                </div>
                <Card className="border-2 hover:border-[#927B6B] transition-all hover:shadow-lg">
                  <div className="p-6">
                    <Badge className="bg-blue-500 text-white hover:bg-blue-600 mb-3">Coming Soon</Badge>
                    <h3 className="text-2xl font-bold text-[#492309] mb-3">
                      Contemporary Art of Rizal: New Voices
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      A showcase of emerging artists from the province, featuring paintings, sculptures, and mixed media installations.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-[#927B6B]" />
                        <span>Pinto Art Museum</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-[#927B6B]" />
                        <span>10:00 AM - 5:00 PM</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4 text-[#927B6B]" />
                        <span>250+ Expected Visitors</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Museum Map Section */}
      <MuseumMap 
        locations={museumLocations}
        onViewFullMap={handleViewFullMap}
      />

      {/* Call to Action */}
      <div className="relative overflow-hidden">
        <div className="h-[500px] bg-cover bg-center relative" style={{ backgroundImage: "url('/mock/pinto1.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#492309]/95 via-[#492309]/85 to-[#492309]/75" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl"
              >
                <h2 className="font-display text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Ready to Explore Our Cultural Heritage?
                </h2>
                <p className="text-white/90 text-xl mb-8 leading-relaxed">
                  Immerse yourself in the rich cultural tapestry of Rizal through our extraordinary exhibits
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-white text-[#492309] hover:bg-gray-100 font-semibold text-lg px-10 py-7 group">
                    Plan Your Visit
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-10 py-7">
                    Become a Member
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#927B6B]/10 border border-[#927B6B]/20 mb-6">
              <Users className="h-4 w-4 text-[#927B6B]" />
              <span className="text-sm font-medium text-[#492309]">Stay Updated</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[#492309] mb-4">
              Join Our Community
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Get the latest updates on new exhibits, exclusive events, and special promotions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <Input 
                className="bg-white border-2 py-7 px-6 text-base flex-grow" 
                placeholder="Enter your email address"
              />
              <Button className="bg-[#492309] text-white hover:bg-[#492309]/90 font-semibold text-lg whitespace-nowrap py-7 px-8">
                Subscribe Now
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Join 2,500+ art enthusiasts already subscribed
            </p>
          </motion.div>
        </div>
      </div>

      {/* Exhibit Detail Modal */}
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

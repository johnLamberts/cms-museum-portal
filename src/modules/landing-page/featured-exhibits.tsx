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
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, Calendar, Clock, Eye, MapPin, Sparkles, User } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

// Define exhibit type
export type ExhibitCardProps = {
  id: number
  title: string
  curator?: string
  status: string
  coverPhoto?: string | null
  expectedTime?: string | null
  fee?: string | null
  colorTheme?: string | null
  address?: string | null
  onClick?: (id: number) => void
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
}

// Default museum images for different themes
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

// Color function for status badges
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'ongoing':
      return 'bg-emerald-500 text-white hover:bg-emerald-600'
    case 'coming soon':
      return 'bg-blue-500 text-white hover:bg-blue-600'
    case 'ended':
      return 'bg-gray-500 text-white hover:bg-gray-600'
    case 'permanent':
      return 'bg-purple-500 text-white hover:bg-purple-600'
    default:
      return 'bg-gray-500 text-white hover:bg-gray-600'
  }
}

// Color function for exhibit themes
const getExhibitColor = (colorTheme: string | null) => {
  const defaultColor = {
    light: '#f5f0e6',
    medium: '#e8d6c0',
    dark: '#492309',
    accent: '#927B6B'
  }
  
  const colorMap: Record<string, { light: string, medium: string, dark: string, accent: string }> = {
    red: { light: '#fef2f2', medium: '#fecaca', dark: '#b91c1c', accent: '#ef4444' },
    blue: { light: '#eff6ff', medium: '#bfdbfe', dark: '#1e40af', accent: '#3b82f6' },
    green: { light: '#f0fdf4', medium: '#bbf7d0', dark: '#166534', accent: '#22c55e' },
    purple: { light: '#faf5ff', medium: '#e9d5ff', dark: '#6b21a8', accent: '#a855f7' },
    orange: { light: '#fff7ed', medium: '#fed7aa', dark: '#c2410c', accent: '#f97316' },
    teal: { light: '#f0fdfa', medium: '#99f6e4', dark: '#0f766e', accent: '#14b8a6' },
    brown: { light: '#f5f0e6', medium: '#e8d6c0', dark: '#492309', accent: '#927B6B' },
  }
  
  if (!colorTheme || !colorMap[colorTheme.toLowerCase()]) {
    return defaultColor
  }
  
  return colorMap[colorTheme.toLowerCase()]
}

type FeaturedExhibitsProps = {
  exhibits: ExhibitCardProps[]
  title?: string
  subtitle?: string
  description?: string
  loading?: boolean
  error?: Error | null
  onExhibitClick?: (exhibit: ExhibitCardProps) => void
}

const FeaturedExhibits = ({
  exhibits,
  title = "Must-See Collections",
  subtitle = "Featured Exhibits",
  description = "Explore our handpicked selection of extraordinary exhibits that showcase the rich cultural heritage of Rizal province.",
  loading = false,
  error = null,
  onExhibitClick = () => {}
}: FeaturedExhibitsProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col justify-center items-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#492309]/20 border-t-[#492309] rounded-full mb-4"
          />
          <p className="text-[#492309] font-medium">Loading extraordinary exhibits...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-200 p-8 rounded-xl text-center max-w-md mx-auto"
        >
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-800 mb-2">Unable to Load Exhibits</h3>
          <p className="text-red-600">Please refresh the page or try again later.</p>
        </motion.div>
      </div>
    )
  }

  if (exhibits.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-2xl text-center max-w-md mx-auto border-2 border-gray-200"
        >
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No Exhibits Available</h3>
          <p className="text-gray-500">New collections are being curated. Check back soon!</p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div 
      ref={ref}
      className="container mx-auto px-4 py-20 lg:py-24"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {/* Enhanced Header */}
      <motion.div className="mb-12 text-center max-w-3xl mx-auto" variants={itemVariants}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#927B6B]/10 border border-[#927B6B]/20 mb-6">
          <Sparkles className="h-4 w-4 text-[#927B6B]" />
          <span className="text-sm font-medium text-[#492309]">{subtitle}</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#492309] leading-tight mb-4">
          {title}
        </h2>
        <p className="text-gray-600 text-lg">
          {description}
        </p>
      </motion.div>

      {/* Exhibits Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
      >
        {exhibits.slice(0, 3).map((exhibit, index) => {
          const colorTheme = getExhibitColor(exhibit.colorTheme as string)
          const imageUrl =  getDefaultExhibitImage(exhibit.colorTheme as string)
          // const imageUrl = exhibit.coverPhoto || getDefaultImage(exhibit.colorTheme as string)
          
          return (
            <motion.div 
              key={exhibit.id} 
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              onClick={() => onExhibitClick(exhibit)}
            >
              <Card className="group overflow-hidden h-full cursor-pointer transition-all hover:shadow-2xl border-2 hover:border-[#927B6B]">
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={exhibit.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className={`${getStatusColor(exhibit.status)} font-semibold shadow-lg`}>
                      {exhibit.status || 'Unknown'}
                    </Badge>
                  </div>
                  
                  {/* Fee Badge */}
                  {exhibit.fee && (
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-amber-500 text-white hover:bg-amber-600 font-semibold shadow-lg">
                        {exhibit.fee === 'Free' ? '🎟️ Free Entry' : exhibit.fee}
                      </Badge>
                    </div>
                  )}

                  {/* View Count or Featured Badge */}
                  <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Eye className="h-4 w-4 text-[#492309]" />
                      <span className="text-sm font-medium text-[#492309]">
                        {index === 0 ? 'Most Popular' : 'Featured'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-display group-hover:text-[#927B6B] transition-colors line-clamp-2">
                    {exhibit.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-600 mt-2">
                    <User className="h-4 w-4" /> 
                    <span className="font-medium">{exhibit.curator || 'Museum Curator'}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="text-gray-700 space-y-2 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-100 rounded-lg">
                      <Clock className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-sm">{exhibit.expectedTime || 'Duration varies'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-gray-100 rounded-lg mt-0.5">
                      <MapPin className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-sm line-clamp-2">{exhibit.address || 'Location to be announced'}</span>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button 
                    className="w-full text-white font-semibold group/btn relative overflow-hidden" 
                    style={{ backgroundColor: colorTheme.dark }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Explore Exhibition
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                    <div 
                      className="absolute inset-0 bg-black/20 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300"
                    />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* View All Button */}
      {exhibits.length > 3 && (
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <Button 
            size="lg"
            className="bg-[#492309] hover:bg-[#492309]/90 text-white px-8 font-semibold group"
          >
            View All {exhibits.length} Exhibits
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default FeaturedExhibits

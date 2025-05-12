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
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, User } from 'lucide-react'
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
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
}

// Color function for status badges
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'ongoing':
      return 'bg-emerald-100 text-emerald-800'
    case 'coming soon':
      return 'bg-blue-100 text-blue-800'
    case 'ended':
      return 'bg-gray-100 text-gray-800'
    case 'permanent':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Color function for exhibit themes
const getExhibitColor = (colorTheme: string | null) => {
  const defaultColor = {
    light: '#f8f9fa',
    medium: '#e9ecef',
    dark: '#492309'
  }
  
  const colorMap: Record<string, { light: string, medium: string, dark: string }> = {
    red: { light: '#fee2e2', medium: '#fecaca', dark: '#b91c1c' },
    blue: { light: '#dbeafe', medium: '#bfdbfe', dark: '#1e40af' },
    green: { light: '#dcfce7', medium: '#bbf7d0', dark: '#166534' },
    purple: { light: '#f3e8ff', medium: '#e9d5ff', dark: '#6b21a8' },
    orange: { light: '#ffedd5', medium: '#fed7aa', dark: '#c2410c' },
    teal: { light: '#ccfbf1', medium: '#99f6e4', dark: '#0f766e' },
    brown: { light: '#f5f0e6', medium: '#e8d6c0', dark: '#492309' },
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
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#492309]"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
          Error loading exhibits. Please try again.
        </div>
      </div>
    )
  }

  if (exhibits.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gray-50 p-8 rounded-md text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700">No exhibits found</h3>
          <p className="text-gray-500 mt-2">Check back later for new exhibits</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      ref={ref}
      className="container mx-auto px-4 py-20"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <div className="mb-8">
        <Eyebrow label={subtitle} />
        <h2 className="text-3xl font-display font-bold text-[#492309] mt-2">
          {title}
        </h2>
        <p className="text-gray-600 mt-2 max-w-3xl">
          {description}
        </p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
      >
        {exhibits.slice(0, 3).map((exhibit) => {
          const colorTheme = getExhibitColor(exhibit.colorTheme as string)
          return (
            <motion.div 
              key={exhibit.id} 
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => onExhibitClick(exhibit)}
            >
              <Card className="overflow-hidden h-full cursor-pointer transition-all hover:shadow-xl border-t-4" style={{ borderTopColor: colorTheme.dark }}>
                <div className="relative h-64 overflow-hidden">
                  {exhibit.coverPhoto ? (
                    <img 
                      src={exhibit.coverPhoto} 
                      alt={exhibit.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{ backgroundColor: colorTheme.light }}>
                      <Calendar className="h-12 w-12 text-gray-400" style={{ color: colorTheme.dark }} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusColor(exhibit.status)}>
                      {exhibit.status || 'Unknown'}
                    </Badge>
                  </div>
                  {exhibit.fee && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-amber-100 text-amber-800">
                        {exhibit.fee === 'Free' ? 'Free Entry' : exhibit.fee}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-display" style={{ color: colorTheme.dark }}>
                    {exhibit.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-gray-600">
                    <User className="h-4 w-4" /> {exhibit.curator || 'Unknown Curator'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <div className="flex items-center gap-1 mb-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{exhibit.expectedTime || 'Duration varies'}</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <span>{exhibit.address || 'Location TBA'}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full text-white" style={{ backgroundColor: colorTheme.dark, borderColor: colorTheme.dark }}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

export default FeaturedExhibits

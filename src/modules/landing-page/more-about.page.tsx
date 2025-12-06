import Eyebrow from "@/components/eyebrow"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  Heart,
  MapPin,
  Shield,
  Sparkles,
  Users
} from "lucide-react"

const MoreAbout = () => {
  const stats = [
    { icon: Users, label: "Active Visitors", value: "10,000+", color: "text-blue-600" },
    { icon: MapPin, label: "Partner Museums", value: "25+", color: "text-green-600" },
    { icon: Calendar, label: "Annual Events", value: "150+", color: "text-purple-600" },
    { icon: Award, label: "Exhibitions", value: "200+", color: "text-amber-600" },
  ]

  const offerings = [
    {
      icon: MapPin,
      title: "Comprehensive Museum Directory",
      description: "Our portal features a complete listing of museums in Rizal Province, providing essential information such as location, operating hours, admission fees, and current exhibitions.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Calendar,
      title: "Event Highlights",
      description: "Stay updated on upcoming events, exhibitions, and educational programs hosted by various museums, allowing you to engage with our cultural community.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: BookOpen,
      title: "Interactive Experience",
      description: "With user accounts, visitors can save their favorite museums and events, leave reviews, and contribute to the ongoing dialogue about our rich history.",
      color: "from-emerald-500 to-emerald-600"
    }
  ]

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col xl:px-32 text-center gap-8 py-20 lg:py-28 items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#927B6B]/10 border border-[#927B6B]/20">
            <Sparkles className="h-4 w-4 text-[#927B6B]" />
            <span className="text-sm font-medium text-[#492309]">About Us</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#492309] leading-tight">
            Museo Rizal: Virtual{" "}
            <span className="bg-[#927B6B]/95 text-gray-100 italic px-3 py-1 inline-block transform -rotate-1">
              Tours and Digital
            </span>{" "}
            Collections
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed">
            Through a digital journey, allowing visitors to discover rare artifacts, historical documents, 
            and personal belongings that provide a glimpse into the rich heritage of Rizal Province
          </p>

        </motion.div>
      </div>

      {/* What We Offer Section */}
      <div className="container mx-auto px-4 lg:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Eyebrow label="What We Offer" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#492309] mt-4 mb-3">
            Your Gateway to Cultural Heritage
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl">
            Discover the comprehensive features that make exploring Rizal's museums an unforgettable experience
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offerings.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-2 hover:border-[#927B6B] transition-all hover:shadow-xl group cursor-pointer">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#492309] mb-3 group-hover:text-[#927B6B] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive CTA Image Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden mb-20"
      >
        <div className="relative h-[600px]">
          <img
            src="/mock/about-1.jpeg"
            alt="Museum Experience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center text-white max-w-3xl px-4"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Experience History Come Alive
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Explore our virtual tours and immerse yourself in the stories of Rizal Province
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Our Commitment Section */}
      <div className="container mx-auto px-4 lg:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Eyebrow label="What We Commit" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#492309] mt-4">
            Our Commitment to Heritage
          </h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="border-2 hover:border-[#927B6B] transition-all">
            <CardContent className="p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#492309] to-[#927B6B] flex items-center justify-center">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-[#492309] mb-4">
                    Preserving Cultural Legacy
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    We are committed to preserving and promoting the cultural legacy of Rizal Province. 
                    Our team works closely with local museums, historians, and cultural advocates to ensure 
                    the accuracy and quality of the information provided.
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    We believe that knowledge is best shared, and we encourage visitors to explore, engage, 
                    and participate in our vibrant cultural scene.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">
                      <Heart className="h-3 w-3 mr-2 inline" />
                      Community Driven
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm">
                      <Shield className="h-3 w-3 mr-2 inline" />
                      Authentic Content
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm">
                      <Users className="h-3 w-3 mr-2 inline" />
                      Collaborative
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tomas Mateo Claudio - Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0  z-10" />
        
        <div className="grid lg:grid-cols-2 min-h-[700px]">
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-full min-h-[400px] lg:min-h-[700px]"
          >
            <img
              src="/mock/tomas.jpeg"
              alt="Tomas Mateo Claudio"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 " />
          </motion.div>

          {/* Content Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-20 flex items-center p-8 lg:p-16 bg-gradient-to-br from-[#492309] to-[#5a2f0e]"
          >
            <div className="max-w-2xl">
              <Badge className="bg-amber-500 text-white hover:bg-amber-600 mb-6 text-sm px-4 py-2">
                <Award className="h-4 w-4 mr-2 inline" />
                War Hero
              </Badge>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
                Tomas Mateo Claudio
              </h2>

              <div className="flex items-center gap-4 mb-8 text-white/80">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">Morong, Rizal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-lg">1894 - 1918</span>
                </div>
              </div>

              <div className="space-y-4 text-white/90 text-lg leading-relaxed">
                <p>
                  <strong className="text-white">The First Filipino Casualty in World War I</strong>
                </p>
                
                <p>
                  Tomas Mateo Claudio was a Filipino soldier who became the first and only Filipino 
                  casualty in World War I, dying in France on <strong className="text-white">June 29, 1918</strong>, 
                  while serving with the American Expeditionary Forces.
                </p>

                <p>
                  Born in Morong, Rizal, he left the Philippines to work in Hawaii and the United States 
                  before joining the US Army in 1917 after America entered the war. His courage and sacrifice 
                  represent the Filipino spirit of bravery and dedication.
                </p>

                <p className="pt-4 border-t border-white/20">
                  His legacy is commemorated throughout the Philippines through institutions, monuments, 
                  and streets named in his honor, ensuring that his sacrifice will never be forgotten.
                </p>
              </div>

              {/* Memorial Badges */}
              <div className="mt-10 pt-8 border-t border-white/20">
                <p className="text-white/60 text-sm mb-4">Honored By:</p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="border-white/30 text-white bg-white/5 px-4 py-2">
                    🇵🇭 Philippines
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white bg-white/5 px-4 py-2">
                    🇺🇸 United States
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white bg-white/5 px-4 py-2">
                    🇫🇷 France
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom CTA */}
    
    </div>
  )
}

export default MoreAbout

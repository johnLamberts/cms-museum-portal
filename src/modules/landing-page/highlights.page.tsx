import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Badge, Calendar, ChevronRight, Sparkles } from "lucide-react"
import { useState } from "react"


export const Highlights = () => {
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null)

  const highlights = [
    {
      id: 1,
      date: "September 2, 2013",
      image: "/highlight_1.jpeg",
      title: "THE BLANCO FAMILY ART MUSEUM",
      description: "The museum houses the vast collection of artwork produced by the Blanco family of painters.",
      featured: true
    },
    {
      id: 2,
      date: "September 2, 2013",
      image: "/highlight_2.jpeg",
      title: "THE BOTONG FRANCISCO MUSEUM AND STREET MURALS",
      description: "The Botong Francisco Museum & Street Murals is just 10 minutes away from Blanco Art Family Museum."
    },
    {
      id: 3,
      date: "September 2, 2013",
      image: "/highlight_3.jpeg",
      title: "NEMIRANDA ART HOUSE",
      description: "A collection of famous artist (Nemesio 'Nemi' R. Miranda Jr.) paintings masterfully employing figurative realism in his artworks, portraying rural life and folkloric art on display."
    }
  ]

  return (
    <div className="container mx-auto lg:py-20 md:py-16 py-12 px-5">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#927B6B]/10 border border-[#927B6B]/20 mb-6">
            <Sparkles className="h-4 w-4 text-[#927B6B]" />
            <span className="text-sm font-medium text-[#492309]">Museum Sneakpeak</span>
          </div>
          <h3 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#492309] leading-tight">
            Immerse Yourself in{" "}
            <span className="italic text-[#927B6B]">Rizal Province's</span>{" "}
            Past
          </h3>
        </div>

        {/* Grid Layout */}
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-8">
          {/* Featured Highlight */}
          <Card 
            className="group overflow-hidden border-2 hover:border-[#927B6B] transition-all duration-300 cursor-pointer hover:shadow-2xl xl:row-span-2"
            onMouseEnter={() => setActiveHighlight(1)}
            onMouseLeave={() => setActiveHighlight(null)}
          >
            <div className="relative aspect-[4/3] xl:aspect-[3/4] overflow-hidden">
              <img
                src={highlights[0].image}
                alt={highlights[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <Badge className="mb-4 bg-[#927B6B] hover:bg-[#927B6B]/90">Featured</Badge>
                <h4 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                  {highlights[0].title}
                </h4>
                <p className="text-white/90 mb-4 line-clamp-3">
                  {highlights[0].description}
                </p>
                <Button 
                  variant="secondary" 
                  className="group/btn"
                >
                  <span>Explore Museum</span>
                  <ChevronRight className={`ml-2 h-4 w-4 transition-transform ${
                    activeHighlight === 1 ? 'translate-x-1' : ''
                  }`} />
                </Button>
              </div>
            </div>
          </Card>

          {/* Other Highlights */}
          <div className="flex flex-col gap-8">
            {highlights.slice(1).map((highlight) => (
              <Card
                key={highlight.id}
                className="group overflow-hidden border-2 hover:border-[#927B6B] transition-all duration-300 cursor-pointer hover:shadow-xl"
                onMouseEnter={() => setActiveHighlight(highlight.id)}
                onMouseLeave={() => setActiveHighlight(null)}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden">
                    <img
                      src={highlight.image}
                      alt={highlight.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="sm:w-3/5 p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{highlight.date}</span>
                    </div>
                    <h4 className="text-lg font-bold text-[#492309] mb-2 group-hover:text-[#927B6B] transition-colors">
                      {highlight.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {highlight.description}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-fit group/btn text-[#492309] hover:text-[#927B6B] p-0"
                    >
                      <span className="font-semibold">Read More</span>
                      <ArrowRight className={`ml-2 h-4 w-4 transition-transform ${
                        activeHighlight === highlight.id ? 'translate-x-1' : ''
                      }`} />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center pt-8">
          <Button 
            size="lg"
            className="bg-[#927B6B] hover:bg-[#492309] text-white px-8 group"
          >
            <span className="font-semibold">Explore All Museums</span>
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}

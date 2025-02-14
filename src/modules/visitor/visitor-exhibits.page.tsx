"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatePresence, motion } from "framer-motion"
import { Search, Sparkles, X } from "lucide-react"
import { useEffect, useState } from "react"

interface Exhibit {
  id: number
  title: string
  description: string
  image: string
  category: string
}

const exhibits: Exhibit[] = [
  {
    id: 1,
    title: "The Time Machine",
    description:
      "Step into our time machine and experience life in different historical periods. From ancient civilizations to futuristic scenarios, this exhibit offers a unique perspective on human progress.",
    image: "https://images.unsplash.com/photo-1726064855900-54128f083192?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "History",
  },
  {
    id: 2,
    title: "Microscopic Marvels",
    description:
      "Dive into the fascinating world of microorganisms and cellular structures. Use our interactive microscopes to observe and learn about the tiny building blocks of life.",
    image: "https://images.unsplash.com/photo-1726064855900-54128f083192?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Science",
  },
  {
    id: 3,
    title: "Sound Sculpture",
    description:
      "Become a living instrument in our Sound Sculpture exhibit. Your movements are translated into unique musical compositions, allowing you to explore the connection between motion and sound.",
    image: "https://images.unsplash.com/photo-1726064855900-54128f083192?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Art",
  },
  {
    id: 4,
    title: "Virtual Ecosystem",
    description:
      "Immerse yourself in a virtual forest teeming with digital flora and fauna. Your actions influence the ecosystem, teaching valuable lessons about environmental balance and conservation.",
    image: "https://images.unsplash.com/photo-1726064855900-54128f083192?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Nature",
  },
  {
    id: 5,
    title: "Puzzle Planet",
    description:
      "Take on the role of a world leader and tackle simulated global issues. This exhibit challenges you to think critically about complex problems and find innovative solutions.",
    image: "https://images.unsplash.com/photo-1726064855900-54128f083192?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Interactive",
  },
  {
    id: 6,
    title: "Cosmic Journey",
    description:
      "Embark on a virtual space odyssey, exploring distant planets, stars, and galaxies. Learn about the wonders of our universe through stunning visuals and interactive simulations.",
    image: "https://images.unsplash.com/photo-1726064855900-54128f083192?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Science",
  },
  {
    id: 7,
    title: "Ancient Artifacts",
    description:
      "Discover the secrets of ancient civilizations through a curated collection of rare artifacts. Use augmented reality to see these objects come to life and tell their stories.",
    image: "https://images.unsplash.com/photo-1726064855900-54128f083192?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "History",
  },
  {
    id: 8,
    title: "Future Cities",
    description:
      "Design and build the cities of tomorrow in this interactive urban planning exhibit. Experiment with sustainable technologies and innovative architecture to create your vision of the future.",
    image: "https://images.unsplash.com/photo-1726064855900-54128f083192?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Interactive",
  },
]

const useMasonryLayout = (items: Exhibit[], columns: number) => {
  const [masonryItems, setMasonryItems] = useState<Exhibit[][]>([])

  useEffect(() => {
    const columnArrays: Exhibit[][] = Array.from({ length: columns }, () => [])
    items.forEach((item, index) => {
      columnArrays[index % columns].push(item)
    })
    setMasonryItems(columnArrays)
  }, [items, columns])

  return masonryItems
}

export default function VisitorExhibitPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null)
  const [spotlightExhibit, setSpotlightExhibit] = useState<Exhibit | null>(null)

  const filteredExhibits = exhibits.filter(
    (exhibit) =>
      exhibit.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || exhibit.category === selectedCategory),
  )

  const masonryItems = useMasonryLayout(filteredExhibits, 3)

  const categories = Array.from(new Set(exhibits.map((exhibit) => exhibit.category)))

  const handleSpotlight = () => {
    const randomExhibit = exhibits[Math.floor(Math.random() * exhibits.length)]
    setSpotlightExhibit(randomExhibit)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Interactive Exhibit Gallery</h1>
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search exhibits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              {category}
            </Badge>
          ))}
        </div>
        <Button onClick={handleSpotlight} className="ml-auto">
          <Sparkles className="mr-2 h-4 w-4" /> Spotlight Exhibit
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {masonryItems.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-6">
            {column.map((exhibit) => (
              <motion.div
                key={exhibit.id}
                layoutId={`exhibit-${exhibit.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative cursor-pointer group"
                onClick={() => setSelectedExhibit(exhibit)}
              >
                <img
                  src={exhibit.image || "/placeholder.svg"}
                  alt={exhibit.title}
                  className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="text-xl font-semibold mb-2">{exhibit.title}</h3>
                    <p className="text-sm">{exhibit.description.substring(0, 100)}...</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      <AnimatePresence>
        {selectedExhibit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedExhibit(null)}
          >
            <motion.div
              layoutId={`exhibit-${selectedExhibit.id}`}
              className="bg-white rounded-lg max-w-2xl w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedExhibit(null)}
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={selectedExhibit.image || "/placeholder.svg"}
                alt={selectedExhibit.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">{selectedExhibit.title}</h2>
              <Badge className="mb-4">{selectedExhibit.category}</Badge>
              <p className="text-gray-600">{selectedExhibit.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {spotlightExhibit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-40"
          >
            <h3 className="text-lg font-semibold mb-2">Spotlight Exhibit</h3>
            <img
              src={spotlightExhibit.image || "/placeholder.svg"}
              alt={spotlightExhibit.title}
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
            <h4 className="font-medium">{spotlightExhibit.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{spotlightExhibit.description.substring(0, 100)}...</p>
            <Button className="mt-2 w-full" onClick={() => setSelectedExhibit(spotlightExhibit)}>
              Learn More
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


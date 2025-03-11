/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatePresence, motion } from "framer-motion"
import { Search, Sparkles, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useEvents } from "../admin/events/hooks/useEvents"
import MuseumLoader from "../admin/museums/exhibit-loader"

// Define the MuseumFormData type
export type EventFormData = {
  title: string;
  coverPhoto: string;
  status?: string;
  eventDate?: string;
  eventTime?: string;
  eventContent?: string | any;
};
// Define the Exhibit interface
interface Exhibit {
  id: string;
  title: string;
  coverPhoto: string;
  status?: string;
  eventDate?: string;
  eventTime?: string;
  eventContent?: string | any;
  category: string;
}

// Custom hook for masonry layout with stable updates
const useMasonryLayout = (items: Exhibit[], columns: number) => {
  const [masonryItems, setMasonryItems] = useState<Exhibit[][]>([]);

  useEffect(() => {
    // Create column arrays only if items or columns change
    const columnArrays: Exhibit[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, index) => {
      columnArrays[index % columns].push(item);
    });

    // Only update state if the new layout differs from the current one
    setMasonryItems((prevItems) => {
      // Convert arrays to strings for comparison to avoid reference issues
      const prevStr = JSON.stringify(prevItems);
      const newStr = JSON.stringify(columnArrays);
      return prevStr === newStr ? prevItems : columnArrays;
    });
  }, [items, columns]);

  return masonryItems;
};

export default function VisitorEventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null)
  const [spotlightExhibit, setSpotlightExhibit] = useState<Exhibit | null>(null)
  const navigate = useNavigate();

  const { data: museumsData, isLoading } = useEvents()

  // Map museumsData to the Exhibit interface
 // Memoize flatExhibits to prevent unnecessary recomputation
 const flatExhibits: Exhibit[] = useMemo(() => {
  return (
    museumsData?.data?.events?.map((museum: any) => ({
      id: museum.event_id,
      title: museum.title,
      description: museum.museumContent || "No content available",
      coverPhoto: museum.coverPhoto || "/placeholder.svg",
      category: museum.status || "Uncategorized",
      address: museum.address || "",
      status: museum.status
})) || []
  );
}, [museumsData]);

// Memoize filteredExhibits to prevent unnecessary recomputation
const filteredExhibits = useMemo(() => {
  return flatExhibits.filter(
    (exhibit) =>
      exhibit.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || exhibit.category === selectedCategory)
  );
}, [flatExhibits, searchTerm, selectedCategory]);



  // Use the masonry layout hook with filtered exhibits
  const masonryItems = useMasonryLayout(filteredExhibits, 3)

  // Extract unique categories dynamically
  const categories = Array.from(new Set(flatExhibits.map((exhibit) => exhibit.category)))

  // Handle spotlight exhibit
  const handleSpotlight = () => {
    if (flatExhibits.length > 0) {
      const randomExhibit = flatExhibits[Math.floor(Math.random() * flatExhibits.length)]
      setSpotlightExhibit(randomExhibit)
    }
  }

  if (isLoading) return <MuseumLoader />

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Museo Event</h1>
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
          <Sparkles className="mr-2 h-4 w-4" /> Spotlight Events
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
                onClick={() => navigate(`/visitor/event/${exhibit.id}`)}
              >
                <img
                  src={exhibit.coverPhoto || "/placeholder.svg"}
                  alt={exhibit.title}
                  className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="text-xl font-semibold mb-2">{exhibit.title}</h3>
                    {/* <p className="text-sm">{exhibit.address}</p> */}
                    {/* <p className="text-sm">{exhibit.description.substring(0, 100)}...</p> */}
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
                src={selectedExhibit.coverPhoto || "/placeholder.svg"}
                alt={selectedExhibit.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">{selectedExhibit.title}</h2>
              <Badge className="mb-4">{selectedExhibit.category}</Badge>
              {/* <p className="text-gray-600">{selectedExhibit.description}</p> */}
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
            <h3 className="text-lg font-semibold mb-2">Spotlight Event</h3>
            <img
              src={spotlightExhibit.coverPhoto || "/placeholder.svg"}
              alt={spotlightExhibit.title}
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
            <h4 className="font-medium">{spotlightExhibit.title}</h4>
            {/* <p className="text-sm text-gray-600 mt-1">{spotlightExhibit.address}</p> */}
            <Button className="mt-2 w-full" onClick={() => navigate(`/visitor/event/${spotlightExhibit.id}`)}>
              Learn More
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

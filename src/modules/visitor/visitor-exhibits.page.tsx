/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MuseumLoading } from "@/layouts/page.layout"
import { AnimatePresence, motion } from "framer-motion"
import { Search, Sparkles, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMuseums } from "../admin/museums/hooks/useMuseums"

// Define the MuseumFormData type
export type MuseumFormData = {
  title: string;
  coverPhoto: string;
  colorTheme: string;
  museumContent: string;
  address?: string;
  fee?: string;
};

// Define the Exhibit interface
interface Exhibit {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  address: string;
}

// Custom hook for masonry layout with stable updates
const useMasonryLayout = (items: Exhibit[], columns: number) => {
  const [masonryItems, setMasonryItems] = useState<Exhibit[][]>([]);

  useEffect(() => {
    // Create column arrays only if items or columns change
    const columnArrays: Exhibit[][] = Array.from({ length: columns }, () => []);
    
    // Distribute items to achieve balanced heights
    // Sort items by aspect ratio before distributing to columns
    const sortedItems = [...items];
    
    sortedItems.forEach((item) => {
      // Find the column with the least items
      const shortestColumnIndex = columnArrays
        .map((column, i) => ({ length: column.length, index: i }))
        .sort((a, b) => a.length - b.length)[0].index;
      
      columnArrays[shortestColumnIndex].push(item);
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

export default function VisitorExhibitPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null)
  const [spotlightExhibit, setSpotlightExhibit] = useState<Exhibit | null>(null)
  const navigate = useNavigate();

  const { data: museumsData, isLoading } = useMuseums()
  
  // Responsive column count based on screen size
  const [columnCount, setColumnCount] = useState(3);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumnCount(1);
      } else if (window.innerWidth < 1024) {
        setColumnCount(2);
      } else {
        setColumnCount(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Map museumsData to the Exhibit interface
  const flatExhibits: Exhibit[] = useMemo(() => {
    return (
      museumsData?.data?.museums?.map((museum: any) => ({
        id: museum.exhibits_id || Date.now() + Math.random(),
        title: museum.title,
        description: museum.museumContent || "No content available",
        image: museum.coverPhoto || "/placeholder.svg",
        category: museum.fee || "Uncategorized",
        address: museum.address || "",
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
  const masonryItems = useMasonryLayout(filteredExhibits, columnCount);

  // Extract unique categories dynamically
  const categories = Array.from(new Set(flatExhibits.map((exhibit) => exhibit.category)))

  // Handle spotlight exhibit
  const handleSpotlight = () => {
    if (flatExhibits.length > 0) {
      const randomExhibit = flatExhibits[Math.floor(Math.random() * flatExhibits.length)]
      setSpotlightExhibit(randomExhibit)
    }
  }

  // Clear spotlight when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (spotlightExhibit && !target.closest('.spotlight-exhibit')) {
        setSpotlightExhibit(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [spotlightExhibit]);

  if (isLoading) return <MuseumLoading />

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Discover Exhibits</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our collection of priceless artifacts and cultural treasures
          </p>
        </div>
        
        {/* Search and filter section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search exhibits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 w-full border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <Button 
              onClick={handleSpotlight} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto flex-shrink-0"
            >
              <Sparkles className="mr-2 h-4 w-4" /> Discover Random Exhibit
            </Button>
          </div>
          
          <div className="mt-6">
            <div className="text-sm font-medium text-gray-700 mb-3">Filter by Category:</div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? "default" : "outline"}
                className="cursor-pointer py-1.5 px-3 text-sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer py-1.5 px-3 text-sm"
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Results summary */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            {filteredExhibits.length} 
            {selectedCategory ? ` ${selectedCategory}` : ''} 
            {filteredExhibits.length === 1 ? ' Exhibit' : ' Exhibits'}
          </h2>
        </div>
        
        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {masonryItems.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-8">
              {column.map((exhibit) => (
                <motion.div
                  key={exhibit.id}
                  layoutId={`exhibit-${exhibit.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate(`/visitor/exhibit/${exhibit.id}`)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={exhibit.image || "/placeholder.svg"}
                      alt={exhibit.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-5">
                    <Badge className="mb-2">{exhibit.category}</Badge>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {exhibit.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{exhibit.address}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Empty state */}
        {filteredExhibits.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No exhibits found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your search or filter criteria</p>
            <Button onClick={() => {setSearchTerm(''); setSelectedCategory(null)}} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Detailed exhibit modal */}
      <AnimatePresence>
        {selectedExhibit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedExhibit(null)}
          >
            <motion.div
              layoutId={`exhibit-${selectedExhibit.id}`}
              className="bg-white rounded-xl max-w-3xl w-full overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 text-gray-800 hover:text-gray-900 z-10"
                onClick={() => setSelectedExhibit(null)}
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <img
                    src={selectedExhibit.image || "/placeholder.svg"}
                    alt={selectedExhibit.title}
                    className="w-full h-full object-cover aspect-square md:aspect-auto"
                  />
                </div>
                <div className="p-6 md:w-1/2 flex flex-col">
                  <Badge className="self-start mb-3">{selectedExhibit.category}</Badge>
                  <h2 className="text-2xl font-bold mb-3">{selectedExhibit.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">{selectedExhibit.address}</p>
                  <div className="flex-grow overflow-y-auto prose prose-sm max-w-none">
                    <p>{selectedExhibit.description}</p>
                  </div>
                  <Button className="mt-6 w-full" onClick={() => navigate(`/visitor/exhibit/${selectedExhibit.id}`)}>
                    View Full Details
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spotlight exhibit */}
      <AnimatePresence>
        {spotlightExhibit && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="spotlight-exhibit fixed bottom-6 right-6 bg-white rounded-xl shadow-xl p-5 max-w-sm z-40 overflow-hidden"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-indigo-800">Featured Exhibit</h3>
              <button 
                className="text-gray-400 hover:text-gray-600" 
                onClick={(e) => {
                  e.stopPropagation();
                  setSpotlightExhibit(null);
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-hidden rounded-lg mb-3">
              <img
                src={spotlightExhibit.image || "/placeholder.svg"}
                alt={spotlightExhibit.title}
                className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h4 className="font-semibold text-lg mb-1">{spotlightExhibit.title}</h4>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{spotlightExhibit.address}</p>
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700" 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/visitor/exhibit/${spotlightExhibit.id}`);
              }}
            >
              Explore This Exhibit
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

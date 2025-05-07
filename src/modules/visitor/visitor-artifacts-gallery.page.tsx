/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft, ArrowRight, Filter, Info, Maximize, Search, Star, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import useArtifacts from '../admin/museum-gallery/hooks/useUsers';

// Interface matching your data structure
interface IArtifact {
  artifact_id?: string;
  artifact_uid?: string;
  title: string;
  description: string;
  period?: string;
  artifactImg?: string;
  category: string;
  location?: string;
  featured?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
  municipal_id?: number;
}

const VisitorGalleryPage = () => {
  const { data: artifacts, isLoading, error } = useArtifacts();
  const [filteredArtifacts, setFilteredArtifacts] = useState<IArtifact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', or 'showcase'
  const [selectedArtifact, setSelectedArtifact] = useState<IArtifact | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  

    const memoArtifacts = useMemo(() => {
      return artifacts?.data?.artifacts || [];
    }, [artifacts]);

  // Extract unique categories from artifacts
  const [categories, setCategories] = useState<string[]>(['All']);

  // Extract categories from artifacts when data loads
  useEffect(() => {
    if (memoArtifacts && memoArtifacts.length > 0) {
      const uniqueCategories = ['All', ...new Set(memoArtifacts.map((item: any) => item.category))];
      setCategories(uniqueCategories as any);
    }
  }, [memoArtifacts]);

  useEffect(() => {
    if (memoArtifacts) {
      let filtered = [...memoArtifacts];
      
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(item => 
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.period?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply category filter
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(item => item.category === selectedCategory);
      }
      
      setFilteredArtifacts(filtered);
    }
  }, [artifacts, searchTerm, selectedCategory]);

  const handleArtifactClick = (artifact: any) => {
    setSelectedArtifact(artifact);
    setViewMode('showcase');
  };

  const handleClose = () => {
    setSelectedArtifact(null);
    setViewMode('grid');
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-red-500 p-4 text-center">
      Error loading artifacts: {error.message}
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen font-serif">
      {/* Museum Header */}
      <header className="bg-gray-900 text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center">Virtual Museum Gallery</h1>
          <p className="text-center mt-2 text-gray-300">Explore our curated collection of artifacts</p>
        </div>
      </header>
      
      {/* Controls */}
      <div className="container mx-auto p-4 bg-white shadow-md my-4 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search artifacts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* View Toggles */}
          <div className="flex items-center gap-3">
            <button 
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => setViewMode('grid')}
            >
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2 h-2 bg-gray-600"></div>
                <div className="w-2 h-2 bg-gray-600"></div>
                <div className="w-2 h-2 bg-gray-600"></div>
                <div className="w-2 h-2 bg-gray-600"></div>
              </div>
            </button>
            <button 
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => setViewMode('list')}
            >
              <div className="flex flex-col gap-0.5">
                <div className="w-6 h-1 bg-gray-600"></div>
                <div className="w-6 h-1 bg-gray-600"></div>
                <div className="w-6 h-1 bg-gray-600"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Display count of artifacts */}
        <div className="mb-4 text-gray-600 font-medium">
          Displaying {filteredArtifacts.length} artifacts
          {searchTerm && <span> matching "{searchTerm}"</span>}
          {selectedCategory !== 'All' && <span> in {selectedCategory}</span>}
        </div>
        
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtifacts.map((artifact) => (
              <div 
                key={artifact.artifact_id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
                onClick={() => handleArtifactClick(artifact)}
              >
                <div className="aspect-w-4 aspect-h-3 bg-gray-200 relative">
                  {artifact.artifactImg ? (
                    <img 
                      src={artifact.artifactImg} 
                      alt={artifact.title} 
                      className="object-cover w-full h-48"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-300 text-gray-500">
                      No Image Available
                    </div>
                  )}
                  {artifact.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full p-1">
                      <Star size={12} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full px-2 py-0.5 text-xs">
                    {artifact.period || 'Unknown period'}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{artifact.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {artifact.location || 'Unknown location'}
                  </p>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {artifact.description || 'No description available'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredArtifacts.map((artifact) => (
              <div 
                key={artifact.artifact_id}
                className="bg-white rounded-lg overflow-hidden shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer flex"
                onClick={() => handleArtifactClick(artifact)}
              >
                <div className="flex-shrink-0 mr-4 relative">
                  {artifact.artifactImg ? (
                    <img 
                      src={artifact.artifactImg} 
                      alt={artifact.title} 
                      className="w-24 h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                  {artifact.featured && (
                    <div className="absolute top-0 right-0 bg-yellow-500 text-white rounded-full p-1 transform translate-x-1/4 -translate-y-1/4">
                      <Star size={10} />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{artifact.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {artifact.location || 'Unknown location'} • {artifact.period || 'Unknown period'}
                  </p>
                  <p className="text-gray-500 mt-2 line-clamp-2">
                    {artifact.description || 'No description available'}
                  </p>
                </div>
                <div className="flex-shrink-0 self-center">
                  <Info size={18} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Showcase View (Modal) */}
        {viewMode === 'showcase' && selectedArtifact && (
          <div className={`fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-8'}`}>
            <div className={`bg-white rounded-lg overflow-hidden max-w-6xl w-full max-h-full flex flex-col ${isFullscreen ? 'h-full rounded-none' : ''}`}>
              {/* Header with controls */}
              <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">{selectedArtifact.title}</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-gray-700 rounded-full"
                  >
                    <Maximize size={20} />
                  </button>
                  <button 
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-700 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-grow flex flex-col md:flex-row overflow-auto">
                {/* Image Section */}
                <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
                  {selectedArtifact.artifactImg ? (
                    <img 
                      src={selectedArtifact.artifactImg} 
                      alt={selectedArtifact.title}
                      className="max-h-full max-w-full object-contain shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-500">
                      No Image Available
                    </div>
                  )}
                </div>
                
                {/* Details Section */}
                <div className="md:w-1/2 p-6 overflow-y-auto">
                  <div className="mb-6 flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{selectedArtifact.title}</h3>
                      <p className="text-gray-600">
                        {selectedArtifact.location ? `Found in ${selectedArtifact.location}` : 'Location unknown'}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        {selectedArtifact.period || 'Unknown period'} • {selectedArtifact.category || 'Uncategorized'}
                      </p>
                    </div>
                    {selectedArtifact.featured && (
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star size={14} className="mr-1" />
                        Featured Artifact
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-lg mb-2 border-b border-gray-200 pb-1">Description</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedArtifact.description || 'No description available for this artifact.'}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-lg mb-2 border-b border-gray-200 pb-1">Historical Period</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedArtifact.period ? 
                        `This artifact dates from the ${selectedArtifact.period} period.` : 
                        'Time period information not available.'}
                    </p>
                  </div>
                  
                  {selectedArtifact.location && (
                    <div className="mb-6">
                      <h4 className="font-bold text-lg mb-2 border-b border-gray-200 pb-1">Location Information</h4>
                      <p className="text-gray-700 leading-relaxed">
                        This artifact was discovered in {selectedArtifact.location}.
                      </p>
                    </div>
                  )}
                  
                  {/* Interactive Elements */}
                  <div className="mt-8">
                    <div className="flex items-center gap-4 text-sm">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1">
                        <span>Virtual Tour</span>
                      </button>
                      <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md flex items-center gap-1">
                        <span>Share</span>
                      </button>
                      <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md flex items-center gap-1">
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation Footer */}
              <div className="bg-gray-100 p-4 flex justify-between items-center border-t border-gray-200">
                <button 
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                  onClick={() => {
                    const currentIndex = filteredArtifacts.findIndex(a => a.artifact_id === selectedArtifact.artifact_id);
                    if (currentIndex > 0) {
                      setSelectedArtifact(filteredArtifacts[currentIndex - 1]);
                    }
                  }}
                  disabled={filteredArtifacts.findIndex(a => a.artifact_id === selectedArtifact.artifact_id) === 0}
                >
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>
                
                <span className="text-sm text-gray-500">
                  Artifact {filteredArtifacts.findIndex(a => a.artifact_id === selectedArtifact.artifact_id) + 1} of {filteredArtifacts.length}
                </span>
                
                <button 
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                  onClick={() => {
                    const currentIndex = filteredArtifacts.findIndex(a => a.artifact_id === selectedArtifact.artifact_id);
                    if (currentIndex < filteredArtifacts.length - 1) {
                      setSelectedArtifact(filteredArtifacts[currentIndex + 1]);
                    }
                  }}
                  disabled={filteredArtifacts.findIndex(a => a.artifact_id === selectedArtifact.artifact_id) === filteredArtifacts.length - 1}
                >
                  <span>Next</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {filteredArtifacts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No artifacts found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any artifacts matching your current filters.
              Try adjusting your search terms or selecting a different category.
            </p>
            <button 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default VisitorGalleryPage;

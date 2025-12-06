import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Maximize,
  Minimize,
  Navigation,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const InteractiveVirtualGallery = ({
  title = "360° Virtual Gallery Preview",
  subtitle = "Interactive Museum Experience",
  description = "Explore our museum spaces with this interactive 360° viewer. Click and drag to look around, or use the navigation controls.",
}) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [, setImagePosition] = useState({ x: 0, y: 0 });
  const [startX, setStartX] = useState(0);
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Museum scenes data
  const scenes = [
    {
      id: 1,
      name: "Traditional Artifacts Gallery",
      image: "/aws-1.jpeg",
      description: "Discover traditional Filipino tools and artifacts that showcase our rich cultural heritage.",
    },
    {
      id: 2,
      name: "Heritage Documentation Center",
      image: "/aws-2.jpeg",
      description: "Explore our collection of historical documents, photographs, and memorabilia.",
    }
  ];

  const currentSceneData = scenes[currentScene];

  // Auto-rotation effect - smooth continuous rotation
  useEffect(() => {
    if (isPlaying && !isDragging) {
      const animate = () => {
        setRotation(prev => prev - 0.2); // Negative for clockwise rotation
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isDragging]);

  // Handle mouse/touch interactions for 360° panorama
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setIsPlaying(false);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    
    // Hide info panel after first interaction
    if (showInfo) {
      setTimeout(() => setShowInfo(false), 2000);
    }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    
    // Adjust sensitivity for better control
    setRotation(prev => prev + deltaX * 0.5);
    setStartX(clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setRotation(0);
    setImagePosition({ x: 0, y: 0 });
    setIsPlaying(false);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (viewerRef.current?.requestFullscreen) {
        viewerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const nextScene = () => {
    setCurrentScene((prev) => (prev + 1) % scenes.length);
    setIsLoading(true);
    setRotation(0);
  };

  const prevScene = () => {
    setCurrentScene((prev) => (prev - 1 + scenes.length) % scenes.length);
    setIsLoading(true);
    setRotation(0);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowLeft':
          setRotation(prev => prev + 10);
          break;
        case 'ArrowRight':
          setRotation(prev => prev - 10);
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'r':
          resetView();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4"
          >
            {subtitle}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-[#492309] mt-2 mb-4"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </div>

        {/* Viewer Container */}
        <motion.div
          ref={viewerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`relative bg-black shadow-2xl rounded-2xl overflow-hidden ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'aspect-video max-w-6xl mx-auto'
          }`}
        >
          {/* Loading State */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-900 flex items-center justify-center z-30"
              >
                <div className="text-center text-white">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4"
                  />
                  <p>Loading {currentSceneData.name}...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 360° Image Viewer */}
          <div
            className="absolute inset-0 overflow-hidden select-none"
            style={{ 
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'none'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                width: '300%', // Triple width for seamless panorama
                height: '100%',
              }}
            >
              {/* Render image three times for seamless loop */}
              <img
                ref={imageRef}
                src={currentSceneData.image}
                alt={currentSceneData.name}
                className="absolute top-0 h-full w-1/3 object-cover select-none pointer-events-none"
                style={{
                  left: '0%',
                  transform: `translateX(${rotation % (100)}%)`,
                }}
                onLoad={handleImageLoad}
                onError={() => setIsLoading(false)}
                draggable={false}
              />
              <img
                src={currentSceneData.image}
                alt={currentSceneData.name}
                className="absolute top-0 h-full w-1/3 object-cover select-none pointer-events-none"
                style={{
                  left: '33.333%',
                  transform: `translateX(${rotation % (100)}%)`,
                }}
                draggable={false}
              />
              <img
                src={currentSceneData.image}
                alt={currentSceneData.name}
                className="absolute top-0 h-full w-1/3 object-cover select-none pointer-events-none"
                style={{
                  left: '66.666%',
                  transform: `translateX(${rotation % (100)}%)`,
                }}
                draggable={false}
              />
            </motion.div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md rounded-lg px-4 py-3 max-w-md pointer-events-auto">
              <h3 className="text-white font-semibold text-lg">{currentSceneData.name}</h3>
              <p className="text-white/80 text-sm mt-1">{currentSceneData.description}</p>
            </div>
            
            {isFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="bg-black/60 backdrop-blur-md text-white p-3 rounded-lg hover:bg-black/70 transition-colors pointer-events-auto"
              >
                <Minimize className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Scene Navigation */}
          {scenes.length > 1 && (
            <>
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
                <button
                  onClick={prevScene}
                  className="bg-black/60 backdrop-blur-md text-white p-4 rounded-lg hover:bg-black/70 transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>
              
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
                <button
                  onClick={nextScene}
                  className="bg-black/60 backdrop-blur-md text-white p-4 rounded-lg hover:bg-black/70 transition-all hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </>
          )}

          {/* Control Panel */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl px-6 py-3 flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:text-amber-400 transition-all p-2 hover:scale-110"
                title={isPlaying ? "Pause rotation" : "Auto-rotate"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <div className="w-px h-6 bg-white/20" />
              
              <button
                onClick={resetView}
                className="text-white hover:text-amber-400 transition-all p-2 hover:scale-110"
                title="Reset view"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              <div className="w-px h-6 bg-white/20" />
              
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-white hover:text-amber-400 transition-all p-2 hover:scale-110"
                title={soundEnabled ? "Mute" : "Unmute"}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              
              <div className="w-px h-6 bg-white/20" />
              
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-amber-400 transition-all p-2 hover:scale-110"
                title="Fullscreen"
              >
                <Maximize className="w-5 h-5" />
              </button>
              
              <div className="w-px h-6 bg-white/20" />
              
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`transition-all p-2 hover:scale-110 ${showInfo ? 'text-amber-400' : 'text-white hover:text-amber-400'}`}
                title="Show instructions"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scene Indicators */}
          {scenes.length > 1 && (
            <div className="absolute bottom-6 right-6 z-20">
              <div className="bg-black/60 backdrop-blur-md rounded-lg px-3 py-2 flex gap-2">
                {scenes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentScene(index);
                      setIsLoading(true);
                      setRotation(0);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentScene ? 'bg-amber-400 w-6' : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-2xl px-4"
              >
                <div className="bg-black/80 backdrop-blur-md text-white rounded-xl p-6 shadow-2xl">
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                    <Navigation className="w-5 h-5 text-amber-400" />
                    How to Navigate the 360° Gallery
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">→</span>
                        <span><strong>Click & Drag:</strong> Look around the gallery</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">⌨</span>
                        <span><strong>Arrow Keys:</strong> Navigate left/right</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">▶</span>
                        <span><strong>Auto-rotate:</strong> Press play button or spacebar</span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">⟲</span>
                        <span><strong>Reset:</strong> Return to starting view</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">←→</span>
                        <span><strong>Scene Arrows:</strong> Switch between galleries</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">⛶</span>
                        <span><strong>Fullscreen:</strong> Immersive experience</span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 max-w-md mx-auto text-sm">
            Experience all our museum galleries with full 360° navigation, audio guides, and interactive features
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default InteractiveVirtualGallery;

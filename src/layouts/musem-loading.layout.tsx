import { motion } from 'framer-motion';

const MuseumLoadingAlt = () => {
  return (
    <div className="fixed inset-0 bg-[#F5F4F1] flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-md px-4 py-8">
        {/* Museum frame */}
        <motion.div 
          className="relative mx-auto mb-8 w-64 h-48 border-8 border-amber-900/80 flex items-center justify-center bg-amber-50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Frame corners */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-amber-900"></div>
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-4 border-r-4 border-amber-900"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-4 border-l-4 border-amber-900"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-amber-900"></div>
          
          {/* Artwork loading animation */}
          <div className="w-full h-full p-4 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
              className="w-32 h-32"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <motion.path
                  d="M20,80 L20,20 L80,20 L80,80 L20,80 Z M35,35 L65,35 M35,50 L65,50 M35,65 L65,65"
                  fill="transparent"
                  stroke="#78350F"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="20"
                  fill="transparent"
                  stroke="#78350F"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay: 0.5 }}
                />
              </svg>
            </motion.div>
          </div>
          
          {/* Frame plaque */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-amber-800 text-amber-50 px-4 py-1 text-xs font-serif">
            <motion.span
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading...
            </motion.span>
          </div>
        </motion.div>
        
        {/* Museum information text */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h2 className="text-2xl font-serif text-amber-900 mb-2">Your Exhibition is Being Prepared</h2>
          <p className="text-amber-700/80 font-serif italic mb-6">Please wait while we arrange the artifacts...</p>
          
          {/* Artwork thumbnails */}
          <div className="flex justify-center space-x-4 my-6">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-10 h-10 bg-amber-700/20 border border-amber-800/30"
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  rotate: [0, i % 2 === 0 ? 5 : -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Animated steps */}
        <div className="mt-6 px-4">
          <div className="flex flex-col space-y-4">
            {[
              "Retrieving artifacts...",
              "Arranging exhibition...",
              "Preparing guided tour..."
            ].map((step, i) => (
              <motion.div 
                key={i}
                className="flex items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + (i * 0.2) }}
              >
                <motion.div 
                  className="w-4 h-4 rounded-full bg-amber-700 mr-3 flex-shrink-0"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    backgroundColor: ["#b45309", "#92400e", "#b45309"] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: i * 1, 
                    ease: "easeInOut" 
                  }}
                />
                <span className="text-amber-800 font-serif">{step}</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Footers */}
        <motion.div 
          className="text-center mt-8 text-sm text-amber-700/60 font-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          "Art is never finished, only abandoned." — Leonardo da Vinci
        </motion.div>
      </div>
    </div>
  );
};

export default MuseumLoadingAlt;

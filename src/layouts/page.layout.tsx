import SiteHeader from "@/components/site-header";
import useViewHomeEditor from "@/modules/admin/page-editor/home-editor/hooks/useViewHomeEditor";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";

export const MuseumLoading = () => {
  return (
    <div className="fixed inset-0 bg-[#F5F4F1] flex flex-col items-center justify-center z-50">
      <div className="max-w-md w-full mx-auto px-4">
        {/* Museum logo/icon */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-24 h-24 relative">
            <motion.div 
              className="absolute inset-0 rounded-full border-4 border-amber-700 opacity-30"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute inset-2 rounded-full border-4 border-amber-800 opacity-40"
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.2, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.div 
              className="absolute inset-4 rounded-full border-4 border-amber-900 opacity-60"
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.3, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
            <motion.div 
              className="absolute inset-6 rounded-full bg-amber-900"
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
          </div>
        </motion.div>

        {/* Exhibit pieces loading animation */}
        <motion.div 
          className="flex justify-center items-end h-20 mb-8 space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 bg-amber-800 rounded-t-md`}
              initial={{ height: 10 }}
              animate={{ height: [10, 40 + (i * 10), 10] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ))}
        </motion.div>

        {/* Loading text */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-serif text-amber-900 mb-2">Curating Your Experience</h2>
          <p className="text-amber-800/70 italic">Preparing the exhibition...</p>
          
          {/* Dots animation */}
          <div className="flex justify-center mt-4 space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-amber-800"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Progress bar */}
        <motion.div 
          className="mt-8 w-full h-1 bg-amber-100 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <motion.div 
            className="h-full bg-amber-800"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

const PageLayout = () => {
  const { isLoading} = useViewHomeEditor();

  return (
    <div className="bg-[#E7E5E1] min-h-screen">
      {/* Header for pages */}
      <SiteHeader />

      {/* Show loading UI when loading, otherwise show content */}
      {isLoading ? (
        <MuseumLoading />
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default PageLayout

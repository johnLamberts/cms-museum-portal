
// This is the Featured Curators section of the ExhibitsPage 
// to show exactly how this section should be structured

import Eyebrow from "@/components/eyebrow"

const FeaturedCuratorsSection = () => {
  return (
    <div className="bg-[#492309] text-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <Eyebrow label="Meet The Team"  />
          <h2 className="text-3xl font-display font-bold text-white mt-2">
            Featured Curators
          </h2>
          <p className="text-white/80 mt-2 max-w-2xl mx-auto">
            The brilliant minds behind our extraordinary exhibits
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Curator 1 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-amber-200 mb-4 overflow-hidden">
              <img 
                src="/mock/curator1.jpg" 
                alt="Curator" 
                className="w-full h-full object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150'
                }} 
              />
            </div>
            <h3 className="text-xl font-medium mb-1">Maria Santos</h3>
            <p className="text-amber-300 mb-3">Pinto Art Museum</p>
            <p className="text-white/70 text-sm">
              Specializes in contemporary Filipino art with a focus on emerging artists from Rizal province.
            </p>
          </div>
          
          {/* Curator 2 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-amber-200 mb-4 overflow-hidden">
              <img 
                src="/mock/curator2.jpg" 
                alt="Curator" 
                className="w-full h-full object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150'
                }} 
              />
            </div>
            <h3 className="text-xl font-medium mb-1">Antonio Reyes</h3>
            <p className="text-amber-300 mb-3">Rizal Provincial Museum</p>
            <p className="text-white/70 text-sm">
              Expert in historical artifacts with over 15 years of experience preserving local heritage.
            </p>
          </div>
          
          {/* Curator 3 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-amber-200 mb-4 overflow-hidden">
              <img 
                src="/mock/curator3.jpg" 
                alt="Curator" 
                className="w-full h-full object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150'
                }} 
              />
            </div>
            <h3 className="text-xl font-medium mb-1">Luna Garcia</h3>
            <p className="text-amber-300 mb-3">Angono-Binangonan Petroglyphs Museum</p>
            <p className="text-white/70 text-sm">
              Specializes in prehistoric Filipino art and archaeological preservation techniques.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedCuratorsSection

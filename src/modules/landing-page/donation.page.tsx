import Eyebrow from '@/components/eyebrow';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import GCashQRDonation from './hero-donation';

// Import the GCash QR component

// Simple donation page with GCash QR code only
const SimpleDonationPage = () => {
  
  // You can optionally fetch museum info if needed
  const { data: museumInfo } = useQuery({
    queryKey: ['museumInfo'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('museum_settings')
          .select('name, gcash_number, gcash_qr')
          .single();
        
        if (error) throw error;
        return data || { name: 'Rizal Cultural Museum', gcash_number: '09123456789', gcash_qr: '/mock/gcash-qr.png' };
      } catch (err) {
        console.error('Error fetching museum info:', err);
        return { name: 'Rizal Cultural Museum', gcash_number: '09123456789', gcash_qr: '/mock/gcash-qr.png' };
      }
    },
    // Default values in case of error or before data loads
    initialData: { name: 'Rizal Cultural Museum', gcash_number: '09123456789', gcash_qr: '/mock/gcash-qr.png' }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div    className="relative h-[80vh] bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: `url('/donations.jpg')` }}>
              <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 text-center">
          <Eyebrow label="Support Our Mission"  />
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-amber-200 to-orange-400 text-transparent bg-clip-text">
            Donate to Preserve Cultural Heritage
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Your contribution helps us protect and celebrate the cultural legacy of Rizal province
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-[#492309]">
              Donate via GCash
            </h2>
            <p className="text-gray-600">
              Support our mission by making a quick and easy donation through GCash
            </p>
          </div>
          
          {/* GCash QR Donation Component */}
          <GCashQRDonation 
            merchantName={museumInfo?.name}
            qrCodeImage={museumInfo?.gcash_qr}
            gcashNumber={museumInfo?.gcash_number}
          />
          
          {/* Quick info section */}
          <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-medium text-[#492309] mb-4">How Your Donation Helps</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#492309] font-bold">•</span>
                <span>Preserve artifacts and cultural items from Rizal province</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#492309] font-bold">•</span>
                <span>Support educational programs for schools and community groups</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#492309] font-bold">•</span>
                <span>Fund special exhibitions and cultural events</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#492309] font-bold">•</span>
                <span>Maintain our facilities to protect our cultural heritage</span>
              </li>
            </ul>
          </div>
          
          {/* Contact information */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              If you have any questions about donating, please contact us:
            </p>
            <p className="font-medium text-[#492309]">
              donations@rizalmuseums.org | +63 2-1234-5678
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDonationPage;

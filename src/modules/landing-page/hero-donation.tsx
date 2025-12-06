import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type GCashQRDonationProps = {
  merchantName?: string;
  qrCodeImage?: string;
  gcashNumber?: string;
  instructions?: string[];
  className?: string;
};

const GCashQRDonation = ({
  merchantName = "Rizal Cultural Museum",
  qrCodeImage = "/mock/gcash-qr.png", // Replace with actual QR code image
  gcashNumber = "09123456789",
  instructions = [
    "Scan this QR code using your GCash app",
    "Enter the amount you wish to donate",
    "Complete the payment in your GCash app",
    "Take a screenshot of your receipt for your records"
  ],
  className = ""
}: GCashQRDonationProps) => {
  return (
    <Card className={`max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-[#492309]">Donate via GCash</CardTitle>
        <CardDescription>
          Support our cultural preservation mission with a GCash donation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center">
        {/* QR Code Image */}
        <div className="w-64 h-64 border border-gray-200 rounded-lg p-2 mb-4">
          <img 
            src={qrCodeImage} 
            alt="GCash QR Code" 
            className="w-full h-full"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = "https://via.placeholder.com/250x250?text=QR+Code";
            }} 
          />
        </div>
        
        <div className="text-center mb-6">
          <p className="font-medium text-gray-700">Send to: {merchantName}</p>
          <p className="text-gray-600">GCash Number: {gcashNumber}</p>
        </div>
        
        <div className="w-full">
          <h3 className="font-medium text-gray-700 mb-2">How to donate:</h3>
          <ol className="space-y-2 list-decimal list-inside text-gray-600">
            {instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <p className="text-sm text-center text-gray-500">
          After sending your donation, please email us at donations@rizalmuseums.org with your name and GCash reference number to receive your donation receipt.
        </p>
      </CardFooter>
    </Card>
  );
};

export default GCashQRDonation;

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRef } from 'react';

type HeroSectionProps = {
  title?: string;
  subtitle: string;
  backgroundImage: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
};

const HeroSection = ({
  subtitle = "Discover extraordinary exhibits from museums across Rizal that showcase our rich cultural identity",
  backgroundImage = "/exhibits_hero.jpg",
  primaryButtonText = "Browse Exhibits",
  secondaryButtonText = "Featured Collections",
  onPrimaryButtonClick = () => {},
  onSecondaryButtonClick = () => {},
}: HeroSectionProps) => {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={heroRef}
      className="relative h-[80vh] bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <motion.div
        className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-display text-5xl md:text-7xl mb-6">
          <span className="block">Experience Art &</span>
          <span className="bg-gradient-to-r from-amber-200 to-orange-400 text-transparent bg-clip-text">
            Cultural Heritage
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-white text-[#492309] hover:bg-gray-100 font-medium text-lg px-8 py-6"
            onClick={onPrimaryButtonClick}
          >
            {primaryButtonText}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/20 font-medium text-lg px-8 py-6"
            onClick={onSecondaryButtonClick}
          >
            {secondaryButtonText}
          </Button>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-50 to-transparent" />
    </div>
  );
};

export default HeroSection;

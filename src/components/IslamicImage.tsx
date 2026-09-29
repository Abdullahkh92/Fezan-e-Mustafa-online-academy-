import React, { useState } from 'react';
import { BookOpen, Sparkles, GraduationCap, Video, Compass } from 'lucide-react';

interface IslamicImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: 'quran' | 'teacher' | 'students' | 'mosque' | 'general';
  title?: string;
  arabicTitle?: string;
}

export const IslamicImage: React.FC<IslamicImageProps> = ({
  src,
  alt,
  className = '',
  category = 'general',
  title,
  arabicTitle
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);
  const [triedAltPath, setTriedAltPath] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Handle potential path variations: e.g. /images/... <-> /src/assets/images/...
  const handleError = () => {
    if (!triedAltPath) {
      setTriedAltPath(true);
      if (currentSrc.startsWith('/src/assets/images/')) {
        const alt = currentSrc.replace('/src/assets/images/', '/images/');
        setCurrentSrc(alt);
        return;
      } else if (currentSrc.startsWith('/images/')) {
        const alt = currentSrc.replace('/images/', '/src/assets/images/');
        setCurrentSrc(alt);
        return;
      }
    }
    // If fallback path also fails, trigger elegant Islamic vector fallback
    setHasError(true);
  };

  if (hasError) {
    // Beautiful handcrafted SVG Islamic art fallback
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#021319] via-[#042427] to-[#010e14] border border-[#D4AF37]/30 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        {/* Subtle geometric background pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Ornate Islamic Emblem */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#063327] via-[#031c20] to-[#021217] border-2 border-[#D4AF37]/50 flex items-center justify-center text-[#F9E79F] shadow-xl shadow-emerald-950/80 mb-3">
          {category === 'quran' && <BookOpen className="w-8 h-8 text-[#D4AF37]" />}
          {category === 'teacher' && <Video className="w-8 h-8 text-[#D4AF37]" />}
          {category === 'students' && <GraduationCap className="w-8 h-8 text-[#D4AF37]" />}
          {category === 'mosque' && <Compass className="w-8 h-8 text-[#D4AF37]" />}
          {category === 'general' && <Sparkles className="w-8 h-8 text-[#D4AF37]" />}
        </div>

        {/* Arabic Calligraphy */}
        <div className="relative z-10 font-amiri text-2xl text-[#F9E79F] font-bold drop-shadow">
          {arabicTitle || 'الْقُرْآنُ الْكَرِيمُ'}
        </div>

        {/* English Title / Description */}
        <div className="relative z-10 text-xs sm:text-sm font-cinzel font-bold text-white mt-1 max-w-xs">
          {title || alt || 'Faizan-e-Mustafa Online Academy'}
        </div>

        <div className="relative z-10 text-[10px] uppercase tracking-widest text-[#D4AF37] font-medium mt-1">
          Authentic Quranic Education
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#021217] ${className}`}>
      {/* Skeleton / Ambient backdrop while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#021319] via-[#042427] to-[#021319] animate-pulse" />
      )}
      <img
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

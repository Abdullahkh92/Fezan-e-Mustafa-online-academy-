import React from 'react';
import { BookOpen, ShieldCheck, HeartHandshake, Globe2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { IslamicImage } from './IslamicImage';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-[#03151E] via-[#041d24] to-[#02141a] relative overflow-hidden border-t border-[#D4AF37]/15">
      {/* Subtle Islamic background accents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider font-cinzel shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            About Our Academy
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-cinzel text-white">
            Nurturing Hearts with the <span className="text-gold-gradient">Light of the Quran</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Faizan-e-Mustafa Online Academy is a premier international institute dedicated to imparting authentic Quranic recitation, Tajweed, and foundational Islamic teachings to Muslim families across the globe.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual with ornate Islamic frame & Hadith */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-600/30 via-[#D4AF37]/30 to-teal-500/20 rounded-2xl blur-lg -z-10" />
              
              <div className="rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-2xl bg-[#03151E]">
                <IslamicImage
                  src="/images/quran_tajweed_rehal_1790595280541.jpg"
                  alt="Holy Quran on carved wooden rehal with golden calligraphy"
                  category="quran"
                  title="Holy Quran & Tajweed"
                  arabicTitle="«خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»"
                  className="w-full h-80 sm:h-[400px] transform hover:scale-105 transition-transform duration-700"
                />
                
                {/* Quranic Verse Box */}
                <div className="p-6 bg-gradient-to-t from-[#021017] via-[#041d24] to-[#03151E] border-t-2 border-[#D4AF37]/30 text-center space-y-2">
                  <p className="font-amiri text-2xl text-[#F9E79F] leading-loose">
                    «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»
                  </p>
                  <p className="text-xs sm:text-sm text-slate-200 italic font-serif">
                    "The best among you are those who learn the Quran and teach it."
                  </p>
                  <p className="text-xs text-[#D4AF37] font-semibold font-cinzel">
                    — Sahih al-Bukhari 5027
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mission and Academy Pillars */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mb-3">
                A Sacred Journey from the Comfort of Your Home
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Founded with a deep devotion to the Prophet Muhammad&apos;s (peace and blessings be upon him) legacy, <strong className="text-white">Faizan-e-Mustafa Online Academy</strong> eliminates geographical boundaries. Whether you reside in the United Kingdom, United States, Canada, Australia, Europe, or the Gulf, we connect you with certified teachers who possess deep patience and expertise.
              </p>
            </div>

            {/* 4 Pillars Bento-style with strong contrast */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-5 rounded-2xl bg-[#031c22]/90 border border-emerald-500/30 hover:border-[#D4AF37]/60 transition-all shadow-md group">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-[#F9E79F] mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h4 className="text-sm font-bold font-cinzel text-white">
                  Step-by-Step Pedagogy
                </h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  From basic Arabic alphabets to advanced Tajweed rules and Hifz memorization, structured for steady mastery.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#031c22]/90 border border-emerald-500/30 hover:border-[#D4AF37]/60 transition-all shadow-md group">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-[#F9E79F] mb-3 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h4 className="text-sm font-bold font-cinzel text-white">
                  Certified Male & Female Scholars
                </h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Rigorous background checks, pedagogical certifications, and dedicated female teachers for sisters and young girls.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#031c22]/90 border border-emerald-500/30 hover:border-[#D4AF37]/60 transition-all shadow-md group">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-[#F9E79F] mb-3 group-hover:scale-110 transition-transform">
                  <Globe2 className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h4 className="text-sm font-bold font-cinzel text-white">
                  Global Time Zone Flexibility
                </h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Round-the-clock availability accommodating UK, USA, Canadian, European, and Australian school routines.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#031c22]/90 border border-emerald-500/30 hover:border-[#D4AF37]/60 transition-all shadow-md group">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-[#F9E79F] mb-3 group-hover:scale-110 transition-transform">
                  <HeartHandshake className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h4 className="text-sm font-bold font-cinzel text-white">
                  Compassionate Mentorship
                </h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Fostering love for Allah and His Messenger (PBUH) through positive reinforcement, patience, and warmth.
                </p>
              </div>

            </div>

            {/* Quick Trust Highlights Checklist */}
            <div className="pt-3 border-t border-[#D4AF37]/20 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Obligation 3-Day Trial</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Monthly Progress Reports</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Completion Certificates</span>
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

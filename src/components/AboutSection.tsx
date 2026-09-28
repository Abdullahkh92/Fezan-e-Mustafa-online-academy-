import React from 'react';
import { BookOpen, ShieldCheck, HeartHandshake, Globe2, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-[#03151E] via-[#041d24] to-[#02141a] relative overflow-hidden border-t border-[#D4AF37]/15">
      {/* Subtle Islamic background accents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider font-cinzel">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            About Our Academy
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-white">
            Nurturing Hearts with the <span className="text-gold-gradient">Light of the Quran</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Faizan-e-Mustafa Online Academy is a premier international institute dedicated to imparting authentic Quranic recitation, Tajweed, and foundational Islamic teachings to Muslim families across the globe.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image with ornate frame */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-600/30 to-[#D4AF37]/30 rounded-2xl blur-lg -z-10" />
              
              <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl bg-[#03151E]">
                <img
                  src="/src/assets/images/quran_tajweed_rehal_1790595280541.jpg"
                  alt="Holy Quran on carved wooden rehal with golden calligraphy"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover object-center"
                />
                
                {/* Quranic Verse Box */}
                <div className="p-5 bg-gradient-to-t from-[#021017] to-[#041d24] border-t border-[#D4AF37]/20 text-center">
                  <p className="font-amiri text-xl text-[#F9E79F] leading-loose">
                    «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»
                  </p>
                  <p className="text-xs text-slate-300 mt-1 italic">
                    "The best among you are those who learn the Quran and teach it."
                  </p>
                  <p className="text-[11px] text-[#D4AF37] font-semibold mt-0.5">
                    — Sahih al-Bukhari 5027
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mission and Academy Pillars */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white mb-3">
                A Sacred Journey from the Comfort of Your Home
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Founded with a deep devotion to the Prophet Muhammad’s (peace and blessings be upon him) legacy, <strong className="text-white">Faizan-e-Mustafa Online Academy</strong> eliminates geographical boundaries. Whether you reside in the United Kingdom, United States, Canada, Australia, Europe, or the Gulf, we connect you with certified teachers who possess deep patience and expertise.
              </p>
            </div>

            {/* 4 Pillars Bento-style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-4 rounded-xl bg-[#031c22]/80 border border-emerald-500/25 hover:border-[#D4AF37]/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-[#F9E79F] mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold font-cinzel text-white">
                  Step-by-Step Pedagogy
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  From basic Arabic alphabets to advanced Tajweed rules and Hifz memorization, structured for steady mastery.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#031c22]/80 border border-emerald-500/25 hover:border-[#D4AF37]/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-[#F9E79F] mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold font-cinzel text-white">
                  Certified Male & Female Scholars
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Rigorous background checks, pedagogical certifications, and dedicated female teachers for sisters and young girls.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#031c22]/80 border border-emerald-500/25 hover:border-[#D4AF37]/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-[#F9E79F] mb-3">
                  <Globe2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold font-cinzel text-white">
                  Global Time Zone Flexibility
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Round-the-clock schedules tailored to your school, work, and family commitments in any time zone.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#031c22]/80 border border-emerald-500/25 hover:border-[#D4AF37]/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-[#F9E79F] mb-3">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold font-cinzel text-white">
                  Parental Transparency
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Daily feedback, regular milestone examinations, and continuous WhatsApp communication with parents.
                </p>
              </div>

            </div>

            {/* Checklist of assurances */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No long-term binding contracts</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>3-Day complimentary evaluation</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Affordable family monthly fees</span>
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

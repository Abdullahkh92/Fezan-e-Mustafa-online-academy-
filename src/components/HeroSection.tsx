import React from 'react';
import { ArrowRight, MessageCircle, Star, Video, Award, Clock } from 'lucide-react';

interface Props {
  onStartLearning: () => void;
  onContactClick: () => void;
}

export const HeroSection: React.FC<Props> = ({ onStartLearning, onContactClick }) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:py-24 bg-islamic-pattern">
      {/* Decorative luxury gradient orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Academy Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Arabic Bismillah Calligraphy */}
            <div className="inline-flex items-center gap-3">
              <span className="font-amiri text-2xl sm:text-3xl text-[#F9E79F] tracking-wide select-none drop-shadow">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            </div>

            {/* Academy Name & Main Headline */}
            <div className="space-y-3">
              <div className="text-xs sm:text-sm font-semibold tracking-widest text-[#D4AF37] uppercase font-cinzel">
                Faizan-e-Mustafa Online Academy
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-cinzel text-white leading-tight" style={{ textWrap: 'balance' }}>
                Learn Quran Online with <span className="text-gold-gradient">Qualified Teachers</span>
              </h1>
            </div>

            {/* Subtitle / Proposition */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Empowering Muslim children and adults worldwide with authentic Quran recitation, Tajweed mastery, Madni Qaida, and Islamic studies through personalized one-to-one interactive Zoom classes.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartLearning}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-semibold text-slate-950 bg-gradient-to-r from-[#F9E79F] via-[#D4AF37] to-[#AA771C] hover:brightness-110 rounded-xl shadow-xl shadow-[#D4AF37]/25 transition-all font-cinzel group cursor-pointer"
              >
                <span>Start Learning (3-Day Free Trial)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onContactClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-slate-200 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/80 hover:border-[#D4AF37]/50 rounded-xl transition-all cursor-pointer"
              >
                <span>Contact Us</span>
              </button>

              <a
                href="https://wa.me/923454040452?text=Assalamu%20Alaikum!%20I%20am%20interested%20in%20enrolling%20in%20Faizan-e-Mustafa%20Online%20Academy."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium text-emerald-300 hover:text-white bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-500/40 rounded-xl transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: 0345-4040452</span>
              </a>
            </div>

            {/* Adjacency Proof & Trust Markers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#D4AF37]/20 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1-on-1 Zoom Classes</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Certified Qaris & Alim</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>24/7 Flexible Timings</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#F9E79F] shrink-0" />
                <span>Male & Female Tutors</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Gold & Emerald ornate frame backdrop */}
              <div className="absolute -inset-2 bg-gradient-to-br from-[#D4AF37]/40 via-emerald-600/30 to-teal-500/20 rounded-3xl blur-md -z-10" />

              <div className="relative overflow-hidden rounded-2xl border-2 border-[#D4AF37]/40 shadow-2xl bg-[#03151E]">
                <img
                  src="/src/assets/images/hero_quran_learning_1790595240873.jpg"
                  alt="Muslim student learning Quran online with headphones on tablet"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#021017] via-[#021017]/90 to-transparent p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold font-cinzel">
                        Live Virtual Classroom
                      </p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        Interactive Tajweed & Qaida Coaching
                      </p>
                    </div>
                    <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Admissions Open</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Testimonial Pill-less Card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 max-w-[260px] p-3.5 rounded-xl bg-[#041d24]/95 border border-[#D4AF37]/40 shadow-xl backdrop-blur-md hidden sm:block">
                <div className="flex items-center gap-1 text-[#F9E79F] mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-[11px] text-slate-200 leading-snug">
                  "My 7-year-old daughter learned fluent Tajweed within 4 months. The teachers are so gentle and encouraging!"
                </p>
                <p className="text-[10px] text-[#D4AF37] font-semibold mt-1">
                  — Sister Maryam · Chicago, USA
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

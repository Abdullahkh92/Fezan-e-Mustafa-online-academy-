import React from 'react';
import { ArrowRight, MessageCircle, Star, Video, Award, Clock, Users, ShieldCheck, Sparkles } from 'lucide-react';
import { IslamicImage } from './IslamicImage';

interface Props {
  onStartLearning: () => void;
  onContactClick: () => void;
}

export const HeroSection: React.FC<Props> = ({ onStartLearning, onContactClick }) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-islamic-pattern">
      {/* Decorative luxury gradient orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Academy Value Proposition */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Arabic Bismillah Calligraphy */}
            <div className="inline-flex items-center gap-3">
              <span className="font-amiri text-2xl sm:text-3xl lg:text-4xl text-[#F9E79F] tracking-wide select-none drop-shadow-md">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            </div>

            {/* Academy Name & Main Headline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider font-cinzel shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Faizan-e-Mustafa Online Academy</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-cinzel text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
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
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold text-slate-950 bg-gradient-to-r from-[#F9E79F] via-[#D4AF37] to-[#AA771C] hover:brightness-110 rounded-xl shadow-xl shadow-[#D4AF37]/25 transition-all font-cinzel uppercase tracking-wider group cursor-pointer"
              >
                <span>Start Learning (3-Day Free Trial)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onContactClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-slate-100 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-[#D4AF37]/60 rounded-xl transition-all font-cinzel cursor-pointer shadow-md"
              >
                <span>Contact Us</span>
              </button>

              <a
                href="https://wa.me/923454040452?text=Assalamu%20Alaikum!%20I%20am%20interested%20in%20enrolling%20in%20Faizan-e-Mustafa%20Online%20Academy."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-4 text-sm font-semibold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 rounded-xl transition-all shadow-md cursor-pointer"
                title="Direct WhatsApp Support"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                <span className="font-mono">WhatsApp: 0345-4040452</span>
              </a>
            </div>

            {/* Adjacency Proof & Trust Markers (Responsive 4-Box Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#D4AF37]/20 text-xs text-slate-200">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#02141a]/60 border border-slate-800/80">
                <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">1-on-1 Zoom Classes</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#02141a]/60 border border-slate-800/80">
                <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="font-medium">Certified Qaris & Alim</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#02141a]/60 border border-slate-800/80">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="font-medium">24/7 Global Timings</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#02141a]/60 border border-slate-800/80">
                <Users className="w-4 h-4 text-[#F9E79F] shrink-0" />
                <span className="font-medium">Male & Female Tutors</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Gold & Emerald ornate frame glow */}
              <div className="absolute -inset-2 bg-gradient-to-br from-[#D4AF37]/40 via-emerald-600/30 to-teal-500/20 rounded-3xl blur-md -z-10" />

              <div className="relative overflow-hidden rounded-2xl border-2 border-[#D4AF37]/50 shadow-2xl bg-[#03151E]">
                <IslamicImage
                  src="/images/hero_quran_academy_desktop_1790658869680.jpg"
                  alt="Holy Quran on carved rehal stand beside digital online classroom on laptop"
                  category="quran"
                  title="Live Online Quran Academy"
                  arabicTitle="الْقُرْآنُ نُورُ الْقُلُوبِ"
                  className="w-full h-80 sm:h-[420px] transform hover:scale-105 transition-transform duration-700"
                />

                {/* Bottom Overlay Info Banner */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#021017] via-[#021017]/95 to-transparent p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold font-cinzel">
                        Live Virtual Classroom
                      </p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        Interactive Tajweed & Qaida Coaching
                      </p>
                    </div>
                    <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Admissions Open</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Verified Testimonial Card */}
              <div className="mt-4 sm:absolute sm:-bottom-5 sm:-left-6 max-w-sm sm:max-w-[280px] p-4 rounded-xl bg-[#041d24]/95 border border-[#D4AF37]/40 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-1 text-[#F9E79F] mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                  <span className="text-[11px] font-bold text-slate-300 ml-1">5.0 Star Rating</span>
                </div>
                <p className="text-xs text-slate-200 leading-snug">
                  "My 7-year-old daughter learned fluent Tajweed within 4 months. The teachers are so gentle and encouraging!"
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#D4AF37] font-semibold mt-2 pt-2 border-t border-slate-700/50">
                  <span>Sister Maryam</span>
                  <span className="text-slate-400 font-normal">Chicago, USA</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

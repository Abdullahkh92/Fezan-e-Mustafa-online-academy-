import React from 'react';
import { Award, Clock, Heart, Laptop, ShieldCheck, Sparkles, Star, Quote } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const pillars = [
    {
      icon: Award,
      title: 'Qualified Teachers',
      desc: 'Our faculty consists of certified Alim, Qaris with Sanad/Ijazah, and university graduates trained in child psychology and Tajweed phonetics.'
    },
    {
      icon: Clock,
      title: 'Flexible Timings',
      desc: 'We operate 24 hours a day across global time zones (US, UK, Canada, Australia, Europe & Gulf). Choose timings that suit your daily family life.'
    },
    {
      icon: Heart,
      title: 'Individual Attention',
      desc: 'With one-to-one dedicated classes, teachers identify specific pronunciation bottlenecks and tailor lessons to the student’s learning curve.'
    },
    {
      icon: Laptop,
      title: 'Interactive Online Learning',
      desc: 'High-definition Zoom video, digital colored Mushaf screen sharing, audio recording playback, and structured online curricula.'
    },
    {
      icon: ShieldCheck,
      title: 'Safe Learning Environment',
      desc: 'Children learn from the comfort and safety of home under parents’ direct supervision, completely eliminating travel fatigue and safety worries.'
    }
  ];

  const testimonials = [
    {
      name: 'Brother Usman Farooqi',
      location: 'London, United Kingdom',
      course: 'Madni Qaida & Nazra Quran',
      quote: 'My 6-year-old son started from zero Arabic. Within 3 months, his Makharij improved remarkably. The teacher is extraordinarily patient with young kids.'
    },
    {
      name: 'Sister Aisha Rahman',
      location: 'Dallas, Texas, USA',
      course: 'Quran with Tajweed',
      quote: 'I requested a female teacher for myself and my teenage daughter. Our Muallima is knowledgeable, gentle, and explains every Tajweed rule with clarity.'
    },
    {
      name: 'Brother Zafar Iqbal',
      location: 'Toronto, Canada',
      course: 'Hifz-ul-Quran Tracking',
      quote: 'The 3-stage revision system (Sabaq, Sabqi, Manzil) kept my son on track during his regular school year. Truly world-class Islamic dedication.'
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-islamic-pattern relative overflow-hidden border-t border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider font-cinzel shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Why Parents Trust Us
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-cinzel text-white">
            Excellence in <span className="text-gold-gradient">Quranic Education</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            We hold ourselves to the highest pedagogical and spiritual standards, ensuring every lesson builds both Quranic fluency and love for the Deen.
          </p>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className={`p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#052627]/95 via-[#031d22]/95 to-[#021319]/98 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all duration-300 shadow-xl ${
                  i === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-900/90 to-teal-950 border border-emerald-500/50 flex items-center justify-center text-[#F9E79F] mb-4 shadow-inner">
                  <Icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold font-cinzel text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quantitative Proof Adjacency Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-[#042426] to-[#021217] border-2 border-[#D4AF37]/40 shadow-2xl mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800/90">
            <div className="pt-4 sm:pt-0">
              <span className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F9E79F] block tracking-tight">
                100%
              </span>
              <span className="text-xs sm:text-sm text-slate-300 mt-1 block font-medium">
                One-to-One Attention
              </span>
            </div>
            <div className="pt-4 sm:pt-0 sm:pl-4">
              <span className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-400 block tracking-tight">
                24/7
              </span>
              <span className="text-xs sm:text-sm text-slate-300 mt-1 block font-medium">
                Global Time Zones
              </span>
            </div>
            <div className="pt-4 sm:pt-0 sm:pl-4">
              <span className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#D4AF37] block tracking-tight">
                3-Day
              </span>
              <span className="text-xs sm:text-sm text-slate-300 mt-1 block font-medium">
                Free Trial Evaluation
              </span>
            </div>
            <div className="pt-4 sm:pt-0 sm:pl-4">
              <span className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-300 block tracking-tight">
                Both
              </span>
              <span className="text-xs sm:text-sm text-slate-300 mt-1 block font-medium">
                Male & Female Scholars
              </span>
            </div>
          </div>
        </div>

        {/* Parent Testimonials Section */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
              Words from <span className="text-gold-gradient">Our Student Families</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Real feedback from parents across the UK, USA, Canada, and beyond
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#031c22]/90 border border-slate-700/80 hover:border-[#D4AF37]/50 transition-colors shadow-lg flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-emerald-500/30" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <p className="text-sm font-bold text-white font-cinzel">{t.name}</p>
                  <p className="text-[11px] text-[#D4AF37] mt-0.5">{t.course} · {t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

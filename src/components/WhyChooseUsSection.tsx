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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider font-cinzel">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Why Parents Trust Us
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-white">
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
                className={`p-6 rounded-2xl bg-gradient-to-b from-[#052627]/90 via-[#031d22]/90 to-[#021319]/95 border border-[#D4AF37]/25 hover:border-[#D4AF37]/50 transition-all duration-300 shadow-lg ${
                  i === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-900/80 to-teal-950/80 border border-emerald-500/40 flex items-center justify-center text-[#F9E79F] mb-4 shadow-inner">
                  <Icon className="w-6 h-6" />
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
        <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#042426] to-[#021217] border border-[#D4AF37]/35 shadow-xl mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80">
            <div className="pt-4 lg:pt-0">
              <div className="text-2xl sm:text-4xl font-bold font-cinzel text-white tabular-nums">
                1,500<span className="text-[#D4AF37]">+</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-cinzel">
                Students Educated
              </p>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-2xl sm:text-4xl font-bold font-cinzel text-white tabular-nums">
                25<span className="text-[#D4AF37]">+</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-cinzel">
                Countries Reached
              </p>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-2xl sm:text-4xl font-bold font-cinzel text-white tabular-nums">
                100<span className="text-[#D4AF37]">%</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-cinzel">
                Certified Teachers
              </p>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-2xl sm:text-4xl font-bold font-cinzel text-white tabular-nums">
                4.9<span className="text-[#D4AF37]">/5</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-cinzel">
                Parent Satisfaction
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
              Words from <span className="text-gold-gradient">Our Community</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real parents and students experiencing life-changing Quranic growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#031c22]/70 border border-emerald-500/20 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#D4AF37]">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 text-emerald-500/40" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <div className="text-sm font-bold font-cinzel text-white">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {t.location} <span aria-hidden="true">·</span> <span className="text-[#D4AF37]">{t.course}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

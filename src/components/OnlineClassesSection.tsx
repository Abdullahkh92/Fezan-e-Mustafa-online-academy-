import React from 'react';
import { Video, MessageCircle, User, Users, Clock, Shield, Sparkles, Check } from 'lucide-react';

export const OnlineClassesSection: React.FC = () => {
  return (
    <section id="online-classes" className="py-20 bg-gradient-to-b from-[#02141a] via-[#031c22] to-[#021017] relative overflow-hidden border-t border-[#D4AF37]/15">
      
      {/* Decorative radial gradients */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider font-cinzel">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Modern Educational Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-white">
            How Our <span className="text-gold-gradient">Online Classes</span> Work
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            State-of-the-art interactive digital learning designed for seamless focus, verified retention, and comfortable home environments.
          </p>
        </div>

        {/* Top Feature: Visual Showcase & Class Methodology */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column: Visual of Teacher Online */}
          <div className="lg:col-span-6 relative">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600/30 via-[#D4AF37]/20 to-teal-500/20 rounded-2xl blur-lg -z-10" />
              <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl bg-[#03151E]">
                <img
                  src="/src/assets/images/teacher_online_class_1790595255599.jpg"
                  alt="Qualified Quran teacher conducting online Zoom class"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover object-center"
                />
                
                {/* Tech Badges floating */}
                <div className="p-4 bg-[#03151E]/95 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Video className="w-4 h-4 text-emerald-400" />
                    <span>Zoom HD Audio & Screen Share</span>
                  </div>
                  <div className="flex items-center gap-2 text-teal-300">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Instant WhatsApp Voice Feedback</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Class Formats */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl font-bold font-cinzel text-white">
              Personalized 1-on-1 & Flexible Learning Tracks
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every student learns at their own pace. Our online classroom connects student and teacher in an intimate, distraction-free environment.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#041d24]/70 border border-emerald-500/20">
                <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-[#F9E79F] shrink-0 mt-0.5">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-cinzel text-white">
                    One-to-One Live Classes
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    100% individual attention throughout the 30 or 45-minute lesson. The teacher listens to every breath and corrects vowel articulation instantly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#041d24]/70 border border-emerald-500/20">
                <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-[#F9E79F] shrink-0 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-cinzel text-white">
                    Small Group & Sibling Classes
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Cost-effective sibling sessions where brothers or sisters learn together under one dedicated teacher, fostering healthy encouragement.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#041d24]/70 border border-emerald-500/20">
                <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-[#F9E79F] shrink-0 mt-0.5">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-cinzel text-white">
                    Children & Adults (Separate Male & Female Tutors)
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Strict adherence to Islamic etiquette. Female students and young girls are paired with certified female teachers, while male students learn with male scholars.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#052627] to-[#021319] border border-[#D4AF37]/25 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-[#D4AF37]">
              <Video className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold font-cinzel text-white">
              Zoom Classroom
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Crystal-clear audio and HD video screen sharing. Teachers point directly to Arabic letters on digital boards and highlight tajweed rules in color.
            </p>
            <ul className="text-xs text-slate-400 space-y-1 pt-1">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> One-click Zoom link</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Works on Tablets, Laptops & Phones</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#052627] to-[#021319] border border-[#D4AF37]/25 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-[#D4AF37]">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold font-cinzel text-white">
              WhatsApp Communication
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Direct communication line with parents. Receive daily lesson updates, audio notes for practice between classes, and schedule rescheduling.
            </p>
            <ul className="text-xs text-slate-400 space-y-1 pt-1">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Direct teacher & coordinator chat</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Homework voice clips</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#052627] to-[#021319] border border-[#D4AF37]/25 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-[#D4AF37]">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold font-cinzel text-white">
              24/7 Flexible Timings
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Select class times that match your family's routine: before school, after school, evenings, or weekend mornings. Easily adjust slots when schedules change.
            </p>
            <ul className="text-xs text-slate-400 space-y-1 pt-1">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Choice of 2, 3, 4, or 5 days/week</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Makeup classes available</li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};

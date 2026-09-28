import React from 'react';
import { CourseDetail } from '../types/academy';
import { COURSES_DATA } from '../data/coursesData';
import { Clock, BookOpen, UserCheck, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  onSelectCourse: (course: CourseDetail) => void;
  onEnrollCourse: (courseTitle: string) => void;
}

export const CoursesSection: React.FC<Props> = ({ onSelectCourse, onEnrollCourse }) => {
  return (
    <section id="courses" className="py-20 bg-islamic-pattern relative overflow-hidden border-t border-[#D4AF37]/15">
      {/* Glow effects */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider font-cinzel">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Curriculum & Programs
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-white">
            Comprehensive <span className="text-gold-gradient">Quranic Courses</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Carefully structured pathways taught by certified scholars. From the first Arabic letter to full Quran memorization and Islamic ethics.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES_DATA.map((course) => (
            <div
              key={course.id}
              className="group relative rounded-2xl bg-gradient-to-b from-[#062425]/90 via-[#031c20]/90 to-[#021318]/95 border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all duration-300 shadow-xl hover:shadow-[#D4AF37]/10 flex flex-col overflow-hidden"
            >
              {/* Card Image Banner */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#021318] via-[#021318]/40 to-transparent" />
                
                {/* Arabic Calligraphy Overlay */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-[#D4AF37]/30">
                  <span className="font-amiri text-base text-[#F9E79F] font-bold">
                    {course.arabicTitle}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3">
                  <span className="text-[11px] font-semibold tracking-wider text-[#D4AF37] uppercase font-cinzel bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-cinzel text-white group-hover:text-[#F9E79F] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {course.shortDesc}
                  </p>
                </div>

                {/* Quick Metadata */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="truncate">{course.suitableFor}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onSelectCourse(course)}
                    className="flex-1 py-2.5 px-3 text-xs font-medium text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-[#D4AF37]/40 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => onEnrollCourse(course.title)}
                    className="py-2.5 px-4 text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#F9E79F] to-[#D4AF37] hover:brightness-110 rounded-xl transition-all font-cinzel flex items-center justify-center gap-1 shadow-md shadow-[#D4AF37]/15 cursor-pointer"
                  >
                    <span>Enroll</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Custom inquiry prompt */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#031c22]/60 border border-[#D4AF37]/20 max-w-2xl mx-auto">
          <p className="text-sm text-slate-200">
            Looking for a custom learning plan, specialized adult classes, or Ijazah certification?
          </p>
          <a
            href="https://wa.me/923454040452?text=Assalamu%20Alaikum!%20I%20want%20to%20discuss%20a%20custom%20Quran%20course."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:text-[#F9E79F] mt-2 underline underline-offset-4"
          >
            <span>Consult directly with our Academic Supervisor on WhatsApp</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

      </div>
    </section>
  );
};

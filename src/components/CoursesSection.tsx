import React from 'react';
import { CourseDetail } from '../types/academy';
import { COURSES_DATA } from '../data/coursesData';
import { Clock, BookOpen, UserCheck, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { IslamicImage } from './IslamicImage';

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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider font-cinzel shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Curriculum & Programs
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-cinzel text-white">
            Comprehensive <span className="text-gold-gradient">Quranic Courses</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Carefully structured pathways taught by certified scholars. From the first Arabic letter to full Quran memorization and Islamic ethics.
          </p>
        </div>

        {/* Courses Grid - Equal Height & High Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES_DATA.map((course) => (
            <div
              key={course.id}
              className="group relative rounded-2xl bg-gradient-to-b from-[#062425]/95 via-[#031c20]/95 to-[#021318]/98 border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#D4AF37]/15 flex flex-col overflow-hidden"
            >
              {/* Card Image Banner */}
              <div className="relative h-52 overflow-hidden bg-slate-900">
                <IslamicImage
                  src={course.image}
                  alt={course.title}
                  title={course.title}
                  arabicTitle={course.arabicTitle}
                  category="quran"
                  className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#021318] via-[#021318]/40 to-transparent pointer-events-none" />
                
                {/* Arabic Calligraphy Badge */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#D4AF37]/40 shadow-md">
                  <span className="font-amiri text-base text-[#F9E79F] font-bold">
                    {course.arabicTitle}
                  </span>
                </div>

                {/* Level Tag */}
                <div className="absolute bottom-3 left-3">
                  <span className="text-[11px] font-bold tracking-wider text-[#F9E79F] uppercase font-cinzel bg-emerald-950/90 px-3 py-1 rounded-lg border border-emerald-500/40 shadow-sm">
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <h3 className="text-xl font-bold font-cinzel text-white group-hover:text-[#F9E79F] transition-colors leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {course.shortDesc}
                  </p>
                </div>

                {/* Quick Metadata */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-200 pt-3 border-t border-slate-800/90">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate font-medium">{course.suitableFor}</span>
                  </div>
                </div>

                {/* Action Buttons (Clearly visible, high contrast) */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => onSelectCourse(course)}
                    className="flex-1 py-3 px-3.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-[#D4AF37]/60 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                    <span>View Syllabus</span>
                  </button>

                  <button
                    onClick={() => onEnrollCourse(course.title)}
                    className="py-3 px-5 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F9E79F] via-[#D4AF37] to-[#AA771C] hover:brightness-110 rounded-xl transition-all font-cinzel flex items-center justify-center gap-1.5 shadow-md shadow-[#D4AF37]/20 uppercase tracking-wider cursor-pointer"
                  >
                    <span>Enroll</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Custom inquiry prompt */}
        <div className="mt-14 text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#031c22]/90 via-[#042426]/90 to-[#02141a]/90 border border-[#D4AF37]/30 max-w-2xl mx-auto shadow-xl">
          <p className="text-sm sm:text-base text-slate-200 font-medium">
            Looking for a custom learning plan, specialized adult classes, or Ijazah certification?
          </p>
          <a
            href="https://wa.me/923454040452?text=Assalamu%20Alaikum!%20I%20want%20to%20discuss%20a%20custom%20Quran%20course."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#F9E79F] hover:text-white mt-3 font-cinzel underline underline-offset-4 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Consult directly with our Academic Supervisor on WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};

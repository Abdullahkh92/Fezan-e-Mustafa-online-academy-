import React from 'react';
import { CourseDetail } from '../types/academy';
import { X, Clock, BookOpen, UserCheck, CheckCircle2, Sparkles, MessageCircle } from 'lucide-react';

interface Props {
  course: CourseDetail | null;
  onClose: () => void;
  onEnroll: (courseTitle: string) => void;
}

export const CourseDetailModal: React.FC<Props> = ({ course, onClose, onEnroll }) => {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl my-8 bg-gradient-to-b from-[#062423] via-[#041d24] to-[#02141a] border border-[#D4AF37]/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gold accent line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-[#D4AF37] to-teal-500" />

        {/* Header with image & title */}
        <div className="relative p-6 sm:p-8 border-b border-[#D4AF37]/20 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(to right, rgba(3, 21, 30, 0.95), rgba(4, 30, 36, 0.85)), url(${course.image})` }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-black/40 hover:bg-black/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="pr-10">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold font-cinzel">
              Course Details
            </span>
            <div className="flex flex-wrap items-baseline gap-3 mt-1">
              <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
                {course.title}
              </h2>
              <span className="font-amiri text-2xl text-[#F9E79F]">
                {course.arabicTitle}
              </span>
            </div>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {course.shortDesc}
            </p>

            {/* Quick meta tags */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{course.level}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{course.suitableFor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Detailed Description */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#D4AF37] font-cinzel mb-2">
              Overview & Objectives
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {course.fullDesc}
            </p>
          </div>

          {/* Curriculum / Topics */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#D4AF37] font-cinzel mb-3">
              Curriculum & Lesson Modules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.keyTopics.map((topic, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#072a2b]/40 border border-emerald-500/20 text-xs sm:text-sm text-slate-200">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#F9E79F] flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Outcomes */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#D4AF37] font-cinzel mb-3">
              Expected Learning Outcomes
            </h3>
            <ul className="space-y-2">
              {course.learningOutcomes.map((outcome, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Highlights */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-[#03151E] border border-[#D4AF37]/30">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F9E79F] mb-2 font-cinzel">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Academy Pedagogical Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {course.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-[#D4AF37]/20 bg-[#03171e] flex flex-wrap items-center justify-between gap-4">
          <a
            href="https://wa.me/923454040452?text=Assalamu%20Alaikum!%20I%20would%20like%20more%20information%20about%20the%20course:%20"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-emerald-300 hover:text-emerald-200 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Questions? Chat on WhatsApp (0345-4040452)</span>
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg border border-slate-700 hover:border-slate-500 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEnroll(course.title);
              }}
              className="px-6 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#F9E79F] via-[#D4AF37] to-[#AA771C] hover:brightness-110 rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all font-cinzel"
            >
              Enroll Now (3-Day Trial)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

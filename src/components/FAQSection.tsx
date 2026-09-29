import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS_DATA: FAQItem[] = [
  {
    category: 'Class Methodology',
    question: 'How do online Quran classes work on Zoom?',
    answer: 'Our online Quran classes are conducted one-to-one between the student and a dedicated teacher via Zoom HD audio and screen sharing. The teacher displays the digital Qaida or color-coded Quran Mushaf on screen, listening to the student and correcting articulation points (Makharij) and Tajweed rules in real-time. Classes are recorded for student review upon request.'
  },
  {
    category: 'Female Teachers',
    question: 'Are qualified female Quran teachers available for sisters and children?',
    answer: 'Yes, absolutely. We have a dedicated team of certified female Quran teachers holding Ijazah degrees in Tajweed and Islamic Studies. Female students and young girls are paired exclusively with female teachers in a secure, respectful, and encouraging environment.'
  },
  {
    category: 'Free Trial',
    question: 'How does the 3-day free trial work?',
    answer: 'The 3-day free trial allows you and your child to experience three live 30-minute one-to-one classes without any payment or credit card commitment. You can evaluate the teacher’s teaching style, communication, and patience. You only proceed with formal enrollment if you are 100% satisfied.'
  },
  {
    category: 'Age & Prerequisites',
    question: 'What is the minimum age to start learning Madni Qaida?',
    answer: 'Children as young as 4 to 5 years old can start with our child-friendly Madni Qaida curriculum. Our tutors use visual interactive slides, gentle repetition, and playful encouragement suited to young attention spans. Adults and reverts with zero prior Arabic knowledge are also warmly welcomed.'
  },
  {
    category: 'Schedule & Timing',
    question: 'What class schedules and time zones are supported?',
    answer: 'We provide 24/7 round-the-clock class flexibility across all international time zones, including USA (EST/CST/PST), United Kingdom (GMT/BST), Canada, Europe, Australia (AEST), and the Middle East (GST/AST). You can choose classes 3, 4, or 5 days per week at the exact time of day or evening that fits your family routine.'
  },
  {
    category: 'Curriculum & Rules',
    question: 'Will students learn practical Salah and daily Masnoon Duas?',
    answer: 'Yes! Along with Quran recitation and Tajweed, our students learn the step-by-step method of Wudu, practical Salah (daily prayers with translation), essential Masnoon Duas for daily life, the Six Kalimahs, and basic Islamic manners (Akhlaq).'
  },
  {
    category: 'Equipment',
    question: 'What device or setup do I need to attend online classes?',
    answer: 'Any laptop, desktop PC, iPad/tablet, or smartphone with a reliable internet connection is sufficient. A headset with a microphone is recommended for crystal-clear audio transmission so the teacher can accurately hear the student’s pronunciation nuances.'
  },
  {
    category: 'Progress Tracking',
    question: 'How do parents track their child’s progress?',
    answer: 'We provide structured weekly progress updates via WhatsApp directly to parents. Additionally, monthly evaluations are conducted by our senior academic supervisor, and students receive celebratory certificates upon completing their Qaida, Nazra, or Hifz milestones.'
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleScrollToAdmission = () => {
    const el = document.getElementById('admission');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="faqs" className="py-20 sm:py-24 relative overflow-hidden bg-[#021117] border-t border-[#D4AF37]/20">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#032326] border border-[#D4AF37]/40 text-[#F9E79F] text-xs font-semibold uppercase tracking-wider font-cinzel shadow-inner">
            <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-cinzel text-white">
            Everything You Need To Know About <span className="text-gold-gradient">Learning Quran Online</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Clear answers to common questions about our one-to-one Zoom classes, qualified teachers, flexible schedules, and 3-day free trial.
          </p>
        </div>

        {/* FAQs Accordion List */}
        <div className="space-y-3.5">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen
                    ? 'bg-gradient-to-b from-[#052829] to-[#02161b] border-[#D4AF37]/60 shadow-lg shadow-emerald-950/40'
                    : 'bg-[#031820]/80 hover:bg-[#031d24] border-slate-800 hover:border-[#D4AF37]/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 pr-2">
                    <span className="w-8 h-8 rounded-xl bg-[#021015] border border-[#D4AF37]/30 flex items-center justify-center text-xs font-mono font-bold text-[#F9E79F] shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-base sm:text-lg font-bold font-cinzel text-white leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div className={`p-2 rounded-lg bg-black/40 text-[#D4AF37] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#F9E79F]' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/80 pt-4 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Certified male & female teachers · 3-Day Free Trial available</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#032326] via-[#043335] to-[#021e22] border-2 border-[#D4AF37]/40 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
              Have a question not listed here?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Speak directly with our academic coordinator on WhatsApp for immediate guidance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/923454040452?text=Assalam-o-Alaikum%20Faizan-e-Mustafa%20Academy,%20I%20have%20a%20question%20about%20your%20online%20Quran%20classes."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>

            <button
              onClick={handleScrollToAdmission}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#F9E79F] hover:brightness-110 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <span>Book 3-Day Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

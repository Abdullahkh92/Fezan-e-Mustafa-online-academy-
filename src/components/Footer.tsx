import React from 'react';
import { MessageCircle, Shield, Sparkles, BookOpen, Clock, Phone, Heart, CreditCard } from 'lucide-react';

interface Props {
  onOpenAdmin: () => void;
  onOpenTrial: () => void;
  onOpenPayment: () => void;
}

export const Footer: React.FC<Props> = ({ onOpenAdmin, onOpenTrial, onOpenPayment }) => {
  return (
    <footer className="bg-[#020e14] border-t-2 border-[#D4AF37]/25 text-slate-300 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1 & 2: Brand & Academy Vision (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] via-emerald-600 to-teal-800 p-[1.5px] shadow-md shadow-emerald-950/50">
                <div className="w-full h-full bg-[#03151E] rounded-[9px] flex items-center justify-center">
                  <span className="font-amiri text-xl text-[#F9E79F] font-bold select-none">ف</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white font-cinzel">
                  Faizan-e-Mustafa <span className="text-[#D4AF37]">Academy</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase font-cinzel">
                  Online Quran & Islamic Studies
                </span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              An international online Quranic and Islamic educational institution delivering authentic, one-to-one recitation, Tajweed, and character education to Muslim families worldwide.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/923454040452?text=Assalamu%20Alaikum!%20I%20am%20contacting%20Faizan-e-Mustafa%20Online%20Academy."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 rounded-xl hover:bg-emerald-900/80 transition-all shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                <span className="font-mono">WhatsApp: 0345-4040452</span>
              </a>

              <button
                onClick={onOpenTrial}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F9E79F] to-[#D4AF37] hover:brightness-110 rounded-xl shadow-md font-cinzel uppercase tracking-wider cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Free Trial</span>
              </button>
            </div>
          </div>

          {/* Col 3: Academic Programs (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-cinzel flex items-center gap-2 border-b border-slate-800 pb-2">
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>Academic Programs</span>
            </h4>
            <ul className="space-y-2.5 text-slate-300 text-xs sm:text-sm">
              <li><a href="#courses" className="hover:text-[#F9E79F] transition-colors block py-0.5">Madni Qaida for Beginners</a></li>
              <li><a href="#courses" className="hover:text-[#F9E79F] transition-colors block py-0.5">Quran Reading (Nazra)</a></li>
              <li><a href="#courses" className="hover:text-[#F9E79F] transition-colors block py-0.5">Quran with Tajweed Mastery</a></li>
              <li><a href="#courses" className="hover:text-[#F9E79F] transition-colors block py-0.5">Hifz-ul-Quran Memorization</a></li>
              <li><a href="#courses" className="hover:text-[#F9E79F] transition-colors block py-0.5">Essential Islamic Studies</a></li>
            </ul>
          </div>

          {/* Col 4: Quick Links (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-cinzel flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2.5 text-slate-300 text-xs sm:text-sm">
              <li><a href="#about" className="hover:text-[#F9E79F] transition-colors block py-0.5">About Academy</a></li>
              <li><a href="#online-classes" className="hover:text-[#F9E79F] transition-colors block py-0.5">Online Zoom Classes</a></li>
              <li><a href="#why-choose-us" className="hover:text-[#F9E79F] transition-colors block py-0.5">Why Choose Us</a></li>
              <li><a href="#faqs" className="hover:text-[#F9E79F] transition-colors block py-0.5">FAQs</a></li>
              <li><button onClick={onOpenPayment} className="hover:text-[#F9E79F] transition-colors text-left block py-0.5 cursor-pointer">Fee Payment (Optional)</button></li>
              <li><button onClick={onOpenTrial} className="hover:text-[#F9E79F] transition-colors text-left block py-0.5 cursor-pointer">Free 3-Day Trial</button></li>
              <li><a href="#contact" className="hover:text-[#F9E79F] transition-colors block py-0.5">Contact Us</a></li>
            </ul>
          </div>

          {/* Col 5: Administration & Support (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-cinzel flex items-center gap-2 border-b border-slate-800 pb-2">
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              <span>Administration & Portal</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs">
              Admissions desk active 24/7 across US, UK, Canada, Australia, and Middle East time zones for schedule assignments.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-[#031d24] border border-slate-700/80 hover:border-[#D4AF37]/70 rounded-xl transition-all shadow-md font-cinzel cursor-pointer"
              >
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <span>Admin Portal Login</span>
              </button>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Response time: &lt; 2 hours on WhatsApp</span>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="mt-14 pt-8 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} Faizan-e-Mustafa Online Academy. All rights reserved.</span>
            <span>·</span>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-[#F9E79F] transition-colors">Sitemap.xml</a>
            <span>·</span>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:text-[#F9E79F] transition-colors">Robots.txt</a>
          </div>
          <p className="font-amiri text-base text-[#F9E79F] select-none">
            رَبِّ زِدْنِي عِلْمًا — "My Lord, increase me in knowledge." (Surah Ta-Ha: 114)
          </p>
        </div>

      </div>
    </footer>
  );
};

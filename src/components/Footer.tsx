import React from 'react';
import { MessageCircle, ShieldCheck } from 'lucide-react';

interface Props {
  onOpenAdmin: () => void;
  onOpenTrial: () => void;
}

export const Footer: React.FC<Props> = ({ onOpenAdmin, onOpenTrial }) => {
  return (
    <footer className="bg-[#020e14] border-t border-[#D4AF37]/20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand & Academy Vision */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-[#D4AF37] p-[1.5px]">
                <div className="w-full h-full bg-[#03151E] rounded-[9px] flex items-center justify-center">
                  <span className="font-amiri text-lg text-[#F9E79F] font-bold">ف</span>
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-cinzel">
                Faizan-e-Mustafa <span className="text-[#D4AF37]">Academy</span>
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed max-w-sm">
              An international online Quranic and Islamic educational institution delivering authentic, one-to-one recitation, Tajweed, and character education to Muslim families worldwide.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://wa.me/923454040452?text=Assalamu%20Alaikum!%20I%20am%20contacting%20Faizan-e-Mustafa%20Online%20Academy."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-lg hover:bg-emerald-900/60 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: 0345-4040452</span>
              </a>
            </div>
          </div>

          {/* Col 3: Academic Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-cinzel">
              Programs
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#courses" className="hover:text-[#F9E79F] transition-colors">Madni Qaida for Beginners</a></li>
              <li><a href="#courses" className="hover:text-[#F9E79F] transition-colors">Quran Reading (Nazra)</a></li>
              <li><a href="#courses" className="hover:text-[#F9E79F] transition-colors">Quran with Tajweed</a></li>
              <li><a href="#courses" className="hover:text-[#F9E79F] transition-colors">Hifz-ul-Quran Memorization</a></li>
              <li><a href="#courses" className="hover:text-[#F9E79F] transition-colors">Basic Islamic Studies</a></li>
            </ul>
          </div>

          {/* Col 4: Academy Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-cinzel">
              Quick Links
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#about" className="hover:text-[#F9E79F] transition-colors">About Our Academy</a></li>
              <li><a href="#online-classes" className="hover:text-[#F9E79F] transition-colors">Online Zoom Classes</a></li>
              <li><a href="#why-choose-us" className="hover:text-[#F9E79F] transition-colors">Why Choose Us</a></li>
              <li><button onClick={onOpenTrial} className="hover:text-[#F9E79F] transition-colors text-left">Book 3-Day Free Trial</button></li>
              <li><a href="#contact" className="hover:text-[#F9E79F] transition-colors">Contact Academy</a></li>
            </ul>
          </div>

          {/* Col 5: Administration & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-cinzel">
              Administration
            </h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              Admissions desk active 24/7 for student evaluations and schedule assignments.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-[#D4AF37]/50 rounded-lg transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Faizan-e-Mustafa Online Academy. All rights reserved.
          </p>
          <p className="font-amiri text-sm text-[#F9E79F]">
            رَبِّ زِدْنِي عِلْمًا — "My Lord, increase me in knowledge."
          </p>
        </div>

      </div>
    </footer>
  );
};

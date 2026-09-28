import React, { useState } from 'react';
import { Menu, X, ShieldCheck, MessageCircle } from 'lucide-react';

interface Props {
  onOpenTrial: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<Props> = ({ onOpenTrial, onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#03151E]/90 backdrop-blur-md border-b border-[#D4AF37]/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Single element wordmark */}
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-[#D4AF37] p-[1.5px] shadow-lg shadow-emerald-950/50">
            <div className="w-full h-full bg-[#03151E] rounded-[10px] flex items-center justify-center">
              <span className="font-amiri text-xl text-[#F9E79F] font-bold">ف</span>
            </div>
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white font-cinzel">
            Faizan-e-Mustafa <span className="text-[#D4AF37]">Academy</span>
          </span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#about" className="hover:text-[#F9E79F] transition-colors">
            About
          </a>
          <a href="#courses" className="hover:text-[#F9E79F] transition-colors">
            Courses
          </a>
          <a href="#online-classes" className="hover:text-[#F9E79F] transition-colors">
            Online Classes
          </a>
          <a href="#why-choose-us" className="hover:text-[#F9E79F] transition-colors">
            Why Choose Us
          </a>
          <a href="#admission" className="hover:text-[#F9E79F] transition-colors">
            Admissions
          </a>
          <a href="#contact" className="hover:text-[#F9E79F] transition-colors">
            Contact
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://wa.me/923454040452?text=Assalamu%20Alaikum!%20I%20want%20to%20inquire%20about%20Quran%20classes%20at%20Faizan-e-Mustafa%20Online%20Academy."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-lg transition-colors whitespace-nowrap"
            title="Chat on WhatsApp: 0345-4040452"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>0345-4040452</span>
          </a>

          <button
            onClick={onOpenTrial}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#F9E79F] via-[#D4AF37] to-[#AA771C] hover:brightness-110 rounded-lg shadow-md shadow-[#D4AF37]/20 transition-all font-cinzel whitespace-nowrap"
          >
            Free 3-Day Trial
          </button>

          <button
            onClick={onOpenAdmin}
            className="p-2 text-slate-400 hover:text-[#D4AF37] hover:bg-slate-800/60 rounded-lg transition-colors"
            title="Academy Admin Portal"
            aria-label="Admin Portal"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={onOpenTrial}
            className="px-3 py-1.5 text-[11px] font-semibold text-slate-950 bg-gradient-to-r from-[#F9E79F] to-[#D4AF37] rounded-lg font-cinzel"
          >
            Free Trial
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#021017] border-b border-[#D4AF37]/20 px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#F9E79F] py-1 border-b border-slate-800/60"
            >
              About Academy
            </a>
            <a
              href="#courses"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#F9E79F] py-1 border-b border-slate-800/60"
            >
              All Courses
            </a>
            <a
              href="#online-classes"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#F9E79F] py-1 border-b border-slate-800/60"
            >
              Online Classes & Zoom
            </a>
            <a
              href="#why-choose-us"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#F9E79F] py-1 border-b border-slate-800/60"
            >
              Why Choose Us
            </a>
            <a
              href="#admission"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#F9E79F] py-1 border-b border-slate-800/60"
            >
              Admission & Free Trial Form
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#F9E79F] py-1"
            >
              Contact Us (0345-4040452)
            </a>
          </nav>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="https://wa.me/923454040452?text=Assalamu%20Alaikum!%20I%20want%20to%20inquire%20about%20Quran%20classes%20at%20Faizan-e-Mustafa%20Online%20Academy."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 rounded-xl"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: 0345-4040452</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center justify-center gap-2 w-full py-2 text-xs text-slate-400 hover:text-white border border-slate-800 rounded-xl"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Academy Administrator Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState } from 'react';
import { Menu, X, Shield, MessageCircle, Sparkles, CreditCard } from 'lucide-react';

interface Props {
  onOpenTrial: () => void;
  onOpenAdmin: () => void;
  onOpenPayment: () => void;
}

export const Navbar: React.FC<Props> = ({ onOpenTrial, onOpenAdmin, onOpenPayment }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Courses', href: '#courses' },
    { label: 'Online Classes', href: '#online-classes' },
    { label: 'Why Choose Us', href: '#why-choose-us' },
    { label: 'Admissions', href: '#admission' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Payment', href: '#payment', isAction: true },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#03151E]/95 backdrop-blur-md border-b border-[#D4AF37]/25 transition-all shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark */}
        <a href="#hero" className="flex items-center gap-3 group shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37] via-emerald-600 to-teal-800 p-[1.5px] shadow-md shadow-emerald-950/60">
            <div className="w-full h-full bg-[#021319] rounded-[10px] flex items-center justify-center">
              <span className="font-amiri text-2xl text-[#F9E79F] font-bold select-none">ف</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white font-cinzel leading-tight group-hover:text-[#F9E79F] transition-colors">
              Faizan-e-Mustafa <span className="text-[#D4AF37]">Academy</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase font-cinzel">
              Online Quran & Islamic Studies
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links (visible on desktop >= 1024px) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-200">
          {navLinks.map((link) => (
            link.label === 'Payment' ? (
              <button
                key={link.label}
                type="button"
                onClick={onOpenPayment}
                className="hover:text-[#F9E79F] transition-colors py-1 relative group font-medium cursor-pointer"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </button>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#F9E79F] transition-colors py-1 relative group font-medium"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </a>
            )
          ))}
        </nav>

        {/* Zone 3: Primary Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {/* WhatsApp Direct Support */}
          <a
            href="https://wa.me/923454040452?text=Assalamu%20Alaikum!%20I%20want%20to%20inquire%20about%20Quran%20classes%20at%20Faizan-e-Mustafa%20Online%20Academy."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 rounded-xl transition-all shadow-sm whitespace-nowrap cursor-pointer"
            title="Direct WhatsApp Support: +92 345 4040452"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
            <span className="font-mono">0345-4040452</span>
          </a>

          {/* Primary CTA: 3-Day Free Trial */}
          <button
            onClick={onOpenTrial}
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F9E79F] via-[#D4AF37] to-[#AA771C] hover:brightness-110 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all font-cinzel uppercase tracking-wider whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>3-Day Free Trial</span>
          </button>

          {/* Non-intrusive Optional Payment Portal Link */}
          <button
            onClick={onOpenPayment}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-[#F9E79F] bg-[#02141a] hover:bg-[#031d24] border border-slate-700/80 hover:border-[#D4AF37]/50 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            title="Make a Payment (Optional)"
            aria-label="Payment Portal"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-cinzel text-[11px]">Payment</span>
          </button>

          {/* Clearly Visible Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-[#F9E79F] bg-[#02141a] hover:bg-[#031d24] border border-slate-700/80 hover:border-[#D4AF37]/50 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            title="Academy Administrator Portal"
            aria-label="Admin Portal"
          >
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-cinzel text-[11px]">Admin</span>
          </button>
        </div>

        {/* Tablet & Mobile Header Right Elements (visible < 1024px) */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Quick Trial CTA on mobile/tablet */}
          <button
            onClick={onOpenTrial}
            className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F9E79F] to-[#D4AF37] hover:brightness-110 rounded-lg font-cinzel whitespace-nowrap shadow-sm cursor-pointer"
          >
            Free Trial
          </button>

          {/* Mobile Admin Quick Icon */}
          <button
            onClick={onOpenAdmin}
            className="p-2 text-slate-300 hover:text-[#D4AF37] bg-slate-900/60 border border-slate-700/60 rounded-lg cursor-pointer"
            title="Admin Portal"
            aria-label="Admin Portal"
          >
            <Shield className="w-4 h-4 text-[#D4AF37]" />
          </button>

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-200 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#D4AF37]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Responsive Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#021217] border-b border-[#D4AF37]/25 px-6 py-6 space-y-5 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-200">
            {navLinks.map((link) => (
              link.label === 'Payment' ? (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPayment();
                  }}
                  className="py-2 px-3 rounded-lg hover:bg-slate-800/50 text-[#F9E79F] hover:text-white transition-colors font-cinzel text-left flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                  <span>Fee Payment (Optional)</span>
                </button>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-lg hover:bg-slate-800/50 hover:text-[#F9E79F] transition-colors font-cinzel"
                >
                  {link.label}
                </a>
              )
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-800 space-y-3">
            <a
              href="https://wa.me/923454040452?text=Assalamu%20Alaikum!%20I%20want%20to%20inquire%20about%20Quran%20classes%20at%20Faizan-e-Mustafa%20Online%20Academy."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 rounded-xl"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us: 0345-4040452</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrial();
              }}
              className="w-full py-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F9E79F] via-[#D4AF37] to-[#AA771C] rounded-xl font-cinzel uppercase tracking-wider shadow-md"
            >
              Register for 3-Day Free Trial
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700/80 rounded-xl font-cinzel flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              <span>Academy Administrator Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

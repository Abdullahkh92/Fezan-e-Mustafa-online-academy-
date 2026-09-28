import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <aside aria-label="WhatsApp quick contact" className="fixed bottom-5 right-5 z-40">
      <a
        href="https://wa.me/923454040452?text=Assalamu%20Alaikum!%20I%20am%20interested%20in%20online%20Quran%20classes%20at%20Faizan-e-Mustafa%20Online%20Academy."
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full shadow-2xl shadow-emerald-950/80 border border-emerald-400/40 transition-all hover:scale-105"
        title="Chat with us on WhatsApp: 0345-4040452"
        aria-label="Chat on WhatsApp 0345-4040452"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F9E79F] rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F9E79F] rounded-full" />
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[10px] text-emerald-100 font-medium uppercase tracking-wider leading-none">
            Online Quran Desk
          </span>
          <span className="text-xs font-bold font-mono leading-tight mt-0.5">
            0345-4040452
          </span>
        </div>
      </a>
    </aside>
  );
};

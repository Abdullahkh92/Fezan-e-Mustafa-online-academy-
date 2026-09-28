import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !whatsapp.trim()) {
      setError('Please provide your name and WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          studentName: name.trim(),
          parentName: name.trim(),
          whatsapp: whatsapp.trim(),
          email: email.trim(),
          course: 'General Academy Inquiry',
          timing: 'Flexible',
          message: message.trim()
        })
      });

      if (!res.ok) {
        throw new Error('Failed to send message. Please retry or chat on WhatsApp.');
      }

      setSubmitted(true);
      setName('');
      setWhatsapp('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-islamic-pattern relative overflow-hidden border-t border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider font-cinzel">
            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-white">
            Contact <span className="text-gold-gradient">Faizan-e-Mustafa Academy</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Have questions about syllabus, class schedules, or trial arrangements? Our administrative team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Prominent WhatsApp & Academy Info */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Super Prominent WhatsApp Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#063327] via-[#042426] to-[#02141a] border-2 border-[#D4AF37]/60 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/20">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold font-cinzel">
                    Official WhatsApp Support
                  </span>
                  <h3 className="text-xl font-bold font-cinzel text-white">
                    Direct Inquiry & Admissions
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Connect directly with our admissions coordinator on WhatsApp for immediate class slot booking and fee details.
              </p>

              {/* Big Phone Number Display */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#D4AF37]/40 mb-6 text-center">
                <span className="text-xs text-slate-400 block font-cinzel">WhatsApp Number</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#F9E79F] font-mono tracking-wider">
                  0345-4040452
                </span>
                <span className="text-[11px] text-emerald-400 block mt-1">
                  International: +92 345 4040452
                </span>
              </div>

              {/* One Click WhatsApp Button */}
              <a
                href="https://wa.me/923454040452?text=Assalamu%20Alaikum!%20I%20am%20contacting%20Faizan-e-Mustafa%20Online%20Academy%20for%20admission%20details."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 text-sm font-bold text-slate-950 bg-gradient-to-r from-[#F9E79F] via-[#D4AF37] to-[#AA771C] hover:brightness-110 rounded-xl shadow-xl shadow-[#D4AF37]/25 transition-all font-cinzel"
              >
                <MessageCircle className="w-5 h-5 text-slate-950" />
                <span>Chat on WhatsApp Now</span>
              </a>
            </div>

            {/* Additional Contact Channels */}
            <div className="p-6 rounded-2xl bg-[#031c22]/80 border border-emerald-500/20 space-y-4 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <span className="text-white font-semibold block">Academic Hours:</span>
                  <span>24 Hours / 7 Days a week (Worldwide Time Zones)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <span className="text-white font-semibold block">Email Inquiries:</span>
                  <span>admissions@faizanemustafa.academy</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-white font-semibold block">Free Consultation:</span>
                  <span>Complimentary recitation level assessment available anytime</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-gradient-to-b from-[#062425]/90 to-[#021319]/95 border border-[#D4AF37]/35 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold font-cinzel text-white mb-1">
                Send an Online Message
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Your message is stored securely in our database and our team will respond within 2-4 hours.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold font-cinzel text-white">Message Dispatched!</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Thank you. Your message has been logged in our database. You may also ping us on WhatsApp at 0345-4040452 for instant response.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    Send another query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 font-cinzel mb-1">
                      Your Name <span className="text-[#D4AF37]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abdullah Khan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 font-cinzel mb-1">
                        WhatsApp Number <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+92 345 4040452"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 font-cinzel mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 font-cinzel mb-1">
                      Your Inquiry / Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please let us know your requirements, suitable timings, or questions regarding our teachers..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F9E79F] via-[#D4AF37] to-[#AA771C] hover:brightness-110 disabled:opacity-50 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all font-cinzel flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-slate-950" />
                        <span>Submit Inquiry Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between text-[11px] text-slate-400">
              <span>Faizan-e-Mustafa Online Academy Admissions Office</span>
              <span className="text-[#D4AF37]">WhatsApp: 0345-4040452</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

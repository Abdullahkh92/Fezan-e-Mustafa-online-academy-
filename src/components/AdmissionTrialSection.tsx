import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { SubmissionType } from '../types/academy';
import { COURSES_DATA } from '../data/coursesData';
import { CheckCircle2, AlertCircle, Loader2, Sparkles, Send, MessageCircle, PartyPopper } from 'lucide-react';

interface Props {
  preSelectedCourse?: string;
  onSuccessSubmission?: () => void;
}

export const AdmissionTrialSection: React.FC<Props> = ({ preSelectedCourse = '', onSuccessSubmission }) => {
  const [formType, setFormType] = useState<SubmissionType>('free_trial');

  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState(preSelectedCourse || COURSES_DATA[0].title);
  const [timing, setTiming] = useState('Evening (5:00 PM - 8:00 PM)');
  const [genderPreference, setGenderPreference] = useState<'Any' | 'Male Teacher' | 'Female Teacher'>('Any');
  const [message, setMessage] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ id: string; studentName: string; course: string; whatsapp: string } | null>(null);

  // Sync if preSelectedCourse changes
  React.useEffect(() => {
    if (preSelectedCourse) {
      setCourse(preSelectedCourse);
    }
  }, [preSelectedCourse]);

  // Luxury Islamic Theme Confetti Celebration Effect
  const fireCelebrationConfetti = () => {
    const goldAndEmeraldColors = ['#D4AF37', '#F9E79F', '#10B981', '#059669', '#FFFFFF', '#14B8A6'];

    // 1. Initial joyful burst from center
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: goldAndEmeraldColors,
      ticks: 250,
      gravity: 1.1,
      scalar: 1.15
    });

    // 2. Left inward cannon
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.65 },
        colors: goldAndEmeraldColors,
        ticks: 200
      });
    }, 180);

    // 3. Right inward cannon
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.65 },
        colors: goldAndEmeraldColors,
        ticks: 200
      });
    }, 360);

    // 4. Golden stars shimmer burst
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#F9E79F', '#FDE047', '#FFFFFF'],
        shapes: ['star', 'circle'],
        scalar: 1.3,
        ticks: 220
      });
    }, 550);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!studentName.trim()) {
      setErrorMessage('Please enter the student\'s full name.');
      return;
    }

    if (!whatsapp.trim()) {
      setErrorMessage('Please provide a valid WhatsApp number for class coordination.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: formType,
          studentName: studentName.trim(),
          parentName: parentName.trim() || studentName.trim(),
          age: age.trim(),
          country: country.trim(),
          whatsapp: whatsapp.trim(),
          email: email.trim(),
          course,
          timing,
          genderPreference,
          message: message.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application. Please try again.');
      }

      setSuccessData({
        id: data.referenceId || data.record?.id || 'FMA-REF',
        studentName: data.studentName || data.record?.studentName || studentName,
        course: data.course || data.record?.course || course,
        whatsapp: data.whatsapp || data.record?.whatsapp || whatsapp
      });

      // Fire celebratory confetti effect immediately
      fireCelebrationConfetti();

      if (onSuccessSubmission) {
        onSuccessSubmission();
      }

    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected network error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSuccessData(null);
    setStudentName('');
    setParentName('');
    setAge('');
    setWhatsapp('');
    setEmail('');
    setMessage('');
    setErrorMessage(null);
  };

  return (
    <section id="admission" className="py-20 bg-gradient-to-b from-[#021017] via-[#031c22] to-[#02141a] relative overflow-hidden border-t border-[#D4AF37]/15">
      
      {/* Decorative luxury Islamic background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider font-cinzel">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Admissions & Free Evaluation
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-white">
            Register for a <span className="text-gold-gradient">3-Day Free Trial</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Experience our interactive one-to-one Zoom lessons with no payment obligations. Evaluate the teacher, curriculum, and class format before enrolling.
          </p>
        </div>

        {/* Success Card with Animation & Celebration */}
        {successData ? (
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#073031] via-[#041f26] to-[#021319] border-2 border-[#D4AF37]/70 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            
            {/* Top Celebration Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-[#D4AF37]/30 to-emerald-500/20 border border-[#D4AF37]/50 text-[#F9E79F] text-xs font-semibold uppercase tracking-wider font-cinzel shadow-lg">
              <PartyPopper className="w-4 h-4 text-[#D4AF37] animate-bounce" />
              <span>Application Successfully Registered</span>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>

            {/* Glowing animated checkmark */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping opacity-40" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-900/60 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-xl shadow-emerald-500/30">
                <CheckCircle2 className="w-11 h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-amiri text-3xl text-[#F9E79F] block tracking-wide">
                الْحَمْدُ لِلَّهِ
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
                Application Received Successfully!
              </h3>
              <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{successData.studentName}</strong>. Your application for <strong className="text-[#F9E79F]">{successData.course}</strong> has been secured in our academic system.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 border border-[#D4AF37]/30 text-xs text-slate-400">
                <span>Application Reference ID:</span>
                <span className="font-mono text-emerald-300 font-bold tracking-wide">{successData.id}</span>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="p-5 rounded-2xl bg-[#031d24]/90 border border-emerald-500/40 max-w-md mx-auto text-left space-y-2.5 text-xs text-slate-300 shadow-inner">
              <p className="font-bold text-white font-cinzel flex items-center gap-2 text-sm border-b border-emerald-500/20 pb-1.5">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>What Happens Next?</span>
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <span>Our Academic Coordinator evaluates your requested schedule and teacher preference.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <span>We send your Zoom class access credentials to <strong className="text-emerald-300 font-mono">{successData.whatsapp}</strong> on WhatsApp within 2 hours.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <span>Attend your 3-day 1-on-1 trial completely free with zero payment commitment.</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <a
                href={`https://wa.me/923454040452?text=Assalamu%20Alaikum!%20I%20just%20submitted%20an%20application%20for%20${encodeURIComponent(successData.studentName)}%20(Ref:%20${successData.id})%20for%20${encodeURIComponent(successData.course)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F9E79F] via-[#D4AF37] to-[#AA771C] hover:brightness-110 rounded-xl shadow-lg shadow-[#D4AF37]/25 transition-all font-cinzel cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Confirm on WhatsApp Now (+92 345 4040452)</span>
              </a>

              <button
                type="button"
                onClick={fireCelebrationConfetti}
                className="px-4 py-3 text-xs font-semibold text-amber-300 hover:text-white bg-amber-950/40 hover:bg-amber-900/50 rounded-xl border border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Celebrate again"
              >
                <PartyPopper className="w-4 h-4" />
                <span>Replay Confetti</span>
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 text-xs font-medium text-slate-300 hover:text-white rounded-xl border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          /* Form Container */
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#062425]/95 via-[#031d22]/95 to-[#021319]/95 border border-[#D4AF37]/35 shadow-2xl">
            
            {/* Interactive Mode Toggle */}
            <div className="flex items-center p-1.5 bg-[#021217] rounded-xl border border-slate-800/80 mb-8 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setFormType('free_trial')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all font-cinzel cursor-pointer ${
                  formType === 'free_trial'
                    ? 'bg-gradient-to-r from-[#F9E79F] to-[#D4AF37] text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Book 3-Day Free Trial
              </button>
              <button
                type="button"
                onClick={() => setFormType('admission')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all font-cinzel cursor-pointer ${
                  formType === 'admission'
                    ? 'bg-gradient-to-r from-[#F9E79F] to-[#D4AF37] text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Official Admission Form
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Student Name & Parent Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Student Full Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Zayd"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tariq Mahmood (or Self if adult)"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Age, Country, WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Student Age
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8 years (or Adult)"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Country of Residence
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  >
                    <option value="United Kingdom">United Kingdom (UK)</option>
                    <option value="United States">United States (USA)</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Saudi Arabia">Saudi Arabia (KSA)</option>
                    <option value="United Arab Emirates">UAE (Dubai/Abu Dhabi)</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Oman">Oman</option>
                    <option value="Other">Other Country</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    WhatsApp Number <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +44 7911 123456"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Course & Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Select Desired Course <span className="text-[#D4AF37]">*</span>
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  >
                    {COURSES_DATA.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Preferred Class Timing Slot
                  </label>
                  <select
                    value={timing}
                    onChange={(e) => setTiming(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  >
                    <option value="Morning (7:00 AM - 11:00 AM)">Morning (7:00 AM - 11:00 AM your local time)</option>
                    <option value="Afternoon (1:00 PM - 5:00 PM)">Afternoon (1:00 PM - 5:00 PM)</option>
                    <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM - Most Popular)</option>
                    <option value="Night (8:00 PM - 11:00 PM)">Night (8:00 PM - 11:00 PM)</option>
                    <option value="Weekend Only">Weekend Only (Sat & Sun)</option>
                    <option value="Custom Flexible">Custom Flexible Slot</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Teacher Gender Preference & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Teacher Gender Preference
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Any', 'Male Teacher', 'Female Teacher'] as const).map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setGenderPreference(pref)}
                        className={`py-2 px-2 text-xs rounded-xl border text-center transition-all cursor-pointer ${
                          genderPreference === pref
                            ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F9E79F] font-semibold'
                            : 'border-slate-800 bg-[#021319] text-slate-400 hover:text-white'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Email Address <span className="text-slate-500 font-normal text-[11px]">(Optional for Zoom link)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              {/* Row 5: Notes / Prior Quran Learning Background */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                  Prior Quran Background / Specific Learning Goals <span className="text-slate-500 font-normal text-[11px]">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Child has never learned Arabic letters before / Finished Qaida and wants Tajweed / Adult looking for flexible weekend Hifz..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 text-sm font-bold text-slate-950 bg-gradient-to-r from-[#F9E79F] via-[#D4AF37] to-[#AA771C] hover:brightness-110 disabled:opacity-60 rounded-xl shadow-xl shadow-[#D4AF37]/20 transition-all font-cinzel uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                      <span>Registering Application & Securing Slot...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>
                        {formType === 'free_trial'
                          ? 'Confirm 3-Day Free Trial (No Payment Required)'
                          : 'Submit Official Admission Application'}
                      </span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-3">
                  🔒 Safe & Confidential. We will never share your family&apos;s contact details.
                </p>
              </div>

            </form>
          </div>
        )}

      </div>
    </section>
  );
};

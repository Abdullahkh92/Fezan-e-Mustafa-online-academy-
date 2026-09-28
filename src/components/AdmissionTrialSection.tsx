import React, { useState } from 'react';
import { SubmissionType } from '../types/academy';
import { COURSES_DATA } from '../data/coursesData';
import { CheckCircle2, AlertCircle, Loader2, Sparkles, Send, MessageCircle } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!studentName.trim()) {
      setErrorMessage('Please enter the student\'s name.');
      return;
    }
    if (!whatsapp.trim()) {
      setErrorMessage('Please enter a valid WhatsApp phone number with country code.');
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
        id: data.record.id,
        studentName: data.record.studentName,
        course: data.record.course,
        whatsapp: data.record.whatsapp
      });

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

        {/* Success Card */}
        {successData ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#06292a] via-[#041d24] to-[#021319] border-2 border-[#D4AF37]/60 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="font-amiri text-2xl text-[#F9E79F]">
                الْحَمْدُ لِلَّهِ
              </span>
              <h3 className="text-2xl font-bold font-cinzel text-white">
                Application Received Successfully!
              </h3>
              <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{successData.studentName}</strong>. Your request for <strong className="text-[#F9E79F]">{successData.course}</strong> has been stored securely in our academy database.
              </p>
              <p className="text-xs text-slate-400">
                Application Reference ID: <span className="font-mono text-emerald-300">{successData.id}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 max-w-md mx-auto text-left space-y-2 text-xs text-slate-300">
              <p className="font-bold text-white font-cinzel">What happens next?</p>
              <p>1. Our Academic Coordinator will verify your requested time slot.</p>
              <p>2. We will contact your WhatsApp at <span className="font-bold text-emerald-300">{successData.whatsapp}</span> within 2 hours with the Zoom link and teacher profile.</p>
              <p>3. Attend your 3-day trial free of charge.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={`https://wa.me/923454040452?text=Assalamu%20Alaikum!%20I%20just%20submitted%20an%20application%20for%20${encodeURIComponent(successData.studentName)}%20(Ref:%20${successData.id})%20for%20${encodeURIComponent(successData.course)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#F9E79F] via-[#D4AF37] to-[#AA771C] hover:brightness-110 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all font-cinzel"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp Now (0345-4040452)</span>
              </a>

              <button
                onClick={resetForm}
                className="px-6 py-3 text-xs font-medium text-slate-300 hover:text-white rounded-xl border border-slate-700 hover:border-slate-500 transition-colors"
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
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all font-cinzel ${
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
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all font-cinzel ${
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
              <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Student Name & Parent Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 font-cinzel mb-1.5">
                    Student Full Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zayd Al-Mansoor"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 font-cinzel mb-1.5">
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tariq Al-Mansoor (or Self)"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Age, Country, WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 font-cinzel mb-1.5">
                    Student Age
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8 or Adult"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 font-cinzel mb-1.5">
                    Country of Residence
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700/80 text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Other">Other Country</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 font-cinzel mb-1.5">
                    WhatsApp Number <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 345 4040452"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Email & Course Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 font-cinzel mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 font-cinzel mb-1.5">
                    Selected Course <span className="text-[#D4AF37]">*</span>
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700/80 text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  >
                    {COURSES_DATA.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                    <option value="Custom / Multiple Courses">Custom / Multiple Courses</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Preferred Timing & Teacher Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 font-cinzel mb-1.5">
                    Preferred Class Timing
                  </label>
                  <select
                    value={timing}
                    onChange={(e) => setTiming(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700/80 text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  >
                    <option value="Morning (6:00 AM - 10:00 AM)">Morning (6:00 AM - 10:00 AM)</option>
                    <option value="Afternoon (1:00 PM - 5:00 PM)">Afternoon (1:00 PM - 5:00 PM)</option>
                    <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                    <option value="Night (8:00 PM - 11:00 PM)">Night (8:00 PM - 11:00 PM)</option>
                    <option value="Weekend Special (Sat & Sun)">Weekend Special (Sat & Sun)</option>
                    <option value="Flexible / Custom Timing">Flexible / Any Available Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 font-cinzel mb-1.5">
                    Teacher Gender Preference
                  </label>
                  <select
                    value={genderPreference}
                    onChange={(e) => setGenderPreference(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700/80 text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  >
                    <option value="Any">No Preference (Any Qualified Teacher)</option>
                    <option value="Male Teacher">Male Teacher (Qari / Alim)</option>
                    <option value="Female Teacher">Female Teacher (Muallima / Alima)</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 font-cinzel mb-1.5">
                  Special Notes, Prior Quran Knowledge, or Questions
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us if the student has finished Qaida before, needs gentle pacing, or has specific target goals..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Your information is encrypted & saved securely in our academy database.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F9E79F] via-[#D4AF37] to-[#AA771C] hover:brightness-110 disabled:opacity-50 rounded-xl shadow-lg shadow-[#D4AF37]/25 transition-all font-cinzel cursor-pointer uppercase tracking-wider"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>{formType === 'free_trial' ? 'Confirm 3-Day Free Trial' : 'Submit Admission Application'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import {
  Building2,
  QrCode,
  Copy,
  Check,
  Download,
  Maximize2,
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  ArrowLeft,
  MessageCircle,
  HelpCircle,
  Info,
  Lock,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Loader2
} from 'lucide-react';

interface Props {
  onBackToHome: () => void;
}

export const PaymentPage: React.FC<Props> = ({ onBackToHome }) => {
  // Copy state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Full Screen QR Modal
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Toggle Form Visibility
  const [showForm, setShowForm] = useState(false);

  // Payment Confirmation Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<{
    referenceNumber: string;
    customerName: string;
    amount: string;
    status: string;
    submissionDate: string;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Verification Status Lookup
  const [lookupRef, setLookupRef] = useState('');
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Bank Info Constants
  const BANK_INFO = {
    bankName: 'United Bank Limited (UBL)',
    accountTitle: 'Arif Hussain',
    iban: 'PK56UNIL0109000270058839',
    accountNumber: '0109000270058839',
    branch: 'UBL Digital / Online Banking',
    qrPath: '/images/ubl_official_payment_qr.png'
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !mobileNumber.trim() || !amountPaid.trim() || !transactionId.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: fullName.trim(),
          mobileNumber: mobileNumber.trim(),
          amount: amountPaid.trim(),
          transactionId: transactionId.trim(),
          paymentDate,
          screenshotUrl: screenshotData || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit payment details.');
      }

      setSubmittedRecord({
        referenceNumber: data.record.referenceNumber,
        customerName: data.record.customerName,
        amount: data.record.amount,
        status: data.record.status,
        submissionDate: data.record.submissionDate
      });

      // Clear form inputs
      setFullName('');
      setMobileNumber('');
      setAmountPaid('');
      setTransactionId('');
      setScreenshotData(null);
      setScreenshotName('');
    } catch (err: any) {
      setFormError(err.message || 'Error submitting payment verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupRef.trim()) return;

    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);

    try {
      const res = await fetch(`/api/payments/status/${encodeURIComponent(lookupRef.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Payment reference not found.');
      }
      setLookupResult(data);
    } catch (err: any) {
      setLookupError(err.message || 'Reference not found. Please double-check the code.');
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020e14] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#FFF8E7]">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#03151E]/95 backdrop-blur-md border-b border-[#D4AF37]/25 shadow-lg shadow-black/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <button
            onClick={onBackToHome}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] via-emerald-600 to-teal-800 p-[1.5px] shadow-md shadow-emerald-950/60">
              <div className="w-full h-full bg-[#021319] rounded-[10px] flex items-center justify-center">
                <span className="font-amiri text-2xl text-[#F9E79F] font-bold select-none">ف</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white font-cinzel leading-tight group-hover:text-[#F9E79F] transition-colors">
                Faizan-e-Mustafa <span className="text-[#D4AF37]">Academy</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase font-cinzel">
                Official Payment Portal
              </span>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
              <span>Back to Home</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Payment Container */}
      <main className="flex-1 py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        
        {/* Page Title & Subtitle */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider font-cinzel shadow-inner">
            <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Official Bank Payment Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-cinzel text-white tracking-tight">
            Make a <span className="text-gold-gradient">Payment</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Use the payment details below to make a bank transfer. Payment is optional.
          </p>

          {/* Non-intrusive Optional Payment Notice */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#031d24]/70 border border-[#D4AF37]/30 text-xs sm:text-sm text-slate-300 flex items-start gap-3 text-left shadow-sm">
            <Info className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-[#F9E79F] font-cinzel block">Important Notice: Payment is 100% Optional</strong>
              <p className="text-slate-300 text-xs leading-relaxed">
                Payment is only needed when paying monthly tuition fees for actively enrolled students. Exploring academy courses, submitting inquiries, and booking 3-Day Free Trial classes is always completely free.
              </p>
            </div>
          </div>
        </div>

        {/* PRIMARY PAYMENT CARDS: Bank Details & Scan & Pay */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* Card 1: Bank Transfer Details (Span 7) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#042226] via-[#02181d] to-[#011015] border-2 border-[#D4AF37]/50 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-900 to-teal-950 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-md">
                    <Building2 className="w-6 h-6 text-[#F9E79F]" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-cinzel font-semibold">
                      Direct Deposit / Online Transfer
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
                      Bank Transfer Details
                    </h2>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold">
                  Verified
                </span>
              </div>

              {/* Bank Detail Rows */}
              <div className="space-y-4">
                
                {/* Bank Name */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#021217] border border-slate-800 hover:border-[#D4AF37]/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-cinzel uppercase tracking-wider">Bank Name</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(BANK_INFO.bankName, 'bank')}
                      className="inline-flex items-center gap-1 text-[11px] text-[#D4AF37] hover:text-[#F9E79F] transition-colors cursor-pointer"
                    >
                      {copiedField === 'bank' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'bank' ? 'Copied successfully' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white mt-1">
                    {BANK_INFO.bankName}
                  </div>
                </div>

                {/* Account Title */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#021217] border border-slate-800 hover:border-[#D4AF37]/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-cinzel uppercase tracking-wider">Account Title</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(BANK_INFO.accountTitle, 'title')}
                      className="inline-flex items-center gap-1 text-[11px] text-[#D4AF37] hover:text-[#F9E79F] transition-colors cursor-pointer"
                    >
                      {copiedField === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'title' ? 'Copied successfully' : 'Copy Account Title'}</span>
                    </button>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-[#F9E79F] font-cinzel mt-1">
                    {BANK_INFO.accountTitle}
                  </div>
                </div>

                {/* IBAN */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#021217] border border-[#D4AF37]/40 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-cinzel uppercase tracking-wider flex items-center gap-1.5">
                      <span>IBAN (Raast / All Banks)</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(BANK_INFO.iban, 'iban')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-xs font-semibold text-emerald-300 transition-colors cursor-pointer shadow-sm"
                    >
                      {copiedField === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
                      <span>{copiedField === 'iban' ? 'Copied successfully' : 'Copy IBAN'}</span>
                    </button>
                  </div>
                  <div className="text-sm sm:text-base font-mono font-bold text-white tracking-wider mt-1 select-all break-all">
                    {BANK_INFO.iban}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Account: <strong className="text-slate-200 font-mono">Ending 8839</strong> (0109000270058839)
                  </span>
                </div>

              </div>

            </div>

            {/* Bottom Security Assurance */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official United Bank Limited account registered for Faizan-e-Mustafa Online Academy.</span>
            </div>

          </div>

          {/* Card 2: Scan & Pay QR Code (Span 5) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#031d23] via-[#02161b] to-[#010f13] border-2 border-[#D4AF37]/50 shadow-2xl relative overflow-hidden flex flex-col justify-between text-center items-center">
            
            <div className="w-full space-y-4">
              <div className="flex items-center justify-center gap-2 border-b border-slate-800 pb-3">
                <QrCode className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
                  Scan &amp; Pay
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed px-2">
                Open your banking app and scan the QR code to make your payment.
              </p>

              {/* Official Uploaded QR Code Display */}
              <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-[#D4AF37] max-w-[240px] sm:max-w-[260px] mx-auto transition-transform hover:scale-[1.02] duration-200">
                <img
                  src={BANK_INFO.qrPath}
                  alt="Official Payment QR Code - United Bank Limited Arif Hussain"
                  className="w-full h-auto object-contain rounded-lg aspect-square block"
                />
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Scan with any Raast / Pakistani Banking App
              </div>
            </div>

            {/* QR Action Buttons */}
            <div className="w-full pt-6 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5 w-full">
                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-[#D4AF37] text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer shadow-md"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>View Full Screen</span>
                </button>

                <a
                  href={BANK_INFO.qrPath}
                  download="Faizan_e_Mustafa_Payment_QR.png"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#F9E79F] hover:brightness-110 text-xs font-bold text-slate-950 uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* SECTION: Already Made a Payment? */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#032328] via-[#043034] to-[#021f23] border-2 border-[#D4AF37]/50 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-cinzel font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verification Gateway</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
                Already Made a Payment?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                If you have already transferred the payment, you can submit your transaction details for verification.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider font-cinzel shadow-lg transition-all cursor-pointer shrink-0"
            >
              <span>{showForm ? 'Hide Confirmation Form' : 'I Have Made the Payment'}</span>
              {showForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* PAYMENT SUBMISSION CONFIRMATION TOAST (If already submitted) */}
          {submittedRecord && (
            <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-950/90 to-[#021c1f] border-2 border-emerald-500/60 shadow-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-cinzel text-white">
                    Payment Submitted
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Your payment details have been received and are pending verification.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#021318] border border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-cinzel">Status:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono font-bold mt-1">
                    <Clock className="w-3 h-3 animate-spin" />
                    <span>{submittedRecord.status}</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-cinzel">Payment Reference:</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <strong className="text-white font-mono text-sm tracking-wider">{submittedRecord.referenceNumber}</strong>
                    <button
                      type="button"
                      onClick={() => handleCopy(submittedRecord.referenceNumber, 'ref')}
                      className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
                    >
                      {copiedField === 'ref' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block font-cinzel">Payer / Amount:</span>
                  <span className="text-emerald-300 font-semibold mt-1 block">
                    {submittedRecord.customerName} ({submittedRecord.amount})
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <a
                  href={`https://wa.me/923454040452?text=Assalam-o-Alaikum%20Faizan-e-Mustafa%20Academy,%20I%20have%20submitted%20my%20fee%20payment%20verification%20with%20Reference:%20${submittedRecord.referenceNumber}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notify Academy on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSubmittedRecord(null)}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Submit Another Payment
                </button>
              </div>
            </div>
          )}

          {/* PAYMENT CONFIRMATION FORM */}
          {showForm && !submittedRecord && (
            <form onSubmit={handleSubmit} className="space-y-6 pt-2 animate-in fade-in duration-300">
              
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#D4AF37]" />
                  <span>Submit Payment for Verification</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Please provide accurate details from your bank receipt so our administration can confirm and verify your transfer.
                </p>
              </div>

              {formError && (
                <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Full Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Al-Mansoor"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Mobile Number <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +92 300 1234567 or +44 7911 123456"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  />
                </div>

                {/* Amount Paid */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Amount Paid <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PKR 3,500 / $35 / £28"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  />
                </div>

                {/* Transaction ID / Reference Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Transaction ID / Reference Number <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UBL-TRX-982341 or Bank Ref"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors font-mono"
                  />
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Payment Date <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors font-mono"
                  />
                </div>

                {/* Payment Screenshot */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Payment Screenshot (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                      id="payment-screenshot-upload"
                    />
                    <label
                      htmlFor="payment-screenshot-upload"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-dashed border-slate-600 hover:border-[#D4AF37] text-slate-300 text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="truncate max-w-[200px]">
                        {screenshotName || 'Choose Receipt / Screenshot'}
                      </span>
                      <Upload className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    </label>
                  </div>
                  {screenshotData && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={screenshotData}
                        alt="Receipt preview"
                        className="w-10 h-10 object-cover rounded-lg border border-slate-700"
                      />
                      <span className="text-[11px] text-emerald-400">Screenshot attached</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#F9E79F] hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider font-cinzel shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting for Verification...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Payment for Verification</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center sm:text-right">
                  Status will start as <strong className="text-amber-300">Pending Verification</strong>.
                </p>
              </div>

            </form>
          )}

        </div>

        {/* STATUS LOOKUP TOOL CARD */}
        <div className="p-6 rounded-2xl bg-[#021319] border border-slate-800 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold font-cinzel text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-[#D4AF37]" />
                <span>Track Payment Verification Status</span>
              </h3>
              <p className="text-xs text-slate-400">
                Have a reference number from a previous transfer? Check its verification status anytime.
              </p>
            </div>

            <form onSubmit={handleLookup} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="e.g. PAY-FMA-2026-..."
                value={lookupRef}
                onChange={(e) => setLookupRef(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#031c22] border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37] w-full sm:w-56"
              />
              <button
                type="submit"
                disabled={lookupLoading}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600 text-xs font-semibold cursor-pointer shrink-0"
              >
                {lookupLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Check'}
              </button>
            </form>
          </div>

          {lookupError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-xs">
              {lookupError}
            </div>
          )}

          {lookupResult && (
            <div className="p-4 rounded-xl bg-[#031d24] border border-[#D4AF37]/40 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-cinzel">Reference:</span>
                <strong className="text-white font-mono text-sm">{lookupResult.referenceNumber}</strong>
              </div>

              <div>
                <span className="text-slate-400 block font-cinzel">Payer:</span>
                <span className="text-slate-200 font-semibold">{lookupResult.customerName}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-cinzel">Amount:</span>
                <span className="text-emerald-300 font-bold">{lookupResult.amount}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-cinzel">Verification Status:</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold ${
                  lookupResult.status === 'Verified'
                    ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                    : lookupResult.status === 'Rejected'
                    ? 'bg-red-950 border border-red-500/40 text-red-300'
                    : 'bg-amber-950 border border-amber-500/40 text-amber-300'
                }`}>
                  {lookupResult.status === 'Verified' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  {lookupResult.status === 'Rejected' && <AlertCircle className="w-3 h-3 text-red-400" />}
                  {lookupResult.status === 'Pending Verification' && <Clock className="w-3 h-3 text-amber-400 animate-spin" />}
                  <span>{lookupResult.status === 'Verified' ? 'Payment Verified' : lookupResult.status}</span>
                </span>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* FULL SCREEN QR MODAL */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-sm w-full bg-[#031820] border-2 border-[#D4AF37] p-6 rounded-3xl shadow-2xl text-center space-y-4">
            
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-black/40 hover:bg-black/60 transition-colors cursor-pointer"
              aria-label="Close QR Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold font-cinzel text-white">
                Scan to Pay
              </h3>
              <p className="text-xs text-slate-400">
                United Bank Limited · Arif Hussain
              </p>
            </div>

            <div className="p-3 bg-white rounded-2xl shadow-inner border-2 border-slate-300 mx-auto max-w-[280px]">
              <img
                src={BANK_INFO.qrPath}
                alt="Payment QR Code Full Screen"
                className="w-full h-auto aspect-square object-contain block"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-[#021015] border border-slate-800 text-xs font-mono text-[#F9E79F] select-all">
              {BANK_INFO.iban}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href={BANK_INFO.qrPath}
                download="Faizan_e_Mustafa_Payment_QR.png"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#F9E79F] text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>

              <button
                type="button"
                onClick={() => setQrModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Page Footer */}
      <footer className="mt-auto py-8 border-t border-slate-800/80 bg-[#010a0e] text-center text-xs text-slate-400 space-y-2">
        <p>© {new Date().getFullYear()} Faizan-e-Mustafa Online Academy. Official Payment Portal.</p>
        <p className="text-[11px] text-slate-400">
          Payment is optional and only required for enrolled students. Support WhatsApp: 0345-4040452.
        </p>
      </footer>

    </div>
  );
};

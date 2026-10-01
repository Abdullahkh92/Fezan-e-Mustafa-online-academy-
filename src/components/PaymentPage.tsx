import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  MessageCircle,
  Info,
  Lock,
  Copy,
  Check,
  History,
  Bell,
  Sparkles,
  Loader2,
  Send,
  XCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentMethod, PaymentRecord, PaymentNotification } from '../server/paymentService';

interface Props {
  onBackToHome: () => void;
}

const PAYMENT_ACCOUNTS = {
  JazzCash: {
    method: 'JazzCash' as PaymentMethod,
    accountName: 'Arif Hussain',
    accountNumber: '03012887630',
    color: 'from-amber-600 via-red-600 to-amber-700',
    borderColor: 'border-amber-500/50',
    badge: 'JazzCash Mobile Account',
    guide: 'Open JazzCash App or dial *786# -> Send Money -> Mobile Account -> Enter 03012887630 (Arif Hussain).'
  },
  Easypaisa: {
    method: 'Easypaisa' as PaymentMethod,
    accountName: 'Arif Hussain',
    accountNumber: '03012887630',
    color: 'from-emerald-600 via-teal-600 to-emerald-700',
    borderColor: 'border-emerald-500/50',
    badge: 'Easypaisa Mobile Account',
    guide: 'Open Easypaisa App -> Send Money -> Easypaisa Transfer -> Enter 03012887630 (Arif Hussain).'
  }
};

const USER_SESSION_KEY = 'faizan_payment_user_session';

export const PaymentPage: React.FC<Props> = ({ onBackToHome }) => {
  // Method selection (Only JazzCash or Easypaisa)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('JazzCash');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('1000');
  const [transactionId, setTransactionId] = useState('');

  // Copy feedback
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successPayment, setSuccessPayment] = useState<PaymentRecord | null>(null);

  // User History & Real Notifications
  const [activeTab, setActiveTab] = useState<'pay' | 'history' | 'notifications'>('pay');
  const [userHistory, setUserHistory] = useState<PaymentRecord[]>([]);
  const [userNotifications, setUserNotifications] = useState<PaymentNotification[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Restore or generate user session
  const [sessionUser, setSessionUser] = useState<{ userId: string; mobile: string; name: string }>(() => {
    try {
      const stored = localStorage.getItem(USER_SESSION_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // Ignored
    }
    return {
      userId: `usr_${Date.now().toString(36)}`,
      mobile: '',
      name: ''
    };
  });

  // Pre-fill form if session exists
  useEffect(() => {
    if (sessionUser.name && !fullName) setFullName(sessionUser.name);
    if (sessionUser.mobile && !mobileNumber) setMobileNumber(sessionUser.mobile);
  }, [sessionUser]);

  // Fetch user isolated history and notifications
  const fetchUserData = async (mob = mobileNumber || sessionUser.mobile, uId = sessionUser.userId) => {
    if (!mob && !uId) return;
    setLoadingHistory(true);
    try {
      const [histRes, notifRes] = await Promise.all([
        fetch(`/api/payments/user-history?userId=${encodeURIComponent(uId)}&mobileNumber=${encodeURIComponent(mob)}`),
        fetch(`/api/payments/user-notifications?userId=${encodeURIComponent(uId)}&mobileNumber=${encodeURIComponent(mob)}`)
      ]);

      if (histRes.ok) {
        const histData = await histRes.json();
        setUserHistory(histData.payments || []);
      }

      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setUserNotifications(notifData.notifications || []);
      }
    } catch (e) {
      console.warn('Could not load user payment data:', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (sessionUser.mobile || mobileNumber) {
      fetchUserData();
    }
  }, [sessionUser.mobile]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Submit Payment
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Frontend Amount Validation: Minimum PKR 100, No Maximum Limit
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 100) {
      setErrorMessage('Minimum payment amount is PKR 100. Payments below PKR 100 cannot be accepted.');
      return;
    }

    const cleanName = fullName.trim();
    const cleanMobile = mobileNumber.trim();
    const cleanTxn = transactionId.trim();

    if (!cleanName || !cleanMobile || !cleanTxn) {
      setErrorMessage('Please fill in your Full Name, Mobile Number, and Transaction ID.');
      return;
    }

    setIsSubmitting(true);
    try {
      const currentUserId = sessionUser.userId || `usr_${cleanMobile.replace(/[^0-9]/g, '').slice(-7)}`;

      const res = await fetch('/api/payments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          customerName: cleanName,
          mobileNumber: cleanMobile,
          amount: parsedAmount,
          paymentMethod: selectedMethod,
          transactionId: cleanTxn
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit payment.');
      }

      // Save user session for isolated history tracking
      const newSession = { userId: currentUserId, mobile: cleanMobile, name: cleanName };
      setSessionUser(newSession);
      try {
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newSession));
      } catch (e) {
        // Ignored
      }

      setSuccessPayment(data.payment);
      setTransactionId('');
      fetchUserData(cleanMobile, currentUserId);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeAccount = PAYMENT_ACCOUNTS[selectedMethod];
  const unreadNotifsCount = userNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#020e14] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#FFF8E7]">
      
      {/* Top Header Navigation */}
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
                Fee Payment Portal (JazzCash &amp; Easypaisa)
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2">
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

      {/* Main Container */}
      <main className="flex-1 py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Title & Info */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider font-cinzel shadow-inner">
            <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Direct Mobile Wallet Payments</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-cinzel text-white tracking-tight">
            Make a <span className="text-gold-gradient">Payment</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Select your preferred mobile wallet (JazzCash or Easypaisa) to transfer fee to our official account, then enter your Transaction ID for verification.
          </p>

          <div className="p-3.5 rounded-2xl bg-[#031d24]/70 border border-[#D4AF37]/30 text-xs sm:text-sm text-slate-300 flex items-start gap-3 text-left">
            <Info className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <p className="text-slate-300 text-xs leading-relaxed">
              <strong className="text-[#F9E79F] font-cinzel">Payment is Optional: </strong>
              Payment is only required when making fee transfers for actively enrolled students. Website access, courses review, and booking 3-Day Free Trial classes is 100% free.
            </p>
          </div>
        </div>

        {/* User Navigation Tabs: Pay / My History / Notifications */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('pay')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-cinzel transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'pay'
                ? 'bg-[#03292e] text-[#F9E79F] border border-[#D4AF37]/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Pay Fee</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('history');
              fetchUserData();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-cinzel transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#03292e] text-[#F9E79F] border border-[#D4AF37]/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>My Payment History</span>
            {userHistory.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300">
                {userHistory.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('notifications');
              fetchUserData();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-cinzel transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'notifications'
                ? 'bg-[#03292e] text-[#F9E79F] border border-[#D4AF37]/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>My Notifications</span>
            {userNotifications.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300">
                {userNotifications.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: MAKE PAYMENT FLOW */}
        {activeTab === 'pay' && (
          <div className="space-y-6">

            {/* PAYMENT SUCCESS NOTICE (After submission) */}
            {successPayment && (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-950/90 to-[#021c1f] border-2 border-emerald-500/60 shadow-xl space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-cinzel text-white">
                      Payment Submitted Successfully
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Your payment has been submitted successfully and is pending verification.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#021318] border border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-cinzel">Status:</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono font-bold mt-1">
                      <Clock className="w-3 h-3 animate-spin" />
                      <span>Pending Verification</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-cinzel">Transaction ID:</span>
                    <strong className="text-white font-mono text-sm tracking-wider mt-1 block">
                      {successPayment.transactionId}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-cinzel">Amount &amp; Method:</span>
                    <span className="text-emerald-300 font-semibold mt-1 block font-mono">
                      PKR {successPayment.amount.toLocaleString()} ({successPayment.paymentMethod})
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href={`https://wa.me/923454040452?text=Assalam-o-Alaikum%20Faizan-e-Mustafa%20Academy,%20I%20have%20submitted%20my%20fee%20payment%20via%20${successPayment.paymentMethod}.%20Transaction%20ID:%20${successPayment.transactionId},%20Amount:%20PKR%20${successPayment.amount}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Notify Academy on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSuccessPayment(null)}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Submit Another Payment
                  </button>
                </div>
              </div>
            )}

            {/* 1. SELECT PAYMENT METHOD (Only JazzCash & Easypaisa) */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-cinzel font-semibold">
                1. Choose Payment Method
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* JazzCash Option */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('JazzCash')}
                  className={`p-5 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedMethod === 'JazzCash'
                      ? 'bg-gradient-to-br from-[#2a0e12] to-[#120507] border-amber-500 shadow-xl shadow-amber-950/40 ring-1 ring-amber-400'
                      : 'bg-[#021319] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-lg font-cinzel text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span>JazzCash</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
                      Mobile Account
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-0.5">
                    <div>Account Name: <strong className="text-white">Arif Hussain</strong></div>
                    <div>Account Number: <strong className="text-[#F9E79F] font-mono">03012887630</strong></div>
                  </div>
                </button>

                {/* Easypaisa Option */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('Easypaisa')}
                  className={`p-5 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedMethod === 'Easypaisa'
                      ? 'bg-gradient-to-br from-[#06241c] to-[#02140f] border-emerald-500 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-400'
                      : 'bg-[#021319] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-lg font-cinzel text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span>Easypaisa</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      Mobile Account
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-0.5">
                    <div>Account Name: <strong className="text-white">Arif Hussain</strong></div>
                    <div>Account Number: <strong className="text-[#F9E79F] font-mono">03012887630</strong></div>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. DEDICATED ACCOUNT DETAILS CARD */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#031d24] via-[#02151b] to-[#010e13] border-2 border-[#D4AF37]/60 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#F9E79F]">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-cinzel tracking-wider text-[#D4AF37]">
                      Official Destination Account
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-cinzel text-white">
                      {selectedMethod} Transfer Details
                    </h3>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold">
                  Verified Account
                </span>
              </div>

              {/* Display Account Name + Account Number with Copy Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Account Name */}
                <div className="p-3.5 rounded-2xl bg-[#021015] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-cinzel uppercase tracking-wider block">
                      Account Name
                    </span>
                    <strong className="text-base sm:text-lg text-[#F9E79F] font-cinzel block mt-0.5">
                      {activeAccount.accountName}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(activeAccount.accountName, 'name')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                  >
                    {copiedField === 'name' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    <span>{copiedField === 'name' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Account Number */}
                <div className="p-3.5 rounded-2xl bg-[#021015] border border-[#D4AF37]/40 shadow-inner flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-cinzel uppercase tracking-wider block">
                      Account Number ({selectedMethod})
                    </span>
                    <strong className="text-lg sm:text-xl font-mono text-white tracking-widest block mt-0.5">
                      {activeAccount.accountNumber}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(activeAccount.accountNumber, 'num')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-xs font-semibold text-emerald-300 transition-colors cursor-pointer shadow-sm"
                  >
                    {copiedField === 'num' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    <span>{copiedField === 'num' ? 'Copied' : 'Copy Number'}</span>
                  </button>
                </div>

              </div>

              <div className="p-3 rounded-xl bg-[#010a0e] text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-200">How to transfer: </strong>
                {activeAccount.guide}
              </div>
            </div>

            {/* 3. PAYMENT SUBMISSION FORM */}
            <form onSubmit={handleSubmitPayment} className="p-6 sm:p-8 rounded-3xl bg-[#021319] border border-slate-800 shadow-2xl space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-cinzel font-semibold">
                  2. Submit Payment Details
                </span>
                <h3 className="text-lg font-bold font-cinzel text-white">
                  Enter Your Transaction Information
                </h3>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Your Full Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Al-Mansoor"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#010e14] border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                    Your Mobile Number <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0300 1234567"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#010e14] border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] font-mono"
                  />
                </div>

                {/* Amount: Minimum PKR 100 - No Maximum Limit */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel">
                      Amount Paid (PKR) <span className="text-[#D4AF37]">*</span>
                    </label>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Min: PKR 100 | Max: No Limit
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#D4AF37]">
                      PKR
                    </span>
                    <input
                      type="number"
                      min="100"
                      required
                      placeholder="e.g. 1000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-14 pr-4 py-2.5 rounded-xl bg-[#010e14] border border-slate-700 text-white text-base font-mono font-bold placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Preset Quick Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {['100', '600', '1000', '2500', '5000', '10000', '50000'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setAmount(chip)}
                        className={`text-[11px] px-2 py-0.5 rounded-md border font-mono transition-colors cursor-pointer ${
                          amount === chip
                            ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F9E79F] font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transaction ID / Reference Number */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel">
                      Transaction ID / Ref # <span className="text-[#D4AF37]">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      From {selectedMethod} SMS/Receipt
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 02938472910 or TID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#010e14] border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] font-mono tracking-wider"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Must be unique. Duplicate transaction IDs are automatically rejected.
                  </span>
                </div>

              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#F9E79F] hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider font-cinzel shadow-xl shadow-[#D4AF37]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting for Verification...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Payment</span>
                    </>
                  )}
                </button>

                <div className="text-xs text-slate-400 text-center sm:text-right">
                  Status starts as <strong className="text-amber-300">Pending Verification</strong>.
                  <br />
                  <span className="text-[11px]">Authorized Admin verifies and approves payment.</span>
                </div>
              </div>

            </form>

          </div>
        )}

        {/* TAB 2: USER PAYMENT HISTORY (Strictly Isolated to Current User) */}
        {activeTab === 'history' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#021319] border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-[#D4AF37]" />
                  <span>Your Payment History</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Only your personal payments are displayed here. Your data is isolated and private.
                </p>
              </div>

              <button
                type="button"
                onClick={() => fetchUserData()}
                disabled={loadingHistory}
                className="text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
              >
                Refresh
              </button>
            </div>

            {loadingHistory ? (
              <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                <span>Loading your records...</span>
              </div>
            ) : userHistory.length === 0 ? (
              <div className="py-10 text-center text-slate-500 text-xs space-y-2">
                <p>No previous payments found under mobile number: <strong className="text-slate-300 font-mono">{mobileNumber || sessionUser.mobile || 'Not set'}</strong></p>
                <p className="text-[11px] text-slate-600">Make your first payment in the "Pay Fee" tab.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#010e14] text-slate-400 font-cinzel uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Transaction ID</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Notes / Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {userHistory.map((p) => (
                      <tr key={p.id} className="hover:bg-[#031d24]/50">
                        <td className="p-3 whitespace-nowrap text-slate-300">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 whitespace-nowrap font-medium text-white">
                          {p.paymentMethod}
                        </td>
                        <td className="p-3 whitespace-nowrap font-bold font-mono text-emerald-300">
                          PKR {p.amount.toLocaleString()}
                        </td>
                        <td className="p-3 whitespace-nowrap font-mono text-slate-300">
                          {p.transactionId}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            p.status === 'Approved'
                              ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                              : p.status === 'Rejected'
                              ? 'bg-red-950 border border-red-500/40 text-red-300'
                              : 'bg-amber-950 border border-amber-500/40 text-amber-300'
                          }`}>
                            {p.status === 'Approved' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                            {p.status === 'Rejected' && <XCircle className="w-3 h-3 text-red-400" />}
                            {p.status === 'Pending' && <Clock className="w-3 h-3 text-amber-400 animate-spin" />}
                            <span>{p.status === 'Pending' ? 'Pending Verification' : p.status}</span>
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-400 max-w-xs truncate">
                          {p.status === 'Rejected' ? (
                            <span className="text-red-300">{p.rejectionReason || 'Verification declined'}</span>
                          ) : (
                            p.verifiedBy ? `Verified by ${p.verifiedBy}` : 'Under admin review'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USER NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#021319] border border-slate-800 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#D4AF37]" />
                <span>Payment Notifications</span>
              </h3>
              <p className="text-xs text-slate-400">
                Real database notifications for your payment submission, approval, or updates.
              </p>
            </div>

            {userNotifications.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No notifications received yet. Submit a payment to receive status updates.
              </div>
            ) : (
              <div className="space-y-3">
                {userNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 rounded-xl bg-[#010e14] border border-slate-800 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-cinzel text-white">{n.title}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-800/80 bg-[#010a0e] text-center text-xs text-slate-400 space-y-2">
        <p>© {new Date().getFullYear()} Faizan-e-Mustafa Online Academy. Official Fee Payment Portal.</p>
        <p className="text-[11px] text-slate-400">
          JazzCash &amp; Easypaisa: 03012887630 (Arif Hussain). Support WhatsApp: 0345-4040452.
        </p>
      </footer>

    </div>
  );
};

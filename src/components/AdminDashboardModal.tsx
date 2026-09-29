import React, { useState, useEffect, useCallback } from 'react';
import { InquiryRecord, SubmissionStatus } from '../types/academy';
import {
  X,
  Search,
  RefreshCw,
  Trash2,
  CheckCircle,
  FileSpreadsheet,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  MessageCircle,
  Sparkles,
  Shield,
  KeyRound,
  AlertTriangle,
  Loader2,
  TrendingUp,
  BarChart3,
  CreditCard
} from 'lucide-react';
import { TrafficAnalyticsView, TrafficStatsData } from './TrafficAnalyticsView';
import { AdminPaymentsView } from './AdminPaymentsView';
import { PaymentRecord } from '../server/paymentService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TOKEN_STORAGE_KEY = 'faizan_academy_admin_token';

export const AdminDashboardModal: React.FC<Props> = ({ isOpen, onClose }) => {
  // Session & Auth state
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Data state
  const [records, setRecords] = useState<InquiryRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // UI state
  const [activeTab, setActiveTab] = useState<'inquiries' | 'traffic' | 'payments'>('inquiries');
  const [trafficStats, setTrafficStats] = useState<TrafficStatsData | null>(null);
  const [trafficLoading, setTrafficLoading] = useState<boolean>(false);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<InquiryRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Helper: Get Authorization header
  const getAuthHeaders = useCallback((customToken?: string): HeadersInit => {
    const token = customToken || authToken || sessionStorage.getItem(TOKEN_STORAGE_KEY);
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }, [authToken]);

  // Handle unauthorized response (401/403)
  const handleUnauthorized = useCallback((message = 'Session expired. Please log in again.') => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthToken(null);
    setIsAuthenticated(false);
    setRecords([]);
    setStats(null);
    setSelectedRecord(null);
    setLoginError(message);
  }, []);

  // Fetch inquiries from server with authentication
  const fetchRecords = useCallback(async (tokenToUse?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (typeFilter !== 'All') params.append('type', typeFilter);

      const res = await fetch(`/api/admin/inquiries?${params.toString()}`, {
        headers: getAuthHeaders(tokenToUse)
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
      }
    } catch (err) {
      console.error('Error fetching admin records:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, typeFilter, getAuthHeaders, handleUnauthorized]);

  // Fetch stats from server with authentication
  const fetchStats = useCallback(async (tokenToUse?: string) => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: getAuthHeaders(tokenToUse)
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, [getAuthHeaders, handleUnauthorized]);

  // Fetch website traffic analytics
  const fetchTrafficStats = useCallback(async (tokenToUse?: string) => {
    setTrafficLoading(true);
    try {
      const res = await fetch('/api/admin/traffic', {
        headers: getAuthHeaders(tokenToUse)
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();
      setTrafficStats(data);
    } catch (err) {
      console.error('Error fetching traffic analytics:', err);
    } finally {
      setTrafficLoading(false);
    }
  }, [getAuthHeaders, handleUnauthorized]);

  // Fetch payments from server with authentication
  const fetchPayments = useCallback(async (customToken?: string) => {
    setPaymentsLoading(true);
    try {
      const res = await fetch('/api/admin/payments', {
        headers: getAuthHeaders(customToken)
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();
      setPayments(data.payments || []);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setPaymentsLoading(false);
    }
  }, [getAuthHeaders, handleUnauthorized]);

  // Validate existing stored session when opening the modal
  useEffect(() => {
    if (!isOpen) return;

    const storedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!storedToken) {
      setIsAuthenticated(false);
      setAuthToken(null);
      return;
    }

    // Verify token with backend
    fetch('/api/admin/session', {
      headers: { 'Authorization': `Bearer ${storedToken}` }
    })
      .then((res) => {
        if (res.ok) {
          setAuthToken(storedToken);
          setIsAuthenticated(true);
          setLoginError(null);
          fetchRecords(storedToken);
          fetchStats(storedToken);
          fetchTrafficStats(storedToken);
          fetchPayments(storedToken);
        } else {
          handleUnauthorized();
        }
      })
      .catch(() => {
        handleUnauthorized();
      });
  }, [isOpen, fetchRecords, fetchStats, fetchTrafficStats, fetchPayments, handleUnauthorized]);

  // Re-fetch records when filters change (only if authenticated)
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchRecords();
    }
  }, [isOpen, isAuthenticated, statusFilter, typeFilter, fetchRecords]);

  // Handle Admin Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!adminUsername.trim() || !adminPassword.trim()) {
      setLoginError('Please enter both username and password.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: adminUsername.trim(),
          password: adminPassword.trim()
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Authentication failed. Please verify your credentials.');
        return;
      }

      const token = data.token;
      sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
      setAuthToken(token);
      setIsAuthenticated(true);
      setAdminPassword('');
      setLoginError(null);
      showNotification('Administrator authenticated successfully');

      // Load records, stats, traffic analytics and payments
      fetchRecords(token);
      fetchStats(token);
      fetchTrafficStats(token);
      fetchPayments(token);
    } catch (err) {
      setLoginError('Connection error. Please check your network and retry.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Admin Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      handleUnauthorized('Logged out successfully.');
      showNotification('Administrator logged out');
    }
  };

  // Change record status
  const handleStatusChange = async (id: string, newStatus: SubmissionStatus) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setRecords(prev => prev.map(r => (r.id === id ? { ...r, status: newStatus } : r)));
        if (selectedRecord && selectedRecord.id === id) {
          setSelectedRecord({ ...selectedRecord, status: newStatus });
        }
        fetchStats();
        showNotification(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Delete record
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setRecords(prev => prev.filter(r => r.id !== id));
        if (selectedRecord && selectedRecord.id === id) {
          setSelectedRecord(null);
        }
        setDeleteConfirmId(null);
        fetchStats();
        showNotification('Record permanently deleted from Cloud Firestore');
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  // Update administrative notes
  const handleUpdateNotes = async (id: string, notes: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ adminNotes: notes })
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setRecords(prev => prev.map(r => (r.id === id ? { ...r, adminNotes: notes } : r)));
        if (selectedRecord && selectedRecord.id === id) {
          setSelectedRecord({ ...selectedRecord, adminNotes: notes });
        }
        showNotification('Follow-up notes saved to Cloud Firestore');
      }
    } catch (err) {
      console.error('Failed to update notes:', err);
    }
  };

  // Seed sample records
  const handleSeedRecords = async () => {
    try {
      const res = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();
      if (data.success) {
        fetchRecords();
        fetchStats();
        showNotification('Sample data populated in Cloud Firestore');
      }
    } catch (err) {
      console.error('Failed to seed:', err);
    }
  };

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Export CSV
  const exportCSV = () => {
    if (records.length === 0) return;
    const headers = [
      'ID', 'Type', 'Student Name', 'Parent Name', 'Age', 'Country',
      'WhatsApp', 'Email', 'Course', 'Timing', 'Gender Pref', 'Status',
      'Is Demo', 'Date Submitted', 'Admin Notes', 'Message'
    ];
    const rows = records.map(r => [
      r.id,
      r.type,
      `"${(r.studentName || '').replace(/"/g, '""')}"`,
      `"${(r.parentName || '').replace(/"/g, '""')}"`,
      r.age,
      `"${(r.country || '').replace(/"/g, '""')}"`,
      `"${(r.whatsapp || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.course || '').replace(/"/g, '""')}"`,
      `"${(r.timing || '').replace(/"/g, '""')}"`,
      `"${r.genderPreference || 'Any'}"`,
      r.status,
      r.isDemo ? 'Yes (Demo)' : 'No (Live)',
      `"${new Date(r.createdAt).toLocaleString()}"`,
      `"${(r.adminNotes || '').replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `faizan_academy_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
      <div 
        className="relative w-full max-w-6xl max-h-[92vh] bg-gradient-to-b from-[#062425] via-[#031c20] to-[#021319] border-2 border-[#D4AF37]/50 rounded-2xl shadow-2xl flex flex-col text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-[#D4AF37] to-teal-400" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#021116]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-900 to-[#03151E] border border-[#D4AF37]/50 flex items-center justify-center text-[#F9E79F]">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold font-cinzel">
                Faizan-e-Mustafa Online Academy
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-cinzel text-white flex items-center gap-2">
                <span>Administrative Portal</span>
                <span className={`text-xs px-2 py-0.5 rounded font-mono border ${
                  isAuthenticated
                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                }`}>
                  {isAuthenticated ? 'Authenticated Session' : 'Protected Area'}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-300 hover:text-white bg-red-950/70 hover:bg-red-900/80 border border-red-500/40 rounded-lg transition-colors cursor-pointer"
                title="Log Out of Admin Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Log Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-black/40 hover:bg-black/60 transition-colors"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Notification Toast */}
        {actionMessage && (
          <div className="bg-emerald-600/90 text-white text-xs font-semibold px-4 py-2 flex items-center justify-center gap-2 shadow-md">
            <CheckCircle className="w-4 h-4" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* AUTHENTICATED ADMIN TAB NAVIGATION */}
        {isAuthenticated && (
          <div className="flex items-center gap-2 px-4 sm:px-6 pt-2 bg-[#021015] border-b border-[#D4AF37]/25 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2.5 text-xs font-bold font-cinzel rounded-t-xl transition-all border-t border-x flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[#03151E] border-[#D4AF37]/50 text-[#F9E79F] shadow-sm'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]" />
              <span>Student Inquiries & Admissions</span>
              {stats?.total !== undefined && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                  {stats.total}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('traffic');
                fetchTrafficStats();
              }}
              className={`px-4 py-2.5 text-xs font-bold font-cinzel rounded-t-xl transition-all border-t border-x flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'traffic'
                  ? 'bg-[#03151E] border-[#D4AF37]/50 text-[#F9E79F] shadow-sm'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              <span>Website Traffic / Visitor Analytics</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('payments');
                fetchPayments();
              }}
              className={`px-4 py-2.5 text-xs font-bold font-cinzel rounded-t-xl transition-all border-t border-x flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-[#03151E] border-[#D4AF37]/50 text-[#F9E79F] shadow-sm'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-4 h-4 text-[#D4AF37]" />
              <span>Payments &amp; Verifications</span>
              {payments.filter(p => p.status === 'Pending Verification').length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold animate-pulse">
                  {payments.filter(p => p.status === 'Pending Verification').length} pending
                </span>
              )}
            </button>
          </div>
        )}

        {/* SECURE ADMIN LOGIN VIEW (Displayed when unauthenticated) */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center my-auto text-center max-w-md mx-auto w-full">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-900/80 via-teal-950 to-[#021319] border-2 border-[#D4AF37]/50 flex items-center justify-center text-[#F9E79F] mb-4 shadow-xl shadow-[#D4AF37]/10">
              <Lock className="w-8 h-8 text-[#D4AF37]" />
            </div>

            <h3 className="text-2xl font-bold font-cinzel text-white mb-1">
              Admin Authentication
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Student admission records and inquiries are encrypted and protected. Please sign in with authorized administrator credentials.
            </p>

            {loginError && (
              <div className="w-full mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 text-left">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="w-full space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                  Administrator Username
                </label>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Enter administrator username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#021319] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-cinzel mb-1.5">
                  Secret Passcode / Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter administrator password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-[#021319] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F9E79F] via-[#D4AF37] to-[#AA771C] hover:brightness-110 disabled:opacity-50 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all font-cinzel flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider mt-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-slate-950" />
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 w-full">
              <span>Faizan-e-Mustafa Online Academy Cloud Security Gate</span>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD VIEW */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {activeTab === 'traffic' ? (
              <TrafficAnalyticsView
                stats={trafficStats}
                loading={trafficLoading}
                onRefresh={() => fetchTrafficStats()}
              />
            ) : activeTab === 'payments' ? (
              <AdminPaymentsView
                payments={payments}
                loading={paymentsLoading}
                token={authToken || sessionStorage.getItem(TOKEN_STORAGE_KEY) || ''}
                onRefresh={() => fetchPayments()}
                onShowNotification={showNotification}
              />
            ) : (
              <>
                {/* Stats Overview */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                <div className="p-3.5 rounded-xl bg-[#021319] border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-cinzel uppercase">Total Records</span>
                  <div className="text-xl font-bold font-mono text-white tabular-nums">{stats.total}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30">
                  <span className="text-[11px] text-blue-300 font-cinzel uppercase">New Inquiries</span>
                  <div className="text-xl font-bold font-mono text-blue-200 tabular-nums">{stats.newCount}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
                  <span className="text-[11px] text-amber-300 font-cinzel uppercase">Contacted</span>
                  <div className="text-xl font-bold font-mono text-amber-200 tabular-nums">{stats.contactedCount}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                  <span className="text-[11px] text-emerald-300 font-cinzel uppercase">Enrolled</span>
                  <div className="text-xl font-bold font-mono text-emerald-200 tabular-nums">{stats.enrolledCount}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30">
                  <span className="text-[11px] text-purple-300 font-cinzel uppercase">Completed</span>
                  <div className="text-xl font-bold font-mono text-purple-200 tabular-nums">{stats.completedCount}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-500/30">
                  <span className="text-[11px] text-teal-300 font-cinzel uppercase">Free Trials</span>
                  <div className="text-xl font-bold font-mono text-teal-200 tabular-nums">{stats.freeTrials}</div>
                </div>
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-xl bg-[#021319]/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by student, parent, WhatsApp, email, course..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchRecords()}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#031820] border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 hidden sm:inline">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-2 rounded-lg bg-[#031820] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 hidden sm:inline">Type:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-2.5 py-2 rounded-lg bg-[#031820] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="All">All Types</option>
                  <option value="free_trial">Free Trial</option>
                  <option value="admission">Admission</option>
                  <option value="contact">Contact Message</option>
                  <option value="inquiry">General Inquiry</option>
                </select>
              </div>

              {/* Utility actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchRecords()}
                  className="p-2 text-slate-300 hover:text-white bg-slate-800/80 rounded-lg hover:bg-slate-700 transition-colors"
                  title="Refresh Database Records from Cloud Firestore"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-lg hover:bg-emerald-900/60 transition-colors"
                  title="Export to CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
                <button
                  onClick={handleSeedRecords}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 rounded-lg"
                  title="Restore Sample Data in Cloud Firestore"
                >
                  <span>Re-seed Demo</span>
                </button>
              </div>
            </div>

            {/* Records Table / List */}
            {records.length === 0 ? (
              <div className="p-12 text-center text-slate-400 border border-dashed border-slate-800 rounded-2xl">
                <p className="text-sm font-cinzel">No records match the active search or filters.</p>
                <button
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('All');
                    setTypeFilter('All');
                    fetchRecords();
                  }}
                  className="mt-3 text-xs text-[#D4AF37] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#021319]/90">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#031a22] text-[#D4AF37] font-cinzel uppercase tracking-wider text-[11px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Student & Parent</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Course & Timing</th>
                        <th className="py-3 px-4">Contact (WhatsApp)</th>
                        <th className="py-3 px-4">Submission Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {records.map((r) => {
                        const cleanPhone = r.whatsapp.replace(/[^0-9]/g, '');
                        return (
                          <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                            {/* Student */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white font-cinzel">{r.studentName}</span>
                                {r.isDemo ? (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono">
                                    DEMO
                                  </span>
                                ) : (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    LIVE
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Parent: {r.parentName || 'N/A'} {r.age ? `· Age ${r.age}` : ''} · {r.country}
                              </div>
                            </td>

                            {/* Type */}
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                r.type === 'free_trial'
                                  ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40'
                                  : r.type === 'admission'
                                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-slate-800 text-slate-300'
                              }`}>
                                {r.type.replace('_', ' ')}
                              </span>
                            </td>

                            {/* Course */}
                            <td className="py-3 px-4">
                              <div className="text-white font-medium">{r.course}</div>
                              <div className="text-[11px] text-slate-400">{r.timing}</div>
                            </td>

                            {/* Contact */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-emerald-300">{r.whatsapp}</span>
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=Assalamu%20Alaikum%20${encodeURIComponent(r.parentName || r.studentName)},%20this%20is%20Faizan-e-Mustafa%20Online%20Academy%20regarding%20your%20Quran%20class%20inquiry.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400"
                                  title="Open WhatsApp Chat"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              </div>
                              {r.email && <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{r.email}</div>}
                            </td>

                            {/* Submission Date/Time */}
                            <td className="py-3 px-4 tabular-nums text-slate-300">
                              <div>{new Date(r.createdAt).toLocaleDateString()}</div>
                              <div className="text-[10px] text-slate-400">{new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </td>

                            {/* Status Selector */}
                            <td className="py-3 px-4">
                              <select
                                value={r.status}
                                onChange={(e) => handleStatusChange(r.id, e.target.value as SubmissionStatus)}
                                className={`px-2 py-1 rounded text-xs font-semibold focus:outline-none ${
                                  r.status === 'New'
                                    ? 'bg-blue-900/60 text-blue-200 border border-blue-500/40'
                                    : r.status === 'Contacted'
                                    ? 'bg-amber-900/60 text-amber-200 border border-amber-500/40'
                                    : r.status === 'Enrolled'
                                    ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/40'
                                    : 'bg-purple-900/60 text-purple-200 border border-purple-500/40'
                                }`}
                              >
                                <option value="New" className="bg-[#031820] text-blue-200">New</option>
                                <option value="Contacted" className="bg-[#031820] text-amber-200">Contacted</option>
                                <option value="Enrolled" className="bg-[#031820] text-emerald-200">Enrolled</option>
                                <option value="Completed" className="bg-[#031820] text-purple-200">Completed</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedRecord(r)}
                                  className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800/60 hover:bg-slate-700"
                                  title="View Full Application Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {deleteConfirmId === r.id ? (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleDelete(r.id)}
                                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmId(null)}
                                      className="px-1.5 py-1 text-[10px] text-slate-400 hover:text-white"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirmId(r.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-400 rounded bg-slate-800/60 hover:bg-red-950/60"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Detailed Record Inspector Modal */}
            {selectedRecord && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <div className="relative w-full max-w-xl bg-gradient-to-b from-[#06292b] to-[#021319] border border-[#D4AF37]/50 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-cinzel text-[#D4AF37]">Application Details</span>
                        {selectedRecord.isDemo ? (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">DEMO RECORD</span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-500/40">REAL SUBMISSION</span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold font-cinzel text-white">{selectedRecord.studentName}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedRecord(null)}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Parent / Guardian:</span>
                      <span className="text-white font-medium">{selectedRecord.parentName || 'Self'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Student Age:</span>
                      <span className="text-white font-medium">{selectedRecord.age || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Country:</span>
                      <span className="text-white font-medium">{selectedRecord.country}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">WhatsApp:</span>
                      <span className="font-mono text-emerald-300 font-semibold">{selectedRecord.whatsapp}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Course:</span>
                      <span className="text-white font-medium">{selectedRecord.course}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Preferred Timing:</span>
                      <span className="text-white font-medium">{selectedRecord.timing}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Teacher Preference:</span>
                      <span className="text-white font-medium">{selectedRecord.genderPreference || 'Any'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Submission Date:</span>
                      <span className="text-white font-medium">{new Date(selectedRecord.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {selectedRecord.message && (
                    <div className="p-3 rounded-lg bg-black/40 border border-slate-800 text-xs">
                      <span className="text-[#D4AF37] block font-cinzel mb-1">Student Notes / Message:</span>
                      <p className="text-slate-300 whitespace-pre-wrap">{selectedRecord.message}</p>
                    </div>
                  )}

                  {/* Admin Internal Notes Editor */}
                  <div className="space-y-1 text-xs">
                    <span className="text-slate-300 block font-cinzel">Administrator Follow-up Notes:</span>
                    <textarea
                      rows={2}
                      defaultValue={selectedRecord.adminNotes || ''}
                      onBlur={(e) => handleUpdateNotes(selectedRecord.id, e.target.value)}
                      placeholder="e.g. Called mother on WhatsApp. Free trial assigned with Qari Bilal on Tuesday 6 PM..."
                      className="w-full p-2.5 rounded-lg bg-[#021116] border border-slate-700 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <a
                      href={`https://wa.me/${selectedRecord.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Direct WhatsApp Message</span>
                    </a>

                    <button
                      onClick={() => setSelectedRecord(null)}
                      className="px-4 py-2 text-xs text-slate-300 hover:text-white rounded-lg border border-slate-700"
                    >
                      Close Inspector
                    </button>
                  </div>
                </div>
              </div>
            )}
              </>
            )}

          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#D4AF37]/20 bg-[#021017] flex items-center justify-between text-xs text-slate-400">
          <span>Faizan-e-Mustafa Online Academy Portal</span>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out Administrator</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

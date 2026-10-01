import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  MessageCircle,
  ShieldCheck,
  RefreshCw,
  X,
  Check,
  Ban,
  Bell,
  XCircle
} from 'lucide-react';
import { PaymentRecord, PaymentStatus, PaymentNotification } from '../server/paymentService';

interface Props {
  payments: PaymentRecord[];
  loading: boolean;
  token: string;
  onRefresh: () => void;
  onShowNotification: (msg: string) => void;
}

export const AdminPaymentsView: React.FC<Props> = ({
  payments,
  loading,
  token,
  onRefresh,
  onShowNotification
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | PaymentStatus>('All');
  const [methodFilter, setMethodFilter] = useState<string>('All');

  // Selected payment for detail modal
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  // Status update / Reject dialog state
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [rejectModalPayment, setRejectModalPayment] = useState<PaymentRecord | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('Details could not be verified in JazzCash/Easypaisa statement.');
  const [adminNotesInput, setAdminNotesInput] = useState<string>('');

  // Admin Real Notifications
  const [adminNotifications, setAdminNotifications] = useState<PaymentNotification[]>([]);
  const [showNotificationsView, setShowNotificationsView] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const fetchAdminNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const res = await fetch('/api/admin/payment-notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminNotifications(data.notifications || []);
      }
    } catch (e) {
      console.warn('Failed to load admin notifications:', e);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchAdminNotifications();
  }, [token]);

  const unreadCount = adminNotifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    const unreadIds = adminNotifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    try {
      await fetch('/api/admin/payment-notifications/read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: unreadIds })
      });
      fetchAdminNotifications();
    } catch (e) {
      // Ignored
    }
  };

  // Filtered Payments
  const filteredPayments = payments.filter((p) => {
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesMethod = methodFilter === 'All' || p.paymentMethod === methodFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      p.customerName.toLowerCase().includes(q) ||
      p.mobileNumber.toLowerCase().includes(q) ||
      p.transactionId.toLowerCase().includes(q) ||
      (p.userId && p.userId.toLowerCase().includes(q));
    return matchesStatus && matchesMethod && matchesSearch;
  });

  const pendingCount = payments.filter(p => p.status === 'Pending').length;
  const approvedCount = payments.filter(p => p.status === 'Approved').length;
  const rejectedCount = payments.filter(p => p.status === 'Rejected').length;

  // Approve / Verify Action
  const handleApprovePayment = async (paymentId: string) => {
    setUpdatingId(paymentId);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'Approved',
          adminNotes: adminNotesInput.trim() || undefined
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to approve payment.');
      }

      const data = await res.json();
      onShowNotification(`Payment for ${data.payment.customerName} (PKR ${data.payment.amount}) Approved successfully`);
      onRefresh();
      fetchAdminNotifications();
      if (selectedPayment?.id === paymentId) {
        setSelectedPayment(data.payment);
      }
    } catch (err: any) {
      alert(err.message || 'Error approving payment.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Reject Action
  const handleConfirmReject = async () => {
    if (!rejectModalPayment) return;
    setUpdatingId(rejectModalPayment.id);
    try {
      const res = await fetch(`/api/admin/payments/${rejectModalPayment.id}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'Rejected',
          rejectionReason: rejectionReasonInput.trim(),
          adminNotes: adminNotesInput.trim() || undefined
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to reject payment.');
      }

      const data = await res.json();
      onShowNotification(`Payment ${data.payment.transactionId} rejected.`);
      onRefresh();
      fetchAdminNotifications();
      setRejectModalPayment(null);
      if (selectedPayment?.id === rejectModalPayment.id) {
        setSelectedPayment(data.payment);
      }
    } catch (err: any) {
      alert(err.message || 'Error rejecting payment.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#021319] border border-slate-800">
          <span className="text-[11px] text-slate-400 font-cinzel uppercase">Total Fee Payments</span>
          <div className="text-xl font-bold font-mono text-white tabular-nums">{payments.length}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
          <span className="text-[11px] text-amber-300 font-cinzel uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Pending Review</span>
          </span>
          <div className="text-xl font-bold font-mono text-amber-200 tabular-nums">{pendingCount}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
          <span className="text-[11px] text-emerald-300 font-cinzel uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Approved / Verified</span>
          </span>
          <div className="text-xl font-bold font-mono text-emerald-200 tabular-nums">{approvedCount}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30">
          <span className="text-[11px] text-red-300 font-cinzel uppercase flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
          <div className="text-xl font-bold font-mono text-red-200 tabular-nums">{rejectedCount}</div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Real Notification Drawer Toggle */}
      <div className="p-4 rounded-2xl bg-[#02141a] border border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, phone, TID, user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#031c22] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#021015] p-1 rounded-xl border border-slate-800 text-xs">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-[#032328] text-[#F9E79F] border border-[#D4AF37]/40 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'All' ? 'All' : st}
              </button>
            ))}
          </div>

          {/* Method Filter */}
          <div className="flex items-center gap-1 bg-[#021015] p-1 rounded-xl border border-slate-800 text-xs">
            {['All', 'JazzCash', 'Easypaisa'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethodFilter(m)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  methodFilter === m
                    ? 'bg-[#032328] text-[#F9E79F] border border-[#D4AF37]/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Real Notification Bell */}
          <button
            type="button"
            onClick={() => {
              setShowNotificationsView(!showNotificationsView);
              if (!showNotificationsView) fetchAdminNotifications();
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              unreadCount > 0
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-200 animate-pulse'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              onRefresh();
              fetchAdminNotifications();
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

      </div>

      {/* REAL ADMIN NOTIFICATIONS DRAWER (When toggled) */}
      {showNotificationsView && (
        <div className="p-4 rounded-2xl bg-[#011015] border border-amber-500/40 shadow-xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold font-cinzel text-amber-300 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#D4AF37]" />
              <span>Real Admin Notifications (Database Logs)</span>
            </h4>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] text-[#D4AF37] hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowNotificationsView(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {loadingNotifications ? (
            <div className="py-4 text-center text-xs text-slate-400">Loading alerts...</div>
          ) : adminNotifications.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-500">No admin notifications recorded.</div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {adminNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                    notif.read ? 'bg-[#021319] border-slate-800 text-slate-400' : 'bg-[#042429] border-[#D4AF37]/50 text-slate-200 font-medium'
                  }`}
                >
                  <div className="space-y-0.5">
                    <strong className="text-white block font-cinzel">{notif.title}</strong>
                    <p className="whitespace-pre-line text-[11px] leading-relaxed">{notif.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PAYMENTS TABLE */}
      <div className="rounded-2xl border border-slate-800 bg-[#021319]/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#021015] border-b border-slate-800 text-slate-400 font-cinzel text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Payer Details</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5">Submission Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#031d24]/60 transition-colors">
                    
                    {/* Method */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-cinzel ${
                        p.paymentMethod === 'JazzCash'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>{p.paymentMethod}</span>
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="p-3.5 min-w-[150px]">
                      <div className="font-bold text-white">{p.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{p.mobileNumber}</div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {p.userId}</div>
                    </td>

                    {/* Amount (Min 100, No Max) */}
                    <td className="p-3.5 font-bold font-mono text-emerald-300 whitespace-nowrap text-sm">
                      PKR {p.amount.toLocaleString()}
                    </td>

                    {/* Transaction ID */}
                    <td className="p-3.5 font-mono text-[#D4AF37] font-semibold whitespace-nowrap">
                      {p.transactionId}
                    </td>

                    {/* Date */}
                    <td className="p-3.5 text-slate-300 text-[11px] whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    {/* Status */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        p.status === 'Approved'
                          ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                          : p.status === 'Rejected'
                          ? 'bg-red-950 border border-red-500/40 text-red-300'
                          : 'bg-amber-950 border border-amber-500/40 text-amber-300'
                      }`}>
                        {p.status === 'Approved' && <Check className="w-3 h-3 text-emerald-400" />}
                        {p.status === 'Rejected' && <Ban className="w-3 h-3 text-red-400" />}
                        {p.status === 'Pending' && <Clock className="w-3 h-3 text-amber-400 animate-spin" />}
                        <span>{p.status === 'Pending' ? 'Pending' : p.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              disabled={updatingId === p.id}
                              onClick={() => handleApprovePayment(p.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-semibold cursor-pointer"
                              title="Approve / Verify Payment"
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              disabled={updatingId === p.id}
                              onClick={() => {
                                setRejectModalPayment(p);
                                setRejectionReasonInput('Details could not be verified in JazzCash/Easypaisa statement.');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-950 hover:bg-red-900 border border-red-500/50 text-red-300 text-xs font-semibold cursor-pointer"
                              title="Reject Payment"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPayment(p);
                            setAdminNotesInput(p.adminNotes || '');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700"
                        >
                          Details
                        </button>

                        <a
                          href={`https://wa.me/${p.mobileNumber.replace(/[^0-9]/g, '')}?text=Assalam-o-Alaikum%20${encodeURIComponent(p.customerName)},%20regarding%20your%20Faizan-e-Mustafa%20Academy%20payment%20(TID:%20${p.transactionId})`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-500/30 cursor-pointer"
                          title="WhatsApp Payer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REJECT MODAL WITH REASON */}
      {rejectModalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-md w-full bg-[#031820] border-2 border-red-500/60 p-6 rounded-3xl shadow-2xl space-y-4">
            <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-400" />
              <span>Reject Payment Submission</span>
            </h3>

            <p className="text-xs text-slate-300">
              Transaction ID: <strong className="text-white font-mono">{rejectModalPayment.transactionId}</strong>
              <br />
              Payer: <strong className="text-white">{rejectModalPayment.customerName}</strong> (PKR {rejectModalPayment.amount.toLocaleString()})
            </p>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 block font-cinzel">Rejection Reason (Sent to User in Notification):</label>
              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="e.g. Transaction ID not found in official statement, or amount mismatch."
                className="w-full p-2.5 rounded-xl bg-[#021116] border border-slate-700 text-white text-xs focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRejectModalPayment(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={updatingId === rejectModalPayment.id || !rejectionReasonInput.trim()}
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-[#031820] border-2 border-[#D4AF37]/60 p-6 rounded-3xl shadow-2xl space-y-4">
            
            <button
              onClick={() => setSelectedPayment(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-black/40 hover:bg-black/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-[#F9E79F]">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-cinzel text-white">
                  Payment Record Inspection
                </h3>
                <p className="text-xs text-[#D4AF37] font-mono">
                  TID: {selectedPayment.transactionId}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#021015] border border-slate-800">
                <div>
                  <span className="text-slate-400 block font-cinzel">User Name:</span>
                  <strong className="text-white text-sm">{selectedPayment.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-cinzel">User ID:</span>
                  <span className="text-slate-300 font-mono">{selectedPayment.userId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-cinzel">Mobile Number:</span>
                  <span className="text-slate-200 font-mono">{selectedPayment.mobileNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-cinzel">Payment Method:</span>
                  <strong className="text-white">{selectedPayment.paymentMethod}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-cinzel">Payment Amount:</span>
                  <strong className="text-emerald-300 font-mono text-base">PKR {selectedPayment.amount.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-cinzel">Status:</span>
                  <span className={`font-mono font-bold ${
                    selectedPayment.status === 'Approved' ? 'text-emerald-400' : selectedPayment.status === 'Rejected' ? 'text-red-400' : 'text-amber-300'
                  }`}>
                    {selectedPayment.status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-cinzel">Submitted At:</span>
                  <span className="text-slate-300">{new Date(selectedPayment.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-cinzel">Verified At:</span>
                  <span className="text-slate-300">{selectedPayment.verifiedAt ? new Date(selectedPayment.verifiedAt).toLocaleString() : 'Not yet'}</span>
                </div>
                {selectedPayment.rejectionReason && (
                  <div className="col-span-2 p-2 bg-red-950/40 rounded border border-red-500/30 text-red-200">
                    <strong className="block">Rejection Reason:</strong>
                    {selectedPayment.rejectionReason}
                  </div>
                )}
              </div>

              {/* Admin Audit Notes */}
              <div className="space-y-1.5">
                <label className="text-slate-400 block font-cinzel">Administrative Audit Notes:</label>
                <textarea
                  rows={2}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="e.g. Verified in Arif Hussain 03012887630 statement..."
                  className="w-full p-2.5 rounded-xl bg-[#021116] border border-slate-700 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                {selectedPayment.status !== 'Approved' && (
                  <button
                    type="button"
                    disabled={updatingId === selectedPayment.id}
                    onClick={() => handleApprovePayment(selectedPayment.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Payment</span>
                  </button>
                )}

                {selectedPayment.status !== 'Rejected' && (
                  <button
                    type="button"
                    disabled={updatingId === selectedPayment.id}
                    onClick={() => {
                      setRejectModalPayment(selectedPayment);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-500/40 text-red-200 font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

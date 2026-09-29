import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  ExternalLink,
  MessageCircle,
  FileText,
  ShieldCheck,
  RefreshCw,
  Eye,
  X,
  Filter,
  Check,
  Ban
} from 'lucide-react';
import { PaymentRecord, PaymentStatus } from '../server/paymentService';

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
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);

  // Updating status in-progress
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState<string>('');

  const filteredPayments = payments.filter((p) => {
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      p.customerName.toLowerCase().includes(q) ||
      p.referenceNumber.toLowerCase().includes(q) ||
      p.transactionId.toLowerCase().includes(q) ||
      p.mobileNumber.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = payments.filter(p => p.status === 'Pending Verification').length;
  const verifiedCount = payments.filter(p => p.status === 'Verified').length;
  const rejectedCount = payments.filter(p => p.status === 'Rejected').length;

  const handleUpdateStatus = async (paymentId: string, newStatus: PaymentStatus) => {
    setUpdatingId(paymentId);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: adminNotesInput.trim() || undefined
        })
      });

      if (!res.ok) {
        throw new Error('Failed to update payment status');
      }

      const data = await res.json();
      onShowNotification(`Payment ${data.payment.referenceNumber} status set to: ${newStatus}`);
      onRefresh();
      if (selectedPayment?.id === paymentId) {
        setSelectedPayment(data.payment);
      }
    } catch (err: any) {
      alert(err.message || 'Error updating payment.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#021319] border border-slate-800">
          <span className="text-[11px] text-slate-400 font-cinzel uppercase">Total Submissions</span>
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
            <span>Verified Payments</span>
          </span>
          <div className="text-xl font-bold font-mono text-emerald-200 tabular-nums">{verifiedCount}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30">
          <span className="text-[11px] text-red-300 font-cinzel uppercase flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
          <div className="text-xl font-bold font-mono text-red-200 tabular-nums">{rejectedCount}</div>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="p-4 rounded-2xl bg-[#02141a] border border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference, name, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#031c22] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#021015] p-1 rounded-xl border border-slate-800 text-xs">
            {(['All', 'Pending Verification', 'Verified', 'Rejected'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#032328] text-[#F9E79F] border border-[#D4AF37]/40 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'All' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
          <span>Refresh</span>
        </button>

      </div>

      {/* PAYMENTS TABLE */}
      <div className="rounded-2xl border border-slate-800 bg-[#021319]/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#021015] border-b border-slate-800 text-slate-400 font-cinzel text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Reference #</th>
                <th className="p-3.5">Payer Details</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5">Payment Date</th>
                <th className="p-3.5">Receipt</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No payment verification submissions found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#031d24]/60 transition-colors">
                    
                    {/* Reference # */}
                    <td className="p-3.5 font-mono text-[#D4AF37] font-semibold whitespace-nowrap">
                      {p.referenceNumber}
                    </td>

                    {/* Customer */}
                    <td className="p-3.5 min-w-[140px]">
                      <div className="font-bold text-white">{p.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{p.mobileNumber}</div>
                    </td>

                    {/* Amount */}
                    <td className="p-3.5 font-bold font-mono text-emerald-300 whitespace-nowrap">
                      {p.amount}
                    </td>

                    {/* Transaction ID */}
                    <td className="p-3.5 font-mono text-slate-300 text-[11px] whitespace-nowrap">
                      {p.transactionId}
                    </td>

                    {/* Date */}
                    <td className="p-3.5 text-slate-300 text-[11px] whitespace-nowrap">
                      {p.paymentDate}
                    </td>

                    {/* Screenshot Receipt */}
                    <td className="p-3.5 whitespace-nowrap">
                      {p.screenshotUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewScreenshot(p.screenshotUrl || null)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[#D4AF37] text-[11px] border border-slate-700 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Image</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px]">No image</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        p.status === 'Verified'
                          ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                          : p.status === 'Rejected'
                          ? 'bg-red-950 border border-red-500/40 text-red-300'
                          : 'bg-amber-950 border border-amber-500/40 text-amber-300'
                      }`}>
                        {p.status === 'Verified' && <Check className="w-3 h-3 text-emerald-400" />}
                        {p.status === 'Rejected' && <Ban className="w-3 h-3 text-red-400" />}
                        {p.status === 'Pending Verification' && <Clock className="w-3 h-3 text-amber-400" />}
                        <span>{p.status === 'Verified' ? 'Payment Verified' : p.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPayment(p);
                            setAdminNotesInput(p.adminNotes || '');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700"
                        >
                          Manage
                        </button>

                        <a
                          href={`https://wa.me/${p.mobileNumber.replace(/[^0-9]/g, '')}?text=Assalam-o-Alaikum%20${encodeURIComponent(p.customerName)},%20regarding%20your%20Faizan-e-Mustafa%20Academy%20payment%20(Ref:%20${p.referenceNumber})`}
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

      {/* DETAIL / VERIFICATION DRAWER MODAL */}
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
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-cinzel text-white">
                  Payment Verification Manager
                </h3>
                <p className="text-xs text-[#D4AF37] font-mono">
                  {selectedPayment.referenceNumber}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#021015] border border-slate-800">
                <div>
                  <span className="text-slate-400 block font-cinzel">Payer Name:</span>
                  <strong className="text-white text-sm">{selectedPayment.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-cinzel">Mobile:</span>
                  <span className="text-slate-200 font-mono">{selectedPayment.mobileNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-cinzel">Amount Paid:</span>
                  <strong className="text-emerald-300 font-mono text-sm">{selectedPayment.amount}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-cinzel">Transaction ID:</span>
                  <span className="text-slate-200 font-mono">{selectedPayment.transactionId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-cinzel">Payment Date:</span>
                  <span className="text-slate-300">{selectedPayment.paymentDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-cinzel">Current Status:</span>
                  <span className="text-amber-300 font-mono font-bold">{selectedPayment.status}</span>
                </div>
              </div>

              {selectedPayment.screenshotUrl && (
                <div className="space-y-1">
                  <span className="text-slate-400 block font-cinzel">Payment Receipt / Screenshot:</span>
                  <div
                    onClick={() => setPreviewScreenshot(selectedPayment.screenshotUrl || null)}
                    className="p-1 rounded-xl bg-black/40 border border-slate-700 max-h-36 overflow-hidden cursor-pointer hover:border-[#D4AF37] transition-colors"
                  >
                    <img
                      src={selectedPayment.screenshotUrl}
                      alt="Receipt"
                      className="w-full h-auto object-contain max-h-32 mx-auto rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Admin Follow-up Notes */}
              <div className="space-y-1.5">
                <label className="text-slate-400 block font-cinzel">Administrative Audit Notes:</label>
                <textarea
                  rows={2}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="e.g. Checked UBL statement, funds received in Arif Hussain account..."
                  className="w-full p-2.5 rounded-xl bg-[#021116] border border-slate-700 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={updatingId === selectedPayment.id}
                  onClick={() => handleUpdateStatus(selectedPayment.id, 'Verified')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Verify Payment</span>
                </button>

                <button
                  type="button"
                  disabled={updatingId === selectedPayment.id}
                  onClick={() => handleUpdateStatus(selectedPayment.id, 'Rejected')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-500/40 text-red-200 font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  <Ban className="w-4 h-4" />
                  <span>Reject</span>
                </button>
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

      {/* SCREENSHOT FULL IMAGE PREVIEW MODAL */}
      {previewScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full bg-[#021319] border-2 border-[#D4AF37] p-4 rounded-3xl shadow-2xl text-center space-y-4">
            <button
              onClick={() => setPreviewScreenshot(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-black/60 hover:bg-black/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h4 className="text-base font-bold font-cinzel text-white">Payment Screenshot Preview</h4>
            <div className="max-h-[75vh] overflow-y-auto rounded-xl border border-slate-700 p-2 bg-black/40">
              <img
                src={previewScreenshot}
                alt="Payment Receipt Screenshot"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
            
            <button
              onClick={() => setPreviewScreenshot(null)}
              className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

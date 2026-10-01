import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './firestoreService.ts';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type PaymentMethod = 'JazzCash' | 'Easypaisa';
export type PaymentStatus = 'Pending' | 'Approved' | 'Rejected';

export interface PaymentAccountInfo {
  method: PaymentMethod;
  accountName: string;
  accountNumber: string;
  instructions: string;
}

export const OFFICIAL_PAYMENT_ACCOUNTS: Record<PaymentMethod, PaymentAccountInfo> = {
  JazzCash: {
    method: 'JazzCash',
    accountName: 'Arif Hussain',
    accountNumber: '03012887630',
    instructions: 'Open your JazzCash App or dial *786# -> Send Money to JazzCash Mobile Account -> Enter 03012887630 (Arif Hussain).'
  },
  Easypaisa: {
    method: 'Easypaisa',
    accountName: 'Arif Hussain',
    accountNumber: '03012887630',
    instructions: 'Open your Easypaisa App -> Send Money -> Easypaisa Transfer -> Enter 03012887630 (Arif Hussain).'
  }
};

export interface PaymentRecord {
  id: string;
  userId: string;
  customerName: string;
  mobileNumber: string;
  amount: number; // In PKR, Minimum 100, No maximum limit
  currency: 'PKR';
  paymentMethod: PaymentMethod;
  transactionId: string; // From provider SMS or app confirmation
  status: PaymentStatus;
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  adminNotes?: string;
  createdAt: string;
}

export interface PaymentNotification {
  id: string;
  recipientType: 'admin' | 'user';
  userId?: string;
  paymentId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const PAYMENTS_COLLECTION = 'payments';
const NOTIFICATIONS_COLLECTION = 'payment_notifications';

const DATA_DIR = path.resolve(__dirname, '../../data');
const LOCAL_PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
const LOCAL_NOTIFICATIONS_FILE = path.join(DATA_DIR, 'payment_notifications.json');

let memoryPayments: PaymentRecord[] = [];
let memoryNotifications: PaymentNotification[] = [];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function persistPayments() {
  try {
    ensureDataDir();
    fs.writeFileSync(LOCAL_PAYMENTS_FILE, JSON.stringify(memoryPayments, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Payment] Error persisting payments locally:', err);
  }
}

function persistNotifications() {
  try {
    ensureDataDir();
    fs.writeFileSync(LOCAL_NOTIFICATIONS_FILE, JSON.stringify(memoryNotifications, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Payment] Error persisting notifications locally:', err);
  }
}

export async function initPaymentService(): Promise<void> {
  ensureDataDir();

  console.log(`[Payment] Initializing Official JazzCash / Easypaisa Payment Engine...`);
  console.log(`[Payment] Minimum Amount enforced: PKR 100 | Maximum Amount: No limit`);
  console.log(`[Payment] JazzCash Account: 03012887630 (Arif Hussain)`);
  console.log(`[Payment] Easypaisa Account: 03012887630 (Arif Hussain)`);

  // 1. Load Payments
  if (fs.existsSync(LOCAL_PAYMENTS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(LOCAL_PAYMENTS_FILE, 'utf-8'));
      if (Array.isArray(data)) {
        memoryPayments = data.filter(p => p && typeof p.transactionId === 'string' && typeof p.amount === 'number');
      }
    } catch (e) {
      console.warn('[Payment] Re-initializing local payments file.');
    }
  }

  // 2. Load Notifications
  if (fs.existsSync(LOCAL_NOTIFICATIONS_FILE)) {
    try {
      const notifs = JSON.parse(fs.readFileSync(LOCAL_NOTIFICATIONS_FILE, 'utf-8'));
      if (Array.isArray(notifs)) memoryNotifications = notifs;
    } catch (e) {
      console.warn('[Payment] Re-initializing local notifications file.');
    }
  }

  // 3. Sync from Firestore if available
  try {
    const colRef = collection(db, PAYMENTS_COLLECTION);
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(500));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const loaded: PaymentRecord[] = [];
      snap.forEach(docSnap => loaded.push(docSnap.data() as PaymentRecord));
      memoryPayments = loaded;
      persistPayments();
      console.log(`[Payment] Synced ${memoryPayments.length} payments from Cloud Firestore.`);
    }
  } catch (err) {
    console.warn('[Payment] Firestore payment sync note:', err);
  }

  try {
    const notifRef = collection(db, NOTIFICATIONS_COLLECTION);
    const nq = query(notifRef, orderBy('createdAt', 'desc'), limit(500));
    const nsnap = await getDocs(nq);
    if (!nsnap.empty) {
      const loadedNotifs: PaymentNotification[] = [];
      nsnap.forEach(docSnap => loadedNotifs.push(docSnap.data() as PaymentNotification));
      memoryNotifications = loadedNotifs;
      persistNotifications();
    }
  } catch (err) {
    console.warn('[Payment] Firestore notification sync note:', err);
  }
}

/**
 * Real Database Notification Creator
 */
export async function createNotification(notifData: Omit<PaymentNotification, 'id' | 'createdAt' | 'read'>): Promise<PaymentNotification> {
  const notification: PaymentNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...notifData,
    read: false,
    createdAt: new Date().toISOString()
  };

  memoryNotifications.unshift(notification);
  persistNotifications();

  try {
    await setDoc(doc(db, NOTIFICATIONS_COLLECTION, notification.id), notification);
  } catch (err) {
    console.error('[Notification] Error writing to Firestore:', err);
  }

  return notification;
}

/**
 * SUBMIT PAYMENT
 * Flow:
 * - Validate minimum PKR 100
 * - NO maximum limit
 * - Duplicate Transaction ID check
 * - Status = 'Pending'
 * - Real Admin Notification
 * - Real User Notification
 */
export async function submitPayment(data: {
  userId?: string;
  customerName: string;
  mobileNumber: string;
  amount: number | string;
  paymentMethod: PaymentMethod;
  transactionId: string;
}): Promise<PaymentRecord> {
  // Validate Payment Method
  if (data.paymentMethod !== 'JazzCash' && data.paymentMethod !== 'Easypaisa') {
    throw new Error('Please select a valid payment method (JazzCash or Easypaisa).');
  }

  // Validate Amount (Minimum PKR 100, No Maximum Limit)
  const numAmount = typeof data.amount === 'string' ? parseFloat(data.amount.replace(/[^0-9.]/g, '')) : data.amount;
  if (isNaN(numAmount) || numAmount < 100) {
    throw new Error('Minimum payment amount is PKR 100. Payments below PKR 100 are not accepted.');
  }

  // Validate Customer Details
  const cleanName = (data.customerName || '').trim();
  if (!cleanName) {
    throw new Error('Please enter your full name.');
  }

  const cleanMobile = (data.mobileNumber || '').trim();
  if (!cleanMobile) {
    throw new Error('Please enter your contact mobile number.');
  }

  // Validate and Check Duplicate Transaction ID
  const cleanTxnId = (data.transactionId || '').trim();
  if (!cleanTxnId) {
    throw new Error('Please provide the Transaction ID / Reference Number from your JazzCash/Easypaisa payment receipt.');
  }

  // STRICT Duplicate Check across all stored records (case-insensitive)
  const isDuplicate = memoryPayments.some(
    p => typeof p.transactionId === 'string' && p.transactionId.toLowerCase() === cleanTxnId.toLowerCase()
  );

  if (isDuplicate) {
    throw new Error('This Transaction ID has already been submitted and is under review or completed. Duplicate transaction rejected.');
  }

  const id = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const userId = (data.userId || '').trim() || `usr_${cleanMobile.replace(/[^0-9]/g, '').slice(-7)}`;
  const createdAt = new Date().toISOString();

  const record: PaymentRecord = {
    id,
    userId,
    customerName: cleanName,
    mobileNumber: cleanMobile,
    amount: numAmount,
    currency: 'PKR',
    paymentMethod: data.paymentMethod,
    transactionId: cleanTxnId,
    status: 'Pending',
    createdAt
  };

  memoryPayments.unshift(record);
  persistPayments();

  // Sync to Firestore
  try {
    await setDoc(doc(db, PAYMENTS_COLLECTION, record.id), record);
  } catch (err) {
    console.error('[Payment] Firestore sync on payment submit:', err);
  }

  // REAL NOTIFICATIONS:
  // 1. Admin Notification
  await createNotification({
    recipientType: 'admin',
    paymentId: record.id,
    title: 'New Payment Received',
    message: `New Payment Received\nUser: ${record.customerName}\nAmount: PKR ${record.amount.toLocaleString()}\nPayment Method: ${record.paymentMethod}\nTransaction ID: ${record.transactionId}`
  });

  // 2. User Notification
  await createNotification({
    recipientType: 'user',
    userId: record.userId,
    paymentId: record.id,
    title: 'Payment Submitted',
    message: 'Your payment has been submitted successfully and is pending verification.'
  });

  return record;
}

/**
 * VERIFY / APPROVE OR REJECT PAYMENT (Authorized Admin Action)
 */
export async function adminVerifyPayment(
  paymentId: string,
  newStatus: 'Approved' | 'Rejected',
  adminNotes?: string,
  rejectionReason?: string,
  adminUsername: string = 'Admin'
): Promise<PaymentRecord | null> {
  const index = memoryPayments.findIndex(p => p.id === paymentId);
  if (index === -1) return null;

  const existing = memoryPayments[index];
  const verifiedAt = new Date().toISOString();

  const updated: PaymentRecord = {
    ...existing,
    status: newStatus,
    adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes,
    rejectionReason: newStatus === 'Rejected' ? (rejectionReason || 'Details could not be verified in official bank statement.') : undefined,
    verifiedAt,
    verifiedBy: adminUsername
  };

  memoryPayments[index] = updated;
  persistPayments();

  // Sync update to Firestore
  try {
    await updateDoc(doc(db, PAYMENTS_COLLECTION, paymentId), {
      status: updated.status,
      verifiedAt: updated.verifiedAt,
      verifiedBy: updated.verifiedBy,
      adminNotes: updated.adminNotes || null,
      rejectionReason: updated.rejectionReason || null
    });
  } catch (err) {
    console.error('[Payment] Firestore update on status change:', err);
  }

  // REAL NOTIFICATION TO USER UPON APPROVAL OR REJECTION:
  if (newStatus === 'Approved') {
    await createNotification({
      recipientType: 'user',
      userId: updated.userId,
      paymentId: updated.id,
      title: 'Payment Approved',
      message: `Your payment of PKR ${updated.amount.toLocaleString()} has been verified successfully.`
    });
  } else if (newStatus === 'Rejected') {
    await createNotification({
      recipientType: 'user',
      userId: updated.userId,
      paymentId: updated.id,
      title: 'Payment Rejected',
      message: `Your payment of PKR ${updated.amount.toLocaleString()} has been rejected. Reason: ${updated.rejectionReason || 'Verification failed.'}`
    });
  }

  return updated;
}

/**
 * USER PAYMENT HISTORY
 * Strictly isolated: A user can only access their own payments.
 */
export function getUserPaymentHistory(userId: string, mobileNumber?: string): PaymentRecord[] {
  const cleanId = (userId || '').trim().toLowerCase();
  const cleanMob = (mobileNumber || '').replace(/[^0-9]/g, '');

  return memoryPayments.filter(p => {
    const matchesUser = cleanId && p.userId.toLowerCase() === cleanId;
    const matchesMob = cleanMob && p.mobileNumber.replace(/[^0-9]/g, '') === cleanMob;
    return matchesUser || matchesMob;
  });
}

/**
 * USER NOTIFICATIONS
 */
export function getUserNotifications(userId: string, mobileNumber?: string): PaymentNotification[] {
  const cleanId = (userId || '').trim().toLowerCase();
  const cleanMob = (mobileNumber || '').replace(/[^0-9]/g, '');

  return memoryNotifications.filter(n => {
    if (n.recipientType !== 'user') return false;
    const matchesUser = cleanId && (n.userId || '').toLowerCase() === cleanId;
    const matchesMob = cleanMob && (n.userId || '').includes(cleanMob);
    return matchesUser || matchesMob;
  });
}

/**
 * ADMIN: ALL PAYMENTS
 */
export function getAllAdminPayments(): PaymentRecord[] {
  return [...memoryPayments];
}

/**
 * ADMIN: NOTIFICATIONS
 */
export function getAdminNotifications(): PaymentNotification[] {
  return memoryNotifications.filter(n => n.recipientType === 'admin');
}

/**
 * MARK NOTIFICATIONS AS READ
 */
export async function markNotificationsAsRead(ids: string[]): Promise<void> {
  const idSet = new Set(ids);
  memoryNotifications.forEach(n => {
    if (idSet.has(n.id)) {
      n.read = true;
    }
  });
  persistNotifications();

  for (const id of ids) {
    try {
      await updateDoc(doc(db, NOTIFICATIONS_COLLECTION, id), { read: true });
    } catch (e) {
      // Ignored
    }
  }
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './firestoreService.ts';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type PaymentStatus = 'Pending Verification' | 'Verified' | 'Rejected';

export interface PaymentRecord {
  id: string;
  referenceNumber: string;
  customerName: string;
  mobileNumber: string;
  amount: string;
  transactionId: string;
  paymentDate: string;
  screenshotUrl?: string;
  submissionDate: string;
  status: PaymentStatus;
  adminNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

const PAYMENTS_COLLECTION = 'payments';
const DATA_DIR = path.resolve(__dirname, '../../data');
const LOCAL_PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');

let memoryPayments: PaymentRecord[] = [];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function persistToLocalFile(payments: PaymentRecord[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(LOCAL_PAYMENTS_FILE, JSON.stringify(payments, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Payment] Error saving local backup:', err);
  }
}

// Generate unique, memorable reference code: PAY-FMA-XXXX-XXXX
export function generateReferenceNumber(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const year = new Date().getFullYear();
  const serial = Math.floor(1000 + Math.random() * 9000);
  return `PAY-FMA-${year}-${randomPart}${serial}`;
}

export async function initPaymentService(): Promise<void> {
  ensureDataDir();

  // 1. Try reading from local file
  if (fs.existsSync(LOCAL_PAYMENTS_FILE)) {
    try {
      const content = fs.readFileSync(LOCAL_PAYMENTS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        memoryPayments = parsed;
        console.log(`[Payment] Loaded ${memoryPayments.length} payment records from local store.`);
        return;
      }
    } catch (e) {
      console.warn('[Payment] Local payments file reinitializing.');
    }
  }

  // 2. Try fetching from Firestore
  try {
    const colRef = collection(db, PAYMENTS_COLLECTION);
    const q = query(colRef, orderBy('submissionDate', 'desc'), limit(500));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const loaded: PaymentRecord[] = [];
      snap.forEach(docSnap => loaded.push(docSnap.data() as PaymentRecord));
      memoryPayments = loaded;
      persistToLocalFile(memoryPayments);
      console.log(`[Payment] Synced ${memoryPayments.length} payments from Cloud Firestore.`);
      return;
    }
  } catch (err) {
    console.warn('[Payment] Could not fetch from Firestore, starting clean store:', err);
  }

  memoryPayments = [];
  persistToLocalFile(memoryPayments);
}

/**
 * Submit payment for verification.
 * Strictly initial status: "Pending Verification"
 */
export async function submitPayment(data: {
  customerName: string;
  mobileNumber: string;
  amount: string;
  transactionId: string;
  paymentDate: string;
  screenshotUrl?: string;
}): Promise<PaymentRecord> {
  const id = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const referenceNumber = generateReferenceNumber();
  const submissionDate = new Date().toISOString();

  const record: PaymentRecord = {
    id,
    referenceNumber,
    customerName: data.customerName.trim(),
    mobileNumber: data.mobileNumber.trim(),
    amount: data.amount.trim(),
    transactionId: data.transactionId.trim(),
    paymentDate: data.paymentDate.trim() || submissionDate.split('T')[0],
    screenshotUrl: data.screenshotUrl || undefined,
    submissionDate,
    status: 'Pending Verification',
    adminNotes: ''
  };

  memoryPayments.unshift(record);
  persistToLocalFile(memoryPayments);

  // Sync to Firestore
  try {
    await setDoc(doc(db, PAYMENTS_COLLECTION, record.id), record);
  } catch (err) {
    console.error('[Payment] Error saving payment to Firestore:', err);
  }

  return record;
}

export function getAllPayments(): PaymentRecord[] {
  return [...memoryPayments];
}

export function getPaymentByReference(referenceNumber: string): PaymentRecord | undefined {
  const cleanRef = referenceNumber.trim().toUpperCase();
  return memoryPayments.find(p => p.referenceNumber.toUpperCase() === cleanRef);
}

export async function updatePaymentStatus(
  id: string,
  newStatus: PaymentStatus,
  adminNotes?: string,
  verifiedBy: string = 'Admin'
): Promise<PaymentRecord | null> {
  const index = memoryPayments.findIndex(p => p.id === id);
  if (index === -1) {
    return null;
  }

  const existing = memoryPayments[index];
  const updated: PaymentRecord = {
    ...existing,
    status: newStatus,
    adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes,
    verifiedAt: newStatus === 'Verified' ? new Date().toISOString() : existing.verifiedAt,
    verifiedBy: newStatus === 'Verified' ? verifiedBy : existing.verifiedBy
  };

  memoryPayments[index] = updated;
  persistToLocalFile(memoryPayments);

  // Update in Firestore
  try {
    const docRef = doc(db, PAYMENTS_COLLECTION, id);
    await updateDoc(docRef, {
      status: updated.status,
      adminNotes: updated.adminNotes || '',
      verifiedAt: updated.verifiedAt || null,
      verifiedBy: updated.verifiedBy || null
    });
  } catch (err) {
    console.error('[Payment] Error updating payment in Firestore:', err);
  }

  return updated;
}

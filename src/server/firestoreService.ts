import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Firestore
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load firebase-applet-config.json from project root
const configPath = path.resolve(__dirname, '../../firebase-applet-config.json');
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore with specified database ID
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface InquiryDocument {
  id: string;
  type: 'free_trial' | 'admission' | 'inquiry' | 'contact';
  studentName: string;
  parentName: string;
  age: string;
  country: string;
  whatsapp: string;
  email: string;
  course: string;
  timing: string;
  genderPreference?: 'Any' | 'Male Teacher' | 'Female Teacher';
  message: string;
  status: 'New' | 'Contacted' | 'Enrolled' | 'Completed';
  createdAt: string;
  adminNotes?: string;
  isDemo?: boolean;
}

const COLLECTION_NAME = 'inquiries';

/**
 * Save new inquiry directly to Cloud Firestore. Throws on error so callers can handle persistence failure.
 */
export async function createInquiryInFirestore(data: InquiryDocument): Promise<InquiryDocument> {
  const docRef = doc(db, COLLECTION_NAME, data.id);
  // Real write to Cloud Firestore
  await setDoc(docRef, data);
  return data;
}

/**
 * Fetch all inquiries from Cloud Firestore ordered by creation date descending
 */
export async function getInquiriesFromFirestore(): Promise<InquiryDocument[]> {
  const colRef = collection(db, COLLECTION_NAME);
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  const results: InquiryDocument[] = [];
  snapshot.forEach((snapDoc) => {
    results.push(snapDoc.data() as InquiryDocument);
  });
  return results;
}

/**
 * Update an inquiry in Cloud Firestore
 */
export async function updateInquiryInFirestore(
  id: string,
  updates: Partial<Pick<InquiryDocument, 'status' | 'adminNotes'>>
): Promise<InquiryDocument | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    return null;
  }
  await updateDoc(docRef, updates as { [x: string]: any });
  const updatedSnap = await getDoc(docRef);
  return updatedSnap.data() as InquiryDocument;
}

/**
 * Delete an inquiry in Cloud Firestore
 */
export async function deleteInquiryInFirestore(id: string): Promise<boolean> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    return false;
  }
  await deleteDoc(docRef);
  return true;
}

/**
 * Seed initial sample/demo records to Firestore if collection is empty
 */
export async function seedDemoRecordsIfEmpty(demoRecords: InquiryDocument[]): Promise<void> {
  try {
    const existing = await getInquiriesFromFirestore();
    if (existing.length === 0) {
      console.log('[Firestore] Seeding initial academy demo records to Cloud Firestore...');
      for (const record of demoRecords) {
        await setDoc(doc(db, COLLECTION_NAME, record.id), {
          ...record,
          isDemo: true
        });
      }
      console.log('[Firestore] Seed records stored in Cloud Firestore.');
    }
  } catch (err) {
    console.error('[Firestore] Error checking/seeding demo records:', err);
  }
}

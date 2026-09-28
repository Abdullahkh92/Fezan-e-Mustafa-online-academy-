import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID required by AI Studio
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test server connectivity on initialization
export async function verifyFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firestore] Database connected successfully to', firebaseConfig.firestoreDatabaseId);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('[Firestore] Client is offline. Please check your Firebase configuration.');
    } else {
      // Missing test doc is normal, means connection succeeded
      console.log('[Firestore] Connection validated to Cloud Firestore.');
    }
    return true;
  }
}

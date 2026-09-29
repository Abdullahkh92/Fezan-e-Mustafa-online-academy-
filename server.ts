import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  createInquiryInFirestore,
  getInquiriesFromFirestore,
  updateInquiryInFirestore,
  deleteInquiryInFirestore,
  seedDemoRecordsIfEmpty,
  InquiryDocument
} from './src/server/firestoreService.ts';
import {
  validateCredentials,
  createAdminToken,
  revokeSessionToken,
  requireAdminAuth,
  checkRateLimit,
  recordLoginAttempt,
  AuthenticatedRequest
} from './src/server/auth.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initial demo records with isDemo: true to separate from real production submissions
const initialSeedRecords: InquiryDocument[] = [
  {
    id: 'fma-demo-1',
    type: 'free_trial',
    studentName: 'Zayd Al-Mansoor',
    parentName: 'Tariq Al-Mansoor',
    age: '8',
    country: 'United Kingdom',
    whatsapp: '+44 7911 123456',
    email: 'tariq.mansoor@example.co.uk',
    course: 'Madni Qaida',
    timing: 'Evening (5:00 PM - 8:00 PM GMT)',
    genderPreference: 'Male Teacher',
    message: 'We want our son Zayd to start learning Qaida from the basic letters with Tajweed pronunciation. Interested in a 3-day free trial on Zoom.',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    adminNotes: 'Requested male teacher. UK time zone.',
    isDemo: true
  },
  {
    id: 'fma-demo-2',
    type: 'admission',
    studentName: 'Amina Fatima',
    parentName: 'Maryam Siddiqui',
    age: '11',
    country: 'United States',
    whatsapp: '+1 312 555 0192',
    email: 'maryam.s@example.com',
    course: 'Quran Reading (Nazra)',
    timing: 'Weekend Morning (EST)',
    genderPreference: 'Female Teacher',
    message: 'Amina finished her Noorani Qaida and wants to read the full Quran fluently. Please assign a female teacher.',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    adminNotes: 'Contacted parent via WhatsApp. Scheduled trial for Saturday.',
    isDemo: true
  },
  {
    id: 'fma-demo-3',
    type: 'free_trial',
    studentName: 'Muhammad Hamza',
    parentName: 'Rashid Khan',
    age: '14',
    country: 'Pakistan',
    whatsapp: '+92 345 4040452',
    email: 'rashid.k@example.com',
    course: 'Hifz-ul-Quran (Memorization)',
    timing: 'After Fajr (6:30 AM PKT)',
    genderPreference: 'Male Teacher',
    message: 'Hamza has memorized 5 Juz and wants to continue full Hifz with a systematic daily routine.',
    status: 'Enrolled',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    adminNotes: 'Student evaluated and enrolled in Morning Hifz track.',
    isDemo: true
  },
  {
    id: 'fma-demo-4',
    type: 'contact',
    studentName: 'Dr. Bilal Qureshi',
    parentName: 'Self',
    age: '34',
    country: 'Canada',
    whatsapp: '+1 416 555 8921',
    email: 'bilal.q@example.ca',
    course: 'Quran with Tajweed',
    timing: 'Late Night (9:00 PM EST)',
    genderPreference: 'Male Teacher',
    message: 'As a working professional, I want to refine my Tajweed rules and Makharij. Inquiring about 1-on-1 adult flexible slots.',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    adminNotes: 'Adult student inquiry for advanced Tajweed.',
    isDemo: true
  }
];

// Seed Firestore with demo records only if the cloud collection is empty
seedDemoRecordsIfEmpty(initialSeedRecords).catch((err) => {
  console.error('[Startup] Failed to check/seed Firestore:', err);
});

// =========================================================================
// PUBLIC ENDPOINTS (No Authentication Required)
// =========================================================================

/**
 * 1. Submit form (Free Trial, Admission, Contact, Inquiry)
 * STRICT PRIVACY REQUIREMENT:
 * - Publicly accessible for new prospective students.
 * - Only returns an acknowledgment with the student's own reference ID.
 * - NEVER returns the full inquiry list or any other student's records.
 */
app.post('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const {
      type = 'inquiry',
      studentName,
      parentName,
      age,
      country,
      whatsapp,
      email,
      course,
      timing,
      genderPreference = 'Any',
      message = ''
    } = req.body;

    if (!studentName || !whatsapp) {
      return res.status(400).json({ error: 'Student name and WhatsApp number are required' });
    }

    const uniqueId = 'fma-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);

    const newRecord: InquiryDocument = {
      id: uniqueId,
      type,
      studentName: studentName.trim(),
      parentName: (parentName || studentName).trim(),
      age: String(age || ''),
      country: (country || 'Unspecified').trim(),
      whatsapp: whatsapp.trim(),
      email: (email || '').trim(),
      course: course || 'General Quran Learning',
      timing: timing || 'Flexible',
      genderPreference,
      message: (message || '').trim(),
      status: 'New',
      createdAt: new Date().toISOString(),
      isDemo: false // Real production student submission
    };

    // Await actual Cloud Firestore persistence
    await createInquiryInFirestore(newRecord);

    console.log(`[Firestore] Successfully persisted inquiry ${newRecord.id} to Cloud Firestore.`);

    // Return ONLY privacy-safe confirmation metadata for this submission
    return res.status(201).json({
      success: true,
      message: 'Your application has been received successfully! Our academic coordinator will contact you on WhatsApp shortly.',
      referenceId: newRecord.id,
      studentName: newRecord.studentName,
      course: newRecord.course,
      whatsapp: newRecord.whatsapp
    });
  } catch (error: any) {
    console.error('[Firestore Error] Failed to persist inquiry to Cloud Firestore:', error);
    return res.status(500).json({
      error: 'Database storage error: Failed to save application to cloud database. Please try again or contact us directly on WhatsApp.'
    });
  }
});

// =========================================================================
// ADMIN AUTHENTICATION ENDPOINTS
// =========================================================================

/**
 * Admin Login
 * Authenticates administrator credentials and issues a secure cryptographically signed session token.
 */
app.post('/api/admin/login', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const { allowed, waitSeconds } = checkRateLimit(ip);

  if (!allowed) {
    return res.status(429).json({
      error: `Too many failed login attempts. Please wait ${waitSeconds} seconds before trying again.`,
      code: 'RATE_LIMITED'
    });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    recordLoginAttempt(ip, false);
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const isValid = validateCredentials(username, password);

  if (!isValid) {
    recordLoginAttempt(ip, false);
    return res.status(401).json({
      error: 'Invalid administrator credentials. Access denied.',
      code: 'INVALID_CREDENTIALS'
    });
  }

  recordLoginAttempt(ip, true);
  const token = createAdminToken(username.trim());

  // Set secure HTTP-only cookie
  res.cookie('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  return res.json({
    success: true,
    message: 'Admin authentication successful',
    token,
    user: {
      username: username.trim(),
      role: 'admin'
    }
  });
});

/**
 * Admin Logout
 * Invalidates the session token on the server and clears the session cookie.
 */
app.post('/api/admin/logout', (req: Request, res: Response) => {
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }
  if (!token && req.headers.cookie) {
    const match = req.headers.cookie.match(/admin_session=([^;]+)/);
    if (match) token = match[1].trim();
  }

  if (token) {
    revokeSessionToken(token);
  }

  res.clearCookie('admin_session');
  return res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * Verify Admin Session
 */
app.get('/api/admin/session', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    authenticated: true,
    user: req.adminUser
  });
});

// =========================================================================
// PROTECTED ADMIN ENDPOINTS (Strictly requires valid admin session)
// =========================================================================

/**
 * 2. Admin: Get all inquiries with search & filter from Cloud Firestore
 */
app.get('/api/admin/inquiries', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search = '', status = 'All', type = 'All', course = 'All' } = req.query;

    let records = await getInquiriesFromFirestore();

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      records = records.filter(
        r =>
          r.studentName.toLowerCase().includes(q) ||
          r.parentName.toLowerCase().includes(q) ||
          r.whatsapp.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q) ||
          r.course.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'All') {
      records = records.filter(r => r.status === status);
    }

    if (type && type !== 'All') {
      records = records.filter(r => r.type === type);
    }

    if (course && course !== 'All') {
      records = records.filter(r => r.course === course);
    }

    return res.json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    console.error('[Firestore Error] Error fetching admin inquiries:', error);
    return res.status(500).json({ error: 'Failed to retrieve records from cloud database' });
  }
});

/**
 * 3. Admin: Update inquiry status or notes in Cloud Firestore
 */
app.patch('/api/admin/inquiries/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updates: Partial<Pick<InquiryDocument, 'status' | 'adminNotes'>> = {};
    if (status) updates.status = status;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;

    const updated = await updateInquiryInFirestore(id, updates);

    if (!updated) {
      return res.status(404).json({ error: 'Record not found in cloud database' });
    }

    return res.json({
      success: true,
      message: 'Record updated successfully in cloud database',
      record: updated
    });
  } catch (error) {
    console.error('[Firestore Error] Error updating inquiry:', error);
    return res.status(500).json({ error: 'Failed to update record in cloud database' });
  }
});

/**
 * 4. Admin: Delete inquiry from Cloud Firestore
 */
app.delete('/api/admin/inquiries/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteInquiryInFirestore(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Record not found in cloud database' });
    }

    return res.json({
      success: true,
      message: 'Record deleted successfully from cloud database'
    });
  } catch (error) {
    console.error('[Firestore Error] Error deleting inquiry:', error);
    return res.status(500).json({ error: 'Failed to delete record from cloud database' });
  }
});

/**
 * 5. Admin: Aggregated stats from Cloud Firestore
 */
app.get('/api/admin/stats', requireAdminAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const records = await getInquiriesFromFirestore();
    const total = records.length;
    const newCount = records.filter(r => r.status === 'New').length;
    const contactedCount = records.filter(r => r.status === 'Contacted').length;
    const enrolledCount = records.filter(r => r.status === 'Enrolled').length;
    const completedCount = records.filter(r => r.status === 'Completed').length;

    const freeTrials = records.filter(r => r.type === 'free_trial').length;
    const admissions = records.filter(r => r.type === 'admission').length;
    const realSubmissions = records.filter(r => !r.isDemo).length;

    return res.json({
      total,
      newCount,
      contactedCount,
      enrolledCount,
      completedCount,
      freeTrials,
      admissions,
      realSubmissions
    });
  } catch (error) {
    console.error('[Firestore Error] Error computing stats:', error);
    return res.status(500).json({ error: 'Failed to compute stats from cloud database' });
  }
});

/**
 * 6. Admin: Seed demo data if requested explicitly by authorized administrator
 */
app.post('/api/admin/seed', requireAdminAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    for (const record of initialSeedRecords) {
      await createInquiryInFirestore(record);
    }
    const all = await getInquiriesFromFirestore();
    return res.json({ success: true, message: 'Sample records restored in Firestore', records: all });
  } catch (error) {
    console.error('[Firestore Error] Error re-seeding records:', error);
    return res.status(500).json({ error: 'Failed to seed records in cloud database' });
  }
});

// =========================================================================
// VITE SPA MIDDLEWARE / STATIC SERVING
// =========================================================================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Faizan-e-Mustafa Online Academy server running on http://localhost:${PORT}`);
    console.log(`Cloud Firestore integration active: Persistent database in use.`);
    console.log(`Security: Server-side Administrator Authentication enforced.`);
  });
}

startServer();

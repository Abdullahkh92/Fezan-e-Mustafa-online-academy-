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
import {
  initTrafficService,
  recordVisit,
  getTrafficAnalytics
} from './src/server/trafficService.ts';
import {
  initPaymentService,
  OFFICIAL_PAYMENT_ACCOUNTS,
  submitPayment,
  adminVerifyPayment,
  getUserPaymentHistory,
  getUserNotifications,
  getAllAdminPayments,
  getAdminNotifications,
  markNotificationsAsRead
} from './src/server/paymentService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.text({ type: ['text/plain', 'application/json'], limit: '10mb' }));

// Statically serve images reliably in development and production
app.use('/images', express.static(path.resolve(__dirname, 'public/images'), { maxAge: '7d' }));
app.use('/src/assets/images', express.static(path.resolve(__dirname, 'src/assets/images'), { maxAge: '7d' }));
app.use(express.static(path.resolve(__dirname, 'public'), { maxAge: '7d' }));

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

/**
 * 7. Public: Anonymous Visitor Traffic Tracking (rate-limited, sanitized)
 */
app.post('/api/track-visit', async (req: Request, res: Response) => {
  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (_) {}
    }

    if (!payload || typeof payload !== 'object' || !payload.visitorId) {
      return res.status(400).json({ error: 'Invalid tracking payload' });
    }

    const result = await recordVisit({
      visitorId: String(payload.visitorId),
      sessionId: payload.sessionId ? String(payload.sessionId) : undefined,
      page: payload.page ? String(payload.page) : '/',
      referrer: payload.referrer ? String(payload.referrer) : 'Direct',
      deviceType: payload.deviceType,
      browser: payload.browser ? String(payload.browser) : 'Unknown',
      os: payload.os ? String(payload.os) : 'Unknown',
      country: payload.country ? String(payload.country) : undefined,
      userAgent: req.headers['user-agent']
    });

    return res.json(result);
  } catch (error) {
    console.error('[Traffic Tracking Error]:', error);
    return res.status(500).json({ error: 'Failed to record visitor analytics' });
  }
});

/**
 * 8. Search Engine Crawling & Indexation Endpoints (SEO)
 */
app.get('/robots.txt', (_req: Request, res: Response) => {
  res.type('text/plain');
  res.sendFile(path.resolve(__dirname, 'public/robots.txt'));
});

app.get('/sitemap.xml', (_req: Request, res: Response) => {
  res.type('application/xml');
  res.sendFile(path.resolve(__dirname, 'public/sitemap.xml'));
});

/**
 * 8. Admin: Comprehensive Traffic Analytics (Strictly authenticated)
 */
app.get('/api/admin/traffic', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = getTrafficAnalytics();
    return res.json(stats);
  } catch (error) {
    console.error('[Traffic Analytics Error]:', error);
    return res.status(500).json({ error: 'Failed to generate traffic analytics' });
  }
});

/**
 * 9. Public: Get Official Payment Accounts Info (JazzCash / Easypaisa)
 */
app.get('/api/payments/accounts', (_req: Request, res: Response) => {
  return res.json({
    accounts: OFFICIAL_PAYMENT_ACCOUNTS,
    minAmount: 100,
    currency: 'PKR'
  });
});

/**
 * 10. Public: Submit Payment (JazzCash / Easypaisa)
 * Flow: User enters Amount (min 100, no max limit), Name, Mobile, and Transaction ID
 * Sets status = 'Pending', checks duplicates, triggers real Admin and User notifications
 */
app.post('/api/payments/submit', async (req: Request, res: Response) => {
  try {
    const { userId, customerName, mobileNumber, amount, paymentMethod, transactionId } = req.body;

    if (!customerName || !mobileNumber || !paymentMethod || !transactionId) {
      return res.status(400).json({ error: 'Please provide Customer Name, Mobile Number, Payment Method, and Transaction ID.' });
    }

    const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount;
    if (isNaN(numAmount) || numAmount < 100) {
      return res.status(400).json({ error: 'Minimum payment amount is PKR 100. Payments below PKR 100 are not accepted.' });
    }

    if (paymentMethod !== 'JazzCash' && paymentMethod !== 'Easypaisa') {
      return res.status(400).json({ error: 'Invalid payment method. Only JazzCash and Easypaisa are accepted.' });
    }

    const payment = await submitPayment({
      userId,
      customerName,
      mobileNumber,
      amount: numAmount,
      paymentMethod,
      transactionId
    });

    return res.status(201).json({
      success: true,
      payment,
      message: 'Your payment has been submitted successfully and is pending verification.'
    });
  } catch (error: any) {
    console.error('[Payment Submit Error]:', error.message);
    const isDup = error.message.includes('already been submitted');
    return res.status(isDup ? 409 : 400).json({ error: error.message || 'Failed to submit payment' });
  }
});

/**
 * 11. User Isolated: Get User Payment History
 * Users only see their own transactions
 */
app.get('/api/payments/user-history', (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || '';
    const mobile = (req.query.mobileNumber as string) || '';
    if (!userId && !mobile) {
      return res.json({ payments: [] });
    }

    const payments = getUserPaymentHistory(userId, mobile);
    return res.json({ payments });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve payment history' });
  }
});

/**
 * 12. User Isolated: Get User Notifications
 */
app.get('/api/payments/user-notifications', (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || '';
    const mobile = (req.query.mobileNumber as string) || '';
    if (!userId && !mobile) {
      return res.json({ notifications: [] });
    }

    const notifications = getUserNotifications(userId, mobile);
    return res.json({ notifications });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve notifications' });
  }
});

/**
 * 13. Admin: Get All Payments
 */
app.get('/api/admin/payments', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const payments = getAllAdminPayments();
    return res.json({ count: payments.length, payments });
  } catch (error) {
    console.error('[Admin Payments Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

/**
 * 14. Admin: Verify / Approve or Reject Payment
 * Actions: 'Approved' | 'Rejected'
 */
app.patch('/api/admin/payments/:id/verify', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, adminNotes, rejectionReason } = req.body;
    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be either Approved or Rejected.' });
    }

    const updated = await adminVerifyPayment(
      req.params.id,
      status,
      adminNotes,
      rejectionReason,
      req.adminUser?.username || 'Admin'
    );

    if (!updated) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    return res.json({ success: true, payment: updated });
  } catch (error: any) {
    console.error('[Admin Verify Error]:', error);
    return res.status(500).json({ error: error.message || 'Failed to update payment status' });
  }
});

/**
 * 15. Admin: Real Payment Notifications
 */
app.get('/api/admin/payment-notifications', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const notifications = getAdminNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;
    return res.json({ notifications, unreadCount });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch admin notifications' });
  }
});

/**
 * 16. Admin: Mark Notifications Read
 */
app.post('/api/admin/payment-notifications/read', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ids } = req.body;
    if (Array.isArray(ids)) {
      await markNotificationsAsRead(ids);
    }
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// =========================================================================
// VITE SPA MIDDLEWARE / STATIC SERVING
// =========================================================================
async function startServer() {
  // Initialize persistent visitor analytics engine
  await initTrafficService();
  // Initialize persistent payment service
  await initPaymentService();
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

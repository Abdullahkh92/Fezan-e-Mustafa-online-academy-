import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent database file setup
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'academy_db.json');

interface InquiryRecord {
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
}

// Ensure database directory and file exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadDatabase(): InquiryRecord[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }
  return [];
}

function saveDatabase(records: InquiryRecord[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

// Initial seed data if database is empty
const initialSeedRecords: InquiryRecord[] = [
  {
    id: 'fma-' + Date.now() + '-1',
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
    adminNotes: 'Requested male teacher. UK time zone.'
  },
  {
    id: 'fma-' + Date.now() + '-2',
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
    adminNotes: 'Contacted parent via WhatsApp. Scheduled trial for Saturday.'
  },
  {
    id: 'fma-' + Date.now() + '-3',
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
    adminNotes: 'Student evaluated and enrolled in Morning Hifz track.'
  },
  {
    id: 'fma-' + Date.now() + '-4',
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
    adminNotes: 'Adult student inquiry for advanced Tajweed.'
  }
];

// Initialize with seed data if file doesn't exist or is empty
if (!fs.existsSync(DB_FILE) || loadDatabase().length === 0) {
  saveDatabase(initialSeedRecords);
}

// REST API Endpoints

// 1. Submit form (Free Trial, Admission, Contact, Inquiry)
app.post('/api/inquiries', (req: Request, res: Response) => {
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

    const newRecord: InquiryRecord = {
      id: 'fma-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
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
      createdAt: new Date().toISOString()
    };

    const records = loadDatabase();
    records.unshift(newRecord);
    saveDatabase(records);

    res.status(201).json({
      success: true,
      message: 'Your application has been received successfully! Our academic coordinator will contact you on WhatsApp shortly.',
      record: newRecord
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ error: 'Failed to process inquiry' });
  }
});

// 2. Admin: Get all inquiries with search & filter
app.get('/api/admin/inquiries', (req: Request, res: Response) => {
  try {
    const { search = '', status = 'All', type = 'All', course = 'All' } = req.query;

    let records = loadDatabase();

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

    res.json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    console.error('Error fetching admin inquiries:', error);
    res.status(500).json({ error: 'Failed to retrieve records' });
  }
});

// 3. Admin: Update inquiry status or notes
app.patch('/api/admin/inquiries/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const records = loadDatabase();
    const index = records.findIndex(r => r.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Record not found' });
    }

    if (status) {
      records[index].status = status;
    }
    if (adminNotes !== undefined) {
      records[index].adminNotes = adminNotes;
    }

    saveDatabase(records);

    res.json({
      success: true,
      message: 'Record updated successfully',
      record: records[index]
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
});

// 4. Admin: Delete inquiry
app.delete('/api/admin/inquiries/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let records = loadDatabase();
    const initialLength = records.length;
    records = records.filter(r => r.id !== id);

    if (records.length === initialLength) {
      return res.status(404).json({ error: 'Record not found' });
    }

    saveDatabase(records);

    res.json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// 5. Admin: Aggregated stats
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  try {
    const records = loadDatabase();
    const total = records.length;
    const newCount = records.filter(r => r.status === 'New').length;
    const contactedCount = records.filter(r => r.status === 'Contacted').length;
    const enrolledCount = records.filter(r => r.status === 'Enrolled').length;
    const completedCount = records.filter(r => r.status === 'Completed').length;

    const freeTrials = records.filter(r => r.type === 'free_trial').length;
    const admissions = records.filter(r => r.type === 'admission').length;

    res.json({
      total,
      newCount,
      contactedCount,
      enrolledCount,
      completedCount,
      freeTrials,
      admissions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compute stats' });
  }
});

// 6. Admin: Reset or Re-seed demo data if desired
app.post('/api/admin/seed', (_req: Request, res: Response) => {
  try {
    saveDatabase(initialSeedRecords);
    res.json({ success: true, message: 'Sample records restored', records: initialSeedRecords });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed records' });
  }
});

// Vite middleware or Static files
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
  });
}

startServer();

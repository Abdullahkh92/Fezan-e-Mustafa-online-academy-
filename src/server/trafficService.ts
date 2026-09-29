import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './firestoreService.ts';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface TrafficVisit {
  id: string;
  visitorId: string;
  sessionId: string;
  timestamp: string;
  date: string; // YYYY-MM-DD
  page: string;
  referrer: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  country: string;
  isNewVisitor: boolean;
  trafficSource?: 'Organic Search' | 'Direct' | 'Referral';
}

export interface TrafficStats {
  totalVisitors: number;
  totalPageViews: number;
  todayVisitors: number;
  yesterdayVisitors: number;
  thisWeekVisitors: number;
  thisMonthVisitors: number;
  thisYearVisitors: number;
  organicSearchCount: number;
  directTrafficCount: number;
  referralTrafficCount: number;
  botsFilteredCount: number;
  recentVisits: TrafficVisit[];
  topPages: { page: string; views: number; percentage: number }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  browserBreakdown: { browser: string; count: number; percentage: number }[];
  dailyTrend: {
    date: string;
    dayName: string;
    uniqueVisitors: number;
    pageViews: number;
  }[];
}

const TRAFFIC_COLLECTION = 'traffic_visits';
const DATA_DIR = path.resolve(__dirname, '../../data');
const LOCAL_TRAFFIC_FILE = path.join(DATA_DIR, 'traffic_visits.json');

// In-memory cache for fast, verified human visits
let memoryVisits: TrafficVisit[] = [];
let botsBlockedCount = 0;

// Bot User-Agent detection pattern (filters scrapers, artificial bots, curl, headless browsers)
const BOT_REGEX = /bot|crawl|spider|slurp|headless|lighthouse|phantom|puppeteer|curl|wget|python|ruby|go-http-client|postman|apachebench|ahrefs|semrush|majestic|trafficexchange/i;

export function isBotUserAgent(userAgent?: string): boolean {
  if (!userAgent) return false;
  return BOT_REGEX.test(userAgent);
}

// Helper to ensure data dir exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Helper to save to local file
function persistToLocalFile(visits: TrafficVisit[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(LOCAL_TRAFFIC_FILE, JSON.stringify(visits, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Traffic] Error saving local backup:', err);
  }
}

/**
 * Initialize traffic service: loads from local file or Firestore.
 * Strictly avoids generating fake/artificial traffic.
 */
export async function initTrafficService(): Promise<void> {
  ensureDataDir();

  // 1. Try reading from local file first
  if (fs.existsSync(LOCAL_TRAFFIC_FILE)) {
    try {
      const content = fs.readFileSync(LOCAL_TRAFFIC_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Clean out any historical artificial seed entries if present
        memoryVisits = parsed.filter(v => !v.id.startsWith('seed_visit_'));
        console.log(`[Traffic] Loaded ${memoryVisits.length} authentic organic visits from local store.`);
        return;
      }
    } catch (e) {
      console.warn('[Traffic] Local traffic file reinitializing.');
    }
  }

  // 2. Try fetching from Firestore
  try {
    const colRef = collection(db, TRAFFIC_COLLECTION);
    const q = query(colRef, orderBy('timestamp', 'desc'), limit(1500));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const loaded: TrafficVisit[] = [];
      snap.forEach(docSnap => {
        const data = docSnap.data() as TrafficVisit;
        if (!data.id.startsWith('seed_visit_')) {
          loaded.push(data);
        }
      });
      memoryVisits = loaded;
      persistToLocalFile(memoryVisits);
      console.log(`[Traffic] Synced ${memoryVisits.length} authentic organic visits from Cloud Firestore.`);
      return;
    }
  } catch (err) {
    console.warn('[Traffic] Could not fetch from Firestore, starting clean authentic store:', err);
  }

  // If no previous visits exist, start with clean store (zero fake bots)
  memoryVisits = [];
  persistToLocalFile(memoryVisits);
  console.log('[Traffic] Real human visitor tracking engine ready.');
}

/**
 * Record a genuine, human visit event.
 * Discards automated bot traffic and traffic-exchange bots.
 */
export async function recordVisit(data: {
  visitorId: string;
  sessionId?: string;
  page?: string;
  referrer?: string;
  deviceType?: 'Desktop' | 'Mobile' | 'Tablet';
  browser?: string;
  os?: string;
  country?: string;
  userAgent?: string;
}): Promise<{ success: boolean; isNewVisitor: boolean; isBot?: boolean }> {
  // Check User-Agent for known bots/crawlers
  if (data.userAgent && isBotUserAgent(data.userAgent)) {
    botsBlockedCount++;
    return { success: false, isNewVisitor: false, isBot: true };
  }

  const visitorId = (data.visitorId || '').trim().slice(0, 64);
  if (!visitorId) {
    return { success: false, isNewVisitor: false };
  }

  const now = new Date();
  const timestamp = now.toISOString();
  const date = timestamp.split('T')[0];
  const isNewVisitor = !memoryVisits.some(v => v.visitorId === visitorId);

  // Classify traffic source (Organic Search, Direct, or Referral)
  const referrer = (data.referrer || 'Direct').trim();
  let trafficSource: 'Organic Search' | 'Direct' | 'Referral' = 'Direct';
  if (
    referrer.toLowerCase().includes('google') ||
    referrer.toLowerCase().includes('bing') ||
    referrer.toLowerCase().includes('yahoo') ||
    referrer.toLowerCase().includes('duckduckgo') ||
    referrer.toLowerCase().includes('ecosia') ||
    referrer.toLowerCase().includes('baidu') ||
    referrer.toLowerCase().includes('yandex')
  ) {
    trafficSource = 'Organic Search';
  } else if (referrer && referrer !== 'Direct' && !referrer.includes('localhost')) {
    trafficSource = 'Referral';
  }

  const visitRecord: TrafficVisit = {
    id: `visit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    visitorId,
    sessionId: (data.sessionId || `sid_${Date.now()}`).slice(0, 64),
    timestamp,
    date,
    page: (data.page || '/').slice(0, 100),
    referrer: referrer.slice(0, 200),
    deviceType: data.deviceType || 'Desktop',
    browser: (data.browser || 'Unknown').slice(0, 50),
    os: (data.os || 'Unknown').slice(0, 50),
    country: (data.country || 'International').slice(0, 50),
    isNewVisitor,
    trafficSource
  };

  // Add to in-memory store
  memoryVisits.unshift(visitRecord);

  // Keep max 10,000 real visits in memory/local file
  if (memoryVisits.length > 10000) {
    memoryVisits = memoryVisits.slice(0, 10000);
  }

  // Persist locally
  persistToLocalFile(memoryVisits);

  // Asynchronously record to Firestore
  setDoc(doc(db, TRAFFIC_COLLECTION, visitRecord.id), visitRecord).catch(err => {
    console.warn('[Traffic] Firestore visit sync warning:', err);
  });

  return { success: true, isNewVisitor };
}

/**
 * Compute comprehensive analytics metrics for Admin Dashboard
 */
export function getTrafficAnalytics(): TrafficStats {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const yesterdayDate = new Date(now.getTime() - 86400000);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
  const currentYear = now.getFullYear();

  // Unique visitor sets
  const allVisitorsSet = new Set<string>();
  const todayVisitorsSet = new Set<string>();
  const yesterdayVisitorsSet = new Set<string>();
  const thisWeekVisitorsSet = new Set<string>();
  const thisMonthVisitorsSet = new Set<string>();
  const thisYearVisitorsSet = new Set<string>();

  // Traffic Source breakdown
  let organicSearchCount = 0;
  let directTrafficCount = 0;
  let referralTrafficCount = 0;

  // Aggregate structures
  const pageCounts: Record<string, number> = {};
  const deviceCounts: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
  const browserCounts: Record<string, number> = {};

  // Daily trend mapping for last 14 days
  const dailyTrendMap: Record<string, { visitors: Set<string>; pageViews: number }> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dStr = d.toISOString().split('T')[0];
    dailyTrendMap[dStr] = { visitors: new Set<string>(), pageViews: 0 };
  }

  for (const v of memoryVisits) {
    const vTime = new Date(v.timestamp);
    const vDate = v.date;

    allVisitorsSet.add(v.visitorId);

    // Today
    if (vDate === todayStr) {
      todayVisitorsSet.add(v.visitorId);
    }
    // Yesterday
    if (vDate === yesterdayStr) {
      yesterdayVisitorsSet.add(v.visitorId);
    }
    // 7 Days
    if (vTime >= sevenDaysAgo) {
      thisWeekVisitorsSet.add(v.visitorId);
    }
    // 30 Days / Month
    if (vTime >= thirtyDaysAgo) {
      thisMonthVisitorsSet.add(v.visitorId);
    }
    // Year
    if (vTime.getFullYear() === currentYear) {
      thisYearVisitorsSet.add(v.visitorId);
    }

    // Traffic Sources
    if (v.trafficSource === 'Organic Search') {
      organicSearchCount++;
    } else if (v.trafficSource === 'Referral') {
      referralTrafficCount++;
    } else {
      directTrafficCount++;
    }

    // Top Pages
    const p = v.page || '/';
    pageCounts[p] = (pageCounts[p] || 0) + 1;

    // Devices
    if (v.deviceType in deviceCounts) {
      deviceCounts[v.deviceType]++;
    } else {
      deviceCounts['Desktop']++;
    }

    // Browsers
    const b = v.browser || 'Other';
    browserCounts[b] = (browserCounts[b] || 0) + 1;

    // Daily Trend
    if (dailyTrendMap[vDate]) {
      dailyTrendMap[vDate].visitors.add(v.visitorId);
      dailyTrendMap[vDate].pageViews++;
    }
  }

  // Format Top Pages
  const totalViews = memoryVisits.length || 1;
  const topPages = Object.entries(pageCounts)
    .map(([page, views]) => ({
      page,
      views,
      percentage: Math.round((views / totalViews) * 100)
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  // Format Device Breakdown
  const totalDeviceVisits = (deviceCounts.Desktop + deviceCounts.Mobile + deviceCounts.Tablet) || 1;
  const deviceBreakdown = [
    { device: 'Desktop', count: deviceCounts.Desktop, percentage: Math.round((deviceCounts.Desktop / totalDeviceVisits) * 100) },
    { device: 'Mobile', count: deviceCounts.Mobile, percentage: Math.round((deviceCounts.Mobile / totalDeviceVisits) * 100) },
    { device: 'Tablet', count: deviceCounts.Tablet, percentage: Math.round((deviceCounts.Tablet / totalDeviceVisits) * 100) }
  ];

  // Format Browser Breakdown
  const browserBreakdown = Object.entries(browserCounts)
    .map(([browser, count]) => ({
      browser,
      count,
      percentage: Math.round((count / totalViews) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Format Daily Trend
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyTrend = Object.keys(dailyTrendMap)
    .sort()
    .map(dateStr => {
      const d = new Date(`${dateStr}T12:00:00Z`);
      const dayName = daysOfWeek[d.getUTCDay()];
      const dayData = dailyTrendMap[dateStr];
      return {
        date: dateStr,
        dayName,
        uniqueVisitors: dayData.visitors.size,
        pageViews: dayData.pageViews
      };
    });

  return {
    totalVisitors: allVisitorsSet.size,
    totalPageViews: memoryVisits.length,
    todayVisitors: todayVisitorsSet.size,
    yesterdayVisitors: yesterdayVisitorsSet.size,
    thisWeekVisitors: thisWeekVisitorsSet.size,
    thisMonthVisitors: thisMonthVisitorsSet.size,
    thisYearVisitors: thisYearVisitorsSet.size,
    organicSearchCount,
    directTrafficCount,
    referralTrafficCount,
    botsFilteredCount: botsBlockedCount,
    recentVisits: memoryVisits.slice(0, 20),
    topPages,
    deviceBreakdown,
    browserBreakdown,
    dailyTrend
  };
}

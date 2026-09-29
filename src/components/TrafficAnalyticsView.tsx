import React, { useState } from 'react';
import {
  Users,
  Eye,
  Calendar,
  Smartphone,
  Laptop,
  Tablet,
  Globe2,
  TrendingUp,
  RefreshCw,
  Clock,
  Sparkles,
  ShieldCheck,
  Compass,
  Search,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  FileCode,
  ShieldAlert,
  Cpu
} from 'lucide-react';

export interface TrafficVisitItem {
  id: string;
  visitorId: string;
  sessionId: string;
  timestamp: string;
  date: string;
  page: string;
  referrer: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  country: string;
  isNewVisitor: boolean;
  trafficSource?: 'Organic Search' | 'Direct' | 'Referral';
}

export interface TrafficStatsData {
  totalVisitors: number;
  totalPageViews: number;
  todayVisitors: number;
  yesterdayVisitors: number;
  thisWeekVisitors: number;
  thisMonthVisitors: number;
  thisYearVisitors: number;
  organicSearchCount?: number;
  directTrafficCount?: number;
  referralTrafficCount?: number;
  botsFilteredCount?: number;
  recentVisits: TrafficVisitItem[];
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

interface Props {
  stats: TrafficStatsData | null;
  loading: boolean;
  onRefresh: () => void;
}

// Relative time formatting helper
function formatTimeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDays = Math.floor(diffHour / 24);
  return `${diffDays}d ago`;
}

export const TrafficAnalyticsView: React.FC<Props> = ({ stats, loading, onRefresh }) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [copiedGscTag, setCopiedGscTag] = useState<boolean>(false);

  if (!stats && loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
        <p className="text-sm font-cinzel text-slate-300">Loading organic traffic analytics from database...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-slate-400">No traffic analytics data available.</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 text-xs font-semibold text-slate-900 bg-[#D4AF37] rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  // Find max value in dailyTrend for scaling the bar chart
  const maxTrendVal = Math.max(...stats.dailyTrend.map(d => Math.max(d.uniqueVisitors, d.pageViews)), 10);

  // Compute change from yesterday to today
  const todayVsYesterday = stats.yesterdayVisitors > 0
    ? Math.round(((stats.todayVisitors - stats.yesterdayVisitors) / stats.yesterdayVisitors) * 100)
    : 0;

  const handleCopyGsc = () => {
    navigator.clipboard.writeText('<meta name="google-site-verification" content="fma-gsc-verification-code-faizanemustafa" />');
    setCopiedGscTag(true);
    setTimeout(() => setCopiedGscTag(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Analytics Sub-Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#02141a]/90 border border-[#D4AF37]/25 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-900 to-[#02141a] border border-[#D4AF37]/40 flex items-center justify-center text-[#F9E79F]">
            <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-cinzel text-white flex items-center gap-2">
              <span>Real Organic Traffic & Visitor Analytics</span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                100% Real Humans · Bots Filtered
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Only authentic, organic human visitors are measured. Artificial bots and scraper traffic are automatically discarded.
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-[#D4AF37]/50 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* TOP BIG METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Total Unique Visitors */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#052627] to-[#021319] border border-[#D4AF37]/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-[#D4AF37] mb-2">
            <span className="text-[11px] font-bold font-cinzel uppercase tracking-wider">Total Real Visitors</span>
            <Users className="w-4 h-4 text-[#F9E79F]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            {stats.totalVisitors.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Eye className="w-3 h-3 text-emerald-400" />
            <span>{stats.totalPageViews.toLocaleString()} total page views</span>
          </div>
        </div>

        {/* Today's Visitors */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#052627] to-[#021319] border border-emerald-500/40 shadow-lg">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[11px] font-bold font-cinzel uppercase tracking-wider">Today&apos;s Visitors</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300 tracking-tight">
            {stats.todayVisitors.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>Yesterday: </span>
            <strong className="text-slate-200 font-mono">{stats.yesterdayVisitors}</strong>
            {todayVsYesterday !== 0 && (
              <span className={`ml-1.5 font-mono text-[10px] ${todayVsYesterday > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                ({todayVsYesterday > 0 ? `+${todayVsYesterday}%` : `${todayVsYesterday}%`})
              </span>
            )}
          </div>
        </div>

        {/* This Week */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#052627] to-[#021319] border border-teal-500/30 shadow-lg">
          <div className="flex items-center justify-between text-teal-300 mb-2">
            <span className="text-[11px] font-bold font-cinzel uppercase tracking-wider">This Week</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-teal-200 tracking-tight">
            {stats.thisWeekVisitors.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>Last 7 calendar days</span>
          </div>
        </div>

        {/* This Month */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#052627] to-[#021319] border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between text-amber-300 mb-2">
            <span className="text-[11px] font-bold font-cinzel uppercase tracking-wider">This Month</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-200 tracking-tight">
            {stats.thisMonthVisitors.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>Last 30 days active</span>
          </div>
        </div>

        {/* This Year */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#052627] to-[#021319] border border-indigo-500/30 shadow-lg col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-indigo-300 mb-2">
            <span className="text-[11px] font-bold font-cinzel uppercase tracking-wider">This Year</span>
            <Globe2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-200 tracking-tight">
            {stats.thisYearVisitors.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>Year {new Date().getFullYear()} total</span>
          </div>
        </div>

      </div>

      {/* ORGANIC TRAFFIC ACQUISITION CHANNELS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#031c22] border border-emerald-500/30 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-emerald-400 font-cinzel uppercase flex items-center gap-1.5 font-bold">
              <Search className="w-3.5 h-3.5" />
              <span>Organic Search</span>
            </span>
            <span className="text-lg font-bold font-mono text-white">
              {stats.organicSearchCount || 0}
            </span>
          </div>
          <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
            Google / Bing
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#031c22] border border-teal-500/30 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-teal-300 font-cinzel uppercase flex items-center gap-1.5 font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>Direct Traffic</span>
            </span>
            <span className="text-lg font-bold font-mono text-white">
              {stats.directTrafficCount || 0}
            </span>
          </div>
          <span className="text-[10px] text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-500/30">
            Bookmarks / URL
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#031c22] border border-amber-500/30 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-amber-300 font-cinzel uppercase flex items-center gap-1.5 font-bold">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Referrals & Social</span>
            </span>
            <span className="text-lg font-bold font-mono text-white">
              {stats.referralTrafficCount || 0}
            </span>
          </div>
          <span className="text-[10px] text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
            External Links
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#031c22] border border-slate-700 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-cinzel uppercase flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              <span>Bots Blocked</span>
            </span>
            <span className="text-lg font-bold font-mono text-slate-300">
              {stats.botsFilteredCount || 0}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
            Filtered Out
          </span>
        </div>
      </div>

      {/* GOOGLE SEARCH CONSOLE & ORGANIC SEO INTEGRATION TOOLKIT */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#031f24] via-[#02171c] to-[#010e14] border border-[#D4AF37]/35 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm sm:text-base font-bold font-cinzel text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-[#D4AF37]" />
              <span>Google Search Console & Organic SEO Integration</span>
            </h4>
            <p className="text-xs text-slate-400">
              Verified crawlability tools, sitemap endpoints, and structured metadata for top organic rankings.
            </p>
          </div>

          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-gradient-to-r from-[#F9E79F] to-[#D4AF37] hover:brightness-110 rounded-xl transition-all shadow-md cursor-pointer"
          >
            <span>Open Google Search Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* XML Sitemap */}
          <div className="p-3.5 rounded-xl bg-[#021217] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-cinzel text-white flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>XML Sitemap</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono">
                Indexable
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Full Google XML sitemap covering all courses, trial forms, and FAQs.
            </p>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#D4AF37] hover:underline font-mono"
            >
              <span>/sitemap.xml</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Robots.txt */}
          <div className="p-3.5 rounded-xl bg-[#021217] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-cinzel text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Robots.txt Crawl Directives</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono">
                Allowed
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Instructs Googlebot and Bingbot to crawl all course pages and images while safeguarding admin routes.
            </p>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline font-mono"
            >
              <span>/robots.txt</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* GSC Verification Tag */}
          <div className="p-3.5 rounded-xl bg-[#021217] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-cinzel text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>HTML Verification Tag</span>
              </span>
              <button
                type="button"
                onClick={handleCopyGsc}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                {copiedGscTag ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedGscTag ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate bg-black/40 p-1.5 rounded border border-slate-800">
              &lt;meta name=&quot;google-site-verification&quot; content=&quot;...&quot; /&gt;
            </p>
            <span className="block text-[10px] text-slate-400">
              Pre-mounted in &lt;head&gt; for immediate Search Console verification.
            </span>
          </div>

        </div>

        {/* SEO Technical Checklist */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Schema.org EducationalOrganization</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Schema.org 5-Course Catalog</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Schema.org FAQPage Rich Snippet</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>OpenGraph 1200x630 Social Cards</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Canonical URLs Active</span>
          </div>
        </div>
      </div>

      {/* VISITOR TRAFFIC CHART (Past 14 Days) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#052425]/95 via-[#031c20]/95 to-[#021318]/98 border border-[#D4AF37]/30 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-sm sm:text-base font-bold font-cinzel text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              <span>Organic Traffic Trend (Daily Activity)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Interactive comparison of Unique Real Visitors vs Total Page Views per day
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#AA771C] to-[#F9E79F]" />
              <span className="text-[#F9E79F]">Unique Human Visitors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-emerald-700 to-emerald-400" />
              <span className="text-emerald-300">Total Page Views</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart Container */}
        <div className="pt-6 pb-2">
          <div className="h-44 sm:h-52 flex items-end justify-between gap-1.5 sm:gap-3 px-1 border-b border-slate-700/80">
            {stats.dailyTrend.map((day, idx) => {
              const visitorHeight = Math.max(Math.round((day.uniqueVisitors / maxTrendVal) * 100), day.uniqueVisitors > 0 ? 6 : 0);
              const pageViewHeight = Math.max(Math.round((day.pageViews / maxTrendVal) * 100), day.pageViews > 0 ? 8 : 0);
              const isHovered = hoveredDay === idx;

              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                  onMouseEnter={() => setHoveredDay(idx)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-16 z-30 bg-[#021017] border border-[#D4AF37] px-3 py-1.5 rounded-lg shadow-2xl text-[11px] whitespace-nowrap pointer-events-none transform -translate-x-1/2 left-1/2 animate-in fade-in zoom-in-95 duration-150">
                      <p className="font-bold text-white font-mono">{day.date} ({day.dayName})</p>
                      <p className="text-[#F9E79F]">Human Visitors: <span className="font-bold">{day.uniqueVisitors}</span></p>
                      <p className="text-emerald-300">Page Views: <span className="font-bold">{day.pageViews}</span></p>
                    </div>
                  )}

                  {/* Dual Bar Group */}
                  <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1.5 h-full">
                    {/* Unique Visitors Bar */}
                    <div
                      style={{ height: `${visitorHeight}%` }}
                      className="w-1/2 max-w-[14px] rounded-t bg-gradient-to-t from-[#AA771C] via-[#D4AF37] to-[#F9E79F] transition-all group-hover:brightness-125 shadow-sm"
                    />
                    {/* Page Views Bar */}
                    <div
                      style={{ height: `${pageViewHeight}%` }}
                      className="w-1/2 max-w-[14px] rounded-t bg-gradient-to-t from-emerald-800 via-emerald-600 to-emerald-400 opacity-90 transition-all group-hover:opacity-100 group-hover:brightness-125 shadow-sm"
                    />
                  </div>

                  {/* Date Label under bar */}
                  <div className="pt-2 text-center">
                    <span className="block text-[10px] text-slate-400 font-mono group-hover:text-white">
                      {day.dayName}
                    </span>
                    <span className="hidden sm:block text-[9px] text-slate-500 font-mono">
                      {day.date.slice(8)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TWO-COLUMN DETAILS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Top Pages & Device Breakdown (Span 6) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Top Viewed Pages */}
          <div className="p-5 rounded-2xl bg-[#021319]/90 border border-slate-800 shadow-lg space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-xs sm:text-sm font-bold font-cinzel text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#D4AF37]" />
                <span>Top Engaging Content & Landing Pages</span>
              </h4>
              <span className="text-[11px] text-slate-400">Total Views</span>
            </div>

            <div className="space-y-3">
              {stats.topPages.map((p, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-200 truncate max-w-[240px]">
                      {p.page === '/' ? '/ (Home Landing)' : p.page}
                    </span>
                    <span className="font-mono text-[#D4AF37] font-semibold">
                      {p.views.toLocaleString()} <span className="text-slate-400 text-[10px]">({p.percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(p.percentage * 2, 100)}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-[#D4AF37] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device & Browser Breakdown */}
          <div className="p-5 rounded-2xl bg-[#021319]/90 border border-slate-800 shadow-lg space-y-4">
            <h4 className="text-xs sm:text-sm font-bold font-cinzel text-white flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Smartphone className="w-4 h-4 text-[#D4AF37]" />
              <span>Real User Devices & Platforms</span>
            </h4>

            {/* Device Category Pills */}
            <div className="grid grid-cols-3 gap-3">
              {stats.deviceBreakdown.map((dev) => (
                <div key={dev.device} className="p-3 rounded-xl bg-[#031c22] border border-slate-700/80 text-center">
                  <div className="w-7 h-7 mx-auto mb-1.5 flex items-center justify-center text-[#D4AF37]">
                    {dev.device === 'Desktop' && <Laptop className="w-4 h-4" />}
                    {dev.device === 'Mobile' && <Smartphone className="w-4 h-4" />}
                    {dev.device === 'Tablet' && <Tablet className="w-4 h-4" />}
                  </div>
                  <span className="block text-xs font-bold text-white">{dev.device}</span>
                  <span className="block text-sm font-extrabold font-mono text-[#F9E79F]">{dev.percentage}%</span>
                  <span className="block text-[10px] text-slate-400 font-mono">{dev.count} visits</span>
                </div>
              ))}
            </div>

            {/* Top Browsers */}
            <div className="pt-2 border-t border-slate-800">
              <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-cinzel mb-2">
                Top Browsers
              </span>
              <div className="flex flex-wrap gap-2">
                {stats.browserBreakdown.map((b) => (
                  <span key={b.browser} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                    {b.browser}: <strong className="text-[#D4AF37]">{b.percentage}%</strong>
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Recent Visitors Chronological Feed (Span 6) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#021319]/90 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h4 className="text-xs sm:text-sm font-bold font-cinzel text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <span>Current / Recent Human Visits</span>
            </h4>
            <span className="text-[11px] text-emerald-400 font-mono">Live organic stream</span>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {stats.recentVisits.map((visit) => (
              <div
                key={visit.id}
                className="p-3 rounded-xl bg-[#031820] hover:bg-[#031d24] border border-slate-800/80 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-[#F9E79F] shrink-0">
                    {visit.deviceType === 'Mobile' ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-white font-medium truncate">
                        {visit.page}
                      </span>
                      {visit.trafficSource && (
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          visit.trafficSource === 'Organic Search'
                            ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-900 border border-slate-700 text-slate-300'
                        }`}>
                          {visit.trafficSource}
                        </span>
                      )}
                      {visit.isNewVisitor && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-950 border border-amber-500/40 text-amber-300 text-[9px] font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate mt-0.5">
                      <span>{visit.browser} · {visit.os}</span>
                      <span>·</span>
                      <span className="text-slate-300">{visit.country}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-[#D4AF37] font-mono block">
                    {formatTimeAgo(visit.timestamp)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block truncate max-w-[80px]">
                    {visit.visitorId.slice(-6)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Privacy & Cloud Storage Footer */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ethical Organic Tracking: Strictly anonymous visitor IDs. Zero artificial traffic or bots counted.</span>
          </div>

        </div>

      </div>

    </div>
  );
};

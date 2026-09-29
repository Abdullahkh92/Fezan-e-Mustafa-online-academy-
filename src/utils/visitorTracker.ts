/**
 * Anonymous, privacy-preserving client-side visitor analytics tracker
 * for Faizan-e-Mustafa Online Academy.
 */

function getOrCreateVisitorId(): string {
  try {
    const key = 'fma_vid';
    let vid = localStorage.getItem(key);
    if (!vid) {
      vid = `fma_vid_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
      localStorage.setItem(key, vid);
    }
    return vid;
  } catch (e) {
    return `fma_vid_ephemeral_${Date.now()}`;
  }
}

function getOrCreateSessionId(): string {
  try {
    const key = 'fma_sid';
    let sid = sessionStorage.getItem(key);
    if (!sid) {
      sid = `fma_sid_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
      sessionStorage.setItem(key, sid);
    }
    return sid;
  } catch (e) {
    return `fma_sid_ephemeral_${Date.now()}`;
  }
}

function detectDevice(): 'Desktop' | 'Mobile' | 'Tablet' {
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (/chrome|crios/i.test(ua) && !/edge|edg|opr|opera/i.test(ua)) return 'Chrome';
  if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) return 'Safari';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/edg/i.test(ua)) return 'Edge';
  if (/opr|opera/i.test(ua)) return 'Opera';
  return 'Other';
}

function detectOS(): string {
  const ua = navigator.userAgent;
  if (/windows/i.test(ua)) return 'Windows';
  if (/macintosh|mac os x/i.test(ua) && !/iphone|ipad|ipod/i.test(ua)) return 'macOS';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/android/i.test(ua)) return 'Android';
  if (/linux/i.test(ua)) return 'Linux';
  return 'Other';
}

let lastTrackedPage = '';
let lastTrackedTime = 0;

/**
 * Record a page visit event
 */
export async function trackPageView(pageOverride?: string): Promise<void> {
  try {
    const page = pageOverride || (window.location.pathname + (window.location.hash || ''));
    const now = Date.now();

    // Prevent duplicate triggers within 2 seconds for identical path
    if (page === lastTrackedPage && (now - lastTrackedTime) < 2000) {
      return;
    }

    lastTrackedPage = page;
    lastTrackedTime = now;

    const payload = {
      visitorId: getOrCreateVisitorId(),
      sessionId: getOrCreateSessionId(),
      page: page || '/',
      referrer: document.referrer ? new URL(document.referrer, window.location.origin).hostname : 'Direct',
      deviceType: detectDevice(),
      browser: detectBrowser(),
      os: detectOS()
    };

    // Fire-and-forget
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/track-visit', blob);
    } else {
      fetch('/api/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    }
  } catch (e) {
    // Fail silently without disrupting user
  }
}

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// Secure server-side administrative credentials (configurable via environment variables)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'abdullah';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Abdullah786';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'faizan-e-mustafa-academy-session-auth-secret-key-2026';

// Session duration: 24 hours
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

// In-memory set of revoked session IDs
const revokedSessionIds = new Set<string>();

// Rate-limiting tracking for login endpoint (in-memory)
interface LoginAttempt {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}
const loginAttempts = new Map<string, LoginAttempt>();

// Clean up expired rate-limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, attempt] of loginAttempts.entries()) {
    if (attempt.blockedUntil && attempt.blockedUntil < now) {
      loginAttempts.delete(ip);
    } else if (now - attempt.firstAttempt > 15 * 60 * 1000) {
      loginAttempts.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export interface AdminPayload {
  username: string;
  role: 'admin';
  sessionId: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  adminUser?: AdminPayload;
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Perform dummy comparison to equalize timing
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Validate admin credentials
 */
export function validateCredentials(username?: string, password?: string): boolean {
  if (!username || !password) return false;
  const usernameMatch = safeEqual(username.trim(), ADMIN_USERNAME);
  const passwordMatch = safeEqual(password, ADMIN_PASSWORD);
  return usernameMatch && passwordMatch;
}

/**
 * Rate limit check for login
 */
export function checkRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt) return { allowed: true };

  if (attempt.blockedUntil && attempt.blockedUntil > now) {
    const waitSeconds = Math.ceil((attempt.blockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  return { allowed: true };
}

/**
 * Record login attempt (increments failure or resets on success)
 */
export function recordLoginAttempt(ip: string, success: boolean): void {
  const now = Date.now();
  if (success) {
    loginAttempts.delete(ip);
    return;
  }

  const attempt = loginAttempts.get(ip) || { count: 0, firstAttempt: now };
  attempt.count += 1;

  // If 5 or more failed attempts within 5 minutes, block for 5 minutes
  if (attempt.count >= 5) {
    attempt.blockedUntil = now + 5 * 60 * 1000;
  }

  loginAttempts.set(ip, attempt);
}

/**
 * Generate a cryptographically signed admin session token
 */
export function createAdminToken(username: string): string {
  const sessionId = crypto.randomBytes(16).toString('hex');
  const now = Date.now();

  const payload: AdminPayload = {
    username,
    role: 'admin',
    sessionId,
    iat: now,
    exp: now + SESSION_DURATION_MS
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Verify a session token
 */
export function verifyAdminToken(token: string): { valid: boolean; payload?: AdminPayload; reason?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'Token missing or invalid format' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Malformed token format' };
  }

  const [payloadBase64, providedSignature] = parts;

  // Verify HMAC signature
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  if (!safeEqual(providedSignature, expectedSignature)) {
    return { valid: false, reason: 'Invalid token signature' };
  }

  try {
    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const payload: AdminPayload = JSON.parse(payloadJson);

    // Check expiration
    if (Date.now() > payload.exp) {
      return { valid: false, reason: 'Session expired' };
    }

    // Check revocation
    if (revokedSessionIds.has(payload.sessionId)) {
      return { valid: false, reason: 'Session has been logged out' };
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, reason: 'Failed to parse session payload' };
  }
}

/**
 * Revoke session on logout
 */
export function revokeSessionToken(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length === 2) {
      const payload: AdminPayload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf-8'));
      if (payload.sessionId) {
        revokedSessionIds.add(payload.sessionId);
        return true;
      }
    }
  } catch {
    // Ignore parse error on logout
  }
  return false;
}

/**
 * Express middleware to strictly require admin authentication
 */
export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  let token: string | undefined;

  // 1. Check Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 2. Check Cookie header (if sent via cookie)
  if (!token && req.headers.cookie) {
    const match = req.headers.cookie.match(/admin_session=([^;]+)/);
    if (match) {
      token = match[1].trim();
    }
  }

  // If no token was provided: 401 Unauthorized
  if (!token) {
    res.status(401).json({
      error: 'Unauthorized: Administrator authentication required. Please log in to access this resource.',
      code: 'AUTH_REQUIRED'
    });
    return;
  }

  // Verify the token
  const verification = verifyAdminToken(token);

  if (!verification.valid || !verification.payload) {
    // If token exists but is invalid or expired
    const isExpired = verification.reason === 'Session expired';
    res.status(isExpired ? 401 : 403).json({
      error: `Access Denied: ${verification.reason || 'Invalid session credentials'}.`,
      code: isExpired ? 'SESSION_EXPIRED' : 'FORBIDDEN'
    });
    return;
  }

  // Check role
  if (verification.payload.role !== 'admin') {
    res.status(403).json({
      error: 'Forbidden: Insufficient privileges to access administrator records.',
      code: 'FORBIDDEN'
    });
    return;
  }

  req.adminUser = verification.payload;
  next();
}

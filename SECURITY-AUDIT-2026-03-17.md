# Assay Security Audit Report

**Project**: Assay (assay.software) - COBOL Documentation Generator
**Location**: `I:\Scratch\cobol-clarity`
**Stack**: Next.js 16.1.6 / React 19 / TypeScript / Anthropic SDK
**Date**: 2026-03-17
**Methodology**: 7 parallel security scans (OWASP, Agentic, Insecure Defaults, Sharp Edges, Supply Chain, Auth Pentest, API Security)

---

## Before / After Comparison

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **CRITICAL** | 2 | 0 | -2 |
| **HIGH** | 3 | 0 | -3 |
| **MEDIUM** | 6 | 3 | -3 |
| **LOW** | 4 | 4 | 0 (different issues) |
| **INFO** | 4 | 5 | +1 |
| npm packages | 1,093 | 376 | -66% |
| npm vulnerabilities | 7 high | 0 | -7 |
| TypeScript | clean | clean | - |
| Build | passes | passes | - |

### Resolved Findings (14)

| ID | Finding | Resolution |
|----|---------|------------|
| C-1 | No authentication on API routes | Session-based auth with httpOnly cookies |
| C-2 | Phantom Nuxt 4.3.1 (413 packages) | Updated @vercel/analytics to ^2.0.1 |
| H-1 | Missing CSP header | Added full Content-Security-Policy |
| H-2 | Password in git history (auth.setup.ts) | Moved to env var |
| H-2b | Password in auth.spec.ts | Moved to env var (caught in rescan) |
| H-3 | 7 high-severity npm CVEs | Resolved by removing Nuxt chain |
| M-1 | In-memory rate limiting resets on deploy | New shared rate-limit utility with bounds |
| M-2 | Predictable job IDs (Math.random) | crypto.randomBytes(16) - 128-bit |
| M-3 | No job cleanup / memory leak | 1hr TTL, max 100 jobs, periodic cleanup |
| M-4 | Unbounded upload (100MB, no rate limit) | 10MB, 50 files, 5/hr rate limit |
| M-5 | Email header injection | Strict RFC regex + control char stripping |
| L-1 | PII in dev-mode logs | Removed - only logs company + hasEmail |
| L-2 | Error digest exposure | Generic messages only |
| L-3 | Missing single-quote escaping | escapeHtml now handles `'` |
| L-4 | Broad devDependency ranges | Pinned to specific minors |

### Additional Fixes (from rescan)

| Finding | Resolution |
|---------|------------|
| TOCTOU race in processJobAsync | Set status='processing' synchronously before async launch |
| Unsanitized projectName length | .slice(0, 100) on upload |
| Job eviction kills active jobs | Skip jobs with status='processing' during eviction |

---

## Remaining Findings (Post-Fix Rescan)

### MEDIUM (3)

**M-1. CSRF Origin check skipped when Origin header absent**
- File: `I:\Scratch\cobol-clarity\src\middleware.ts` lines 9-14
- The check only triggers when both Origin and Host are present. Non-browser clients can omit Origin.
- Mitigated by SameSite=Lax cookies (browsers always send Origin on cross-site POSTs).
- Acceptable for current threat model. Harden if auth changes.

**M-2. processJobAsync bypasses session ownership check**
- File: `I:\Scratch\cobol-clarity\src\app\api\process\route.ts` line 116
- Internal `getJob()` doesn't check session. Handler validates ownership first, so no current exploit.
- Defense-in-depth gap - future routes calling getJob directly could bypass auth.

**M-3. CSP requires 'unsafe-inline' for BookingWidget init snippet**
- File: `I:\Scratch\cobol-clarity\src\app\layout.tsx` lines 63-66
- The inline `dangerouslySetInnerHTML` for BookingWidget.init forces `'unsafe-inline'` in script-src.
- Fix by moving the init call into the external `booking-widget.js` file.

### LOW (4)

**L-1. Rate limiter cleanup runs inline on hot path**
- File: `I:\Scratch\cobol-clarity\src\lib\rate-limit.ts` lines 17-24
- When map exceeds 10K entries, cleanup is O(n*m) on the request path.
- Move to periodic timer for production.

**L-2. No SRI hash on external booking-widget.js**
- File: `I:\Scratch\cobol-clarity\src\app\layout.tsx` line 62
- crossOrigin="anonymous" added, but no integrity hash yet. Generate from deployed script.

**L-3. Sync readFileSync on every request in docs route**
- File: `I:\Scratch\cobol-clarity\src\app\docs\route.ts`
- Blocks event loop. Cache at module load or use async API.

**L-4. Session cookie has no explicit domain restriction**
- File: `I:\Scratch\cobol-clarity\src\lib\auth\session.ts` lines 20-28
- Defaults to exact hostname (correct for single-domain). Note for future subdomain work.

### INFORMATIONAL (5)

- Email regex is safe from ReDoS (analyzed - no catastrophic backtracking)
- Job ID regex is safe from ReDoS (anchored, fixed-length)
- No prototype pollution vectors found
- No open redirect vectors found
- No typosquat dependencies detected

---

## Positive Security Observations

1. Session-based auth on all processing API routes
2. httpOnly + Secure + SameSite=Lax cookies
3. CSRF Origin header check in middleware
4. Content-Security-Policy header with restricted sources
5. crypto.randomBytes(16) for job IDs (128-bit entropy)
6. Job ownership verified on all status/download/process routes
7. Rate limiting on upload, process, and contact endpoints
8. Memory-bounded rate limiter with max entries cap
9. Job TTL (1hr) with periodic cleanup and max count (100)
10. Eviction skips in-progress jobs
11. TOCTOU prevention (synchronous status update before async launch)
12. Strict email regex + control character stripping
13. HTML escaping including single quotes
14. File extension allowlisting
15. Upload capped at 10MB / 50 files
16. projectName length limited to 100 chars
17. Error boundaries show generic messages
18. getPublicJob strips internal data
19. Secrets in env vars, .env files gitignored
20. 0 npm vulnerabilities, 376 packages (lean dependency tree)

---

*Report generated by 14 parallel security agent runs (7 initial + 7 rescan) on 2026-03-17.*

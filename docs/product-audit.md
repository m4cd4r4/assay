# Assay Product Management Audit

**Date:** 2026-03-17
**Site:** https://assay.software
**Stack:** Next.js 16, TypeScript, Claude Opus 4.6, Vercel
**Auditor:** Claude Opus 4.6 (automated)

---

## Executive Summary

Assay is a well-built COBOL documentation SaaS with strong technical foundations, clear positioning, and enterprise-grade security messaging. The core product loop (upload COBOL, get documentation) is sound. However, the product has significant growth and conversion gaps: no self-serve path, a broken primary CTA flow, no retention mechanisms, zero content marketing, and a demo that dead-ends without capturing intent. The biggest wins are fixing the contact-to-booking disconnect, adding a self-serve upload flow to the landing page, and building an SEO content engine around COBOL modernization keywords.

---

## 1. Hook Model Analysis

### Current State

| Element | Status | Details |
|---------|--------|---------|
| **Trigger** | WEAK | No external triggers. No email nurture, no content marketing, no social proof notifications. Only trigger is organic search (if ranking) or direct referral. |
| **Action** | MODERATE | Two actions available: "Book a Call" and "Try Live Demo". The demo action is low-friction. The booking action depends on a third-party widget (donnacha.app). |
| **Variable Reward** | WEAK | The demo shows a fixed, pre-generated output for a single program. No variability - same result every time. No "try with your own code" moment. |
| **Investment** | MISSING | Zero user investment. No account creation, no saved state, no upload history, no progressive profile building. Users leave nothing behind. |

### Findings

- **CRITICAL** - No investment loop. Enterprise SaaS needs at minimum: saved quotes, project history, or a dashboard showing past analyses. Without investment, there is zero switching cost and zero reason to return.
- **HIGH** - Variable reward is absent. The demo is deterministic. Users who have seen it once have no reason to revisit. The upload API exists but has no frontend UI on the marketing site.
- **MEDIUM** - External triggers are nonexistent. No blog, no newsletter signup, no drip email after form submission, no LinkedIn content strategy.

---

## 2. AARRR Funnel Scores

| Stage | Score | Analysis |
|-------|-------|----------|
| **Acquisition** | 2/5 | SEO metadata is present (good keywords, OG tags, JSON-LD, sitemap). But there is zero content marketing - no blog, no case studies, no "COBOL modernization" articles. The sitemap has only 5 URLs. For a niche B2B product, content is the primary acquisition channel. Without it, discovery is limited to direct referrals and branded search. |
| **Activation** | 3/5 | The demo provides a decent "aha" moment - seeing real AI-generated documentation from COBOL is compelling. But activation is incomplete: users can only view a pre-baked payroll example. They cannot upload their own code to get a taste. The real activation event (seeing YOUR code documented) requires a human-mediated sales call. |
| **Retention** | 1/5 | Nothing brings users back. No dashboard, no account, no email updates, no content. The product is designed as a one-shot engagement (upload, pay, receive docs). Even repeat customers have no reason to visit the site between engagements. |
| **Referral** | 1/5 | Zero referral mechanisms. No "share this demo" button. No case studies that customers could forward to peers. No "powered by Assay" watermark in generated docs. No referral incentive. |
| **Revenue** | 2/5 | Pricing is transparent (good), but the path from pricing to payment has maximum friction: click "Get Started" -> scroll to contact section -> BookingWidget.open() -> external booking flow on donnacha.app -> manual follow-up -> NDA -> file transfer -> processing -> invoice. That is 8+ steps with human gates at every stage. No self-serve checkout. |

**Overall AARRR Score: 9/25** - The funnel leaks badly at every stage except the initial activation moment.

---

## 3. Jobs-to-be-Done Analysis

### Primary Job
> "Help me understand what my legacy COBOL codebase does so I can make decisions about modernization, compliance, or knowledge transfer - without touching production."

This job is well-served by the product. The five-pass analysis (overview, business rules, dead code, dependency mapping, data flow) directly addresses the core need.

### Secondary Jobs (Partially Served)
| Job | Served? | Gap |
|-----|---------|-----|
| "Prove to my CTO/board that modernization is needed" | Partial | The executive summary is mentioned but not showcased. No sample executive report on the site. |
| "Onboard new developers to a legacy codebase" | Partial | Documentation is helpful but there is no interactive search, no Q&A layer on top of docs. |
| "Satisfy auditors about our COBOL business rules" | Partial | Business rules are extracted but no compliance-specific framing (SOX, APRA, PCI). |

### Unmet Jobs
| Job | Opportunity |
|-----|------------|
| "Tell me how much modernization will cost" | The tool already estimates processing cost. Extending this to estimate modernization effort (LOC x complexity) would be a natural upsell. |
| "Give me a migration plan from COBOL to Java/C#" | The dead code analysis and business rules extraction are 80% of what is needed for a migration planning product. |
| "Let me ask questions about my codebase in natural language" | A RAG layer on top of the generated documentation would be a retention-driving feature. Upload once, query forever. |

---

## 4. Retention Gaps

| Gap | Severity | Description |
|-----|----------|-------------|
| No user accounts | **CRITICAL** | No login, no dashboard, no history. Every visit is a cold start. |
| No content engine | **HIGH** | No blog, no newsletter, no educational content. Nothing to bring people back organically. |
| No post-delivery value | **HIGH** | After downloading the knowledge base, the customer has no reason to return until their next engagement (if ever). |
| No notifications | **MEDIUM** | No email after demo completion, no weekly digest, no "your industry" updates. |
| Session is ephemeral | **MEDIUM** | The session cookie expires in 24 hours. Upload state is lost. If a user uploads files today and returns tomorrow, everything is gone. |

### Recommended Retention Mechanisms
1. **Customer portal** - Login to view past analyses, re-download docs, see processing history.
2. **Interactive knowledge base** - Host the generated docs with search and a Claude-powered Q&A chatbot ("Ask about your codebase").
3. **COBOL modernization blog** - Weekly articles targeting enterprise decision-makers. Each article funnels to the demo or contact form.
4. **Monthly COBOL industry digest** - Email newsletter with modernization news, regulatory changes, case studies.

---

## 5. UX Dead Ends

| Dead End | Severity | Location | Issue |
|----------|----------|----------|-------|
| Demo completion | **CRITICAL** | `I:\Scratch\cobol-clarity\src\app\demo\demo-client.tsx` line 381-404 | After completing all 4 demo passes and downloading the knowledge base, the bottom CTA only offers "Request Free PoC" (links to `/#contact`) and "View Pricing". There is no email capture, no "share results", no "upload your own files" option. The user who just invested 5+ minutes watching the demo is offered the same generic CTAs as someone who just landed. |
| Contact section -> BookingWidget | **HIGH** | `I:\Scratch\cobol-clarity\src\app\contact-section.tsx` | The entire contact section is now just a "Book a Call" button that calls `window.BookingWidget.open()`. If the widget fails to load (donnacha.app down, JS blocked, ad blocker), the user sees a button that does nothing. No fallback. The original contact form (`contact-form.tsx`) exists but is not rendered anywhere on the site. |
| Docs page | **MEDIUM** | `I:\Scratch\cobol-clarity\src\app\docs\route.ts` | Serves a static HTML file (`docs/architecture.html`). This is a technical architecture doc, not user-facing documentation. No navigation back to the main site from within the docs page. |
| Privacy/Terms pages | **LOW** | Both pages have a "Back to Assay" link but no other navigation. Users who land here from Google have no way to discover the product without manually clicking back. |
| 404 page | **LOW** | `I:\Scratch\cobol-clarity\src\app\not-found.tsx` | Only links to home. Could include search, popular pages, or the demo link. |

---

## 6. Growth Blockers

### CRITICAL

1. **No self-serve path** - The entire conversion flow requires a human sales call. For a $1,250 starter tier, this is massive overkill. Competitors (if any exist) offering self-serve upload-and-pay will win every time on convenience. The upload API (`/api/upload`, `/api/process`, `/api/download`) already exists and works. It just has no frontend UI.

2. **Contact form is disconnected** - The `contact-form.tsx` component (with Resend email integration, validation, rate limiting) is fully built but NOT USED. The `contact-section.tsx` replaced it with a BookingWidget button. This means the email capture mechanism is dead code. Users cannot submit their details via a form - they must use an external booking widget.

3. **No content/SEO strategy** - The site has 5 indexed pages. For a niche B2B product targeting "COBOL documentation", "COBOL modernization", "legacy code analysis", "mainframe documentation", there should be 20-50+ content pages targeting long-tail keywords. Every COBOL-related search query is a potential lead.

### HIGH

4. **No social proof** - Zero testimonials, zero case studies, zero logos, zero "X programs documented" counter. Enterprise buyers need proof that others trust this tool with their source code.

5. **Demo is pre-baked only** - The demo shows a fixed payroll program. Users cannot upload their own .cbl file for a quick preview. Even a limited "analyze 1 file free" self-serve flow would dramatically increase activation.

6. **No analytics beyond Vercel** - Vercel Analytics provides page views but no funnel tracking, no heatmaps, no form analytics. There is no way to measure where users drop off.

### MEDIUM

7. **Pricing may deter exploration** - $1,250 AUD for the starter tier is displayed upfront with no option to try first (beyond the PoC, which requires a sales call). A freemium tier or self-serve single-file analysis would lower the barrier.

8. **No urgency or scarcity** - No limited-time offers, no "X spots remaining this quarter", no upcoming deadline messaging. Enterprise COBOL modernization has natural urgency (retiring workforce, compliance deadlines) that is not leveraged.

9. **ABN pending / Draft legal docs** - Both the Privacy Policy and Terms display "Draft" banners and "ABN pending". This undermines the enterprise trust messaging. An enterprise buyer doing due diligence will flag this.

---

## 7. Conversion Funnel Analysis

### Current Flow: Landing Page -> Contact

```
Landing Page (100%)
  |
  v
Scroll to #contact section (??%)     <- No tracking, unknown drop-off
  |
  v
Click "Book a Call" button (??%)      <- Depends on BookingWidget loading
  |
  v
BookingWidget opens (??%)             <- External dependency, can fail silently
  |
  v
User selects time slot (??%)          <- Leaves assay.software context
  |
  v
Call happens (??%)                    <- Multi-day delay, momentum lost
  |
  v
NDA signed, files transferred (??%)  <- Manual process
  |
  v
Payment (??%)                         <- 8+ steps from first visit
```

### Leaks Identified

| Leak | Severity | Estimated Impact |
|------|----------|-----------------|
| BookingWidget as sole CTA | **CRITICAL** | If the widget fails to load (ad blockers, network issues, donnacha.app outage), 100% of conversion attempts fail silently. No fallback form exists on the page. |
| No email capture anywhere | **CRITICAL** | Users who are interested but not ready to book a call have zero way to stay in touch. No newsletter, no "get notified", no "download whitepaper". Every non-booking visitor is lost forever. |
| Demo -> Contact gap | **HIGH** | The demo page bottom CTA links to `/#contact` which opens the BookingWidget. But users who just watched a 5-minute demo are warm leads - they should get a contextual form ("Liked the demo? Upload your own files") not a generic booking button. |
| No form on pricing cards | **HIGH** | Each pricing tier has a "Get Started" button that scrolls to #contact. All four tiers funnel to the same booking button. There is no tier-specific context passed. The sales team has no idea which tier the lead was interested in. |
| Mobile booking experience | **MEDIUM** | The BookingWidget is loaded lazily and may not work well on mobile. No mobile-specific fallback (e.g., phone number, WhatsApp link). |

### Recommended Funnel Fixes (Priority Order)

1. **Restore the contact form as primary CTA** - Put `contact-form.tsx` back on the page as the default. Add "Or book a call" as secondary option below it. This captures leads even when the booking widget fails.
2. **Add email capture to demo completion** - After all 4 passes complete, show: "Want this for your codebase? Enter your email and we'll send a custom quote."
3. **Add tier context to CTA** - When clicking "Get Started" on a pricing card, pass the tier name to the contact form so the inquiry includes "Interested in: Standard (25K-100K lines)".
4. **Add a self-serve upload flow** - Use the existing `/api/upload` endpoint. Let users upload 1 file for free analysis. Capture email before showing results.
5. **Add a "Request PDF" lead magnet** - Offer a downloadable "COBOL Modernization Readiness Checklist" or similar in exchange for email.

---

## Priority Action Plan

| Priority | Action | Severity | Effort | Impact |
|----------|--------|----------|--------|--------|
| P0 | Restore contact form as primary CTA with BookingWidget as secondary | CRITICAL | 1 hour | Unblocks all lead capture |
| P0 | Fix "ABN pending" / "Draft" labels on legal pages | CRITICAL | 1 hour | Removes enterprise trust blocker |
| P1 | Add email capture field to demo completion screen | HIGH | 2 hours | Captures warm leads from demo |
| P1 | Build self-serve upload UI using existing API endpoints | HIGH | 1-2 days | Creates a self-serve activation path |
| P1 | Add 3-5 case studies or testimonials (even anonymized) | HIGH | 2-3 days | Social proof for enterprise buyers |
| P2 | Start a COBOL modernization blog (target: 2 articles/week) | HIGH | Ongoing | SEO acquisition channel |
| P2 | Add Hotjar or PostHog for funnel analytics | MEDIUM | 2 hours | Measure what is actually happening |
| P2 | Add newsletter signup to footer and demo page | MEDIUM | 1 hour | Capture non-converting visitors |
| P3 | Build customer portal with login and download history | MEDIUM | 3-5 days | Retention and repeat business |
| P3 | Add "Ask your codebase" RAG chatbot on delivered docs | MEDIUM | 1-2 weeks | Retention and differentiation |
| P3 | Add referral program or "share demo" functionality | LOW | 1 day | Viral growth mechanism |
| P3 | Add compliance-specific landing pages (SOX, APRA, PCI) | LOW | 2-3 days | SEO for high-intent keywords |

---

## Key Metrics to Track

| Metric | Current State | Target |
|--------|---------------|--------|
| Monthly unique visitors | Unknown (Vercel Analytics only) | Track with PostHog |
| Demo start rate | Unknown | >30% of landing page visitors |
| Demo completion rate | Unknown | >60% of demo starters |
| Contact form submissions / month | Unknown (form not even active) | >10/month |
| Booking calls / month | Unknown | >5/month |
| PoC-to-paid conversion | Unknown | >40% |
| Time from first visit to PoC request | Unknown | <7 days |
| Organic search impressions | Unknown (no GSC connected?) | >1000/month within 6 months |

---

## Summary

Assay has a genuinely useful product with solid engineering. The COBOL documentation generation pipeline works, the demo is impressive, and the security/trust messaging is appropriate for the enterprise audience. But the product is trapped behind a sales-call-only funnel with no self-serve path, no email capture, and no content strategy. The most urgent fix is restoring the contact form (it is already built and just needs to be re-added to the page). The highest-leverage investment is building a self-serve upload flow using the existing API endpoints, which would transform Assay from a consulting service into a scalable SaaS product.

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createRateLimiter, isRateLimited, getClientIp } from '@/lib/rate-limit';

const contactLimiter = createRateLimiter(5, 60 * 60 * 1000); // 5 per hour per IP

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Strict email regex - rejects control characters
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const VALID_CODEBASE_SIZES = new Set([
  '',
  'Under 25K lines',
  '25K \u2014 100K lines',
  '100K \u2014 500K lines',
  '500K+ lines',
  'Not sure',
]);

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(contactLimiter, ip)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { name, email, company, codebaseSize, message } = body as {
    name?: string;
    email?: string;
    company?: string;
    codebaseSize?: string;
    message?: string;
  };

  if (!name || !email || !company) {
    return NextResponse.json(
      { error: 'Name, email, and company are required' },
      { status: 400 }
    );
  }

  // Field length limits to prevent abuse
  if (
    String(name).length > 200 ||
    String(email).length > 254 ||
    String(company).length > 200 ||
    String(codebaseSize ?? '').length > 200 ||
    String(message ?? '').length > 2000
  ) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(String(email))) {
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400 }
    );
  }

  // Validate codebaseSize against frontend allowlist
  if (codebaseSize && !VALID_CODEBASE_SIZES.has(String(codebaseSize))) {
    return NextResponse.json({ error: 'Invalid codebase size' }, { status: 400 });
  }

  // Strip control characters from all fields used in email headers/subjects
  const sanitizedEmail = String(email).replace(/[\r\n\t]/g, '');
  const sanitizedName = String(name).replace(/[\r\n\t]/g, '');
  const sanitizedCompany = String(company).replace(/[\r\n\t]/g, '');

  const notificationHtml = `
    <h2>New PoC Request - Assay</h2>
    <table style="border-collapse:collapse;width:100%;max-width:500px;">
      <tr><td style="padding:8px;font-weight:bold;color:#333;">Name</td><td style="padding:8px;">${escapeHtml(sanitizedName)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#333;">Email</td><td style="padding:8px;"><a href="mailto:${escapeHtml(sanitizedEmail)}">${escapeHtml(sanitizedEmail)}</a></td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#333;">Company</td><td style="padding:8px;">${escapeHtml(sanitizedCompany)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#333;">Codebase Size</td><td style="padding:8px;">${escapeHtml(String(codebaseSize || 'Not specified'))}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#333;">Message</td><td style="padding:8px;">${escapeHtml(String(message || 'None'))}</td></tr>
    </table>
  `;

  const confirmationHtml = `
    <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;">
      <h2 style="color:#060b18;">Thanks for your interest, ${escapeHtml(sanitizedName)}!</h2>
      <p style="color:#333;line-height:1.6;">
        We've received your request for a free Proof of Concept. We'll review your details
        and get back to you within 1-2 business days to discuss next steps.
      </p>
      <p style="color:#333;line-height:1.6;">
        As a reminder, the free PoC includes documentation of up to 5 of your COBOL programs -
        giving you a clear picture of what the full engagement delivers.
      </p>
      <p style="color:#666;font-size:14px;margin-top:24px;">
        - The Assay Team<br/>
        <span style="color:#999;">Solaisoft Pty Ltd</span>
      </p>
    </div>
  `;

  if (!resend) {
    console.log('DEV: PoC request received (no RESEND_API_KEY)', {
      company: sanitizedCompany,
      hasEmail: Boolean(email),
    });
    return NextResponse.json({ success: true });
  }

  try {
    await Promise.all([
      resend.emails.send({
        from: 'Assay <noreply@assay.software>',
        to: 'hello@assay.software',
        replyTo: sanitizedEmail,
        subject: `PoC Request: ${sanitizedCompany}`,
        html: notificationHtml,
      }),
      resend.emails.send({
        from: 'Assay <noreply@assay.software>',
        to: sanitizedEmail,
        subject: 'Your Assay PoC Request',
        html: confirmationHtml,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { error: 'Failed to send request. Please try again.' },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

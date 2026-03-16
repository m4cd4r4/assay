import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Rate limit: 5 submissions per hour per IP
const contactAttempts = new Map<string, number[]>();

function isContactRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const limit = 5;

  const attempts = (contactAttempts.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (attempts.length >= limit) {
    contactAttempts.set(ip, attempts);
    return true;
  }
  attempts.push(now);
  contactAttempts.set(ip, attempts);
  return false;
}

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (isContactRateLimited(ip)) {
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
    String(message ?? '').length > 2000
  ) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email))) {
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400 }
    );
  }

  const notificationHtml = `
    <h2>New PoC Request — Assay</h2>
    <table style="border-collapse:collapse;width:100%;max-width:500px;">
      <tr><td style="padding:8px;font-weight:bold;color:#333;">Name</td><td style="padding:8px;">${escapeHtml(String(name))}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#333;">Email</td><td style="padding:8px;"><a href="mailto:${escapeHtml(String(email))}">${escapeHtml(String(email))}</a></td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#333;">Company</td><td style="padding:8px;">${escapeHtml(String(company))}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#333;">Codebase Size</td><td style="padding:8px;">${escapeHtml(String(codebaseSize || 'Not specified'))}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#333;">Message</td><td style="padding:8px;">${escapeHtml(String(message || 'None'))}</td></tr>
    </table>
  `;

  const confirmationHtml = `
    <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;">
      <h2 style="color:#060b18;">Thanks for your interest, ${escapeHtml(String(name))}!</h2>
      <p style="color:#333;line-height:1.6;">
        We've received your request for a free Proof of Concept. We'll review your details
        and get back to you within 1-2 business days to discuss next steps.
      </p>
      <p style="color:#333;line-height:1.6;">
        As a reminder, the free PoC includes documentation of up to 5 of your COBOL programs —
        giving you a clear picture of what the full engagement delivers.
      </p>
      <p style="color:#666;font-size:14px;margin-top:24px;">
        — The Assay Team<br/>
        <span style="color:#999;">Solaisoft Pty Ltd</span>
      </p>
    </div>
  `;

  if (!resend) {
    console.log('DEV: PoC request received (no RESEND_API_KEY)', {
      name,
      email,
      company,
      codebaseSize,
      message,
    });
    return NextResponse.json({ success: true });
  }

  try {
    await Promise.all([
      resend.emails.send({
        from: 'Assay <noreply@assay.software>',
        to: 'hello@assay.software',
        replyTo: String(email),
        subject: `PoC Request: ${String(company)}`,
        html: notificationHtml,
      }),
      resend.emails.send({
        from: 'Assay <noreply@assay.software>',
        to: String(email),
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
    .replace(/"/g, '&quot;');
}

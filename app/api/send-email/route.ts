import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { emailRateLimiter } from '@/lib/rate-limit';
import { z } from 'zod';

const contactSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10).max(5000),
});

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    const rateLimitResult = emailRateLimiter.check(ip, 5);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      );
    }

    const body = await request.json();
    
    // Validate with Zod
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Données invalides', details: validationResult.error.errors }, { status: 400 });
    }
    
    const { firstName, lastName, email, phone, message } = validationResult.data;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json({ error: 'Email service unavailable' }, { status: 503 });
    }
    const resend = new Resend(apiKey);

    const fromEmail = 'onboarding@resend.dev';
    const toEmail = process.env.CLINIC_EMAIL || 'contact@cliniqueokba.com';

    const { data, error } = await resend.emails.send({
      from: `Clinique Okba <${fromEmail}>`,
      to: [toEmail],
      subject: 'Nouveau message depuis le formulaire de contact',
      html: `<p>Vous avez reçu un nouveau message de <strong>${escapeHtml(firstName)} ${escapeHtml(lastName)}</strong>.</p>
             <p><strong>Email:</strong> ${escapeHtml(email)}</p>
             <p><strong>Téléphone:</strong> ${escapeHtml(phone || 'Non renseigné')}</p>
             <p><strong>Message:</strong></p>
             <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
    });

    if (error) {
      console.error('Resend email error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

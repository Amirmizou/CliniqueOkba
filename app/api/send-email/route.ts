import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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
    
    const rateLimitResult = await emailRateLimiter.check(ip, 5);
    
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

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error('SMTP configuration is incomplete (SMTP_HOST / SMTP_USER / SMTP_PASS)');
      return NextResponse.json({ error: 'Email service unavailable' }, { status: 503 });
    }

    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    // SMTP_SECURE=true => connexion TLS directe (port 465). false => STARTTLS (port 587).
    const smtpSecure = process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === 'true'
      : smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Expéditeur : sur Hostinger l'adresse "from" doit correspondre à la boîte SMTP.
    // Par défaut on réutilise SMTP_USER. Destinataire = MAIL_TO (ou SMTP_USER).
    const fromEmail = process.env.MAIL_FROM || `Clinique Okba <${smtpUser}>`;
    const toEmail = process.env.MAIL_TO || process.env.CLINIC_EMAIL || smtpUser;

    try {
      await transporter.sendMail({
        from: fromEmail,
        to: toEmail,
        replyTo: email,
        subject: 'Nouveau message depuis le formulaire de contact',
        html: `<p>Vous avez reçu un nouveau message de <strong>${escapeHtml(firstName)} ${escapeHtml(lastName)}</strong>.</p>
               <p><strong>Email:</strong> ${escapeHtml(email)}</p>
               <p><strong>Téléphone:</strong> ${escapeHtml(phone || 'Non renseigné')}</p>
               <p><strong>Message:</strong></p>
               <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
      });
    } catch (sendError) {
      console.error('SMTP email error:', sendError);
      return NextResponse.json(
        { error: "Échec de l'envoi de l'email" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

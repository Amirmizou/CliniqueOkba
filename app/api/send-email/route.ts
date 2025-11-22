import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { emailRateLimiter } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const { firstName, lastName, email, phone, message } = await request.json();

    // Ensure 'from' email is a verified domain in your Resend account
    // For testing, you can use 'onboarding@resend.dev'
    const fromEmail = 'onboarding@resend.dev'; // Replace with your verified sender email

    const { data, error } = await resend.emails.send({
      from: `Clinique Okba <${fromEmail}>`,
      to: ['denzbahi@gmail.com'], // Replace with your own email address
      subject: 'Nouveau message depuis le formulaire de contact',
      html: `<p>Vous avez reçu un nouveau message de <strong>${firstName} ${lastName}</strong>.</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Téléphone:</strong> ${phone}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`,
    });

    if (error) {
      console.error('Resend email error:', error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}

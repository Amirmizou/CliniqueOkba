import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { emailDailyLimiter, emailRateLimiter } from '@/lib/rate-limit';
import {
  checkHumanSignals,
  getClientIp,
  isAttackToolUserAgent,
  isBotUserAgent,
  isSameOriginRequest,
  looksLikeSpamContent,
  NO_STORE_HEADERS,
} from '@/lib/security';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

/** Taille maximale du corps accepté : au-delà, c'est un abus (5 ko de texte suffisent). */
const MAX_BODY_BYTES = 32 * 1024;

/** Plafonds : rafale par minute, et volume journalier par IP. */
const PER_MINUTE = 3;
const PER_DAY = 15;

const contactSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email().max(120),
  phone: z.string().max(30).optional(),
  message: z.string().min(10).max(5000),
  // Signaux anti-robot envoyés par le formulaire (voir components/contact.tsx).
  honeypot: z.string().max(200).optional(),
  startedAt: z.union([z.number(), z.string()]).optional(),
});

/**
 * Réponse « succès » renvoyée aux robots détectés.
 *
 * Répondre 403 apprend au robot quel signal l'a trahi et l'incite à s'adapter.
 * On renvoie donc un succès silencieux sans envoyer d'email.
 */
function silentSuccess(reason: string) {
  console.warn(`[contact] Soumission rejetée (${reason}) — réponse silencieuse`);
  return NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
}

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
    const ua = request.headers.get('user-agent');

    // 1. Robots manifestes : outils de scan et clients non navigateur. Le
    //    formulaire n'est utilisable que depuis une page du site.
    if (isAttackToolUserAgent(ua)) return silentSuccess('attack-tool');
    if (isBotUserAgent(ua)) return silentSuccess('bot-ua');
    if (!isSameOriginRequest(request)) return silentSuccess('cross-origin');

    // 2. Corps surdimensionné : refusé avant toute lecture/parsing.
    const declaredLength = Number(request.headers.get('content-length') || 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Requête trop volumineuse.' }, { status: 413 });
    }

    // 3. Limitation de débit. L'IP est extraite d'en-têtes non falsifiables
    //    (voir getClientIp) : un robot ne peut plus créer une clé neuve à
    //    chaque requête en envoyant son propre `x-forwarded-for`.
    const ip = getClientIp(request.headers);

    const [burst, daily] = await Promise.all([
      emailRateLimiter.check(ip, PER_MINUTE),
      emailDailyLimiter.check(ip, PER_DAY),
    ]);

    if (!burst.success || !daily.success) {
      const reset = (!burst.success ? burst.reset : daily.reset).toString();
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
        {
          status: 429,
          headers: {
            ...NO_STORE_HEADERS,
            'Retry-After': Math.max(1, Math.ceil((Number(reset) - Date.now()) / 1000)).toString(),
            'X-RateLimit-Limit': String(PER_MINUTE),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': reset,
          }
        }
      );
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Requête trop volumineuse.' }, { status: 413 });
    }
    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    // Validate with Zod
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      // Pas de `details` : le détail des règles de validation aide un robot à
      // ajuster sa charge jusqu'à passer.
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const { firstName, lastName, email, phone, message, honeypot, startedAt } =
      validationResult.data;

    // 4. Signaux « humain » : champ piège + délai de remplissage. Ces contrôles
    //    existaient uniquement côté client, donc un robot postant directement
    //    sur l'API les ignorait complètement.
    const human = checkHumanSignals({ honeypot, startedAt });
    if (!human.ok) return silentSuccess(human.reason);

    // 5. Contenu manifestement automatisé (spam SEO, injection de liens).
    if (looksLikeSpamContent(firstName, lastName, message, phone)) {
      return silentSuccess('spam-content');
    }

    // 6. En-têtes SMTP : un saut de ligne dans une valeur réinjectée permettrait
    //    d'ajouter des destinataires (injection d'en-tête / relais de spam).
    const clean = (v: string) => v.replace(/[\r\n]+/g, ' ').trim();

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
      // Sans délais explicites, nodemailer attend très longtemps : quand le SMTP
      // Hostinger ne répond pas, la requête restait suspendue jusqu'au timeout de
      // la plateforme (le visiteur voit un formulaire figé, aucune trace de
      // l'erreur). On échoue vite et proprement à la place.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });

    // Expéditeur : sur Hostinger l'adresse "from" doit correspondre à la boîte SMTP.
    // Par défaut on réutilise SMTP_USER. Destinataire = MAIL_TO (ou SMTP_USER).
    const fromEmail = process.env.MAIL_FROM || `Clinique Okba <${smtpUser}>`;
    const toEmail = process.env.MAIL_TO || process.env.CLINIC_EMAIL || smtpUser;

    const mail = {
      from: fromEmail,
      to: toEmail,
      replyTo: clean(email),
      subject: 'Nouveau message depuis le formulaire de contact',
      html: `<p>Vous avez reçu un nouveau message de <strong>${escapeHtml(firstName)} ${escapeHtml(lastName)}</strong>.</p>
             <p><strong>Email:</strong> ${escapeHtml(email)}</p>
             <p><strong>Téléphone:</strong> ${escapeHtml(phone || 'Non renseigné')}</p>
             <p><strong>Message:</strong></p>
             <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
    };

    // Erreurs réseau transitoires : Hostinger coupe régulièrement une connexion
    // SMTP au-delà d'un certain rythme. Une seule nouvelle tentative suffit
    // dans la grande majorité des cas.
    const TRANSIENT = ['ETIMEDOUT', 'ECONNRESET', 'ECONNECTION', 'ESOCKET', 'EDNS'];

    try {
      try {
        await transporter.sendMail(mail);
      } catch (firstError) {
        const code = (firstError as { code?: string })?.code || '';
        if (!TRANSIENT.includes(code)) throw firstError;
        console.warn(`[contact] Échec SMTP transitoire (${code}) — nouvelle tentative`);
        await new Promise((r) => setTimeout(r, 1_000));
        await transporter.sendMail(mail);
      }
    } catch (sendError) {
      const err = sendError as { message?: string; code?: string; command?: string; response?: string };
      // Log structuré : sans host/port/secure, impossible de distinguer dans les
      // logs Hostinger une panne SMTP d'une mauvaise configuration.
      console.error('[contact] Échec SMTP définitif', {
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        user: smtpUser,
        code: err?.code,
        command: err?.command,
        response: err?.response,
        message: err?.message,
      });
      // Aucun détail dans la réponse : le diagnostic SMTP (hôte, commande,
      // réponse du serveur, message d'erreur) renseignait un attaquant sur
      // l'infrastructure mail et son état. Il reste dans les logs serveur.
      return NextResponse.json(
        { error: "Échec de l'envoi de l'email" },
        { status: 502, headers: NO_STORE_HEADERS },
      );
    }

    return NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

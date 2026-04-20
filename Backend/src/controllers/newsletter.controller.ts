import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import jwt from 'jsonwebtoken';
import { Newsletter } from '../entities/newsletter.entity';
import { NewsletterCampaign } from '../entities/newsletterCampaign.entity';
import { Usuario } from '../entities/usuario.entity';
import { sendEmail, sendNewsletterWelcome } from '../services/email.service';
import { AuthRequest } from '../middleware/auth.middleware';

type AudienceType = 'registered' | 'subscribers' | 'all';
type TemplateStyle = 'clean' | 'ocean' | 'forest';

interface CampaignBlocksInput {
  introTitle?: string;
  introText?: string;
  highlightTitle?: string;
  highlightText?: string;
  bullets?: string[];
  closingText?: string;
}

interface CampaignCustomizationInput {
  templateStyle?: TemplateStyle;
  preheader?: string;
  ctaText?: string;
  ctaUrl?: string;
  senderName?: string;
  footerNote?: string;
  blocks?: CampaignBlocksInput;
}

interface CampaignCustomization {
  templateStyle: TemplateStyle;
  preheader: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  senderName: string;
  footerNote: string | null;
  blocks: {
    introTitle: string | null;
    introText: string | null;
    highlightTitle: string | null;
    highlightText: string | null;
    bullets: string[];
    closingText: string | null;
  };
}

interface CampaignRecipient {
  email: string;
  name: string | null;
}

const ALLOWED_VARIABLES = ['nombre', 'email', 'frontend_url', 'anio'];

const UNSUBSCRIBE_TOKEN_TTL = '365d';

const normalizeEmail = (email?: string | null): string | null => {
  if (!email || typeof email !== 'string') return null;
  const normalized = email.trim().toLowerCase();
  return normalized && normalized.includes('@') ? normalized : null;
};

const getJwtSecret = (): string => process.env.JWT_SECRET || 'secretkey';

const createUnsubscribeToken = (email: string): string => {
  return jwt.sign(
    { email, type: 'newsletter-unsubscribe' },
    getJwtSecret(),
    { expiresIn: UNSUBSCRIBE_TOKEN_TTL }
  );
};

const parseUnsubscribeToken = (token: string): string | null => {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as { email?: string; type?: string };
    if (!payload || payload.type !== 'newsletter-unsubscribe') return null;
    return normalizeEmail(payload.email) || null;
  } catch {
    return null;
  }
};

const buildUnsubscribeLink = (email: string): string => {
  const token = createUnsubscribeToken(email);
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return `${frontendUrl}/unsubscribe/${token}`;
};

const normalizeCustomization = (input?: CampaignCustomizationInput): CampaignCustomization => {
  const templateStyle: TemplateStyle = ['clean', 'ocean', 'forest'].includes(input?.templateStyle || '')
    ? (input?.templateStyle as TemplateStyle)
    : 'clean';

  const preheader = (input?.preheader || '').trim() || null;
  const ctaText = (input?.ctaText || '').trim() || null;
  const ctaUrl = (input?.ctaUrl || '').trim() || null;
  const senderName = (input?.senderName || '').trim() || 'Equipo BookCode';
  const footerNote = (input?.footerNote || '').trim() || null;

  const blocks = {
    introTitle: (input?.blocks?.introTitle || '').trim() || null,
    introText: (input?.blocks?.introText || '').trim() || null,
    highlightTitle: (input?.blocks?.highlightTitle || '').trim() || null,
    highlightText: (input?.blocks?.highlightText || '').trim() || null,
    bullets: Array.isArray(input?.blocks?.bullets)
      ? input!.blocks!.bullets!.map((b) => (b || '').trim()).filter(Boolean)
      : [],
    closingText: (input?.blocks?.closingText || '').trim() || null,
  };

  return {
    templateStyle,
    preheader,
    ctaText,
    ctaUrl,
    senderName,
    footerNote,
    blocks,
  };
};

const extractVariables = (text: string): string[] => {
  const matches = text.match(/\{\{\s*([a-zA-Z_]+)\s*\}\}/g) || [];
  return Array.from(new Set(matches.map((m) => m.replace(/[{}\s]/g, ''))));
};

const replaceVariables = (text: string, recipient: CampaignRecipient): string => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const map: Record<string, string> = {
    nombre: recipient.name || 'lector',
    email: recipient.email,
    frontend_url: frontendUrl,
    anio: String(new Date().getFullYear()),
  };

  return text.replace(/\{\{\s*([a-zA-Z_]+)\s*\}\}/g, (_m, key) => {
    const cleanKey = String(key || '').trim();
    return map[cleanKey] ?? `{{${cleanKey}}}`;
  });
};

const gatherTextsForValidation = (subject: string, message: string, c: CampaignCustomization): string[] => {
  return [
    subject,
    message,
    c.preheader || '',
    c.ctaText || '',
    c.ctaUrl || '',
    c.senderName || '',
    c.footerNote || '',
    c.blocks.introTitle || '',
    c.blocks.introText || '',
    c.blocks.highlightTitle || '',
    c.blocks.highlightText || '',
    ...(c.blocks.bullets || []),
    c.blocks.closingText || '',
  ].filter(Boolean);
};

const validateCampaignInput = (subject: string, message: string, c: CampaignCustomization) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (subject.trim().length < 3) errors.push('El asunto debe tener al menos 3 caracteres.');
  if (subject.trim().length > 120) warnings.push('El asunto es largo, considera menos de 90 caracteres.');
  if (message.trim().length < 10) errors.push('El mensaje principal debe tener al menos 10 caracteres.');
  if (c.preheader && c.preheader.length > 140) warnings.push('El preheader supera 140 caracteres.');

  if ((c.ctaText && !c.ctaUrl) || (!c.ctaText && c.ctaUrl)) {
    errors.push('CTA incompleto: debes completar texto y URL del botón.');
  }

  if (c.ctaUrl && !/^https?:\/\//i.test(c.ctaUrl)) {
    errors.push('La URL del CTA debe empezar con http:// o https://');
  }

  const usedVariables = Array.from(new Set(gatherTextsForValidation(subject, message, c).flatMap(extractVariables)));
  const invalidVariables = usedVariables.filter((v) => !ALLOWED_VARIABLES.includes(v));
  if (invalidVariables.length) {
    errors.push(`Variables no soportadas: ${invalidVariables.join(', ')}`);
  }

  if (!c.ctaText) warnings.push('No hay CTA configurado (botón principal).');
  if (!c.blocks.bullets.length && !c.blocks.highlightText) warnings.push('No hay bloque destacado ni bullets.');

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    usedVariables,
    allowedVariables: ALLOWED_VARIABLES,
  };
};

const getTemplateColors = (style: TemplateStyle) => {
  if (style === 'ocean') {
    return {
      bg: '#f0f9ff',
      header: 'linear-gradient(135deg, #0891b2 0%, #2563eb 100%)',
      button: '#0f766e',
      surface: '#ecfeff',
    };
  }

  if (style === 'forest') {
    return {
      bg: '#f8fafc',
      header: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      button: '#0284c7',
      surface: '#e2e8f0',
    };
  }

  return {
    bg: '#f8fafc',
    header: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    button: '#0ea5e9',
    surface: '#f1f5f9',
  };
};

const campaignHtml = (
  subject: string,
  message: string,
  unsubscribeLink: string,
  customization: CampaignCustomization
): string => {
  const colors = getTemplateColors(customization.templateStyle);
  const ctaBlock = customization.ctaText && customization.ctaUrl
    ? `
      <div style="margin: 24px 0; text-align: left;">
        <a href="${customization.ctaUrl}" style="display: inline-block; padding: 10px 18px; border-radius: 8px; background: ${colors.button}; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600;">
          ${customization.ctaText}
        </a>
      </div>
    `
    : '';

  const footerNote = customization.footerNote
    ? `<p style="font-size: 12px; color: #6b7280; margin: 10px 0 0;">${customization.footerNote}</p>`
    : '';

  const preheaderBlock = customization.preheader
    ? `<span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${customization.preheader}</span>`
    : '';

  const introBlock = customization.blocks.introTitle || customization.blocks.introText
    ? `
      <div style="margin: 16px 0;">
        ${customization.blocks.introTitle ? `<h2 style="margin: 0 0 6px; color:#0f172a; font-size: 20px;">${customization.blocks.introTitle}</h2>` : ''}
        ${customization.blocks.introText ? `<p style="margin:0; font-size:14px; color:#334155;">${customization.blocks.introText}</p>` : ''}
      </div>
    `
    : '';

  const highlightBlock = customization.blocks.highlightTitle || customization.blocks.highlightText
    ? `
      <div style="margin:16px 0; padding: 12px; border-radius: 8px; background: ${colors.surface}; border: 1px solid #dbeafe;">
        ${customization.blocks.highlightTitle ? `<p style="margin:0 0 4px; font-weight:700; color:#0f172a;">${customization.blocks.highlightTitle}</p>` : ''}
        ${customization.blocks.highlightText ? `<p style="margin:0; font-size:14px; color:#334155;">${customization.blocks.highlightText}</p>` : ''}
      </div>
    `
    : '';

  const bulletsBlock = customization.blocks.bullets.length
    ? `<ul style="margin: 10px 0 16px; padding-left: 20px; color:#334155; font-size:14px;">${customization.blocks.bullets.map((b) => `<li style="margin-bottom:4px;">${b}</li>`).join('')}</ul>`
    : '';

  const closingBlock = customization.blocks.closingText
    ? `<p style="font-size:14px; color:#334155; margin: 14px 0 0;">${customization.blocks.closingText}</p>`
    : '';

  return `
    <div style="font-family: 'Segoe UI', 'Inter', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 680px; margin: 0 auto; padding: 18px; background: ${colors.bg}; border: 1px solid #e2e8f0; border-radius: 12px;">
      ${preheaderBlock}
      <div style="background: ${colors.header}; color: #ffffff; border-radius: 10px; padding: 16px 18px; margin-bottom: 16px;">
        <p style="margin: 0 0 6px; font-size: 12px; opacity: 0.9;">${customization.senderName}</p>
        <h1 style="margin: 0; font-size: 26px;">${subject}</h1>
      </div>

      <div style="white-space: pre-wrap; font-size: 15px;">${message}</div>
      ${introBlock}
      ${highlightBlock}
      ${bulletsBlock}
      ${ctaBlock}
      ${closingBlock}

      <hr style="margin: 24px 0; border: 0; border-top: 1px solid #e5e7eb;" />
      <p style="font-size: 12px; color: #6b7280; margin: 0 0 6px;">Email enviado desde el panel de administracion de BookCode.</p>
      <p style="font-size: 12px; color: #6b7280; margin: 0;">
        Si no queres recibir estos correos,
        <a href="${unsubscribeLink}" style="color: #2563eb; text-decoration: none;">darte de baja de la newsletter</a>.
      </p>
      ${footerNote}
    </div>
  `;
};

const getAudienceRecipients = async (orm: MikroORM, audience: AudienceType): Promise<CampaignRecipient[]> => {
  const em = orm.em.fork();
  const recipientMap = new Map<string, CampaignRecipient>();

  const addRecipient = (email: string | null, name?: string | null) => {
    if (!email) return;
    const existing = recipientMap.get(email);
    if (!existing) {
      recipientMap.set(email, { email, name: (name || '').trim() || null });
      return;
    }

    if (!existing.name && name) {
      existing.name = (name || '').trim() || null;
    }
  };

  if (audience === 'registered' || audience === 'all') {
    const usuarios = await em.find(Usuario, {}, { fields: ['email', 'nombre', 'username'] as any });
    for (const user of usuarios) {
      const normalized = normalizeEmail(user.email);
      addRecipient(normalized, user.nombre || user.username || null);
    }
  }

  if (audience === 'subscribers' || audience === 'all') {
    const subscriptions = await em.find(Newsletter, { activo: true }, { fields: ['email', 'nombre'] as any });
    for (const sub of subscriptions) {
      const normalized = normalizeEmail(sub.email);
      addRecipient(normalized, sub.nombre || null);
    }
  }

  return Array.from(recipientMap.values());
};

const serializeCreatedAt = (value: unknown): string | null => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'string') {
    // MySQL DATE rows can still exist from legacy migrations.
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
    return value;
  }

  return null;
};

/**
 * Suscribir un email a la newsletter
 */
export const subscribe = async (req: Request, res: Response) => {
  try {
    const { email, nombre } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return res.status(400).json({ 
        message: 'Email inválido' 
      });
    }

    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();

    // Verificar si ya está suscrito
    const existingSub = await em.findOne(Newsletter, { email: normalizedEmail });

    if (existingSub) {
      if (existingSub.activo) {
        return res.status(400).json({ 
          message: 'Este email ya está suscrito a la newsletter' 
        });
      } else {
        // Reactivar suscripción
        existingSub.activo = true;
        existingSub.fechaBaja = undefined;
        await em.persistAndFlush(existingSub);

        // Enviar email de bienvenida (solo si está configurado)
        if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
          try {
            await sendNewsletterWelcome(normalizedEmail, nombre, buildUnsubscribeLink(normalizedEmail));
            console.log('✅ Email de bienvenida enviado a:', normalizedEmail);
          } catch (emailError) {
            console.warn('⚠️  No se pudo enviar email de bienvenida:', emailError);
          }
        }

        return res.status(200).json({
          message: 'Suscripción reactivada exitosamente',
          subscription: existingSub,
        });
      }
    }

    // Crear nueva suscripción
    const subscription = new Newsletter(normalizedEmail, nombre);

    await em.persistAndFlush(subscription);

    // Enviar email de bienvenida (solo si está configurado)
    if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
      try {
        await sendNewsletterWelcome(normalizedEmail, nombre, buildUnsubscribeLink(normalizedEmail));
        console.log('✅ Email de bienvenida enviado a:', normalizedEmail);
      } catch (emailError) {
        console.warn('⚠️  No se pudo enviar email de bienvenida:', emailError);
        // No fallar si el email no se puede enviar
      }
    } else {
      console.log('ℹ️  Email no configurado, suscripción guardada sin envío de email');
    }

    return res.status(201).json({
      message: '¡Suscripción exitosa! Revisa tu email',
      subscription,
    });
  } catch (error: any) {
    console.error('Error en subscribe:', error);
    return res.status(500).json({ 
      message: 'Error al procesar la suscripción',
      error: error.message,
    });
  }
};

/**
 * Cancelar suscripción a la newsletter
 */
export const unsubscribe = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return res.status(400).json({ 
        message: 'Email requerido' 
      });
    }

    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();

    const subscription = await em.findOne(Newsletter, { email: normalizedEmail, activo: true });

    if (!subscription) {
      return res.status(404).json({ 
        message: 'Suscripción no encontrada' 
      });
    }

    subscription.activo = false;
    subscription.fechaBaja = new Date();

    await em.persistAndFlush(subscription);

    return res.status(200).json({
      message: 'Te has dado de baja de la newsletter',
    });
  } catch (error: any) {
    console.error('Error en unsubscribe:', error);
    return res.status(500).json({ 
      message: 'Error al procesar la baja',
      error: error.message,
    });
  }
};

/**
 * Cancelar suscripción mediante token de email
 */
export const unsubscribeByToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const email = parseUnsubscribeToken(token);

    if (!email) {
      return res.status(400).json({ message: 'Token de desuscripcion invalido o expirado' });
    }

    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();

    const subscription = await em.findOne(Newsletter, { email });
    if (!subscription) {
      return res.json({ message: 'El email no estaba suscripto', email });
    }

    if (subscription.activo) {
      subscription.activo = false;
      subscription.fechaBaja = new Date();
      await em.persistAndFlush(subscription);
    }

    return res.json({ message: 'Suscripcion cancelada correctamente', email });
  } catch (error: any) {
    console.error('Error en unsubscribeByToken:', error);
    return res.status(500).json({
      message: 'Error al procesar la desuscripcion',
      error: error.message,
    });
  }
};

/**
 * Obtener todas las suscripciones (solo admin)
 */
export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();

    const subscriptions = await em.find(Newsletter, {}, {
      orderBy: { fechaSuscripcion: 'DESC' },
    });

    const stats = {
      total: subscriptions.length,
      activos: subscriptions.filter((s: Newsletter) => s.activo).length,
      inactivos: subscriptions.filter((s: Newsletter) => !s.activo).length,
    };

    return res.json({
      subscriptions,
      stats,
    });
  } catch (error: any) {
    console.error('Error en getAllSubscriptions:', error);
    return res.status(500).json({ 
      message: 'Error al obtener suscripciones',
      error: error.message,
    });
  }
};

/**
 * Obtener resumen de destinatarios disponibles para campaña admin
 */
export const getRecipientsSummary = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();

    const [usuarios, subscriptions] = await Promise.all([
      em.find(Usuario, {}, { fields: ['email'] as any }),
      em.find(Newsletter, { activo: true }, { fields: ['email'] as any }),
    ]);

    const registeredSet = new Set<string>();
    const subscribersSet = new Set<string>();

    for (const user of usuarios) {
      const normalized = normalizeEmail(user.email);
      if (normalized) {
        registeredSet.add(normalized);
      }
    }

    for (const sub of subscriptions) {
      const normalized = normalizeEmail(sub.email);
      if (normalized) {
        subscribersSet.add(normalized);
      }
    }

    const allSet = new Set<string>([...registeredSet, ...subscribersSet]);

    return res.json({
      registered: registeredSet.size,
      subscribers: subscribersSet.size,
      totalUnique: allSet.size,
    });
  } catch (error: any) {
    console.error('Error en getRecipientsSummary:', error);
    return res.status(500).json({
      message: 'Error al obtener resumen de destinatarios',
      error: error.message,
    });
  }
};

/**
 * Enviar newsletter/campaña a destinatarios desde panel admin
 */
export const sendAdminCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { subject, message, audience, customization } = req.body as {
      subject?: string;
      message?: string;
      audience?: AudienceType;
      customization?: CampaignCustomizationInput;
    };

    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      return res.status(400).json({
        message: 'El envio de emails no esta configurado en el servidor',
      });
    }

    const cleanSubject = (subject || '').trim();
    const cleanMessage = (message || '').trim();
    const selectedAudience: AudienceType = audience || 'all';
    const normalizedCustomization = normalizeCustomization(customization);

    if (!['registered', 'subscribers', 'all'].includes(selectedAudience)) {
      return res.status(400).json({ message: 'Audiencia invalida' });
    }

    const validation = validateCampaignInput(cleanSubject, cleanMessage, normalizedCustomization);
    if (!validation.valid) {
      return res.status(400).json({
        message: 'La campaña tiene errores de validación',
        details: validation,
      });
    }

    const orm = req.app.get('orm') as MikroORM;
    const recipients = await getAudienceRecipients(orm, selectedAudience);

    if (recipients.length === 0) {
      return res.status(400).json({ message: 'No hay destinatarios para la audiencia seleccionada' });
    }

    const failures: string[] = [];
    let sentCount = 0;

    for (const recipient of recipients) {
      try {
        const personalizedSubject = replaceVariables(cleanSubject, recipient);
        const personalizedMessage = replaceVariables(cleanMessage, recipient);
        const personalizedCustomization: CampaignCustomization = {
          ...normalizedCustomization,
          preheader: normalizedCustomization.preheader ? replaceVariables(normalizedCustomization.preheader, recipient) : null,
          ctaText: normalizedCustomization.ctaText ? replaceVariables(normalizedCustomization.ctaText, recipient) : null,
          ctaUrl: normalizedCustomization.ctaUrl ? replaceVariables(normalizedCustomization.ctaUrl, recipient) : null,
          senderName: replaceVariables(normalizedCustomization.senderName, recipient),
          footerNote: normalizedCustomization.footerNote ? replaceVariables(normalizedCustomization.footerNote, recipient) : null,
          blocks: {
            introTitle: normalizedCustomization.blocks.introTitle ? replaceVariables(normalizedCustomization.blocks.introTitle, recipient) : null,
            introText: normalizedCustomization.blocks.introText ? replaceVariables(normalizedCustomization.blocks.introText, recipient) : null,
            highlightTitle: normalizedCustomization.blocks.highlightTitle ? replaceVariables(normalizedCustomization.blocks.highlightTitle, recipient) : null,
            highlightText: normalizedCustomization.blocks.highlightText ? replaceVariables(normalizedCustomization.blocks.highlightText, recipient) : null,
            bullets: normalizedCustomization.blocks.bullets.map((b) => replaceVariables(b, recipient)),
            closingText: normalizedCustomization.blocks.closingText ? replaceVariables(normalizedCustomization.blocks.closingText, recipient) : null,
          },
        };

        const html = campaignHtml(personalizedSubject, personalizedMessage, buildUnsubscribeLink(recipient.email), personalizedCustomization);
        await sendEmail({
          to: recipient.email,
          subject: personalizedSubject,
          html,
          text: personalizedMessage,
        });
        sentCount += 1;
      } catch (error) {
        console.error('Error enviando campaña a', recipient.email, error);
        failures.push(recipient.email);
      }
    }

    const ormCampaign = req.app.get('orm') as MikroORM;
    const emCampaign = ormCampaign.em.fork();
    const campaign = new NewsletterCampaign();
    campaign.subject = cleanSubject;
    campaign.message = cleanMessage;
    campaign.audience = selectedAudience;
    campaign.totalRecipients = recipients.length;
    campaign.sent = sentCount;
    campaign.failed = failures.length;
    campaign.failedRecipients = failures;
    campaign.sentByUserId = req.user?.id || null;
    campaign.sentByEmail = typeof req.user?.email === 'string' ? req.user.email : null;
    campaign.isTest = false;
    campaign.createdAt = new Date();
    campaign.preheader = normalizedCustomization.preheader;
    campaign.templateStyle = normalizedCustomization.templateStyle;
    campaign.customization = normalizedCustomization;
    await emCampaign.persistAndFlush(campaign);

    return res.json({
      message: 'Campaña procesada',
      campaignId: campaign.id,
      audience: selectedAudience,
      totalRecipients: recipients.length,
      sent: sentCount,
      failed: failures.length,
      failedRecipients: failures,
      validation,
    });
  } catch (error: any) {
    console.error('Error en sendAdminCampaign:', error);
    return res.status(500).json({
      message: 'Error al enviar la campaña',
      error: error.message,
    });
  }
};

/**
 * Enviar email de prueba desde panel admin
 */
export const sendAdminTestEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { toEmail, subject, message, customization } = req.body as {
      toEmail?: string;
      subject?: string;
      message?: string;
      customization?: CampaignCustomizationInput;
    };

    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      return res.status(400).json({ message: 'El envio de emails no esta configurado en el servidor' });
    }

    const recipient = normalizeEmail(toEmail);
    if (!recipient) {
      return res.status(400).json({ message: 'Email de prueba invalido' });
    }

    const cleanSubject = (subject || '').trim();
    const cleanMessage = (message || '').trim();
    const normalizedCustomization = normalizeCustomization(customization);

    const validation = validateCampaignInput(cleanSubject, cleanMessage, normalizedCustomization);
    if (!validation.valid) {
      return res.status(400).json({
        message: 'El mail de prueba tiene errores de validación',
        details: validation,
      });
    }

    const recipientCtx: CampaignRecipient = { email: recipient, name: null };
    const personalizedSubject = replaceVariables(cleanSubject, recipientCtx);
    const personalizedMessage = replaceVariables(cleanMessage, recipientCtx);
    const personalizedCustomization: CampaignCustomization = {
      ...normalizedCustomization,
      preheader: normalizedCustomization.preheader ? replaceVariables(normalizedCustomization.preheader, recipientCtx) : null,
      ctaText: normalizedCustomization.ctaText ? replaceVariables(normalizedCustomization.ctaText, recipientCtx) : null,
      ctaUrl: normalizedCustomization.ctaUrl ? replaceVariables(normalizedCustomization.ctaUrl, recipientCtx) : null,
      senderName: replaceVariables(normalizedCustomization.senderName, recipientCtx),
      footerNote: normalizedCustomization.footerNote ? replaceVariables(normalizedCustomization.footerNote, recipientCtx) : null,
      blocks: {
        introTitle: normalizedCustomization.blocks.introTitle ? replaceVariables(normalizedCustomization.blocks.introTitle, recipientCtx) : null,
        introText: normalizedCustomization.blocks.introText ? replaceVariables(normalizedCustomization.blocks.introText, recipientCtx) : null,
        highlightTitle: normalizedCustomization.blocks.highlightTitle ? replaceVariables(normalizedCustomization.blocks.highlightTitle, recipientCtx) : null,
        highlightText: normalizedCustomization.blocks.highlightText ? replaceVariables(normalizedCustomization.blocks.highlightText, recipientCtx) : null,
        bullets: normalizedCustomization.blocks.bullets.map((b) => replaceVariables(b, recipientCtx)),
        closingText: normalizedCustomization.blocks.closingText ? replaceVariables(normalizedCustomization.blocks.closingText, recipientCtx) : null,
      },
    };

    const html = campaignHtml(personalizedSubject, personalizedMessage, buildUnsubscribeLink(recipient), personalizedCustomization);
    await sendEmail({
      to: recipient,
      subject: `[PRUEBA] ${personalizedSubject}`,
      html,
      text: personalizedMessage,
    });

    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    const campaign = new NewsletterCampaign();
    campaign.subject = cleanSubject;
    campaign.message = cleanMessage;
    campaign.audience = 'test';
    campaign.totalRecipients = 1;
    campaign.sent = 1;
    campaign.failed = 0;
    campaign.failedRecipients = [];
    campaign.sentByUserId = req.user?.id || null;
    campaign.sentByEmail = typeof req.user?.email === 'string' ? req.user.email : null;
    campaign.isTest = true;
    campaign.createdAt = new Date();
    campaign.preheader = normalizedCustomization.preheader;
    campaign.templateStyle = normalizedCustomization.templateStyle;
    campaign.customization = normalizedCustomization;
    await em.persistAndFlush(campaign);

    return res.json({ message: 'Email de prueba enviado', campaignId: campaign.id, validation });
  } catch (error: any) {
    console.error('Error en sendAdminTestEmail:', error);
    return res.status(500).json({
      message: 'Error al enviar el email de prueba',
      error: error.message,
    });
  }
};

/**
 * Generar preview renderizado de campaña newsletter
 */
export const previewAdminCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { subject, message, previewEmail, customization } = req.body as {
      subject?: string;
      message?: string;
      previewEmail?: string;
      customization?: CampaignCustomizationInput;
    };

    const cleanSubject = (subject || '').trim();
    const cleanMessage = (message || '').trim();
    const recipient = normalizeEmail(previewEmail) || normalizeEmail(req.user?.email) || 'preview@bookcode.local';
    const normalizedCustomization = normalizeCustomization(customization);

    const validation = validateCampaignInput(cleanSubject, cleanMessage, normalizedCustomization);

    const recipientCtx: CampaignRecipient = { email: recipient, name: 'Lector' };
    const personalizedSubject = replaceVariables(cleanSubject, recipientCtx);
    const personalizedMessage = replaceVariables(cleanMessage, recipientCtx);
    const personalizedCustomization: CampaignCustomization = {
      ...normalizedCustomization,
      preheader: normalizedCustomization.preheader ? replaceVariables(normalizedCustomization.preheader, recipientCtx) : null,
      ctaText: normalizedCustomization.ctaText ? replaceVariables(normalizedCustomization.ctaText, recipientCtx) : null,
      ctaUrl: normalizedCustomization.ctaUrl ? replaceVariables(normalizedCustomization.ctaUrl, recipientCtx) : null,
      senderName: replaceVariables(normalizedCustomization.senderName, recipientCtx),
      footerNote: normalizedCustomization.footerNote ? replaceVariables(normalizedCustomization.footerNote, recipientCtx) : null,
      blocks: {
        introTitle: normalizedCustomization.blocks.introTitle ? replaceVariables(normalizedCustomization.blocks.introTitle, recipientCtx) : null,
        introText: normalizedCustomization.blocks.introText ? replaceVariables(normalizedCustomization.blocks.introText, recipientCtx) : null,
        highlightTitle: normalizedCustomization.blocks.highlightTitle ? replaceVariables(normalizedCustomization.blocks.highlightTitle, recipientCtx) : null,
        highlightText: normalizedCustomization.blocks.highlightText ? replaceVariables(normalizedCustomization.blocks.highlightText, recipientCtx) : null,
        bullets: normalizedCustomization.blocks.bullets.map((b) => replaceVariables(b, recipientCtx)),
        closingText: normalizedCustomization.blocks.closingText ? replaceVariables(normalizedCustomization.blocks.closingText, recipientCtx) : null,
      },
    };

    const unsubscribeLink = buildUnsubscribeLink(recipient);
    const html = campaignHtml(personalizedSubject, personalizedMessage, unsubscribeLink, personalizedCustomization);

    return res.json({
      subject: personalizedSubject,
      message: personalizedMessage,
      previewEmail: recipient,
      unsubscribeLink,
      customization: personalizedCustomization,
      validationMessage: validation.valid ? null : 'El preview tiene errores de validación',
      validation,
      html,
      text: personalizedMessage,
    });
  } catch (error: any) {
    console.error('Error en previewAdminCampaign:', error);
    return res.status(500).json({
      message: 'Error al generar preview de campaña',
      error: error.message,
    });
  }
};

/**
 * Historial de campañas enviadas por administradores
 */
export const getCampaignHistory = async (req: Request, res: Response) => {
  try {
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
    const page = Math.max(1, Number(req.query.page) || 1);

    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();

    const [data, total] = await em.findAndCount(NewsletterCampaign, {}, {
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'DESC' },
    });

    const rows = data.map((campaign) => ({
      id: campaign.id,
      subject: campaign.subject,
      message: campaign.message,
      preheader: campaign.preheader || null,
      templateStyle: campaign.templateStyle || null,
      customization: campaign.customization,
      audience: campaign.audience,
      totalRecipients: campaign.totalRecipients,
      sent: campaign.sent,
      failed: campaign.failed,
      failedRecipients: campaign.failedRecipients,
      sentByUserId: campaign.sentByUserId || null,
      sentByEmail: campaign.sentByEmail || null,
      isTest: campaign.isTest,
      createdAt: serializeCreatedAt(campaign.createdAt),
    }));

    return res.json({
      data: rows,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasMore: page * limit < total,
    });
  } catch (error: any) {
    console.error('Error en getCampaignHistory:', error);
    return res.status(500).json({
      message: 'Error al obtener historial de campañas',
      error: error.message,
    });
  }
};

/**
 * Validar campaña sin enviar
 */
export const validateAdminCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { subject, message, customization } = req.body as {
      subject?: string;
      message?: string;
      customization?: CampaignCustomizationInput;
    };

    const cleanSubject = (subject || '').trim();
    const cleanMessage = (message || '').trim();
    const normalizedCustomization = normalizeCustomization(customization);
    const validation = validateCampaignInput(cleanSubject, cleanMessage, normalizedCustomization);

    return res.json({
      ...validation,
      customization: normalizedCustomization,
    });
  } catch (error: any) {
    console.error('Error en validateAdminCampaign:', error);
    return res.status(500).json({
      message: 'Error al validar campaña',
      error: error.message,
    });
  }
};

/**
 * Obtener detalle de campaña para duplicar/reusar
 */
export const getCampaignDetail = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ message: 'ID de campaña inválido' });
    }

    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    const campaign = await em.findOne(NewsletterCampaign, { id });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaña no encontrada' });
    }

    return res.json({
      id: campaign.id,
      subject: campaign.subject,
      message: campaign.message,
      preheader: campaign.preheader || null,
      templateStyle: campaign.templateStyle || null,
      customization: campaign.customization,
      audience: campaign.audience,
      totalRecipients: campaign.totalRecipients,
      sent: campaign.sent,
      failed: campaign.failed,
      failedRecipients: campaign.failedRecipients,
      sentByUserId: campaign.sentByUserId || null,
      sentByEmail: campaign.sentByEmail || null,
      isTest: campaign.isTest,
      createdAt: serializeCreatedAt(campaign.createdAt),
    });
  } catch (error: any) {
    console.error('Error en getCampaignDetail:', error);
    return res.status(500).json({
      message: 'Error al obtener detalle de campaña',
      error: error.message,
    });
  }
};

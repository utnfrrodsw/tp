import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, Send, Users, UserCheck, Sparkles, Eye, History, Copy, Check, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { isAdmin } from '../utils/jwtUtils';
import { getAccessToken } from '../utils/tokenUtil';
import {
  adminNewsletterService,
  NewsletterAudience,
  RecipientsSummary,
  AdminSendCampaignResponse,
  AdminCampaignPreviewResponse,
  NewsletterCustomization,
  CampaignValidationResult,
  CampaignDetailResponse,
} from '../services/adminNewsletterService';

const cardClass = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900';
const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-cyan-800';

type AudienceOption = NewsletterAudience | 'test';
type PresetKey = 'none' | 'novedades' | 'promo' | 'comunidad';

interface NewsletterEditorLocationState {
  reuseCampaign?: CampaignDetailResponse;
}

const audienceLabels: Record<AudienceOption, string> = {
  registered: 'Usuarios registrados',
  subscribers: 'Suscriptos activos',
  all: 'Todos (deduplicado)',
  test: 'Mail de prueba',
};

const presetDefinitions: Record<Exclude<PresetKey, 'none'>, { subject: string; preheader: string; message: string; customization: NewsletterCustomization; bulletsText: string }> = {
  novedades: {
    subject: 'Novedades semanales de BookCode',
    preheader: 'Descubre los lanzamientos y recomendaciones destacadas',
    message: 'Hola {{nombre}},\n\nTenemos novedades para ti esta semana en BookCode.',
    customization: {
      templateStyle: 'ocean',
      senderName: 'Equipo Editorial BookCode',
      ctaText: 'Ver novedades',
      ctaUrl: '{{frontend_url}}/libros/nuevos',
      footerNote: 'Recibes este correo por estar registrado en BookCode.',
      blocks: {
        introTitle: 'Resumen de la semana',
        introText: 'Seleccionamos los títulos con mejor recepción y más actividad.',
        highlightTitle: 'Recomendación destacada',
        highlightText: 'Explora lecturas alineadas a tus intereses recientes.',
        bullets: ['Top 5 libros más leídos', 'Autores tendencia', 'Nuevas reseñas de la comunidad'],
        closingText: 'Nos vemos dentro de BookCode.',
      },
    },
    bulletsText: 'Top 5 libros más leídos\nAutores tendencia\nNuevas reseñas de la comunidad',
  },
  promo: {
    subject: 'Promo especial para la comunidad BookCode',
    preheader: 'No te pierdas esta oportunidad por tiempo limitado',
    message: 'Hola {{nombre}},\n\nTenemos una promoción especial para vos.',
    customization: {
      templateStyle: 'clean',
      senderName: 'BookCode Promociones',
      ctaText: 'Aprovechar ahora',
      ctaUrl: '{{frontend_url}}',
      footerNote: 'Promo sujeta a disponibilidad.',
      blocks: {
        introTitle: 'Oferta de la semana',
        introText: 'Seleccionamos beneficios para lectores activos de la plataforma.',
        highlightTitle: 'Beneficio principal',
        highlightText: 'Activa tu cuenta y mira los libros destacados con beneficios.',
        bullets: ['Duración limitada', 'Acceso inmediato', 'Aplicable a miembros activos'],
        closingText: 'Gracias por ser parte de la comunidad.',
      },
    },
    bulletsText: 'Duración limitada\nAcceso inmediato\nAplicable a miembros activos',
  },
  comunidad: {
    subject: 'La comunidad de BookCode está creciendo',
    preheader: 'Nuevas reseñas, seguidores y actividades para descubrir',
    message: 'Hola {{nombre}},\n\nTe compartimos actividad destacada de la comunidad.',
    customization: {
      templateStyle: 'clean',
      senderName: 'Comunidad BookCode',
      ctaText: 'Ir al feed',
      ctaUrl: '{{frontend_url}}/feed',
      footerNote: 'Puedes configurar tus preferencias de comunicación desde tu perfil.',
      blocks: {
        introTitle: 'Movimiento reciente',
        introText: 'Tu red literaria tuvo muchas novedades durante estos días.',
        highlightTitle: 'Actividad recomendada',
        highlightText: 'Mira nuevas reseñas y conecta con lectores similares a vos.',
        bullets: ['Reseñas populares', 'Nuevos seguidores', 'Autores en tendencia'],
        closingText: 'Seguimos leyendo juntos.',
      },
    },
    bulletsText: 'Reseñas populares\nNuevos seguidores\nAutores en tendencia',
  },
};

const emptyCustomization: NewsletterCustomization = {
  templateStyle: 'clean',
  preheader: '',
  ctaText: '',
  ctaUrl: '',
  senderName: 'Equipo BookCode',
  footerNote: '',
  blocks: {
    introTitle: '',
    introText: '',
    highlightTitle: '',
    highlightText: '',
    bullets: [],
    closingText: '',
  },
};

const AdminNewsletterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillAppliedRef = useRef(false);

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summary, setSummary] = useState<RecipientsSummary | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<AudienceOption>('all');
  const [sending, setSending] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AdminSendCampaignResponse | null>(null);
  const [preview, setPreview] = useState<AdminCampaignPreviewResponse | null>(null);
  const [copiedUnsub, setCopiedUnsub] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('none');
  const [validation, setValidation] = useState<CampaignValidationResult | null>(null);
  const [customization, setCustomization] = useState<NewsletterCustomization>(emptyCustomization);
  const [bulletsText, setBulletsText] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getNormalizedCustomization = (): NewsletterCustomization => {
    const bullets = bulletsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    return {
      ...customization,
      preheader: (customization.preheader || '').trim(),
      ctaText: (customization.ctaText || '').trim(),
      ctaUrl: (customization.ctaUrl || '').trim(),
      senderName: (customization.senderName || '').trim(),
      footerNote: (customization.footerNote || '').trim(),
      blocks: {
        introTitle: (customization.blocks?.introTitle || '').trim(),
        introText: (customization.blocks?.introText || '').trim(),
        highlightTitle: (customization.blocks?.highlightTitle || '').trim(),
        highlightText: (customization.blocks?.highlightText || '').trim(),
        bullets,
        closingText: (customization.blocks?.closingText || '').trim(),
      },
    };
  };

  const loadSummary = async () => {
    try {
      setLoadingSummary(true);
      setError(null);
      const response = await adminNewsletterService.getRecipientsSummary();
      setSummary(response);
    } catch (err: any) {
      setError(err.message || 'No se pudo cargar el resumen de destinatarios');
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate('/LoginPage');
      return;
    }

    if (!isAdmin()) {
      navigate('/');
      return;
    }

    void loadSummary();
  }, [navigate]);

  useEffect(() => {
    const state = (location.state || {}) as NewsletterEditorLocationState;
    if (prefillAppliedRef.current) return;

    const campaign = state.reuseCampaign;
    if (!campaign) return;

    prefillAppliedRef.current = true;

    setSubject(campaign.subject || '');
    setMessage(campaign.message || '');
    setCustomization((prev) => ({
      ...prev,
      ...campaign.customization,
      templateStyle: (campaign.templateStyle as any) || campaign.customization?.templateStyle || prev.templateStyle,
      preheader: campaign.preheader || campaign.customization?.preheader || '',
      blocks: {
        ...prev.blocks,
        ...(campaign.customization?.blocks || {}),
      },
    }));
    setBulletsText((campaign.customization?.blocks?.bullets || []).join('\n'));
    setSelectedPreset('none');
  }, [location.state]);

  const getEstimatedRecipients = () => {
    if (!summary) return 0;
    if (audience === 'test') return testEmail.trim() ? 1 : 0;
    if (audience === 'registered') return summary.registered;
    if (audience === 'subscribers') return summary.subscribers;
    return summary.totalUnique;
  };

  const compactLink = (url: string) => {
    if (url.length <= 110) return url;
    return `${url.slice(0, 72)}...${url.slice(-24)}`;
  };

  const handleCopyUnsubscribeLink = async () => {
    if (!preview?.unsubscribeLink) return;
    try {
      await navigator.clipboard.writeText(preview.unsubscribeLink);
      setCopiedUnsub(true);
      window.setTimeout(() => setCopiedUnsub(false), 1500);
    } catch {
      setError('No se pudo copiar el link de desuscripción.');
    }
  };

  const handlePresetChange = (presetKey: PresetKey) => {
    setSelectedPreset(presetKey);
    if (presetKey === 'none') return;
    const preset = presetDefinitions[presetKey];

    setSubject(preset.subject);
    setMessage(preset.message);
    setCustomization({ ...preset.customization });
    setBulletsText(preset.bulletsText);
    setValidation(null);
  };

  const handleValidate = async () => {
    setError(null);

    try {
      const response = await adminNewsletterService.validateCampaign({
        subject: subject.trim(),
        message: message.trim(),
        customization: getNormalizedCustomization(),
      });
      setValidation(response);
    } catch (err: any) {
      setError(err.message || 'No se pudo validar la campaña');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (audience === 'test' && !testEmail.trim()) {
      setError('Ingresa un mail de prueba para esa opción.');
      return;
    }

    try {
      setSending(true);
      const normalizedCustomization = getNormalizedCustomization();

      if (audience === 'test') {
        await adminNewsletterService.sendTestEmail({
          toEmail: testEmail.trim(),
          subject: subject.trim(),
          message: message.trim(),
          customization: normalizedCustomization,
        });

        setResult({
          message: 'Mail de prueba enviado',
          audience: 'all',
          totalRecipients: 1,
          sent: 1,
          failed: 0,
          failedRecipients: [],
        });
      } else {
        const response = await adminNewsletterService.sendCampaign({
          subject: subject.trim(),
          message: message.trim(),
          audience,
          customization: normalizedCustomization,
        });
        setResult(response);
      }
    } catch (err: any) {
      setError(err.message || 'No se pudo enviar la campaña');
    } finally {
      setSending(false);
    }
  };

  const handlePreview = async () => {
    setError(null);

    try {
      setLoadingPreview(true);
      const response = await adminNewsletterService.previewCampaign({
        subject: subject.trim(),
        message: message.trim(),
        previewEmail: testEmail.trim() || undefined,
        customization: getNormalizedCustomization(),
      });
      setValidation(response.validation || null);
      setPreview(response);
    } catch (err: any) {
      setError(err.message || 'No se pudo generar el preview');
    } finally {
      setLoadingPreview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="rounded-3xl border border-cyan-200 bg-white/90 p-6 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
              <Mail className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Newsletter Admin</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Editor completo pero simple, con estilo visual coherente con BookCode.
              </p>
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
            {error}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <div className={cardClass}>
            <div className="mb-2 flex items-center gap-2 text-cyan-700 dark:text-cyan-300"><Users className="h-4 w-4" /><span className="text-sm font-medium">Registrados</span></div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{loadingSummary ? '...' : summary?.registered ?? 0}</p>
          </div>
          <div className={cardClass}>
            <div className="mb-2 flex items-center gap-2 text-sky-700 dark:text-sky-300"><UserCheck className="h-4 w-4" /><span className="text-sm font-medium">Suscriptos activos</span></div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{loadingSummary ? '...' : summary?.subscribers ?? 0}</p>
          </div>
          <div className={cardClass}>
            <div className="mb-2 flex items-center gap-2 text-slate-700 dark:text-slate-200"><Sparkles className="h-4 w-4" /><span className="text-sm font-medium">Total único</span></div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{loadingSummary ? '...' : summary?.totalUnique ?? 0}</p>
          </div>
        </section>

        <section className={cardClass}>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Plantilla</label>
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value as PresetKey)}
                className={inputClass}
                disabled={sending || loadingPreview}
              >
                <option value="none">Escribir desde cero</option>
                <option value="novedades">BookCode - Novedades</option>
                <option value="promo">BookCode - Promoción</option>
                <option value="comunidad">BookCode - Comunidad</option>
              </select>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Al elegir una plantilla, se aplican automáticamente asunto, texto y estilo.</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Público objetivo</label>
              <select value={audience} onChange={(e) => setAudience(e.target.value as AudienceOption)} className={inputClass} disabled={sending}>
                <option value="all">Todos (registrados + suscriptos)</option>
                <option value="registered">Solo registrados</option>
                <option value="subscribers">Solo suscriptos activos</option>
                <option value="test">Mail de prueba</option>
              </select>

              {audience === 'test' && (
                <div className="mt-3">
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Mail de prueba</label>
                  <input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className={inputClass} placeholder="mail@ejemplo.com" disabled={sending || loadingPreview} />
                </div>
              )}

              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Alcance estimado: {getEstimatedRecipients()} destinatarios ({audienceLabels[audience]}).</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Asunto</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120} className={inputClass} placeholder="Ej: Novedades de abril en BookCode" disabled={sending} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Preheader</label>
              <input value={customization.preheader || ''} onChange={(e) => setCustomization((prev) => ({ ...prev, preheader: e.target.value }))} className={inputClass} placeholder="Texto breve que aparece junto al asunto en el inbox" disabled={sending || loadingPreview} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Mensaje principal</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className={inputClass} placeholder="Usa variables como {{nombre}}, {{email}}, {{frontend_url}}, {{anio}}" disabled={sending} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">Personalización básica</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Estilo visual</label>
                  <select value={customization.templateStyle} onChange={(e) => setCustomization((prev) => ({ ...prev, templateStyle: e.target.value as NewsletterCustomization['templateStyle'] }))} className={inputClass} disabled={sending || loadingPreview}>
                    <option value="clean">BookCode Clásico</option>
                    <option value="ocean">BookCode Cian</option>
                    <option value="forest">BookCode Noche</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Remitente visible</label>
                  <input value={customization.senderName || ''} onChange={(e) => setCustomization((prev) => ({ ...prev, senderName: e.target.value }))} className={inputClass} placeholder="Equipo BookCode" disabled={sending || loadingPreview} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Texto del botón</label>
                  <input value={customization.ctaText || ''} onChange={(e) => setCustomization((prev) => ({ ...prev, ctaText: e.target.value }))} className={inputClass} placeholder="Ver más" disabled={sending || loadingPreview} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">URL del botón</label>
                  <input value={customization.ctaUrl || ''} onChange={(e) => setCustomization((prev) => ({ ...prev, ctaUrl: e.target.value }))} className={inputClass} placeholder="{{frontend_url}}" disabled={sending || loadingPreview} />
                </div>
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Nota de pie (opcional)</label>
                <textarea value={customization.footerNote || ''} onChange={(e) => setCustomization((prev) => ({ ...prev, footerNote: e.target.value }))} rows={2} className={inputClass} placeholder="Mensaje corto al final del correo" disabled={sending || loadingPreview} />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <button
                type="button"
                onClick={() => setShowAdvanced((prev) => !prev)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showAdvanced ? 'Ocultar opciones avanzadas' : 'Mostrar opciones avanzadas'}
              </button>

              {!showAdvanced ? (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Incluye bloques extra, destacados y lista de bullets para campañas más completas.</p>
              ) : (
                <>
                  <h3 className="mb-3 mt-4 text-sm font-semibold text-slate-800 dark:text-slate-100">Bloques de contenido</h3>

                  <div className="grid gap-3 md:grid-cols-2">
                    <input value={customization.blocks?.introTitle || ''} onChange={(e) => setCustomization((prev) => ({ ...prev, blocks: { ...prev.blocks, introTitle: e.target.value } }))} className={inputClass} placeholder="Título de introducción" disabled={sending || loadingPreview} />
                    <input value={customization.blocks?.highlightTitle || ''} onChange={(e) => setCustomization((prev) => ({ ...prev, blocks: { ...prev.blocks, highlightTitle: e.target.value } }))} className={inputClass} placeholder="Título destacado" disabled={sending || loadingPreview} />
                    <textarea value={customization.blocks?.introText || ''} onChange={(e) => setCustomization((prev) => ({ ...prev, blocks: { ...prev.blocks, introText: e.target.value } }))} rows={3} className={inputClass} placeholder="Texto de introducción" disabled={sending || loadingPreview} />
                    <textarea value={customization.blocks?.highlightText || ''} onChange={(e) => setCustomization((prev) => ({ ...prev, blocks: { ...prev.blocks, highlightText: e.target.value } }))} rows={3} className={inputClass} placeholder="Texto destacado" disabled={sending || loadingPreview} />
                  </div>

                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Bullets (uno por línea)</label>
                    <textarea value={bulletsText} onChange={(e) => setBulletsText(e.target.value)} rows={4} className={inputClass} placeholder={'Punto 1\nPunto 2\nPunto 3'} disabled={sending || loadingPreview} />
                  </div>

                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Cierre</label>
                    <textarea value={customization.blocks?.closingText || ''} onChange={(e) => setCustomization((prev) => ({ ...prev, blocks: { ...prev.blocks, closingText: e.target.value } }))} rows={2} className={inputClass} placeholder="Mensaje de cierre" disabled={sending || loadingPreview} />
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={handleValidate} disabled={sending || loadingPreview} className="inline-flex items-center gap-2 rounded-xl border border-cyan-300 bg-cyan-50 px-5 py-3 text-sm font-semibold text-cyan-700 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 dark:hover:bg-cyan-900/40">
                <ShieldCheck className="h-4 w-4" />
                Revisión automática
              </button>

              <button type="button" onClick={handlePreview} disabled={sending || loadingPreview} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-800/70">
                <Eye className="h-4 w-4" />
                {loadingPreview ? 'Generando preview...' : 'Generar preview'}
              </button>

              <button type="submit" disabled={sending || loadingSummary || getEstimatedRecipients() === 0} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:from-cyan-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                <Send className="h-4 w-4" />
                {sending ? 'Enviando...' : audience === 'test' ? 'Enviar mail de prueba' : 'Enviar campaña'}
              </button>

              <button type="button" onClick={loadSummary} disabled={sending} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">Actualizar resumen</button>

              <button type="button" onClick={() => navigate('/admin/newsletter/historial')} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
                <History className="h-4 w-4" />
                Ver historial
              </button>
            </div>

            <div className="rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 text-xs text-slate-700 dark:border-cyan-800 dark:bg-cyan-950/20 dark:text-slate-200">
              <p className="font-semibold text-cyan-800 dark:text-cyan-300">¿Qué hace “Revisión automática”?</p>
              <p className="mt-1">Chequea errores y advertencias (asunto, CTA, variables, etc.) sin enviar emails. Es una validación previa para evitar fallos antes del envío real.</p>
            </div>
          </form>
        </section>

        {validation && (
          <section className={cardClass}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Revisión de campaña</h2>
            <p className={`mt-2 text-sm font-medium ${validation.valid ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
              {validation.valid ? 'Todo listo para enviar' : 'Hay errores que debes corregir'}
            </p>
            {validation.errors.length > 0 && <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">Errores: {validation.errors.join(' | ')}</p>}
            {validation.warnings.length > 0 && <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">Advertencias: {validation.warnings.join(' | ')}</p>}
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Variables permitidas: {validation.allowedVariables.join(', ')}</p>
          </section>
        )}

        {result && (
          <section className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <h2 className="text-lg font-semibold">Resultado del envío</h2>
            <p className="mt-2 text-sm">Total destinatarios: {result.totalRecipients}</p>
            <p className="text-sm">Enviados: {result.sent}</p>
            <p className="text-sm">Fallidos: {result.failed}</p>
          </section>
        )}

        {preview && (
          <section className={cardClass}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Preview renderizado</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Email de preview: {preview.previewEmail}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Desuscripción:</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <a href={preview.unsubscribeLink} target="_blank" rel="noreferrer" title={preview.unsubscribeLink} className="min-w-0 flex-1 truncate rounded-md bg-slate-100 px-2 py-1 text-xs text-cyan-700 hover:text-cyan-800 dark:bg-slate-800 dark:text-cyan-300 dark:hover:text-cyan-200">
                {compactLink(preview.unsubscribeLink)}
              </a>
              <button type="button" onClick={handleCopyUnsubscribeLink} className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
                {copiedUnsub ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedUnsub ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
              <iframe title="Preview newsletter" srcDoc={preview.html} className="h-[420px] w-full bg-white" />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminNewsletterPage;

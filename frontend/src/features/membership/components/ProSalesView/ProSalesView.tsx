// Cara "de venta" de la página /pro: la que ve un visitante o un usuario Free.
// Muestra el pitch de la membresía (hero, planes, beneficios, comparativa y FAQ).
//
// El botón de contratación cambia según haya sesión o no: a un visitante lo
// invita a crear su cuenta, y a un usuario Free ya no le ofrece registrarse
// —que no tendría sentido— sino pasar al plan pago.
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../../../../core/context/AuthModalContext';
import { FadeInSection } from '../../../../core/components/FadeInSection';
import { useFetch } from '../../../../core/hooks/useFetch';
import { membershipService } from '../../services/membershipService';
import { PRO_PLAN_NAME } from '../../models/Membership';
import { ProBenefits } from '../ProBenefits';
import { ProComparison } from '../ProComparison';
import { ProFaq } from '../ProFaq';
import { CtaBackdrop } from '../../../home/components/CtaBackdrop';
import {
  Crown,
  BarChart3,
  Palette,
  Shield,
  Star,
  Ban,
  ListMusic,
  Sparkles,
  HeadphonesIcon,
} from 'lucide-react';
// El CTA final usa el bloque cta-section, que es de CallToAction: se importa su
// hoja para no depender de que la página de inicio ya se haya cargado.
import '../../../home/components/CallToAction/CallToAction.scss';
import './ProSalesView.scss';

type ProSalesViewProps = {
  /** true si el usuario ya inició sesión (y todavía está en el plan Free). */
  isAuthenticated: boolean;
};

export const ProSalesView = ({ isAuthenticated }: ProSalesViewProps) => {
  const { openSignup } = useAuthModal();
  const navigate = useNavigate();

  // Los precios salen de la API y no del código: son un dato de negocio que un
  // ADMIN puede cambiar desde el panel, y tenerlos escritos acá haría que la
  // página mostrara uno y el checkout cobrara otro.
  const { data: plans, isLoading } = useFetch(() => membershipService.listPlans());

  const freePlan = plans?.find((plan) => !plan.isPaid) ?? null;
  const proPlan = plans?.find((plan) => plan.name === PRO_PLAN_NAME) ?? null;

  // Un visitante primero necesita una cuenta; el que ya entró la tiene, y lo que
  // le falta es pagar. Esta página NO cobra: lleva al resumen de la contratación
  // (/pro/checkout), que es donde el usuario ve qué está por comprar antes de
  // que lo saquemos del sitio hacia MercadoPago.
  const handleUpgradeClick = () => {
    if (!isAuthenticated) {
      openSignup();
      return;
    }
    navigate('/pro/checkout');
  };

  // El botón queda inhabilitado mientras no se sepa cuánto sale el plan: sin el
  // plan cargado no hay nada que contratar.
  const isUpgradeDisabled = isAuthenticated && (isLoading || !proPlan);

  const upgradeLabel = isAuthenticated ? 'Pasarme a Pro' : 'Obtener Pro';

  return (
    <>
      {/* ── Hero: imagen de fondo con título y CTAs ──── */}
      <FadeInSection delay={100}>
        <section className="pro-hero">
          {/* Álbumes flotantes como fondo visual (las mismas imágenes fijas del Hero de la home) */}
          <div className="pro-hero__bg">
            <img src="/images/abbey-road.jpg" alt="" className="pro-hero__bg-album pro-hero__bg-album--1" />
            <img src="/images/audioslave.jpeg" alt="" className="pro-hero__bg-album pro-hero__bg-album--2" />
            <img src="/images/wish-you-where-here.jpeg" alt="" className="pro-hero__bg-album pro-hero__bg-album--3" />
            <img src="/images/oktubre.jpg" alt="" className="pro-hero__bg-album pro-hero__bg-album--4" />
            <img src="/images/frank-sinatra.webp" alt="" className="pro-hero__bg-album pro-hero__bg-album--5" />
            <img src="/images/ahi-vamos.jpg" alt="" className="pro-hero__bg-album pro-hero__bg-album--6" />
          </div>
          <div className="pro-hero__overlay" />
          <div className="pro-hero__content">
            <h1 className="pro-hero__title">
              Potenciá tu experiencia<br />en Musicboxd con <span className="pro-hero__title-accent">Pro</span>
            </h1>
            <p className="pro-hero__subtitle">
              {proPlan ? `${proPlan.priceLabel}, un solo pago.` : 'Un solo pago.'} Sin
              renovaciones ni vencimiento.
            </p>
            <div className="pro-hero__actions">
              <a href="#pricing" className="pro-hero__cta pro-hero__cta--primary">
                <Crown size={18} />
                {upgradeLabel}
              </a>
              <a href="#features" className="pro-hero__cta pro-hero__cta--secondary">
                Ver beneficios
              </a>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── Pricing Cards: Free vs Pro ────────────── */}
      <FadeInSection delay={200}>
        <section id="pricing" className="pro-pricing">
          <div className="pro-pricing__cards">

            {/* Card Free */}
            <div className="pro-pricing__card">
              <h3 className="pro-pricing__card-name">
                <HeadphonesIcon size={22} />
                Musicboxd Free
              </h3>
              <div className="pro-pricing__card-price">
                <span className="pro-pricing__card-amount">
                  {freePlan ? freePlan.priceLabel : '—'}
                </span>
                <span className="pro-pricing__card-period"> para siempre</span>
              </div>
              <p className="pro-pricing__card-tagline">Todo lo esencial, y...</p>
              <ul className="pro-pricing__card-list">
                <li><Ban size={18} /> Con anuncios</li>
                <li><Star size={18} /> Reseñas y calificaciones</li>
                <li><Shield size={18} /> Perfil público</li>
                <li><ListMusic size={18} /> Ver y dar "me gusta" a listas</li>
              </ul>
              <button
                type="button"
                className="pro-pricing__card-btn pro-pricing__card-btn--outline"
                disabled
              >
                {isAuthenticated ? 'Tu plan actual' : 'Plan gratuito'}
              </button>
            </div>

            {/* Card Pro — destacada */}
            <div className="pro-pricing__card pro-pricing__card--pro">
              <div className="pro-pricing__card-stickers">
                <span className="pro-pricing__sticker pro-pricing__sticker--1">🎵</span>
                <span className="pro-pricing__sticker pro-pricing__sticker--2">🔥</span>
                <span className="pro-pricing__sticker pro-pricing__sticker--3">⭐</span>
                <span className="pro-pricing__sticker pro-pricing__sticker--4">🎧</span>
                <span className="pro-pricing__sticker pro-pricing__sticker--5">💎</span>
              </div>
              <h3 className="pro-pricing__card-name">
                <Crown size={22} />
                Musicboxd Pro
              </h3>
              <div className="pro-pricing__card-price">
                <span className="pro-pricing__card-amount">
                  {proPlan ? proPlan.priceLabel : '—'}
                </span>
                <span className="pro-pricing__card-period"> pago único</span>
              </div>
              <p className="pro-pricing__card-tagline">Todo lo de Free, y...</p>
              <ul className="pro-pricing__card-list">
                <li><Palette size={18} /> Personalización del perfil</li>
                <li><BarChart3 size={18} /> Estadísticas avanzadas</li>
                <li><Shield size={18} /> Badge Pro verificado</li>
                <li><ListMusic size={18} /> Armá tus propias listas</li>
                <li><Sparkles size={18} /> Aportá al catálogo</li>
              </ul>
              <button
                type="button"
                className="pro-pricing__card-btn pro-pricing__card-btn--primary"
                onClick={handleUpgradeClick}
                disabled={isUpgradeDisabled}
              >
                <Crown size={16} />
                {upgradeLabel}
              </button>

              <p className="pro-pricing__card-note">
                Es un pago único: se paga una sola vez y el acceso Pro no vence. No hay
                renovaciones ni cobros más adelante.
              </p>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── Beneficios que incluye Pro ───────────── */}
      <FadeInSection delay={200}>
        <ProBenefits heading="¿Qué incluye Pro?" />
      </FadeInSection>

      {/* ── Comparativa Free vs Pro ──────────────── */}
      <FadeInSection delay={200}>
        <ProComparison proPrice={proPlan ? proPlan.priceLabel : '—'} />
      </FadeInSection>

      {/* ── FAQ ──────────────────────────────────── */}
      <FadeInSection delay={200}>
        <ProFaq />
      </FadeInSection>

      {/* ── Final CTA ────────────────────────────── */}
      {/* Reutiliza la caja y el fondo animado del CTA de la página de inicio
          (bloque cta-section y CtaBackdrop), para que los dos se vean iguales. */}
      <FadeInSection delay={200}>
        <section className="cta-section">
          <div className="cta-section__container">
            <CtaBackdrop />

            <div className="cta-section__content">
              <h2 className="cta-section__title">
                ¿Listo para llevar tu música al siguiente nivel?
              </h2>
              <p className="cta-section__subtitle">
                Sumate a los que ya disfrutan Musicboxd Pro.
              </p>
              <div className="cta-section__actions">
                <button
                  type="button"
                  className="cta-section__btn cta-section__btn--primary pro-cta__btn"
                  onClick={handleUpgradeClick}
                >
                  <Crown size={18} />
                  {isAuthenticated ? 'Pasarme a Pro' : 'Comenzar con Pro'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
    </>
  );
};

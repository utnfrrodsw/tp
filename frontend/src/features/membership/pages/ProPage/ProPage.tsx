// Página /pro de Musicboxd. Tiene dos caras y elige una según quién esté mirando:
//
//   - visitante o usuario Free -> ProSalesView: el pitch de la membresía.
//   - usuario Pro (o Admin)    -> ProMemberView: el área de socio, con el estado
//                                 de su membresía y accesos a lo que le habilita.
//
// A quien ya pagó no tiene sentido volver a venderle el plan, igual que no tiene
// sentido ofrecerle registrarse a quien ya inició sesión.
import { useEffect } from 'react';
import { useAuth } from '../../../../core/context/AuthContext';
import { membershipService } from '../../services/membershipService';
import { Navbar } from '../../../../core/components/Navbar';
import { Footer } from '../../../../core/components/Footer';
import { Loader } from '../../../../core/components/Loader';
import { FadeInSection } from '../../../../core/components/FadeInSection';
import { ProMemberView } from '../../components/ProMemberView';
import { ProSalesView } from '../../components/ProSalesView';
import './ProPage.scss';

export const ProPage = () => {
  const { state: authState, refreshSession } = useAuth();

  const isAuthenticated = authState.status === 'authenticated';
  const user = isAuthenticated ? authState.user : null;
  const needsPaymentCheck = user !== null && !user.isPro;

  // Respaldo de la confirmación del pago: si un usuario logueado que no es Pro
  // abre /pro, se le pregunta al backend si tiene un pago aprobado sin
  // registrar. Pasa cuando pagó pero no volvió al sitio desde MercadoPago (y en
  // local el webhook no llega). Si aparece, la membresía se activa y se pide un
  // token nuevo: la página pasa sola a la vista de socio.
  //
  // Los errores se ignoran a propósito: es una verificación silenciosa y, si
  // falla, la página de venta se ve igual que siempre.
  useEffect(() => {
    if (!needsPaymentCheck) return;

    membershipService
      .syncMyPayment()
      .then((activated) => (activated ? refreshSession() : false))
      .catch(() => false);
    // refreshSession cambia en cada render del contexto: incluirlo repetiría la
    // consulta sin necesidad. Alcanza con volver a mirar cuando cambia el usuario.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsPaymentCheck, user?.id]);

  return (
    <>
      <Navbar />
      <main className={`pro-page ${user?.isPro ? 'pro-page--member' : ''}`}>
        {/* Mientras se valida el token guardado no se sabe todavía qué cara
            corresponde: mostrar la de venta y cambiarla un instante después
            haría parpadear la pantalla a un socio Pro. */}
        {authState.status === 'checking' ? (
          <Loader message="Cargando tu membresía..." />
        ) : user?.isPro ? (
          <ProMemberView user={user} />
        ) : (
          <ProSalesView isAuthenticated={isAuthenticated} />
        )}
      </main>
      <FadeInSection delay={300}>
        <Footer />
      </FadeInSection>
    </>
  );
};

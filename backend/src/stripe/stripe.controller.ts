import Stripe from 'stripe';
import { Request, Response } from 'express';
import { getOauth } from '../usuario/usuario.controler.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});
interface AuthRequest extends Request {
  user?: {
    id: string;
    rol: string;
    email: string;
  };
}

// If you have a custom authRequest type, import it here instead of Request
async function createAccount(req: AuthRequest, res: Response) {
  const id = req.user?.id;
  if (!id) {
    return res.status(400).json({ error: 'Usuario no autenticado' });
  }
  const usuario = await getOauth(Number(id));
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: usuario.mail,
      business_type: 'individual',
      business_profile: {
        name: usuario.nombreFantasia, // opcional
        url: 'https://reformix.site/',
        mcc: '5734',
      },
      individual: {
        first_name: usuario.nombre,
        last_name: usuario.apellido,
        email: usuario.mail,
        phone: `+11${usuario.telefono}`,
        dob: {
          day: 15,
          month: 5,
          year: 1990,
        },
        address: {
          line1: '123 Main St',
          line2: 'Apt 4B',
          city: 'San Francisco',
          state: 'CA',
          postal_code: '94103',
          country: 'US',
        },
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      // 🔥 CONFIGURACIÓN PARA PAYOUTS AUTOMÁTICOS DIARIOS
      settings: {
        payouts: {
          schedule: {
            interval: 'daily', // Payouts automáticos cada día
            delay_days: 2, // Demora mínima (estándar para US)
          },
        },
      },
    });

    // 2️⃣ Generar enlace de onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}dashboard/refresh`,
      return_url: `${process.env.FRONTEND_URL}dashboard/success`,
      type: 'account_onboarding',
    });

    console.log(`Account ID: ${account.id}`);
    console.log(`Enlace de onboarding: ${accountLink.url}`);
    console.log(`Payouts configurados como: DAILY (automático)`);

    res.json({
      url: accountLink.url,
      accountId: account.id,
      payoutSchedule: 'daily',
    });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: String(err) });
    }
  }
}

async function createSplitPayment(req: Request, res: Response) {
  try {
    const { amount, sellerStripeId, turno, userID, userMail } = req.body;

    console.log('Datos recibidos para split payment:', {
      amount,
      sellerStripeId,
      turno,
      userID,
      userMail,
    });

    // Validar datos requeridos
    if (!amount || !sellerStripeId || !turno || !userID || !userMail) {
      return res.status(400).json({
        error: 'Faltan datos requeridos',
        received: { amount, sellerStripeId, turno, userID, userMail },
      });
    }

    const platformFeePercentage = 0.05; // 5%
    const applicationFeeAmount = Math.floor(amount * platformFeePercentage);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Turno ${turno}` },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: { destination: sellerStripeId },
        metadata: {
          turnoId: turno.toString(),
          userID: userID.toString(),
          userMail: userMail,
        },
      },
      success_url: `${process.env.FRONTEND_URL}historial/success`,
      cancel_url: `${process.env.FRONTEND_URL}historial/canceled`,
    });

    console.log('Sesión de pago creada exitosamente:', session.id);
    res.json({ url: session.url });
  } catch (err) {
    console.error('Error en createSplitPayment:', err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: String(err) });
    }
  }
}

export { createAccount, createSplitPayment };

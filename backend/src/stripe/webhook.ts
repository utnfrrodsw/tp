import { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { putOauth } from '../usuario/usuario.controler.js';
import { updatePagoSplit } from '../pago/pago.controller.js';
import { sendEmail } from '../mail/mail.js';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-08-27.basil',
});

// Webhook para Stripe
async function stripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  console.log('📩 Webhook recibido (Principal):', {
    hasBody: !!req.body,
    hasSignature: !!sig,
    bodyLength: req.body?.length || 0,
  });

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_DEV_STRIPE as string
    );
    console.log(
      '🎯 Evento verificado (Principal):',
      event.type,
      'ID:',
      event.id
    );
  } catch (err: any) {
    console.log('Webhook Error:', err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // Detectar cuando la cuenta de un vendedor queda activa o cambia de estado
  if (event.type === 'account.updated') {
    const account = event.data.object as Stripe.Account;

    const email = account.email;
    const estado = account.charges_enabled ? 'active' : 'pending';
    const stripeAccountId = account.id;
    const chargesEnabled = account.charges_enabled;
    const payoutsEnabled = account.payouts_enabled;
    const createdAt = account.created
      ? new Date(account.created * 1000)
      : undefined;
    const updatedAt = new Date();

    if (email) {
      await putOauth(
        email,
        estado,
        stripeAccountId,
        chargesEnabled,
        payoutsEnabled,
        createdAt,
        updatedAt
      );
    } else {
      console.warn('Stripe account does not have an email.');
    }
    sendEmail(email ?? '', 'Stripe', 'Cuenta Stripe actualizada correctamente');
  }
  // Detectar pagos completados (opcional)
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(`Pago completado: ${paymentIntent.id}`);
    // Actualizar DB, notificar vendedor, etc.
  }

  res.json({ received: true });
}

// guarda los datos del pago en la base de datos
async function splitPaymentWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  console.log('📩 Webhook recibido (Split Payment):', {
    hasBody: !!req.body,
    hasSignature: !!sig,
    bodyLength: req.body?.length || 0,
  });
  let event: Stripe.Event;

  try {
    // Para webhooks de Checkout debemos usar express.raw en app.ts
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_DEV_SPLIT_PAYMENT as string
    );
    console.log('🎯 Evento verificado:', event.type, 'ID:', event.id);
  } catch (err: any) {
    console.error('⚠️ Webhook Error:', err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );

        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error procesando webhook:', err);
    res.status(500).send('Error procesando webhook');
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    // Recuperamos el PaymentIntent completo para tener todos los datos
    const paymentIntentId = session.payment_intent as string;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Guardamos en la DB usando tu función
    await updatePagoSplit(paymentIntent.id, 'succeeded', paymentIntent);
    console.log('✅ Pago guardado correctamente en DB:', paymentIntent.id);
  } catch (err) {
    console.error('Error guardando pago tras checkout session:', err);
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  try {
    await updatePagoSplit(paymentIntent.id, 'succeeded', paymentIntent);
    console.log('✅ Pago exitoso guardado en DB:', paymentIntent.id);
  } catch (err) {
    console.error('Error guardando pago exitoso:', err);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    await updatePagoSplit(paymentIntent.id, 'failed', paymentIntent);
    console.log('⚠️ Pago fallido actualizado en DB:', paymentIntent.id);
  } catch (err) {
    console.error('Error actualizando pago fallido:', err);
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    await updatePagoSplit(paymentIntent.id, 'canceled', paymentIntent);
    console.log('⚠️ Pago cancelado actualizado en DB:', paymentIntent.id);
  } catch (err) {
    console.error('Error actualizando pago cancelado:', err);
  }
}
export { stripeWebhook, splitPaymentWebhook, updatePagoSplit };

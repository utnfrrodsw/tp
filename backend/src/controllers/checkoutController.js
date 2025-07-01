import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
dotenv.config();

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export const createCheckout = async (req, res) => {
  try {
    const { items, payer } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Debe enviar items válidos' });
    }

    const formattedItems = items.map(item => ({
      title: item.title, 
      unit_price: Number(item.unit_price),
      quantity: Number(item.quantity),
      currency_id: 'ARS',
    }));
    
    

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: formattedItems,
        payer: {
          email: payer?.email, 
          name: payer?.name,
          surname: payer?.surname,
        },
        back_urls: {
          success: 'http://localhost:4200/success',
          failure: 'http://localhost:4200/failure',
          pending: 'http://localhost:4200/pending',
        },
        //auto_return: 'approved', // descomentado para que auto-retorne al aprobar pago
        // opción extra para sandbox (no obligatorio)
        notification_url: 'http://localhost:3000/api/notifications', 
      },
    });

    // usar sandbox_init_point para pruebas sandbox
    const paymentUrl = result.sandbox_init_point || result.init_point;

    res.status(200).json({ init_point: paymentUrl });

  } catch (error) {
    console.error('Error al crear preferencia:', error.response?.data || error.message || error);
    res.status(500).json({ error: 'No se pudo crear la preferencia' });
  }
};

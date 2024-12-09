const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

// Configuración de variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración de MercadoPago
const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-5360684163294216-090101-42085ff60bdfb7cf05a92b2ad223624e-237551322',
});

// Credentials
app.use(express.json());
app.use(cors({
    origin: process.env.URL_CORS,
    credentials: true,
}));

// Rutas de tu aplicación
const routerApi = require('./routes');
routerApi(app);

// Ruta para crear una preferencia de pago en MercadoPago
app.post('/create_preference', async (req, res) => {
    try {
        const body = {
            items: [
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                    currency_id: 'ARS',
                },
            ],
            back_urls: {
                success: process.env.URL_CORS2,
                failure: process.env.URL_CORS2,
                pending: process.env.URL_CORS,
            },
            auto_return: 'approved',
            notification_url: process.env.URL_CORS2, // Reemplaza con tu URL de webhook
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });

        res.json({
            id: result.id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Error al crear la preferencia',
        });
    }
});

// Middleware


// Iniciar el servidor
app.listen(port, () => {
    console.log('Servidor corriendo en el puerto =>> ', port);
});

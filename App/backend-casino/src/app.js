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
                success: process.env.URL_CORS,
                failure: process.env.URL_CORS_FAIL,
                pending: process.env.URL_CORS_PENDING,
            },
            auto_return: 'approved',
            notification_url:"https://c018-186-158-145-120.ngrok-free.app/webhook"
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

app.post("/webhook", async function (req, res) {
    console.log("Se realizo el pago")

    const paymentId = req.query.id;
    console.log({payment});

    try{
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${client.accessToken}`
            }
        });
        
        if(response.ok) {
            const data = await response.json();
            console.log(data);
        }
        
        res.sendStatus(200);
        }catch (error) {
            console.error('Error:', error);
            res.sendStatus(500);
        }
})



// Middleware


// Iniciar el servidor
app.listen(port, () => {
    console.log('Servidor corriendo en el puerto =>> ', port);
});

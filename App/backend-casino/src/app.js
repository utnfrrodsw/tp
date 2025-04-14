const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { QueryTypes } = require('sequelize')
const { models } = require('./libs/sequelize')

// Configuración de variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
let userID = ""
let price = 0

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
                    id_user: req.body.id_user
                },
            ],
            back_urls: {
                success: process.env.URL_CORS_SUCCESS,
                failure: process.env.URL_CORS_FAIL,
                pending: process.env.URL_CORS_PENDING,
            },
            auto_return: 'approved',
            notification_url: process.env.URL_MP_NOTIFICATION
        };

        userID = req.body.id_user
        price = Number(req.body.price)
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


    const paymentId = req.query['data.id'];
    try{
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${client.accessToken}`
            }
        });
        
        if(response.ok) {
            const data = await response.json();
            
            try {
                if(data.status === "approved") {
                    models.User.sequelize.query(`update Users 
                        set balance = balance + ` + price + `
                        where id_user = ` + userID, {type: QueryTypes.update})
                    }
                } catch (error) {
                    console.log(error);
                }
        }

        
        res.sendStatus(200);
    }catch (error) {
            console.error('Error:', error);
            res.sendStatus(500);
        }
})


// Iniciar el servidor
app.listen(port, () => {
    console.log('Servidor corriendo en el puerto =>> ', port);
});

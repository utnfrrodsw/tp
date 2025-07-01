
require('dotenv').config();
const express = require('express');
const cors = require('cors');

//const sequelize = require('./config/db');
const { sequelize } = require('./models');

// Inicializar app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());



// Rutas base
app.get('/', (req, res) => {
  res.send('API de ecommerce funcionando ');
});


// Rutas del proyecto
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderProductsRoutes = require('./routes/orderProductsRoutes');
const paymentRoutes = require('./routes/payment');





app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/order-products', orderProductsRoutes);
app.use('/api/payments', paymentRoutes);

// Conexión a la base de datos
sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos establecida'))
  .catch(err => console.error('Error de conexión:', err));

  sequelize.sync({ alter: true }) //  modifica todas las tablas y las vuelve a crear
  .then(() => console.log('Modelos sincronizados con la base de datos'))
  .catch(err => console.error('Error al sincronizar modelos:', err));


// Servidor escuchando
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

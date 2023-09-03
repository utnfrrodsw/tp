const express = require('express');
const mongoose = require('mongoose'); 
const app = express();
const apiRoutes = require('./routes/apiRoutes');

mongoose.connect('mongodb+srv://bautistaguerra:bautista1234@nospeakdb.2pmdvhk.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Conexión a MongoDB Atlas establecida');
});

app.use(express.json());

app.use('/api', apiRoutes); 
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});

const express = require('express');
const app = express();


const apiRoutes = require('./routes/apiRoutes');


app.use('/api', apiRoutes); 



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});

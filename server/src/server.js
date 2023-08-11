const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const path = require('path');

//settings

app.set("port", process.env.PORT || 5000); //seteamos el puerto que nos da el servidor o el 5000
app.use(cors()); //para que el servidor entienda las peticiones que llegan desde el cliente
//middlewares
app.use(morgan('dev')); //dependencia para ver las peticiones que llegan al servidor
app.use(express.json()); //para que el servidor entienda los json que llegan desde el cliente
//routes
app.use('/api/tasks',require('./routes/task.routes'))
//static files

//start server
app.listen(app.get('port'), () => {
  console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});


app.get("/api", (req, res) => {
  res.json({ "users": ["userOne","userTwo","userThree"]});
});
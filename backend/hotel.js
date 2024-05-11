const express = require('express');
const app = express();
app.use(express.json());

//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------

let tiposHabitacion = [
  { id: '1', denominacion: 'Individual' },
  { id: '2', denominacion: 'Doble' },
  { id: '3', denominacion: 'Suite' }
];

let habitaciones = [
  { 
    nroHabitacion: '101',
    descripcion: 'Habitación individual con vista al mar',
    capacidadPersonas: 1,
    precioXdia: 100,
    tipoHabitacionId: '1'
  },
  { 
    nroHabitacion: '201',
    descripcion: 'Habitación doble estándar',
    capacidadPersonas: 2,
    precioXdia: 150,
    tipoHabitacionId: '2'
  },
  { 
    nroHabitacion: '301',
    descripcion: 'Suite de lujo con jacuzzi',
    capacidadPersonas: 2,
    precioXdia: 300,
    tipoHabitacionId: '3'
  }
];

let clientes = [
  { 
    id: '1',
    nroDni: '12345678',
    tipoDni: 'DNI',
    apellidoYnombre: 'González, María',
    sexo: 'Femenino',
    fechaNac: '15-05-1990',
    mail: 'maria@example.com',
    contrasena: 'clave123'
  },
  
];


let estadias = [
  { 
    id: '1',
    fechaIngreso: '10-05-2024',
    fechaEgreso: '15-05-2024',
    estado: 'Activa'
  },
  
];

//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------

app.get('/clientes', (req, res) => {
  res.json(clientes);
});

app.get('/clientes/:dni', (req, res) => {
  const dni = req.params.dni;
  const cliente = clientes.find(c => c.nroDni === dni);
  if (cliente) {
    res.json(cliente);
  } else {
    res.status(404).send('Cliente no encontrado');
  }
});

app.post('/clientes', (req, res) => {
  const nuevoCliente = req.body;
  clientes.push(nuevoCliente);
  res.status(201).json(nuevoCliente);
});

//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------

app.get('/estadias', (req, res) => {
  res.json(estadias);
});

app.get('/estadias/:id', (req, res) => {
  const id = req.params.id;
  const estadia = estadias.find(e => e.id === id);
  if (estadia) {
    res.json(estadia);
  } else {
    res.status(404).send('Estadia no encontrada');
  }
});

app.post('/estadias', (req, res) => {
  const nuevaEstadia = req.body;
  estadias.push(nuevaEstadia);
  res.status(201).json(nuevaEstadia);
});

//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------

app.get('/tiposHabitacion', (req, res) => {
  res.json(tiposHabitacion);
});

app.get('/tiposHabitacion/:id', (req, res) => {
  const id = req.params.id;
  const tipoHabitacion = tiposHabitacion.find(t => t.id === id);
  if (tipoHabitacion) {
    res.json(tipoHabitacion);
  } else {
    res.status(404).send('Tipo de habitación no encontrado');
  }
});

app.post('/tiposHabitacion', (req, res) => {
  const nuevoTipoHabitacion = req.body;
  tiposHabitacion.push(nuevoTipoHabitacion);
  res.status(201).json(nuevoTipoHabitacion);
});

app.put('/tiposHabitacion/:id', (req, res) => {
  const id = req.params.id;
  const tipoHabitacionActualizado = req.body;
  const indice = tiposHabitacion.findIndex(t => t.id === id);
  if (indice !== -1) {
    tiposHabitacion[indice] = {
      ...tiposHabitacion[indice], 
      ...tipoHabitacionActualizado 
    };
    res.json(tiposHabitacion[indice]); 
  } else {
    res.status(404).send('Tipo de habitación no encontrado');
  }
});

app.delete('/tiposHabitacion/:id', (req, res) => {
  const id = req.params.id;
  const indice = tiposHabitacion.findIndex(t => t.id === id);
  if (indice !== -1) {
    const habitacionAsignada = habitaciones.find(h => h.tipoHabitacionId === id);
    if (habitacionAsignada) {
      res.status(400).send('No se puede eliminar este tipo de habitación porque hay habitaciones asignadas a él');
    } else {
      tiposHabitacion.splice(indice, 1);
      res.status(204).send();
    }
  } else {
    res.status(404).send('Tipo de habitación no encontrado');
  }
});

//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------

app.get('/habitaciones', (req, res) => {
  const habitacionesConDenominacion = habitaciones.map(habitacion => {
    const tipoHabitacion = tiposHabitacion.find(tipo => tipo.id === habitacion.tipoHabitacionId);
    return {
      nroHabitacion: habitacion.nroHabitacion,
      descripcion: habitacion.descripcion,
      capacidadPersonas: habitacion.capacidadPersonas,
      precioXdia: habitacion.precioXdia,
      tipoHabitacion: tipoHabitacion ? tipoHabitacion.denominacion : 'Tipo de habitación no encontrado'
    };
  });
  res.json(habitacionesConDenominacion);
});

app.get('/habitaciones/:nroHabitacion', (req, res) => {
  const nroHabitacion = req.params.nroHabitacion;
  const habitacion = habitaciones.find(h => h.nroHabitacion === nroHabitacion);
  if (habitacion) {
    const tipoHabitacion = tiposHabitacion.find(t => t.id === habitacion.tipoHabitacionId);
    if (tipoHabitacion) {
      const habitacionConDenominacion = {
        nroHabitacion: habitacion.nroHabitacion,
        descripcion: habitacion.descripcion,
        capacidadPersonas: habitacion.capacidadPersonas,
        precioXdia: habitacion.precioXdia,
        tipoHabitacion: tipoHabitacion.denominacion
      };
      res.json(habitacionConDenominacion);
    } else {
      res.status(404).send('Tipo de habitación no encontrado');
    }
  } else {
    res.status(404).send('Habitación no encontrada');
  }
});

app.post('/habitaciones', (req, res) => {
  const nuevaHabitacion = req.body;
  habitaciones.push(nuevaHabitacion);
  res.status(201).json(nuevaHabitacion);
});

app.put('/habitaciones/:nroHabitacion', (req, res) => {
  const nroHabitacion = req.params.nroHabitacion;
  const habitacionActualizada = req.body;
  const indice = habitaciones.findIndex(h => h.nroHabitacion === nroHabitacion);
  if (indice !== -1) {
    habitaciones[indice] = {
      ...habitaciones[indice], 
      ...habitacionActualizada 
    };
    res.json(habitaciones[indice]); 
  } else {
    res.status(404).send('Habitación no encontrada');
  }
});

app.delete('/habitaciones/:nroHabitacion', (req, res) => {
  const nroHabitacion = req.params.nroHabitacion;
  const indice = habitaciones.findIndex(h => h.nroHabitacion === nroHabitacion);
  if (indice !== -1) {
    habitaciones.splice(indice, 1);
    res.status(204).send(); 
  } else {
    res.status(404).send('Habitación no encontrada');
  }
});

//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------

const puerto = 3000;
app.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});

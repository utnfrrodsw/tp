const express = require('express');
const app = express();
const uuid = require('uuid');
app.use(express.json());

//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------

let localidades = [
  { id: '1', nombre: 'Buenos Aires', provinciaId: '1' },
  { id: '2', nombre: 'La Plata', provinciaId: '1' },
  { id: '3', nombre: 'Córdoba', provinciaId: '2' },
  { id: '4', nombre: 'Rosario', provinciaId: '3' },
  
];

let provincias = [
  { id: '1', nombre: 'Buenos Aires' },
  { id: '2', nombre: 'Córdoba' },
  { id: '3', nombre: 'Santa Fe' },
  
];


let servicios = [
  { 
    idServicio: '1',
    nombre: 'WiFi',
    descripcion: 'Conexión a internet de alta velocidad',
    precio: 10
  },
  { 
    idServicio: '2',
    nombre: 'Desayuno',
    descripcion: 'Desayuno buffet con variedad de opciones',
    precio: 15
  },
  { 
    idServicio: '3',
    nombre: 'Estacionamiento',
    descripcion: 'Estacionamiento privado y seguro',
    precio: 20
  }
];

let servicioEstadia = [
  { idServicio: '1', idEstadia: '1' }, 
  { idServicio: '2', idEstadia: '1' }, 
  { idServicio: '2', idEstadia: '2' } 
];



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
    tipoHabitacionId: '1',
    estado: 'Disponible' 
  },
  { 
    nroHabitacion: '201',
    descripcion: 'Habitación doble estándar',
    capacidadPersonas: 2,
    precioXdia: 150,
    tipoHabitacionId: '2',
    estado: 'Disponible' 
  },
  { 
    nroHabitacion: '301',
    descripcion: 'Suite de lujo con jacuzzi',
    capacidadPersonas: 2,
    precioXdia: 300,
    tipoHabitacionId: '3',
    estado: 'Disponible' 
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
    clienteId: '1',
    nroHabitacion: '101',
    fechaIngreso: '10-05-2024',
    fechaEgreso: '15-05-2024',
    estado: 'Finalizado'
  },
  { 
    id: '2',
    clienteId: '1',
    nroHabitacion: '201',
    fechaIngreso: '12-07-2024',
    fechaEgreso: '17-07-2024',
    estado: 'Reservado'
  },
];


let tokensValidos = {};

//---------------------------------------------------------------------------------------------------------------------------------
// Verificar si el usuario esta logueado
//---------------------------------------------------------------------------------------------------------------------------------

function verificarAutenticacion(req, res, next) {
  const token = req.headers['authorization']; 
  if (token && tokensValidos[token]) {
    req.cliente = tokensValidos[token]; 
    next();
  } else {
    res.status(401).send('Cliente no autenticado');
  }
}

//---------------------------------------------------------------------------------------------------------------------------------
// Ruta para login
//---------------------------------------------------------------------------------------------------------------------------------

app.post('/login', (req, res) => {
  const { mail, contrasena } = req.body;
  const cliente = clientes.find(c => c.mail === mail && c.contrasena === contrasena);
  if (cliente) {
    const token = uuid.v4(); 
    tokensValidos[token] = cliente;
    res.json({ token });
  } else {
    res.status(401).send('Credenciales incorrectas');
  }
});

//---------------------------------------------------------------------------------------------------------------------------------
// Rutas para  Cliente
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

app.put('/clientes/:dni', (req, res) => {
  const dni = req.params.dni;
  const index = clientes.findIndex(cliente => cliente.nroDni === dni);
  if (index !== -1) {
    const clienteActualizado = { ...clientes[index], ...req.body };
    clientes[index] = clienteActualizado;
    res.json(clienteActualizado);
  } else {
    res.status(404).send('Cliente no encontrado');
  }
});


//---------------------------------------------------------------------------------------------------------------------------------
// Rutas para  Localidad
//---------------------------------------------------------------------------------------------------------------------------------

app.get('/localidades', (req, res) => {
  res.json(localidades);
});


app.get('/localidades/:id', (req, res) => {
  const id = req.params.id;
  const localidad = localidades.find(localidad => localidad.id === id);
  if (localidad) {
    res.json(localidad);
  } else {
    res.status(404).send('Localidad no encontrada');
  }
});


app.post('/localidades', (req, res) => {
  const nuevaLocalidad = req.body;
  localidades.push(nuevaLocalidad);
  res.status(201).json(nuevaLocalidad);
});


app.put('/localidades/:id', (req, res) => {
  const id = req.params.id;
  const index = localidades.findIndex(localidad => localidad.id === id);
  if (index !== -1) {
    localidades[index] = { ...localidades[index], ...req.body };
    res.json(localidades[index]);
  } else {
    res.status(404).send('Localidad no encontrada');
  }
});


app.delete('/localidades/:id', (req, res) => {
  const id = req.params.id;
  const index = localidades.findIndex(localidad => localidad.id === id);
  if (index !== -1) {
    localidades.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Localidad no encontrada');
  }
});


app.get('/localidades/provincia/:idProvincia', (req, res) => {
  const idProvincia = req.params.idProvincia;
  const localidadesProvincia = localidades.filter(localidad => localidad.provinciaId === idProvincia);
  if (localidadesProvincia.length > 0) {
    res.json(localidadesProvincia);
  } else {
    res.status(404).send('No se encontraron localidades para esta provincia');
  }
});



//---------------------------------------------------------------------------------------------------------------------------------
// Rutas para  Provincia
//---------------------------------------------------------------------------------------------------------------------------------


app.get('/provincias', (req, res) => {
  res.json(provincias);
});


app.get('/provincias/:id', (req, res) => {
  const id = req.params.id;
  const provincia = provincias.find(provincia => provincia.id === id);
  if (provincia) {
    res.json(provincia);
  } else {
    res.status(404).send('Provincia no encontrada');
  }
});


app.post('/provincias', (req, res) => {
  const nuevaProvincia = req.body;
  provincias.push(nuevaProvincia);
  res.status(201).json(nuevaProvincia);
});


app.put('/provincias/:id', (req, res) => {
  const id = req.params.id;
  const index = provincias.findIndex(provincia => provincia.id === id);
  if (index !== -1) {
    provincias[index] = { ...provincias[index], ...req.body };
    res.json(provincias[index]);
  } else {
    res.status(404).send('Provincia no encontrada');
  }
});


app.delete('/provincias/:id', (req, res) => {
  const id = req.params.id;
  const index = provincias.findIndex(provincia => provincia.id === id);
  if (index !== -1) {
    provincias.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Provincia no encontrada');
  }
});


//---------------------------------------------------------------------------------------------------------------------------------
// Rutas para  Estadia
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

app.get('/estadias/cliente/:dni', (req, res) => {
  const dni = req.params.dni;
  const clienteEstadias = estadias.filter(e => e.cliente.nroDni === dni);
  if (clienteEstadias.length > 0) {
    res.json(clienteEstadias);
  } else {
    res.status(404).send('No se encontraron estadías para este cliente');
  }
});


//---------------------------------------------------------------------------------------------------------------------------------
// Rutas para  Tipos de Habitacion
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
// Rutas para Habitaciones
//---------------------------------------------------------------------------------------------------------------------------------

app.get('/habitaciones', (req, res) => {
  const habitacionesConDenominacion = habitaciones.map(habitacion => {
    const tipoHabitacion = tiposHabitacion.find(tipo => tipo.id === habitacion.tipoHabitacionId);
    return {
      nroHabitacion: habitacion.nroHabitacion,
      descripcion: habitacion.descripcion,
      capacidadPersonas: habitacion.capacidadPersonas,
      precioXdia: habitacion.precioXdia,
      tipoHabitacion: tipoHabitacion ? tipoHabitacion.denominacion : 'Tipo de habitación no encontrado',
      estado: habitacion.estado
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
        tipoHabitacion: tipoHabitacion.denominacion,
        estado: habitacion.estado
      };
      res.json(habitacionConDenominacion);
    } else {
      res.status(404).send('Tipo de habitación no encontrado');
    }
  } else {
    res.status(404).send('Habitación no encontrada');
  }
});

app.get('/habitacionesXtipo/:idTipo', (req, res) => {
  const idTipo = req.params.idTipo;
  const habitacionesTipo = habitaciones.filter(habitacion => habitacion.tipoHabitacionId === idTipo);
  if (habitacionesTipo.length > 0) {
    res.json(habitacionesTipo);
  } else {
    res.status(404).send('No se encontraron habitaciones para este tipo de habitación');
  }
});


app.get('/habitaciones/disponibles', (req, res) => {
  const habitacionesDisponibles = habitaciones.filter(habitacion => habitacion.estado === 'Disponible');
  res.json(habitacionesDisponibles);
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
// Ruta para reservar una habitacion
//---------------------------------------------------------------------------------------------------------------------------------


app.get('/habitaciones/disponibles/:fechaIngreso/:fechaEgreso', (req, res) => {
  const fechaIngresoParts = req.params.fechaIngreso.split('-').map(Number); // Convertir partes de fecha a números
  const fechaEgresoParts = req.params.fechaEgreso.split('-').map(Number); // Convertir partes de fecha a números

  // Crear fechas con el formato esperado (AAAA-MM-DD)
  const fechaIngreso = new Date(fechaIngresoParts[2], fechaIngresoParts[1] - 1, fechaIngresoParts[0]);
  const fechaEgreso = new Date(fechaEgresoParts[2], fechaEgresoParts[1] - 1, fechaEgresoParts[0]);

  // Filtrar las estancias que se superponen con el rango de fechas proporcionado
  const estadiasSuperpuestas = estadias.filter(estadia => {
    const estadiaInicio = new Date(estadia.fechaIngreso);
    const estadiaFin = new Date(estadia.fechaEgreso);
    return (
      (fechaIngreso >= estadiaInicio && fechaIngreso < estadiaFin) ||
      (fechaEgreso > estadiaInicio && fechaEgreso <= estadiaFin) ||
      (fechaIngreso <= estadiaInicio && fechaEgreso >= estadiaFin)
    );
  });

  // Obtener los números de habitación de las estancias superpuestas
  const habitacionesOcupadas = estadiasSuperpuestas.map(estadia => estadia.nroHabitacion);

  // Filtrar las habitaciones que no están en la lista de habitaciones ocupadas
  const habitacionesDisponibles = habitaciones.filter(habitacion => !habitacionesOcupadas.includes(habitacion.nroHabitacion));

  res.json(habitacionesDisponibles);
});






app.post('/estadias/reservar-habitacion/:nroHabitacion', verificarAutenticacion, (req, res) => {
  const nroHabitacion = req.params.nroHabitacion;
  const { fechaIngreso, fechaEgreso } = req.body;
  const clienteId = req.cliente.id;

  
  const habitacion = habitaciones.find(h => h.nroHabitacion === nroHabitacion);
  if (habitacion) {
    if (habitacion.estado === 'Disponible') {
      
      const nuevaEstadia = {
        id: (estadias.length + 1).toString(),
        clienteId: clienteId,
        nroHabitacion: nroHabitacion,
        fechaIngreso: fechaIngreso,
        fechaEgreso: fechaEgreso,
        estado: 'Reservado'
      };

      
      habitacion.estado = 'Ocupado';

      
      estadias.push(nuevaEstadia);

      res.status(200).json(nuevaEstadia);
    } else {
      res.status(400).send('La habitación ya está ocupada.');
    }
  } else {
    res.status(404).send('Habitación no encontrada.');
  }
});

//---------------------------------------------------------------------------------------------------------------------------------
// Ruta para check in
//---------------------------------------------------------------------------------------------------------------------------------

app.post('/checkin/:idReserva', (req, res) => {
  const idReserva = req.params.idReserva;
  
  // Buscar la reserva por su ID
  const reserva = estadias.find(estadia => estadia.id === idReserva);

  if (!reserva) {
    return res.status(404).send('Reserva no encontrada');
  }

  // Actualizar el estado de la reserva a "Activa"
  reserva.estado = 'Activa';

  // Buscar la habitación asociada a la reserva
  const habitacion = habitaciones.find(habitacion => habitacion.nroHabitacion === reserva.nroHabitacion);

  if (!habitacion) {
    return res.status(404).send('Habitación no encontrada');
  }

  // Actualizar el estado de la habitación a "Ocupado"
  habitacion.estado = 'Ocupado';

  res.json({ mensaje: 'Check-in realizado exitosamente' });
});


//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------

const puerto = 3000;
app.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});

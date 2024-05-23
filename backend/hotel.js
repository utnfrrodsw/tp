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
    estado: 'Disponible',
    imagenUrl: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
  },
  { 
    nroHabitacion: '201',
    descripcion: 'Habitación doble estándar',
    capacidadPersonas: 2,
    precioXdia: 150,
    tipoHabitacionId: '2',
    estado: 'Disponible',
    imagenUrl: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
  },
  { 
    nroHabitacion: '301',
    descripcion: 'Suite de lujo con jacuzzi',
    capacidadPersonas: 2,
    precioXdia: 300,
    tipoHabitacionId: '3',
    estado: 'Disponible',
    imagenUrl: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
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


const tokensValidos = {};

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
// Rutas para cliente
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
// Rutas para localidad
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
// Rutas para provincia
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
// Rutas para estadia
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
// Rutas para tipos de habitacion
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
// Rutas para habitaciones
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
      estado: habitacion.estado,
      imagenUrl:habitacion.imagenUrl
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


app.get('/habitaciones/disponibles/:fechaIngreso/:fechaEgreso/:capacidad', (req, res) => {
  const { fechaIngreso, fechaEgreso, capacidad } = req.params;

 
  const parseDate = (fecha) => {
    const day = parseInt(fecha.substring(0, 2), 10);
    const month = parseInt(fecha.substring(2, 4), 10) - 1; 
    const year = parseInt(fecha.substring(4, 8), 10);
    return new Date(year, month, day);
  };

  
  const fechaIngresoDate = parseDate(fechaIngreso);
  const fechaEgresoDate = parseDate(fechaEgreso);

  if (isNaN(fechaIngresoDate) || isNaN(fechaEgresoDate)) {
    return res.status(400).json({ error: 'Fechas inválidas' });
  }

  
  const estadiasSuperpuestas = estadias.filter(estadia => {
    const estadiaInicio = new Date(estadia.fechaIngreso.split('-').reverse().join('-'));
    const estadiaFin = new Date(estadia.fechaEgreso.split('-').reverse().join('-'));
    return (
      estadia.estado !== 'Finalizado' &&
      (
        (fechaIngresoDate >= estadiaInicio && fechaIngresoDate < estadiaFin) ||
        (fechaEgresoDate > estadiaInicio && fechaEgresoDate <= estadiaFin) ||
        (fechaIngresoDate <= estadiaInicio && fechaEgresoDate >= estadiaFin)
      )
    );
  });

  
  const habitacionesOcupadas = estadiasSuperpuestas.map(estadia => estadia.nroHabitacion);

  
  const habitacionesDisponibles = habitaciones.filter(habitacion => 
    !habitacionesOcupadas.includes(habitacion.nroHabitacion) && habitacion.capacidadPersonas >= parseInt(capacidad, 10)
  );

  res.json(habitacionesDisponibles);
});


app.post('/estadias/reservar-habitacion', verificarAutenticacion, (req, res) => {
  const { nroHabitacion, fechaIngreso, fechaEgreso } = req.body;
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
// Ruta para checkin
//---------------------------------------------------------------------------------------------------------------------------------

app.post('/checkin/:idReserva', (req, res) => {
  const idReserva = req.params.idReserva;
  
  const reserva = estadias.find(estadia => estadia.id === idReserva);

  if (!reserva) {
    return res.status(404).send('Reserva no encontrada');
  }
  
  reserva.estado = 'Activa';
  
  const habitacion = habitaciones.find(habitacion => habitacion.nroHabitacion === reserva.nroHabitacion);

  if (!habitacion) {
    return res.status(404).send('Habitación no encontrada');
  }

  
  habitacion.estado = 'Ocupado';

  res.json({ mensaje: 'Check-in realizado exitosamente' });
});


//---------------------------------------------------------------------------------------------------------------------------------
// Ruta para checkout
//---------------------------------------------------------------------------------------------------------------------------------

app.post('/checkout/:idReserva', (req, res) => {
  const idReserva = req.params.idReserva;

  const reserva = estadias.find(estadia => estadia.id === idReserva);

  if (!reserva) {
    return res.status(404).send('Reserva no encontrada');
  }

 
  if (reserva.estado === 'Finalizado') {
    return res.status(400).send('La reserva ya ha sido finalizada anteriormente');
  }

 
  reserva.estado = 'Finalizado';

  const habitacion = habitaciones.find(habitacion => habitacion.nroHabitacion === reserva.nroHabitacion);

  if (!habitacion) {
    return res.status(404).send('Habitación no encontrada');
  }

  
  habitacion.estado = 'Disponible';

  res.json({ mensaje: 'Check-out realizado exitosamente' });
});



//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------

const puerto = 3000;
app.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});

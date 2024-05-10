const express = require('express');
const app = express();
app.use(express.json());

//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------

let tiposHabitacion = [
  { id: '1', denominacion: 'Individual' },
  { id: '2', denominacion: 'Doble' },
  { id: '3', denominacion: 'Suite' }
];

let habitaciones = [
  { 
    id: '1',
    nroHabitacion: '101',
    descripcion: 'Habitación individual con vista al mar',
    capacidadPersonas: 1,
    precioXdia: 100,
    tipoHabitacionId: '1'
  },
  { 
    id: '2',
    nroHabitacion: '201',
    descripcion: 'Habitación doble estándar',
    capacidadPersonas: 2,
    precioXdia: 150,
    tipoHabitacionId: '2'
  },
  { 
    id: '3',
    nroHabitacion: '301',
    descripcion: 'Suite de lujo con jacuzzi',
    capacidadPersonas: 2,
    precioXdia: 300,
    tipoHabitacionId: '3'
  }
];

//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------

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
    tiposHabitacion.splice(indice, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Tipo de habitación no encontrado');
  }
});

//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------

app.get('/habitaciones', (req, res) => {
    const habitacionesConDenominacion = habitaciones.map(habitacion => {
      const tipoHabitacion = tiposHabitacion.find(tipo => tipo.id === habitacion.tipoHabitacionId);
      return {
        id: habitacion.id,
        nroHabitacion: habitacion.nroHabitacion,
        descripcion: habitacion.descripcion,
        capacidadPersonas: habitacion.capacidadPersonas,
        precioXdia: habitacion.precioXdia,
        tipoHabitacion: tipoHabitacion ? tipoHabitacion.denominacion : 'Tipo de habitación no encontrado'
      };
    });
    res.json(habitacionesConDenominacion);
  });
  

  app.get('/habitaciones/:id', (req, res) => {
    const id = req.params.id;
    const habitacion = habitaciones.find(h => h.id === id);
    if (habitacion) {
      const tipoHabitacion = tiposHabitacion.find(t => t.id === habitacion.tipoHabitacionId);
      if (tipoHabitacion) {
        const habitacionConDenominacion = {
          id: habitacion.id,
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

app.put('/habitaciones/:id', (req, res) => {
    const id = req.params.id;
    const habitacionActualizada = req.body;
    const indice = habitaciones.findIndex(h => h.id === id);
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
  

  app.delete('/habitaciones/:id', (req, res) => {
    const id = req.params.id;
    const indice = habitaciones.findIndex(h => h.id === id);
    if (indice !== -1) {
      habitaciones.splice(indice, 1);
      res.status(204).send(); 
    } else {
      res.status(404).send('Habitación no encontrada');
    }
  });
 
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------


app.get('/habitacionesPorTipo/:idTipo', (req, res) => {
    const idTipo = req.params.idTipo;
    const habitacionesTipo = habitaciones.filter(h => h.tipoHabitacionId === idTipo);
    if (habitacionesTipo.length > 0) {
      const habitacionesConDenominacion = habitacionesTipo.map(habitacion => {
        const tipoHabitacion = tiposHabitacion.find(tipo => tipo.id === habitacion.tipoHabitacionId);
        return {
          id: habitacion.id,
          nroHabitacion: habitacion.nroHabitacion,
          descripcion: habitacion.descripcion,
          capacidadPersonas: habitacion.capacidadPersonas,
          precioXdia: habitacion.precioXdia,
          tipoHabitacion: tipoHabitacion.denominacion
        };
      });
      res.json(habitacionesConDenominacion);
    } else {
      res.status(404).send('No se encontraron habitaciones para este tipo de habitación');
    }
  });
  
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------  

const puerto = 3000;
app.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});

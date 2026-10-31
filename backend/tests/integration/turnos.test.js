import { beforeAll, describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { ADMIN, iniciarBase, loguear, conOrigen } = require('../helpers');
const { hoy } = require('../../src/utils/membresia');
const { InscripcionTurno } = require('../../src/models/associations');

// Fecha de hoy +/- días, en AAAA-MM-DD (hora de Argentina, como el backend)
const enDias = (dias) =>
  new Date(Date.parse(`${hoy()}T00:00:00Z`) + dias * 86400000).toISOString().slice(0, 10);

let admin;
let profe;
let otroProfe;
let ana;
let beto;
let idClase;

const nuevoCliente = (dni) =>
  conOrigen(admin.post('/api/clientes')).send({
    dni,
    nombre: 'Cli',
    apellido: `Ente${dni}`,
    email: `cliente${dni}@test.com`
  });

const nuevoProfesor = (dni) =>
  conOrigen(admin.post('/api/profesores')).send({
    dni,
    nombre: 'Pro',
    apellido: `Fesor${dni}`,
    telefono: '1111',
    email: `profe${dni}@test.com`
  });

const nuevoTurno = (datos) =>
  conOrigen(admin.post('/api/turnos')).send({
    idClase,
    fecha: enDias(3),
    horaInicio: '10:00',
    horaFin: '11:00',
    capacidadMaxima: 5,
    dniProfesores: [500],
    ...datos
  });

const inscribirse = (agente, idTurno) =>
  conOrigen(agente.post(`/api/turnos/${idTurno}/inscripciones`));

beforeAll(async () => {
  await iniciarBase();
  admin = await loguear(ADMIN.email, ADMIN.password);
  await nuevoCliente(100);
  await nuevoCliente(200);
  await nuevoProfesor(500);
  await nuevoProfesor(600);
  const tipo = await conOrigen(admin.post('/api/turnos/tipos-clase')).send({
    nombre: 'Crossfit',
    descripcion: 'Entrenamiento funcional'
  });
  idClase = tipo.body.idClase;
  // Reservar exige una membresía que cubra el día del turno
  for (const dni of [100, 200]) {
    const res = await conOrigen(admin.post('/api/membresias')).send({
      dniCliente: dni,
      fechaPago: enDias(-5),
      fechaInicio: enDias(-5),
      fechaVencimiento: enDias(60),
      valor: 15000
    });
    expect(res.status).toBe(201);
  }
  ana = await loguear('cliente100@test.com', '100');
  beto = await loguear('cliente200@test.com', '200');
  profe = await loguear('profe500@test.com', '500');
  otroProfe = await loguear('profe600@test.com', '600');
});

describe('tipos de clase', () => {
  it('el admin crea y todos los roles pueden listarlos', async () => {
    expect(idClase).toBeTruthy();
    const res = await ana.get('/api/turnos/tipos-clase');
    expect(res.status).toBe(200);
    expect(res.body.map((t) => t.nombre)).toContain('Crossfit');
  });

  it('rechaza un nombre vacío con 400 y a un cliente con 403', async () => {
    expect(
      (await conOrigen(admin.post('/api/turnos/tipos-clase')).send({ nombre: ' ' })).status
    ).toBe(400);
    expect(
      (await conOrigen(ana.post('/api/turnos/tipos-clase')).send({ nombre: 'Yoga' })).status
    ).toBe(403);
  });

  it('no se puede borrar un tipo de clase con turnos (409)', async () => {
    await nuevoTurno({ fecha: enDias(10) });
    const res = await conOrigen(admin.delete(`/api/turnos/tipos-clase/${idClase}`));
    expect(res.status).toBe(409);
  });
});

describe('alta de turnos', () => {
  it('crea un turno con sus profesores', async () => {
    const res = await nuevoTurno({});
    expect(res.status).toBe(201);
    expect(res.body.profesores.map((p) => p.dni)).toEqual([500]);
    expect(res.body.inscriptos).toBe(0);
  });

  it('valida horarios, capacidad y profesores inexistentes con 400', async () => {
    expect((await nuevoTurno({ horaFin: '09:00' })).status).toBe(400);
    expect((await nuevoTurno({ capacidadMaxima: 0 })).status).toBe(400);
    expect((await nuevoTurno({ fecha: '2026-02-30' })).status).toBe(400);
    expect((await nuevoTurno({ dniProfesores: [999] })).status).toBe(400);
    expect((await nuevoTurno({ idClase: 9999 })).status).toBe(400);
  });

  it('el cliente no puede crear turnos', async () => {
    const res = await conOrigen(ana.post('/api/turnos')).send({ idClase });
    expect(res.status).toBe(403);
  });
});

describe('plantillas', () => {
  it('una plantilla (sin fecha) genera los turnos de los próximos 30 días', async () => {
    const plantilla = await nuevoTurno({
      fecha: null,
      horaInicio: '07:00',
      horaFin: '08:00',
      dniProfesores: [600]
    });
    expect(plantilla.status).toBe(201);

    const res = await admin.get(`/api/turnos?desde=${enDias(0)}&hasta=${enDias(29)}`);
    const generados = res.body.filter((t) => t.horaInicio === '07:00:00');
    expect(generados).toHaveLength(30);
    expect(generados[0].profesores.map((p) => p.dni)).toEqual([600]);

    // No aparece como un turno más en el listado ni lo ve el cliente
    expect(res.body.every((t) => t.fecha !== null)).toBe(true);
    const plantillas = await admin.get('/api/turnos/plantillas');
    expect(plantillas.body.some((t) => t.idTurno === plantilla.body.idTurno)).toBe(true);
  });

  it('pedir los turnos de nuevo no duplica los generados', async () => {
    const res = await admin.get(`/api/turnos?desde=${enDias(0)}&hasta=${enDias(29)}`);
    expect(res.body.filter((t) => t.horaInicio === '07:00:00')).toHaveLength(30);
  });
});

describe('inscripción de clientes', () => {
  it('el cliente se inscribe y el turno cuenta un inscripto más', async () => {
    const { body: turno } = await nuevoTurno({ fecha: enDias(4) });
    const res = await inscribirse(ana, turno.idTurno);
    expect(res.status).toBe(201);
    expect(res.body.estado).toBe('activa');

    const detalle = await beto.get(`/api/turnos/${turno.idTurno}`);
    expect(detalle.body.inscriptos).toBe(1);
    // Beto ve el cupo ocupado pero no a quién pertenece
    expect(detalle.body.inscripciones).toEqual([]);
  });

  it('no se puede inscribir dos veces al mismo turno (409)', async () => {
    const { body: turno } = await nuevoTurno({ fecha: enDias(5) });
    expect((await inscribirse(ana, turno.idTurno)).status).toBe(201);
    expect((await inscribirse(ana, turno.idTurno)).status).toBe(409);
  });

  it('solo un turno por día (409)', async () => {
    const { body: manana } = await nuevoTurno({
      fecha: enDias(6),
      horaInicio: '09:00',
      horaFin: '10:00'
    });
    const { body: tarde } = await nuevoTurno({
      fecha: enDias(6),
      horaInicio: '18:00',
      horaFin: '19:00'
    });
    expect((await inscribirse(beto, manana.idTurno)).status).toBe(201);
    const res = await inscribirse(beto, tarde.idTurno);
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/por día/);
  });

  it('respeta la capacidad máxima (409)', async () => {
    const { body: turno } = await nuevoTurno({ fecha: enDias(7), capacidadMaxima: 1 });
    expect((await inscribirse(ana, turno.idTurno)).status).toBe(201);
    const res = await inscribirse(beto, turno.idTurno);
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/capacidad/);
  });

  it('exige 8 horas de anticipación (409)', async () => {
    const { body: turno } = await nuevoTurno({
      fecha: enDias(-1),
      horaInicio: '10:00',
      horaFin: '11:00'
    });
    const res = await inscribirse(ana, turno.idTurno);
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/8 horas/);
  });

  it('cancelar libera el cupo y permite volver a inscribirse', async () => {
    const { body: turno } = await nuevoTurno({ fecha: enDias(8), capacidadMaxima: 1 });
    await inscribirse(ana, turno.idTurno);
    const cancelar = await conOrigen(ana.delete(`/api/turnos/${turno.idTurno}/inscripciones`));
    expect(cancelar.status).toBe(200);

    // Con el cupo libre, otro cliente entra
    expect((await inscribirse(beto, turno.idTurno)).status).toBe(201);
    // Cancelar algo que no existe da 404
    expect((await conOrigen(ana.delete(`/api/turnos/${turno.idTurno}/inscripciones`))).status).toBe(
      404
    );
  });

  it('el profesor y el admin no se inscriben (403)', async () => {
    const { body: turno } = await nuevoTurno({ fecha: enDias(9) });
    expect((await inscribirse(profe, turno.idTurno)).status).toBe(403);
    expect((await inscribirse(admin, turno.idTurno)).status).toBe(403);
  });
});

describe('membresía para reservar', () => {
  const nuevoCliente = async (dni, membresia) => {
    await conOrigen(admin.post('/api/clientes')).send({
      dni,
      nombre: 'Cli',
      apellido: `Ente${dni}`,
      email: `cliente${dni}@test.com`
    });
    if (membresia) {
      await conOrigen(admin.post('/api/membresias')).send({
        dniCliente: dni,
        valor: 100,
        ...membresia
      });
    }
    return loguear(`cliente${dni}@test.com`, String(dni));
  };

  it('sin membresía no se puede reservar (409)', async () => {
    const sin = await nuevoCliente(710);
    const { body: turno } = await nuevoTurno({ fecha: enDias(5) });
    const res = await inscribirse(sin, turno.idTurno);
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/membresía vigente/);
  });

  it('con la membresía vencida tampoco (409)', async () => {
    const vencida = await nuevoCliente(711, {
      fechaPago: enDias(-60),
      fechaInicio: enDias(-60),
      fechaVencimiento: enDias(-30)
    });
    const { body: turno } = await nuevoTurno({ fecha: enDias(5) });
    expect((await inscribirse(vencida, turno.idTurno)).status).toBe(409);
  });

  it('la membresía tiene que cubrir el día del turno, no solo hoy (409)', async () => {
    const porVencer = await nuevoCliente(712, {
      fechaPago: enDias(-20),
      fechaInicio: enDias(-20),
      fechaVencimiento: enDias(10)
    });
    const { body: antes } = await nuevoTurno({ fecha: enDias(9) });
    const { body: despues } = await nuevoTurno({ fecha: enDias(11) });

    expect((await inscribirse(porVencer, antes.idTurno)).status).toBe(201);
    const res = await inscribirse(porVencer, despues.idTurno);
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/no cubre el día/);
  });

  it('una membresía que todavía no empezó no sirve para un turno anterior (409)', async () => {
    const pendiente = await nuevoCliente(713, {
      fechaPago: enDias(0),
      fechaInicio: enDias(20),
      fechaVencimiento: enDias(50)
    });
    const { body: turno } = await nuevoTurno({ fecha: enDias(15) });
    expect((await inscribirse(pendiente, turno.idTurno)).status).toBe(409);
  });
});

describe('quién ve qué', () => {
  it('el profesor ve solo los turnos que dicta', async () => {
    const res = await otroProfe.get(`/api/turnos?desde=${enDias(3)}&hasta=${enDias(10)}`);
    expect(res.status).toBe(200);
    expect(res.body.every((t) => t.profesores.every((p) => p.dni === 600))).toBe(true);
    const { body: suyo } = await nuevoTurno({ fecha: enDias(11), dniProfesores: [500] });
    expect((await otroProfe.get(`/api/turnos/${suyo.idTurno}`)).status).toBe(404);
  });

  it('solo el admin y los profesores del turno ven los inscriptos', async () => {
    const { body: turno } = await nuevoTurno({ fecha: enDias(12) });
    await inscribirse(ana, turno.idTurno);

    const lista = await profe.get(`/api/turnos/${turno.idTurno}/inscripciones`);
    expect(lista.status).toBe(200);
    expect(lista.body[0].cliente.dni).toBe(100);
    expect((await otroProfe.get(`/api/turnos/${turno.idTurno}/inscripciones`)).status).toBe(404);
    expect((await ana.get(`/api/turnos/${turno.idTurno}/inscripciones`)).status).toBe(403);
  });
});

describe('asistencia', () => {
  let turnoHoy;

  beforeAll(async () => {
    // Se inscribe directo en la base: la API no deja anotarse a un turno que ya empezó
    turnoHoy = (await nuevoTurno({ fecha: enDias(0), horaInicio: '06:00', horaFin: '07:00' })).body;
    await InscripcionTurno.create({
      idTurno: turnoHoy.idTurno,
      dniCliente: 100,
      fechaHoraInscripcion: new Date(),
      estado: 'activa'
    });
  });

  const marcar = (agente, idTurno, dni, estado) =>
    conOrigen(agente.put(`/api/turnos/${idTurno}/inscripciones/${dni}`)).send({ estado });

  it('el profesor del turno registra la asistencia', async () => {
    const res = await marcar(profe, turnoHoy.idTurno, 100, 'asistio');
    expect(res.status).toBe(200);
    expect(res.body.estado).toBe('asistio');

    const lista = await admin.get(`/api/turnos/${turnoHoy.idTurno}/inscripciones`);
    expect(lista.body[0].estado).toBe('asistio');
  });

  it('el que asistió sigue ocupando cupo', async () => {
    const detalle = await admin.get(`/api/turnos/${turnoHoy.idTurno}`);
    expect(detalle.body.inscriptos).toBe(1);
  });

  it('rechaza estados inválidos, otro profesor y clientes', async () => {
    expect((await marcar(profe, turnoHoy.idTurno, 100, 'quizas')).status).toBe(400);
    expect((await marcar(otroProfe, turnoHoy.idTurno, 100, 'ausente')).status).toBe(404);
    expect((await marcar(ana, turnoHoy.idTurno, 100, 'ausente')).status).toBe(403);
    expect((await marcar(profe, turnoHoy.idTurno, 200, 'ausente')).status).toBe(404);
  });

  it('no se registra la asistencia de un turno futuro (409)', async () => {
    const { body: futuro } = await nuevoTurno({ fecha: enDias(20) });
    await inscribirse(ana, futuro.idTurno);
    expect((await marcar(profe, futuro.idTurno, 100, 'asistio')).status).toBe(409);
  });
});

describe('borrados', () => {
  it('no se borra un turno con inscripciones (409)', async () => {
    const { body: turno } = await nuevoTurno({ fecha: enDias(15) });
    await inscribirse(beto, turno.idTurno);
    expect((await conOrigen(admin.delete(`/api/turnos/${turno.idTurno}`))).status).toBe(409);
  });

  it('un profesor con turnos asignados no se puede borrar (409)', async () => {
    expect((await conOrigen(admin.delete('/api/profesores/500'))).status).toBe(409);
  });

  it('al borrar un cliente se borran sus inscripciones', async () => {
    await nuevoCliente(300);
    await conOrigen(admin.post('/api/membresias')).send({
      dniCliente: 300,
      fechaPago: enDias(0),
      fechaInicio: enDias(0),
      fechaVencimiento: enDias(60),
      valor: 100
    });
    const carla = await loguear('cliente300@test.com', '300');
    const { body: turno } = await nuevoTurno({ fecha: enDias(16) });
    expect((await inscribirse(carla, turno.idTurno)).status).toBe(201);

    expect([200, 204]).toContain((await conOrigen(admin.delete('/api/clientes/300'))).status);
    const lista = await admin.get(`/api/turnos/${turno.idTurno}/inscripciones`);
    expect(lista.body.some((i) => i.dniCliente === 300)).toBe(false);
  });
});

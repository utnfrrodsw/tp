import { MikroORM } from '@mikro-orm/postgresql';
import mikroOrmConfig from '../config/mikro-orm.config.js';
import { User } from '../entities/usuario.js';
import { Evento } from '../entities/evento.js';
import { Categoria } from '../entities/categoria.js';
import { EventoCategoria } from '../entities/evento-categoria.js';
import { Servicio } from '../entities/servicio.js';
import { Tablero } from '../entities/tablero.js';
import { TableroServicio } from '../entities/tablero-servicio.js';
import { hashPassword } from '../modules/auth/services/auth.service.js';

const confirm = process.argv.includes('--confirm');
const password = 'PlanItDemo2026!';

const users: {
  key: string; nombre: string; email: string; rol: User['rol']; activo: boolean;
  zona?: string; cuit?: number; telefono?: number;
}[] = [
  { key: 'admin', nombre: '[Demo] Administrador', email: 'admin@planit-demo.invalid', rol: 'administrador', activo: true },
  { key: 'cliente', nombre: '[Demo] Ana Cliente', email: 'ana@planit-demo.invalid', rol: 'cliente', activo: true },
  { key: 'cliente2', nombre: '[Demo] Luis Cliente', email: 'luis@planit-demo.invalid', rol: 'cliente', activo: true },
  { key: 'centro', nombre: '[Demo] Fiestas Centro', email: 'centro@planit-demo.invalid', rol: 'empresa', activo: true, zona: 'Centro', cuit: 301111111, telefono: 1144441111 },
  { key: 'norte', nombre: '[Demo] Eventos Norte', email: 'norte@planit-demo.invalid', rol: 'empresa', activo: true, zona: 'Zona Norte', cuit: 302222222, telefono: 1144442222 },
  { key: 'inactiva', nombre: '[Demo] Empresa Suspendida', email: 'suspendida@planit-demo.invalid', rol: 'empresa', activo: false, zona: 'Centro', cuit: 303333333, telefono: 1144443333 }
];

const events = [
  { key: 'boda', nombre: '[Demo] Boda', descripcion: 'Evento de prueba para bodas', draft: false },
  { key: 'cumple', nombre: '[Demo] Cumpleanos', descripcion: 'Evento de prueba para cumpleanos', draft: false },
  { key: 'borrador', nombre: '[Demo] Evento borrador', descripcion: 'No visible para clientes', draft: true }
];

const categories = [
  { key: 'musica', evento: 'boda', nombre: '[Demo] Musica' },
  { key: 'catering', evento: 'boda', nombre: '[Demo] Catering' },
  { key: 'decoracion', evento: 'cumple', nombre: '[Demo] Decoracion' }
];

const services = [
  { key: 'djCentro', categoria: 'musica', empresa: 'centro', nombre: '[Demo] DJ para fiestas', estado: 'publicado' as const },
  { key: 'djNorte', categoria: 'musica', empresa: 'norte', nombre: '[Demo] DJ para fiestas', estado: 'publicado' as const },
  { key: 'comida', categoria: 'catering', empresa: 'centro', nombre: '[Demo] Catering para eventos', estado: 'publicado' as const },
  { key: 'decoracion', categoria: 'decoracion', empresa: 'norte', nombre: '[Demo] Decoracion de salon', estado: 'borrador' as const },
  { key: 'enRevision', categoria: 'catering', empresa: 'norte', nombre: '[Demo] Catering esperando aprobacion', estado: 'revision' as const },
  { key: 'suspendido', categoria: 'catering', empresa: 'inactiva', nombre: '[Demo] Catering suspendido', estado: 'publicado' as const }
];

const boards = [
  { key: 'bodaAna', cliente: 'cliente', evento: 'boda', nombre: '[Demo] Boda de Ana' },
  { key: 'cumpleAna', cliente: 'cliente', evento: 'cumple', nombre: '[Demo] Cumple de Ana' },
  { key: 'bodaLuis', cliente: 'cliente2', evento: 'boda', nombre: '[Demo] Boda de Luis' }
];

async function main() {
  if (process.env.NODE_ENV === 'production') throw new Error('No se permite cargar datos demo en produccion');
  if (!confirm) throw new Error('Usa --confirm para insertar los datos demo');

  const orm = await MikroORM.init({ ...mikroOrmConfig, debug: false });
  const created = { usuarios: 0, eventos: 0, categorias: 0, eventoCategoria: 0, servicios: 0, tableros: 0, tableroServicio: 0 };
  const passwordHash = await hashPassword(password);
  const em = orm.em.fork();

  try {
    const demoUsers: Record<string, User> = {};
    const demoEvents: Record<string, Evento> = {};
    const demoCategories: Record<string, Categoria> = {};
    const demoServices: Record<string, Servicio> = {};
    const demoBoards: Record<string, Tablero> = {};

    for (const data of users) {
      let user = await em.findOne(User, { email: data.email });
      if (user && user.rol !== data.rol) throw new Error(`Rol inesperado para ${data.email}`);
      if (!user) {
        user = em.create(User, {
          nombre: data.nombre, email: data.email, password: passwordHash, rol: data.rol,
          activo: data.activo, plan: 'gratis', zona: data.zona, cuit: data.cuit, telefono: data.telefono
        });
        em.persist(user);
        created.usuarios++;
      }
      demoUsers[data.key] = user;
    }
    await em.flush();

    for (const data of events) {
      let event = await em.findOne(Evento, { nombre: data.nombre });
      if (!event) {
        event = em.create(Evento, { nombre: data.nombre, descripcion: data.descripcion, draft: data.draft, creadoEn: new Date() });
        em.persist(event);
        created.eventos++;
      }
      demoEvents[data.key] = event;
    }
    await em.flush();

    for (const data of categories) {
      const event = demoEvents[data.evento];
      let category = await em.findOne(Categoria, { evento: event, nombre: data.nombre });
      if (!category) {
        category = em.create(Categoria, { evento: event, nombre: data.nombre, creadoEn: new Date() });
        em.persist(category);
        created.categorias++;
      }
      demoCategories[data.key] = category;
    }
    await em.flush();

    for (const data of categories) {
      const event = demoEvents[data.evento];
      const category = demoCategories[data.key];
      if (!await em.findOne(EventoCategoria, { evento: event, categoria: category })) {
        em.persist(em.create(EventoCategoria, { evento: event, categoria: category }));
        created.eventoCategoria++;
      }
    }
    await em.flush();

    for (const data of services) {
      const category = demoCategories[data.categoria];
      const company = demoUsers[data.empresa];
      let service = await em.findOne(Servicio, { categoria: category, usuario: company, nombre: data.nombre });
      if (!service) {
        service = em.create(Servicio, {
          categoria: category, usuario: company, nombre: data.nombre,
          descripcion: `Servicio de prueba de ${company.nombre}`, estado: data.estado, creadoEn: new Date()
        });
        em.persist(service);
        created.servicios++;
      }
      demoServices[data.key] = service;
    }
    await em.flush();

    for (const data of boards) {
      const client = demoUsers[data.cliente];
      let board = await em.findOne(Tablero, { cliente: client, nombre: data.nombre });
      if (!board) {
        board = em.create(Tablero, { cliente: client, evento: demoEvents[data.evento], nombre: data.nombre, fechaCreacion: new Date() });
        em.persist(board);
        created.tableros++;
      }
      demoBoards[data.key] = board;
    }
    await em.flush();

    const savedServices = [
      { board: 'bodaAna', service: 'djCentro' },
      { board: 'bodaAna', service: 'comida' },
      { board: 'cumpleAna', service: 'djNorte' },
      { board: 'bodaLuis', service: 'djNorte' }
    ];
    for (const data of savedServices) {
      const board = demoBoards[data.board];
      const service = demoServices[data.service];
      if (!await em.findOne(TableroServicio, { tablero: board, servicio: service })) {
        em.persist(em.create(TableroServicio, { tablero: board, servicio: service, guardadoEn: new Date() }));
        created.tableroServicio++;
      }
    }
    await em.flush();

    console.log('Registros creados:', created);
    console.log(`Usuarios demo: *@planit-demo.invalid | contrasena inicial: ${password}`);
  } finally {
    await orm.close();
  }
}

main().catch(error => {
  console.error('No se pudo cargar el seed demo:', error);
  process.exitCode = 1;
});
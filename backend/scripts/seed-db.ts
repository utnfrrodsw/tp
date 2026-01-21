// scripts/seed-db.ts - VERSIÓN COMPLETA CON SUBASTAS
import 'reflect-metadata';
import 'dotenv/config';
import { MikroORM } from '@mikro-orm/core';
import config from '../src/mikro-orm.config';
import { Usuario, UsuarioRol } from '../src/entities/Usuario';
import { Categoria } from '../src/entities/Categoria';
import { MetodoPago } from '../src/entities/MetodoPago';
import { Descuento } from '../src/entities/Descuento';
import { Camiseta, Talle, CondicionCamiseta } from '../src/entities/Camiseta';
import { Subasta } from '../src/entities/Subasta'; // ✅ AGREGAR
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  const orm = await MikroORM.init(config);
  const em = orm.em.fork();

  try {
    console.log('🧹 Limpiando la base de datos...');
    
    // Limpiar con SQL directo
    await em.getConnection().execute('SET FOREIGN_KEY_CHECKS = 0');
    await em.getConnection().execute('TRUNCATE TABLE oferta'); // ✅ AGREGAR
    await em.getConnection().execute('TRUNCATE TABLE subasta'); // ✅ AGREGAR
    await em.getConnection().execute('TRUNCATE TABLE camiseta');
    await em.getConnection().execute('TRUNCATE TABLE descuento');
    await em.getConnection().execute('TRUNCATE TABLE metodo_pago');
    await em.getConnection().execute('TRUNCATE TABLE categoria');
    await em.getConnection().execute('TRUNCATE TABLE usuario');
    await em.getConnection().execute('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('✅ Base de datos limpiada con SQL directo');
    console.log('🌱 Iniciando la siembra de datos...');

    // 1. Crear usuarios
    const adminUser = new Usuario(
      'Juan',
      'Pérez',
      'admin@tiendaretro.com',
      await bcrypt.hash('admin123', 10),
      'Av. Corrientes 1234, Buenos Aires',
      '+54 11 1234-5678',
      UsuarioRol.ADMINISTRADOR
    );

    const user1 = new Usuario(
      'María',
      'González',
      'maria@email.com',
      await bcrypt.hash('user123', 10),
      'Calle San Martín 567, Rosario',
      '+54 341 9876-5432'
    );

    const user2 = new Usuario(
      'Carlos',
      'López',
      'carlos@email.com',
      await bcrypt.hash('user456', 10),
      'Av. Libertador 890, Córdoba',
      '+54 351 5555-4444'
    );

    em.persist([adminUser, user1, user2]);

    // 2. Crear categorías
    const categoriaClubs = new Categoria('Clubes Argentinos', 'Camisetas de clubes de fútbol argentino');
    const categoriaSelecciones = new Categoria('Selecciones', 'Camisetas de selecciones nacionales');
    const categoriaEuropa = new Categoria('Clubes Europeos', 'Camisetas de clubes europeos');
    const categoriaRetro = new Categoria('Retro/Vintage', 'Camisetas clásicas y vintage');

    em.persist([categoriaClubs, categoriaSelecciones, categoriaEuropa, categoriaRetro]);

    // 3. Crear métodos de pago
    const efectivo = new MetodoPago('Efectivo', 'Pago en efectivo contra entrega');
    efectivo.activo = true; // ✅ Asegurar que esté activo
    
    const transferencia = new MetodoPago('Transferencia Bancaria', 'Transferencia bancaria - CBU: 0000003100010000000001 - Alias: TIENDA.RETRO');
    transferencia.activo = true;
    
    const tarjeta = new MetodoPago('Tarjeta de Crédito', 'Pago con tarjeta (próximamente)');
    tarjeta.activo = false; // ✅ Desactivar por ahora
    
    const mercadoPago = new MetodoPago('Mercado Pago', 'Pago a través de Mercado Pago (próximamente)');
    mercadoPago.activo = false; // ✅ Desactivar por ahora

    em.persist([efectivo, transferencia, tarjeta, mercadoPago]);

    // 4. Crear descuentos
    const descuento1 = new Descuento(
      'RETRO10',
      'Descuento del 10% en camisetas retro',
      10,
      new Date('2024-01-01'),
      new Date('2024-12-31'),
      true
    );

    const descuento2 = new Descuento(
      'VINTAGE20',
      'Descuento del 20% en camisetas vintage',
      20,
      new Date('2024-06-01'),
      new Date('2024-09-30'),
      true
    );

    em.persist([descuento1, descuento2]);

    // Guardar primero para obtener IDs
    await em.flush();

    // 5. Crear camisetas
    const camiseta1 = new Camiseta(
      'Camiseta Argentina Mundial 1986',
      'Camiseta histórica de Argentina del Mundial de México 1986',
      'Argentina',
      '1986',
      Talle.L,
      CondicionCamiseta.VINTAGE,
      'argentina_1986.jpg', // ✅ Sin /uploads/
      25000,
      adminUser
    );
    camiseta1.categoria = categoriaSelecciones;

    const camiseta2 = new Camiseta(
      'Camiseta Boca Juniors 1981',
      'Camiseta clásica de Boca Juniors de la década del 80',
      'Boca Juniors',
      '1981',
      Talle.M,
      CondicionCamiseta.USADA,
      'boca_1981.jpg', // ✅ Sin /uploads/
      18000,
      adminUser
    );
    camiseta2.categoria = categoriaClubs;

    const camiseta3 = new Camiseta(
      'Camiseta Barcelona 1992',
      'Camiseta del Dream Team del Barcelona',
      'FC Barcelona',
      '1992',
      Talle.XL,
      CondicionCamiseta.VINTAGE,
      'barcelona_1992.jpeg', // ✅ Sin /uploads/
      30000,
      adminUser
    );
    camiseta3.categoria = categoriaEuropa;

    const camiseta4 = new Camiseta(
      'Camiseta River Plate 1986',
      'Camiseta histórica de River Plate',
      'River Plate',
      '1986',
      Talle.L,
      CondicionCamiseta.NUEVA,
      'river_1986.jpeg', // ✅ Sin /uploads/
      22000,
      adminUser
    );
    camiseta4.categoria = categoriaClubs;

    const camiseta5 = new Camiseta(
      'Camiseta Brasil 1970',
      'Camiseta del tricampeón mundial Brasil 1970 - SUBASTA',
      'Brasil',
      '1970',
      Talle.M,
      CondicionCamiseta.VINTAGE,
      'brasil_1970.jpg', // ✅ Sin /uploads/
      35000,
      adminUser
    );
    camiseta5.esSubasta = true;
    camiseta5.categoria = categoriaSelecciones;

    const camiseta6 = new Camiseta(
      'Camiseta Italia 1982',
      'Camiseta del campeón mundial Italia 1982 - SUBASTA',
      'Italia',
      '1982',
      Talle.L,
      CondicionCamiseta.VINTAGE,
      'italia_1982.jpg', // ✅ Sin /uploads/
      40000,
      adminUser
    );
    camiseta6.esSubasta = true;
    camiseta6.categoria = categoriaSelecciones;

    em.persist([camiseta1, camiseta2, camiseta3, camiseta4, camiseta5, camiseta6]);

    // Guardar camisetas primero
    await em.flush();

    // ✅ 6. CREAR SUBASTAS (NUEVO)
    const ahora = new Date();
    const fechaFin7Dias = new Date();
    fechaFin7Dias.setDate(ahora.getDate() + 7);

    const fechaFin3Dias = new Date();
    fechaFin3Dias.setDate(ahora.getDate() + 3);

    const subasta1 = new Subasta(
      ahora,
      fechaFin7Dias,
      35000, // Precio inicial de camiseta5
      camiseta5
    );

    const subasta2 = new Subasta(
      ahora,
      fechaFin3Dias,
      40000, // Precio inicial de camiseta6
      camiseta6
    );

    em.persist([subasta1, subasta2]);

    await em.flush();

    console.log('✅ Datos sembrados correctamente:');
    console.log('- 3 usuarios creados (CON CONTRASEÑAS HASHEADAS)');
    console.log('- 4 categorías creadas');
    console.log('- 4 métodos de pago creados');
    console.log('- 2 descuentos creados');
    console.log('- 6 camisetas creadas (2 en subasta)');
    console.log('- 2 subastas activas creadas'); // ✅ NUEVO
    console.log('');
    console.log('🔑 Credenciales de prueba:');
    console.log('   Admin: admin@tiendaretro.com / admin123');
    console.log('   Usuario: maria@email.com / user123');
    console.log('');
    console.log('🔨 Subastas creadas:');
    console.log(`   - Brasil 1970: Termina ${fechaFin7Dias.toLocaleDateString()}`);
    console.log(`   - Italia 1982: Termina ${fechaFin3Dias.toLocaleDateString()}`);

  } catch (error) {
    console.error('❌ Error al sembrar datos:', error);
  } finally {
    await orm.close();
  }
}

seedDatabase();

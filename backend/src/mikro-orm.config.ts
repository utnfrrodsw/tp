import { defineConfig } from '@mikro-orm/mysql';
import { Usuario } from './entities/Usuario';
import { Camiseta } from './entities/Camiseta';
import { Subasta } from './entities/Subasta';
import { Oferta } from './entities/Oferta';
import { Compra } from './entities/Compra';
import { CompraItem } from './entities/CompraItem'; 
import { MetodoPago } from './entities/MetodoPago';
import { Pago } from './entities/Pago';
import { Categoria } from './entities/Categoria';
import { Descuento } from './entities/Descuento';

export default defineConfig({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  dbName: process.env.DB_NAME || 'tienda_retro',
  entities: [
    Usuario,
    Camiseta,
    Subasta,
    Oferta,
    Compra,
    CompraItem, 
    MetodoPago,
    Pago,
    Categoria,
    Descuento
  ],
  discovery: {
    warnWhenNoEntities: false,
  },
  debug: process.env.NODE_ENV !== 'production',
});

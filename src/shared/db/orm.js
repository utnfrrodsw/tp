// src/shared/db/orm.ts
import { MikroORM } from '@mikro-orm/core';
import { Usuario } from '../../entities/usuario.entity';
import { Libro } from '../../entities/libro.entity';
import { Resena } from '../../entities/resena.entity';
import { Categoria } from '../../entities/categoria.entity';
import { Autor } from '../../entities/autor.entity';
export const initORM = async () => {
    return await MikroORM.init({
        dbName: 'nombre_de_tu_base_de_datos',
        user: 'tu_usuario',
        password: 'tu_contraseña',
        host: 'localhost',
        port: 5432,
        entities: [Usuario, Libro, Resena, Categoria, Autor],
        debug: true,
    });
};

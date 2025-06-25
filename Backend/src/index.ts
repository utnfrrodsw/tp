import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/mysql'
import config from './shared/mikro-orm.config'
import { Usuario } from './entities/usuario.entity'

async function main(){
    const orm = await MikroORM.init(config);
    const em = orm.em.fork();

    const user = new Usuario();
    user.username = "Joaquina";
    user.email = "joagm@test.com";
    user.id=1;
    user.password="123";

    await orm.getSchemaGenerator().ensureDatabase();
    await orm.getSchemaGenerator().updateSchema();

    await em.persistAndFlush(user);

    const users = await em.find(Usuario, {});
    console.log(users);

    

    await orm.close();

}

main().catch(console.error);
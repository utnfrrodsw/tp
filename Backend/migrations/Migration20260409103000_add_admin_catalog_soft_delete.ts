import { Migration } from '@mikro-orm/migrations';

export class Migration20260409103000_add_admin_catalog_soft_delete extends Migration {

  private addColumnIfMissing(table: string, column: string, definition: string): void {
    this.addSql(`set @col_exists = (select count(*) from information_schema.columns where table_schema = database() and table_name = '${table}' and column_name = '${column}');`);
    this.addSql(`set @ddl = if(@col_exists = 0, 'alter table ${table} add ${column} ${definition}', 'select 1');`);
    this.addSql('prepare stmt from @ddl;');
    this.addSql('execute stmt;');
    this.addSql('deallocate prepare stmt;');
  }

  private addIndexIfMissing(table: string, indexName: string, expression: string): void {
    this.addSql(`set @idx_exists = (select count(*) from information_schema.statistics where table_schema = database() and table_name = '${table}' and index_name = '${indexName}');`);
    this.addSql(`set @ddl = if(@idx_exists = 0, 'alter table ${table} add index ${indexName}(${expression})', 'select 1');`);
    this.addSql('prepare stmt from @ddl;');
    this.addSql('execute stmt;');
    this.addSql('deallocate prepare stmt;');
  }

  private dropIndexIfExists(table: string, indexName: string): void {
    this.addSql(`set @idx_exists = (select count(*) from information_schema.statistics where table_schema = database() and table_name = '${table}' and index_name = '${indexName}');`);
    this.addSql(`set @ddl = if(@idx_exists > 0, 'alter table ${table} drop index ${indexName}', 'select 1');`);
    this.addSql('prepare stmt from @ddl;');
    this.addSql('execute stmt;');
    this.addSql('deallocate prepare stmt;');
  }

  private dropColumnIfExists(table: string, column: string): void {
    this.addSql(`set @col_exists = (select count(*) from information_schema.columns where table_schema = database() and table_name = '${table}' and column_name = '${column}');`);
    this.addSql(`set @ddl = if(@col_exists > 0, 'alter table ${table} drop column ${column}', 'select 1');`);
    this.addSql('prepare stmt from @ddl;');
    this.addSql('execute stmt;');
    this.addSql('deallocate prepare stmt;');
  }

  override async up(): Promise<void> {
    this.addColumnIfMissing('libro', 'created_by_admin', 'tinyint(1) not null default false');
    this.addColumnIfMissing('libro', 'activo', 'tinyint(1) not null default true');
    this.addColumnIfMissing('libro', 'deleted_at', 'datetime null');
    this.addIndexIfMissing('libro', 'libro_created_by_admin_index', '`created_by_admin`');
    this.addIndexIfMissing('libro', 'libro_activo_index', '`activo`');

    this.addColumnIfMissing('autor', 'created_by_admin', 'tinyint(1) not null default false');
    this.addColumnIfMissing('autor', 'activo', 'tinyint(1) not null default true');
    this.addColumnIfMissing('autor', 'deleted_at', 'datetime null');
    this.addIndexIfMissing('autor', 'autor_created_by_admin_index', '`created_by_admin`');
    this.addIndexIfMissing('autor', 'autor_activo_index', '`activo`');

    // Backfill: en el esquema actual `source` ya no existe, usar `external_id` como criterio.
    this.addSql('update `libro` set `created_by_admin` = true where `external_id` is null;');
    this.addSql('update `autor` set `created_by_admin` = true;');
  }

  override async down(): Promise<void> {
    this.dropIndexIfExists('libro', 'libro_created_by_admin_index');
    this.dropIndexIfExists('libro', 'libro_activo_index');
    this.dropColumnIfExists('libro', 'created_by_admin');
    this.dropColumnIfExists('libro', 'activo');
    this.dropColumnIfExists('libro', 'deleted_at');

    this.dropIndexIfExists('autor', 'autor_created_by_admin_index');
    this.dropIndexIfExists('autor', 'autor_activo_index');
    this.dropColumnIfExists('autor', 'created_by_admin');
    this.dropColumnIfExists('autor', 'activo');
    this.dropColumnIfExists('autor', 'deleted_at');
  }

}

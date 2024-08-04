create database if not exists AppDB;

use AppDB;


create user if not exists dsw@'%' identified by 'dsw';
grant select, update, insert, delete on AppDB.* to dsw@'%';


create table if not exists `AppDB`.`autors` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NULL,
  `apellido` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));

create table if not exists `AppDB`.`autorLibros` (
  `autorId` INT UNSIGNED NOT NULL,
  `libroNombre` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`autorId`, `libroNombre`),
  CONSTRAINT `fk_autorLibro_autor`
    FOREIGN KEY (`autorId`)
    REFERENCES `AppDB`.`autors` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);

insert into AppDB.autors values(1,'Jorge Luis','Borges');
insert into AppDB.autorLibros values(1,'Ficciones');
insert into AppDB.autorLibros values(1,'El sur');

CREATE DATABASE IF NOT EXISTS `fastservices`
40100 DEFAULT CHARACTER SET utf8mb3 
80016 DEFAULT ENCRYPTION='N' 
;
USE `fastservices`;
-- MySQL dump 10.13 Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost Database: fastservices

---

-- Server version 8.0.34
40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT 
;
40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS 
;
40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION 
;
50503 SET NAMES utf8 
;
40103 SET @OLD_TIME_ZONE=@@TIME_ZONE 
;
40103 SET TIME_ZONE='+00:00' 
;
40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 
;
40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 
;
40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' 
;
40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 
;
--
-- Table structure for table `anuncio`
--
DROP TABLE IF EXISTS `anuncio`;
40101 SET @saved_cs_client = @@character_set_client 
;
50503 SET character_set_client = utf8mb4 
;
CREATE TABLE `anuncio` (
`idAnuncio` int NOT NULL AUTO_INCREMENT,
`fechaHora` varchar(45) NOT NULL,
`titulo` varchar(45) NOT NULL,
`descripcion` varchar(255) NOT NULL,
`fotos` varchar(45) NOT NULL,
`idUsuario` int NOT NULL,
`adress` int NOT NULL,
PRIMARY KEY (`idAnuncio`),
KEY `cliente` (`idUsuario`, `adress`),
CONSTRAINT `cliente` FOREIGN KEY (`idUsuario`, `adress`) REFERENCES `direccion` (`idUsuario`, `idDireccion`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;
40101 SET character_set_client = @saved_cs_client 
;
--
-- Dumping data for table `anuncio`
--
LOCK TABLES `anuncio` WRITE;
40000 ALTER TABLE `anuncio` DISABLE KEYS 
;
40000 ALTER TABLE `anuncio` ENABLE KEYS 
;
UNLOCK TABLES;
--
-- Table structure for table `anuncio_profesiones`
--
DROP TABLE IF EXISTS `anuncio_profesiones`;
40101 SET @saved_cs_client = @@character_set_client 
;
50503 SET character_set_client = utf8mb4 
;
CREATE TABLE `anuncio_profesiones` (
`idanuncio` int NOT NULL,
`idprofesiones` int NOT NULL,
PRIMARY KEY (`idanuncio`, `idprofesiones`),
UNIQUE KEY `idprofesiones_UNIQUE` (`idprofesiones`),
CONSTRAINT `anuncio_prof` FOREIGN KEY (`idanuncio`) REFERENCES `anuncio` (`idAnuncio`),
CONSTRAINT `profesion_anun` FOREIGN KEY (`idprofesiones`) REFERENCES `profesion` (`idProfesion`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;
40101 SET character_set_client = @saved_cs_client 
;
--
-- Dumping data for table `anuncio_prof esiones`
--
LOCK TABLES `anuncio_profesiones` WRITE;
40000 ALTER TABLE `anuncio_profesiones` DISABLE KEYS 
;
40000 ALTER TABLE `anuncio_profesiones` ENABLE KEYS 
;
UNLOCK TABLES;
--
-- Table structure for table `direccion`
--
DROP TABLE IF EXISTS `direccion`;
40101 SET @saved_cs_client = @@character_set_client 
;
50503 SET character_set_client = utf8mb4 
;
CREATE TABLE `direccion` (
`idDireccion` int NOT NULL AUTO_INCREMENT,
`calle` varchar(45) NOT NULL,
`numero` varchar(45) NOT NULL,
`piso` int DEFAULT NULL,
`depto` int DEFAULT NULL,
`idUsuario` int NOT NULL,
`codPostal` int NOT NULL,
PRIMARY KEY (`idDireccion`),
KEY `usuario` (`idUsuario`),
KEY `cp` (`codPostal`),
CONSTRAINT `cp` FOREIGN KEY (`codPostal`) REFERENCES `localidad` (`codPostal`),
CONSTRAINT `usuario` FOREIGN KEY (`idUsuario`) REFERENCES `user` (`idUser`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;
40101 SET character_set_client = @saved_cs_client 
;
--
-- Dumping data for table `direccion`
--
LOCK TABLES `direccion` WRITE;
40000 ALTER TABLE `direccion` DISABLE KEYS 
;
40000 ALTER TABLE `direccion` ENABLE KEYS 
;
UNLOCK TABLES;
--
-- Table structure for table `historicoresenia`
--
DROP TABLE IF EXISTS `historicoresenia`;
40101 SET @saved_cs_client = @@character_set_client 
;
50503 SET character_set_client = utf8mb4 
;
CREATE TABLE `historicoresenia` (
`idPrestador` int NOT NULL,
`fechaRes` datetime NOT NULL,
`resenia` int NOT NULL,
PRIMARY KEY (`idPrestador`),
CONSTRAINT `prestador_resenia` FOREIGN KEY (`idPrestador`) REFERENCES `user` (`idUser`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;
40101 SET character_set_client = @saved_cs_client 
;
--
-- Dumping data for table `historicoresenia`
--
LOCK TABLES `historicoresenia` WRITE;
40000 ALTER TABLE `historicoresenia` DISABLE KEYS 
;
40000 ALTER TABLE `historicoresenia` ENABLE KEYS 
;
UNLOCK TABLES;
--
-- Table structure for table `horariospresupuesto`
--
DROP TABLE IF EXISTS `horariospresupuesto`;
40101 SET @saved_cs_client = @@character_set_client 
;
50503 SET character_set_client = utf8mb4 
;
CREATE TABLE `horariospresupuesto` (
`idAnuncio` int NOT NULL,
`idPrestador` int NOT NULL,
`horario` datetime NOT NULL,
PRIMARY KEY (`idAnuncio`, `idPrestador`),
UNIQUE KEY `horario_UNIQUE` (`horario`),
CONSTRAINT `presupuesto` FOREIGN KEY (`idAnuncio`, `idPrestador`) REFERENCES `presupuesto` (`idAnuncio`, `idPrestador`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;
40101 SET character_set_client = @saved_cs_client 
;
--
-- Dumping data for table `horariospresupuesto`
--
LOCK TABLES `horariospresupuesto` WRITE;
40000 ALTER TABLE `horariospresupuesto` DISABLE KEYS 
;
40000 ALTER TABLE `horariospresupuesto` ENABLE KEYS 
;
UNLOCK TABLES;
--
-- Table structure for table `localidad`
--
DROP TABLE IF EXISTS `localidad`;
40101 SET @saved_cs_client = @@character_set_client 
;
50503 SET character_set_client = utf8mb4 
;
CREATE TABLE `localidad` (
`codPostal` int NOT NULL,
`nombre` varchar(45) NOT NULL,
`provincia` varchar(45) NOT NULL,
PRIMARY KEY (`codPostal`),
UNIQUE KEY `codPostal_UNIQUE` (`codPostal`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;
40101 SET character_set_client = @saved_cs_client 
;
--
-- Dumping data for table `localidad`
--
LOCK TABLES `localidad` WRITE;
40000 ALTER TABLE `localidad` DISABLE KEYS 
;
40000 ALTER TABLE `localidad` ENABLE KEYS 
;
UNLOCK TABLES;
--
-- Table structure for table `prestador_profesiones`
--
DROP TABLE IF EXISTS `prestador_profesiones`;
40101 SET @saved_cs_client = @@character_set_client 
;
50503 SET character_set_client = utf8mb4 
;
CREATE TABLE `prestador_profesiones` (
`idprestador` int NOT NULL,
`idProfesion` int NOT NULL,
PRIMARY KEY (`idprestador`, `idProfesion`),
KEY `profesion_pres` (`idProfesion`),
CONSTRAINT `prestador_prof` FOREIGN KEY (`idprestador`) REFERENCES `user` (`idUser`),
CONSTRAINT `profesion_pres` FOREIGN KEY (`idProfesion`) REFERENCES `profesion` (`idProfesion`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;
40101 SET character_set_client = @saved_cs_client 
;
--
-- Dumping data for table `prestador_profesiones`
--
LOCK TABLES `prestador_profesiones` WRITE;
40000 ALTER TABLE `prestador_profesiones` DISABLE KEYS 
;
40000 ALTER TABLE `prestador_profesiones` ENABLE KEYS 
;
UNLOCK TABLES;
--
-- Table structure for table `presupuesto`
--
DROP TABLE IF EXISTS `presupuesto`;
40101 SET @saved_cs_client = @@character_set_client 
;
50503 SET character_set_client = utf8mb4 
;
CREATE TABLE `presupuesto` (
`idAnuncio` int NOT NULL,
`idPrestador` int NOT NULL,
`costoMateriales` varchar(45) DEFAULT NULL,
`costoXHora` varchar(45) DEFAULT NULL,
PRIMARY KEY (`idAnuncio`, `idPrestador`),
KEY `prestador` (`idPrestador`),
CONSTRAINT `anuncio` FOREIGN KEY (`idAnuncio`) REFERENCES `anuncio` (`idAnuncio`),
CONSTRAINT `prestador` FOREIGN KEY (`idPrestador`) REFERENCES `user` (`idUser`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;
40101 SET character_set_client = @saved_cs_client 
;
--
-- Dumping data for table `presupuesto`
--
LOCK TABLES `presupuesto` WRITE;
40000 ALTER TABLE `presupuesto` DISABLE KEYS 
;
40000 ALTER TABLE `presupuesto` ENABLE KEYS 
;
UNLOCK TABLES;
--
-- Table structure for table `profesion`
--
DROP TABLE IF EXISTS `profesion`;
40101 SET @saved_cs_client = @@character_set_client 
;
50503 SET character_set_client = utf8mb4 
;
CREATE TABLE `profesion` (
`idProfesion` int NOT NULL,
`nombreProfesion` varchar(255) NOT NULL,
PRIMARY KEY (`idProfesion`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;
40101 SET character_set_client = @saved_cs_client 
;
--
-- Dumping data for table `profesion`
--
LOCK TABLES `profesion` WRITE;
40000 ALTER TABLE `profesion` DISABLE KEYS 
;
40000 ALTER TABLE `profesion` ENABLE KEYS 
;
UNLOCK TABLES;
--
-- Table structure for table `servicio`
--
DROP TABLE IF EXISTS `servicio`;
40101 SET @saved_cs_client = @@character_set_client 
;
50503 SET character_set_client = utf8mb4 
;
CREATE TABLE `servicio` (
`idAnuncio` int NOT NULL,
`idPrestador` int NOT NULL,
`fechaHora` datetime NOT NULL,
`costoTotal` double NOT NULL,
PRIMARY KEY (`idAnuncio`, `idPrestador`),
CONSTRAINT `presupuesto_service` FOREIGN KEY (`idAnuncio`, `idPrestador`) REFERENCES `presupuesto` (`idAnuncio`, `idPrestador`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;
40101 SET character_set_client = @saved_cs_client 
;
--
-- Dumping data for table `servicio`
--
LOCK TABLES `servicio` WRITE;
40000 ALTER TABLE `servicio` DISABLE KEYS 
;
40000 ALTER TABLE `servicio` ENABLE KEYS 
;
UNLOCK TABLES;
--
-- Table structure for table `user`
--
DROP TABLE IF EXISTS `user`;
40101 SET @saved_cs_client = @@character_set_client 
;
50503 SET character_set_client = utf8mb4 
;
CREATE TABLE `user` (
`idUser` int NOT NULL AUTO_INCREMENT,
`surname` varchar(45) NOT NULL,
`name` varchar(16) NOT NULL,
`email` varchar(255) NOT NULL,
`password` varchar(32) NOT NULL,
`birthDate` date DEFAULT NULL,
`phoneNumber` int DEFAULT NULL,
`isPrestador` tinyint DEFAULT '0',
PRIMARY KEY (`idUser`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3;
40101 SET character_set_client = @saved_cs_client 
;
--
-- Dumping data for table `user`
--
LOCK TABLES `user` WRITE;
40000 ALTER TABLE `user` DISABLE KEYS 
;
40000 ALTER TABLE `user` ENABLE KEYS 
;
UNLOCK TABLES;
40103 SET TIME_ZONE=@OLD_TIME_ZONE 
;
40101 SET SQL_MODE=@OLD_SQL_MODE 
;
40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS 
;
40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS 
;
40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT 
;
40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS 
;
40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION 
;
40111 SET SQL_NOTES=@OLD_SQL_NOTES 
;
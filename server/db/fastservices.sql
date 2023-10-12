-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: 100.93.197.20    Database: fastservices
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `direccion`
--

DROP TABLE IF EXISTS `direccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direccion` (
  `idDireccion` int NOT NULL AUTO_INCREMENT,
  `calle` varchar(45) NOT NULL,
  `numero` varchar(45) NOT NULL,
  `piso` varchar(10) DEFAULT NULL,
  `dpto` varchar(10) DEFAULT NULL,
  `idUsuario` int DEFAULT NULL,
  `codPostal` int DEFAULT NULL,
  PRIMARY KEY (`idDireccion`),
  KEY `usuario` (`idUsuario`),
  KEY `cp` (`codPostal`),
  CONSTRAINT `cp` FOREIGN KEY (`codPostal`) REFERENCES `localidad` (`codPostal`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `fk_direccion_cliente` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direccion`
--

LOCK TABLES `direccion` WRITE;
/*!40000 ALTER TABLE `direccion` DISABLE KEYS */;
INSERT INTO `direccion` VALUES (1,'Rivadavia','25','1','2',2,2500);
/*!40000 ALTER TABLE `direccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historicoresenia`
--

DROP TABLE IF EXISTS `historicoresenia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historicoresenia` (
  `idPrestador` int NOT NULL,
  `fechaRes` datetime NOT NULL,
  `resenia` int NOT NULL,
  PRIMARY KEY (`idPrestador`),
  CONSTRAINT `fk_prestador` FOREIGN KEY (`idPrestador`) REFERENCES `usuario` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historicoresenia`
--

LOCK TABLES `historicoresenia` WRITE;
/*!40000 ALTER TABLE `historicoresenia` DISABLE KEYS */;
/*!40000 ALTER TABLE `historicoresenia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horariospresupuesto`
--

DROP TABLE IF EXISTS `horariospresupuesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horariospresupuesto` (
  `idAnuncio` int NOT NULL,
  `idPrestador` int NOT NULL,
  `horario` datetime NOT NULL,
  PRIMARY KEY (`idAnuncio`,`idPrestador`),
  UNIQUE KEY `horario_UNIQUE` (`horario`),
  CONSTRAINT `fk_horariospresupuesto_1` FOREIGN KEY (`idAnuncio`, `idPrestador`) REFERENCES `presupuesto` (`idAnuncio`, `idPrestador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horariospresupuesto`
--

LOCK TABLES `horariospresupuesto` WRITE;
/*!40000 ALTER TABLE `horariospresupuesto` DISABLE KEYS */;
/*!40000 ALTER TABLE `horariospresupuesto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `localidad`
--

DROP TABLE IF EXISTS `localidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `localidad` (
  `codPostal` int NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `provincia` varchar(45) NOT NULL,
  PRIMARY KEY (`codPostal`),
  UNIQUE KEY `codPostal_UNIQUE` (`codPostal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `localidad`
--

LOCK TABLES `localidad` WRITE;
/*!40000 ALTER TABLE `localidad` DISABLE KEYS */;
INSERT INTO `localidad` VALUES (2500,'Cañada de Gómez','Santa Fe');
/*!40000 ALTER TABLE `localidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prestador_profesiones`
--

DROP TABLE IF EXISTS `prestador_profesiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestador_profesiones` (
  `idprestador` int NOT NULL,
  `idProfesion` int NOT NULL,
  PRIMARY KEY (`idprestador`,`idProfesion`),
  KEY `profesion_pres` (`idProfesion`),
  CONSTRAINT `fk_prestador_profesiones_1` FOREIGN KEY (`idprestador`) REFERENCES `usuario` (`idUsuario`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `profesion_pres` FOREIGN KEY (`idProfesion`) REFERENCES `profesion` (`idProfesion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestador_profesiones`
--

LOCK TABLES `prestador_profesiones` WRITE;
/*!40000 ALTER TABLE `prestador_profesiones` DISABLE KEYS */;
/*!40000 ALTER TABLE `prestador_profesiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presupuesto`
--

DROP TABLE IF EXISTS `presupuesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presupuesto` (
  `idAnuncio` int NOT NULL,
  `idPrestador` int NOT NULL,
  `costoMateriales` varchar(45) DEFAULT NULL,
  `costoXHora` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idAnuncio`,`idPrestador`),
  KEY `fk_presupuesto_prest_idx` (`idPrestador`),
  CONSTRAINT `anuncio` FOREIGN KEY (`idAnuncio`) REFERENCES `solicitud` (`idSolicitud`),
  CONSTRAINT `fk_presupuesto_prest` FOREIGN KEY (`idPrestador`) REFERENCES `usuario` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presupuesto`
--

LOCK TABLES `presupuesto` WRITE;
/*!40000 ALTER TABLE `presupuesto` DISABLE KEYS */;
/*!40000 ALTER TABLE `presupuesto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profesion`
--

DROP TABLE IF EXISTS `profesion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesion` (
  `idProfesion` int NOT NULL,
  `nombreProfesion` varchar(255) NOT NULL,
  PRIMARY KEY (`idProfesion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesion`
--

LOCK TABLES `profesion` WRITE;
/*!40000 ALTER TABLE `profesion` DISABLE KEYS */;
/*!40000 ALTER TABLE `profesion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicio`
--

DROP TABLE IF EXISTS `servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicio` (
  `idAnuncio` int NOT NULL,
  `idPrestador` int NOT NULL,
  `fechaHora` datetime NOT NULL,
  `costoTotal` double NOT NULL,
  PRIMARY KEY (`idAnuncio`,`idPrestador`),
  CONSTRAINT `presupuesto_service` FOREIGN KEY (`idAnuncio`, `idPrestador`) REFERENCES `presupuesto` (`idAnuncio`, `idPrestador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicio`
--

LOCK TABLES `servicio` WRITE;
/*!40000 ALTER TABLE `servicio` DISABLE KEYS */;
/*!40000 ALTER TABLE `servicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud`
--

DROP TABLE IF EXISTS `solicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitud` (
  `idSolicitud` int NOT NULL AUTO_INCREMENT,
  `fechaHora` datetime NOT NULL,
  `titulo` varchar(45) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `fotos` blob,
  `estado` varchar(20) NOT NULL DEFAULT 'Activo',
  `idDireccion` int NOT NULL,
  PRIMARY KEY (`idSolicitud`),
  KEY `cliente` (`idDireccion`),
  CONSTRAINT `cliente` FOREIGN KEY (`idDireccion`) REFERENCES `direccion` (`idDireccion`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud`
--

LOCK TABLES `solicitud` WRITE;
/*!40000 ALTER TABLE `solicitud` DISABLE KEYS */;
INSERT INTO `solicitud` VALUES (1,'2023-01-01 00:00:00','electricista','fontanero',NULL,'1',1);
/*!40000 ALTER TABLE `solicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud_profesiones`
--

DROP TABLE IF EXISTS `solicitud_profesiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitud_profesiones` (
  `idSolicitud` int NOT NULL,
  `idProfesion` int NOT NULL,
  PRIMARY KEY (`idSolicitud`,`idProfesion`),
  KEY `profesion_anun` (`idProfesion`),
  CONSTRAINT `profesion_anun` FOREIGN KEY (`idProfesion`) REFERENCES `profesion` (`idProfesion`),
  CONSTRAINT `solicitud_anun` FOREIGN KEY (`idSolicitud`) REFERENCES `solicitud` (`idSolicitud`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud_profesiones`
--

LOCK TABLES `solicitud_profesiones` WRITE;
/*!40000 ALTER TABLE `solicitud_profesiones` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitud_profesiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token` (
  `idToken` int NOT NULL AUTO_INCREMENT,
  `token` varchar(1000) NOT NULL,
  PRIMARY KEY (`idToken`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk0OTIyNSwiZXhwIjoxNjk2OTUyODI1fQ.t-A516BCAIKuTxwB_QLNjoOazTUYA720xb76dmzBCPw'),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk1MDc2MSwiZXhwIjoxNjk2OTU0MzYxfQ.mskrJfidmCics8xQkBqb_SgNtddeR2R7ArcO5lFKK8A'),(3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk1MDc2MywiZXhwIjoxNjk2OTU0MzYzfQ.dWE7P2JyrF7JCMSPnV70Gd3D9bfG7W-uOujZhysd9fo'),(4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk1MDc2MywiZXhwIjoxNjk2OTU0MzYzfQ.dWE7P2JyrF7JCMSPnV70Gd3D9bfG7W-uOujZhysd9fo'),(5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk1MDgxOCwiZXhwIjoxNjk2OTU0NDE4fQ.FEuggBx_r2fu9auixU00XBfvg5CEAbEJFtdqxZSkfho'),(6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk1MDgzMiwiZXhwIjoxNjk2OTU0NDMyfQ.3GtO3kG0kT2dcChaxNk7kolXyzdQhUaCCEnLokF13R0'),(7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk1MDgzNSwiZXhwIjoxNjk2OTU0NDM1fQ.Oqj7TDi6pDIqz1tFbPgfz8bQd0_nPxKjIge8uiyVUjc'),(8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk1MDg3NCwiZXhwIjoxNjk2OTU0NDc0fQ.f7P83C41S_ReJpEy76SQwW0j7--gW8EkJ8htpNDX7Ao'),(9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk1MDkwMCwiZXhwIjoxNjk2OTU0NTAwfQ.ULItO3btF4frkEdyAyNutuYY7uxqRzbWGrOJqyTUOeE'),(10,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk1MDk2NiwiZXhwIjoxNjk2OTU0NTY2fQ.8_LcsUWERtGSHqRmorceE7hGeVSswk3jiW6IoqcvsA4'),(11,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk1MTAwNCwiZXhwIjoxNjk2OTU0NjA0fQ.ce1oYb4Zd4Xvz6Yd6SAxW0pZA1aHjTHfbcAGNwx8Ooc'),(12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk1MTA0NSwiZXhwIjoxNjk2OTU0NjQ1fQ.pRXmuaMlrA4bDYckYuuQXhyf9fTLXyKxo9GV4iIwRik'),(13,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2MTI2NiwiZXhwIjoxNjk2OTY0ODY2fQ.kRg2wFQcf0Blkiyfe2vxJNXyD0XDEYz8Ney9mNKTxKI'),(14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2MTYxMywiZXhwIjoxNjk2OTY1MjEzfQ.9MaM7o5aVqFBYaERZu8nIFKrpDCFKT6oBLIdJybvTHE'),(15,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2MjkxNSwiZXhwIjoxNjk2OTY2NTE1fQ.8E_ExyMraZi3DrGoNZb2AkUsX089NMyBlzry05DfEyY'),(16,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2NjA0MCwiZXhwIjoxNjk2OTY5NjQwfQ.MwOrUszmhGMXVPr0bZpNfWA8iZqwyOP978pjR_NykoU'),(17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2NjM3MCwiZXhwIjoxNjk2OTY5OTcwfQ.PCY7XNVRs_7t_bk4D1ckZ3a9Wqn4-OH1oVCxcQyLIfw'),(18,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2NjgwMCwiZXhwIjoxNjk2OTcwNDAwfQ.YnVllCLMeGd7oRogUGbggUh1oYOAPGEb4S49kleu0Mo'),(19,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2NjkzOCwiZXhwIjoxNjk2OTcwNTM4fQ.E96LyhdHV5hysoJGkKyLQXefluSbN7DrtQtbB-y_aEM'),(20,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2Njk3MCwiZXhwIjoxNjk2OTcwNTcwfQ.7KUqFgCc-pDfzz_JzWjtEQ0FVjWXsUm9e95HIWG21x0'),(21,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2NzA1MiwiZXhwIjoxNjk2OTcwNjUyfQ.OQR_9xl-akrw7rFYWJ6A_CF_tbbDXDVtl2gDgVIhHDI'),(22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2NzQxMCwiZXhwIjoxNjk2OTcxMDEwfQ.NHEHjlEWyZ1w771o9NgNldFIvbgWUMAGbmK6fT_E6eE'),(23,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2Nzc1OSwiZXhwIjoxNjk2OTcxMzU5fQ.Cr8zP1yBIhfmVYctRdOv8g-LA1FkOOykxpMkyVuo_4E'),(24,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2Nzg1OCwiZXhwIjoxNjk2OTcxNDU4fQ.qTY3F8XZnYje5hrRt_bH7FKHtGD_R4Vnl2PfWaUfW9g'),(25,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2ODc1MCwiZXhwIjoxNjk2OTcyMzUwfQ.aswCZFel8-6I8CBxGrdbE9qWAgV3WsPxpuYNQioFi2Y'),(26,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2ODk5NywiZXhwIjoxNjk2OTcyNTk3fQ.TCcuSEhoWvIeZgF49nLfvgtqqta5tgmM0eZV9ZEv-gY'),(27,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2OTEyOSwiZXhwIjoxNjk2OTcyNzI5fQ.kMR8qj6h7ym5w0Ui7peB-_rF2jvWPw8XfVv86mLtKpM'),(28,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2OTIyNCwiZXhwIjoxNjk2OTcyODI0fQ.f5ezp05IZzW6hmL5hgjV5wvblgbHB5rqZqhDQH5aCcU'),(29,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2OTM1OSwiZXhwIjoxNjk2OTcyOTU5fQ.dWA0N-9g1M9mwlgfiHawVKo7o5Ze68aFGxzvZNkyuGo'),(30,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2OTQ0OCwiZXhwIjoxNjk2OTczMDQ4fQ.ASslJHQhlnaxQ4nm30OlyXjbnWGw2zK7RUFDLpdLzuE'),(31,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2OTQ5OCwiZXhwIjoxNjk2OTczMDk4fQ.CzigQiaMV4LmB_h8IjKW_kodf9RnuHa4SG9vip8DDAI'),(32,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2OTY0OSwiZXhwIjoxNjk2OTczMjQ5fQ.PT_mvMNHcw-t04FnRF5mQjQRbWdOkihQWJ_BIkXe26Q'),(33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2OTkxOCwiZXhwIjoxNjk2OTczNTE4fQ.lK8JpgRbBd1EBmKSGg1IDGj5j4WYVsP99Jv1D2iA4Rc'),(34,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5Njk2OTkzOCwiZXhwIjoxNjk2OTczNTM4fQ.Yx3bg8MU1pemOx5lnJj4lAW98wZCYp1BBxAZZnAyoso'),(35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5NzA0NDMxMiwiZXhwIjoxNjk3MDQ3OTEyfQ.i8gw2FETlDmq_xfmUE4CxAEWF1q1ZUBdayNzC6OuJv4'),(36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5NzA0NTMyOSwiZXhwIjoxNjk3MDQ4OTI5fQ.2XbudjGIrqPS-3DoX0WsJjMcn_1wXom_ucrvtoqrWeM'),(37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5NzA0NTUxOSwiZXhwIjoxNjk3MDQ5MTE5fQ.HC4CVs73cr_51_A82uGrxCacx9GNTHnajubDySECEbo'),(38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5NzA0NTc2NCwiZXhwIjoxNjk3MDQ5MzY0fQ.jV-Gs4PjbtronOhgYr-o2WRBRGtmNzG6ahFRl5taS7k'),(39,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5NzA0NjQwOCwiZXhwIjoxNjk3MDUwMDA4fQ.-mFrTIRgnLi3g9y2eiHMvmOf4lGTHAdaM-XoCWtEih8'),(40,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5NzA0NjU2MCwiZXhwIjoxNjk3MDUwMTYwfQ.6YKrAuRCWX8St5PlgSWHeM_evLTrlmuhKIkBTZ2zJ_U'),(41,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5NzA0Njc3OCwiZXhwIjoxNjk3MDUwMzc4fQ.j-JEVZ-HHJHbTx-sw2pxb_vmzde9VbMu4AKy-c60dOk'),(42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3LCJlbWFpbCI6InBydWViYUBnbWFpbC5jb20iLCJub21icmUiOiJwcnVlYmEiLCJhcGVsbGlkbyI6InBydWViYSIsImVzUHJlc3RhZG9yIjowLCJmZWNoYU5hY2ltaWVudG8iOiIyMDIzLTEwLTE4IiwidGVsZWZvbm8iOjk5OTk5OTk5OX0sImlhdCI6MTY5NzA0NjkwNywiZXhwIjoxNjk3MDUwNTA3fQ.fZUKqdbivW2oV109FR_dn9NzWOWfPtkYSwNa7Qmi_nU');
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) NOT NULL,
  `apellido` varchar(40) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contrasena` varchar(250) NOT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `telefono` int DEFAULT NULL,
  `esPrestador` tinyint DEFAULT '0',
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (2,'Facundo','Taborra','taborrafacundo@gmail.com','facuuuu','2001-09-27',0,0),(3,'Seggio','Romero','SRomero@gmial.com','$2b$10$VSrulsN1XFteyRXxjRL95e2MAs.OnBwceXf8S.y4OkGQaCMBlU4we',NULL,777777778,0),(4,'rodolgo','asdas','ashdbjj@gmail.com','$2b$10$6wkVWlFhr2Evf8i6gOpCBurRAAgiUDYaamGI1OtmCr48XIYOQxtii','2023-10-26',845754896,0),(5,'facundo','taborra','rodolgomorales@gmail.com','$2b$10$jfm/grejEdU/.5pPti1KMOwGXEwh4/.lSa3uFFJrFVobP5j1cTDAi','2023-10-11',888888888,0),(6,'admin','prueba','admin@gmail.com','$2b$10$jTaQsVE9SKcX53L82MLW/.Shb39BdG5I7EEVMNOUsDZFcWe21kE8e','2023-10-19',123456789,0),(7,'prueba','prueba','prueba@gmail.com','$2b$10$F5W8/xnCjoWvg8gumqtoHeXHTjRbQIj11/YXpKPvCWIsiylB/Xp2K','2023-10-18',999999999,0);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-11 14:56:06
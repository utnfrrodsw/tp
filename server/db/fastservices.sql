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
  `idprofesiones` int NOT NULL,
  PRIMARY KEY (`idSolicitud`,`idprofesiones`),
  UNIQUE KEY `idprofesiones_UNIQUE` (`idprofesiones`),
  CONSTRAINT `profesion_anun` FOREIGN KEY (`idprofesiones`) REFERENCES `profesion` (`idProfesion`)
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
  `contrasena` varchar(32) NOT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `telefono` int DEFAULT NULL,
  `esPrestador` tinyint DEFAULT '0',
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (2,'Facundo','Taborra','taborrafacundo@gmail.com','facuuuu','2001-09-27',0,0);
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

-- Dump completed on 2023-10-06 10:36:24
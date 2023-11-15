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
  CONSTRAINT `cp` FOREIGN KEY (`codPostal`) REFERENCES `localidad` (`codPostal`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_direccion_cliente` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `foto_solicitud`
--

DROP TABLE IF EXISTS `foto_solicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foto_solicitud` (
  `idfoto` int NOT NULL AUTO_INCREMENT,
  `foto` longblob NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(45) NOT NULL,
  `idSolicitud` int DEFAULT NULL,
  PRIMARY KEY (`idfoto`),
  KEY `fk_fotos_solicitud_idx` (`idSolicitud`),
  CONSTRAINT `fk_fotos_solicitud` FOREIGN KEY (`idSolicitud`) REFERENCES `solicitud` (`idSolicitud`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `horariospresupuesto`
--

DROP TABLE IF EXISTS `horariospresupuesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horariospresupuesto` (
  `idSolicitud` int NOT NULL,
  `idUsuario` int NOT NULL,
  `horario` datetime NOT NULL,
  PRIMARY KEY (`idSolicitud`,`idUsuario`,`horario`),
  CONSTRAINT `fk_horariospresupuesto_1` FOREIGN KEY (`idSolicitud`, `idUsuario`) REFERENCES `presupuesto` (`idSolicitud`, `idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

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
-- Table structure for table `prestador_profesiones`
--

DROP TABLE IF EXISTS `prestador_profesiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestador_profesiones` (
  `idPrestador` int NOT NULL,
  `idProfesion` int NOT NULL,
  PRIMARY KEY (`idPrestador`,`idProfesion`),
  KEY `fk_prestador_profesiones_idx` (`idProfesion`),
  CONSTRAINT `fk_prestador_profesiones` FOREIGN KEY (`idProfesion`) REFERENCES `profesion` (`idProfesion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_prestador_usuario` FOREIGN KEY (`idPrestador`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `presupuesto`
--

DROP TABLE IF EXISTS `presupuesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presupuesto` (
  `idSolicitud` int NOT NULL,
  `idUsuario` int NOT NULL,
  `materiales` varchar(255) DEFAULT NULL,
  `costoMateriales` double NOT NULL,
  `costoXHora` double NOT NULL,
  `tiempoAprox` int DEFAULT NULL,
  PRIMARY KEY (`idSolicitud`,`idUsuario`),
  KEY `fk_presupuesto_prest_idx` (`idUsuario`),
  CONSTRAINT `fk_presupuesto_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `solicitud_presupuesto` FOREIGN KEY (`idSolicitud`) REFERENCES `solicitud` (`idSolicitud`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `profesion`
--

DROP TABLE IF EXISTS `profesion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesion` (
  `idProfesion` int NOT NULL AUTO_INCREMENT,
  `nombreProfesion` varchar(255) NOT NULL,
  PRIMARY KEY (`idProfesion`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reset_codes`
--

DROP TABLE IF EXISTS `reset_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reset_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `userId` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `reset_codes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `usuario` (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `servicio`
--

DROP TABLE IF EXISTS `servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicio` (
  `idSolicitud` int NOT NULL,
  `idUsuario` int NOT NULL,
  `estado` varchar(45) NOT NULL,
  `fechaHora` datetime NOT NULL,
  `resenia` int DEFAULT '6',
  PRIMARY KEY (`idSolicitud`,`idUsuario`),
  KEY `presupuesto_service_idx` (`idSolicitud`),
  KEY `fk_servicio_usuario_idx` (`idUsuario`),
  CONSTRAINT `fk_servicio_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `presupuesto_service` FOREIGN KEY (`idSolicitud`) REFERENCES `presupuesto` (`idSolicitud`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `estado` varchar(20) NOT NULL DEFAULT 'Activo',
  `idDireccion` int NOT NULL,
  `idProfesion` int DEFAULT NULL,
  PRIMARY KEY (`idSolicitud`),
  KEY `cliente` (`idDireccion`),
  KEY `fk_solicitud_profesion_idx` (`idProfesion`),
  KEY `fk_solicitud_profesion` (`idProfesion`),
  CONSTRAINT `cliente` FOREIGN KEY (`idDireccion`) REFERENCES `direccion` (`idDireccion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_solicitud_profesion` FOREIGN KEY (`idProfesion`) REFERENCES `profesion` (`idProfesion`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token` (
  `idtoken` int NOT NULL AUTO_INCREMENT,
  `token` varchar(1000) NOT NULL,
  PRIMARY KEY (`idtoken`)
) ENGINE=InnoDB AUTO_INCREMENT=402 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `fechaNacimiento` date NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `esPrestador` tinyint NOT NULL DEFAULT '0',
  `fotoPerfil` varchar(255) DEFAULT NULL,
  `foto` longblob,
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-15 12:10:22
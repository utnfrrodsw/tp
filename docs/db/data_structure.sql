DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
)

DROP TABLE IF EXISTS `groups_tasks`;
CREATE TABLE `groups_tasks` (
  `date_completed` datetime NOT NULL,
  `conection` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `hour` time DEFAULT NULL,
  `observation` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `groupId` int DEFAULT NULL,
  `taskId` int DEFAULT NULL,
  PRIMARY KEY (`date_completed`,`conection`),
  UNIQUE KEY `groups_tasks_taskId_groupId_unique` (`groupId`,`taskId`),
  KEY `taskId` (`taskId`),
  CONSTRAINT `groups_tasks_ibfk_141` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `groups_tasks_ibfk_142` FOREIGN KEY (`taskId`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
)

DROP TABLE IF EXISTS `groups_technicians`;
CREATE TABLE `groups_technicians` (
  `date_assigned` datetime NOT NULL,
  `date_end` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `groupId` int NOT NULL,
  `technicianId` int NOT NULL,
  PRIMARY KEY (`groupId`,`technicianId`,`date_assigned`),
  KEY `technicianId` (`technicianId`),
  CONSTRAINT `groups_technicians_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `groups_technicians_ibfk_2` FOREIGN KEY (`technicianId`) REFERENCES `technicians` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
)

DROP TABLE IF EXISTS `prices`;
CREATE TABLE `prices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date_from` datetime NOT NULL,
  `price` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `taskId` int DEFAULT NULL,
  PRIMARY KEY (`id`,`date_from`),
  KEY `taskId` (`taskId`),
  CONSTRAINT `prices_ibfk_1` FOREIGN KEY (`taskId`) REFERENCES `tasks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
)

DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
)

DROP TABLE IF EXISTS `technicians`;
CREATE TABLE `technicians` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `date_born` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
)

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
)
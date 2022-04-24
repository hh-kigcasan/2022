# js-capstone
## An Algorithm App | Lolo Edong
Developed by Jette Dumayas

### Demo Link 
[https://www.youtube.com/watch?v=jpJq5eFomlU]

### Description
An algorithm web app that allow users to solve algorithm problems and the app records it. These are the following features:
1. Login/Registration - requires user to register and login before using the app
2. Rankings - shows users and their no. of the challenges they took and it's total duration
3. Profile - shows the available challenges that the user can take or retake, allow user to play and watch his/her previous solution in a specific challenge he/she took
4. Admin - shows the user rankings to admin and each user's challenges history videos

### Technologies used
HTML, CSS, JS, NodeJS, Socket.IO, Redis, and MySQL.

### Instructions to use

1. Download or clone the github repository:
```
https://github.com/jettedmys/js-capstone
```
2. Open a terminal window (Mac) or a command window (Windows), and navigate (cd) to the ```js-capstone/codes```
3. install server dependencies
```
npm install
```
4. Start server
```
nodemon app.js
```
5. Start redis server
```
redis-server
```
6. Start MySQL server then change the localhost port, database name and password inside ```js-capstone/codes/app/config/database.yml```. Lastly, run the provided query below:

```
CREATE DATABASE  IF NOT EXISTS `js_capstone` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `js_capstone`;
-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)
--
-- Host: localhost    Database: js_capstone
-- ------------------------------------------------------
-- Server version	5.7.34

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
-- Table structure for table `challenges`
--

DROP TABLE IF EXISTS `challenges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `challenges` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`title` varchar(255) DEFAULT NULL,
`problem` text,
`test_cases` text,
`updated_at` datetime DEFAULT NULL,
`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `challenges`
--

LOCK TABLES `challenges` WRITE;
/*!40000 ALTER TABLE `challenges` DISABLE KEYS */;
INSERT INTO `challenges` VALUES (1,'Sum of array numbers','Get the sum of array numbers','[{\"value\":[1,1,1],\"output\":3},{\"value\":[2,2,2],\"output\":6},{\"value\":[3,3,3],\"output\":9}]',NULL,'2022-04-22 16:28:49'),(2,'Product of array numbers','Get the product of array numbers','[{\"value\":[1,1,1],\"output\":1},{\"value\":[2,2,2],\"output\":8},{\"value\":[3,3,3],\"output\":27}]',NULL,'2022-04-22 16:28:49'),(3,'Min, Max, and Avg','Given an array, print the max, min and average values for that array','[{\"value\":[1,2,3,4,5], \"output\":[3,1,5]}]',NULL,'2022-04-24 18:19:54');
/*!40000 ALTER TABLE `challenges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_challenges_history`
--

DROP TABLE IF EXISTS `user_challenges_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_challenges_history` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`user_id` int(11) DEFAULT NULL,
`challenge_id` int(11) DEFAULT NULL,
`record_ended_at` varchar(45) DEFAULT '00:00:00:00',
`duration` time DEFAULT NULL,
`updated_at` datetime DEFAULT NULL,
`record_path` varchar(45) DEFAULT NULL,
`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_challenges_history`
--

LOCK TABLES `user_challenges_history` WRITE;
/*!40000 ALTER TABLE `user_challenges_history` DISABLE KEYS */;
INSERT INTO `user_challenges_history` VALUES (55,32,1,'00:00:32:56','00:00:32',NULL,'records/321650801342011.txt','2022-04-24 19:55:42'),(56,32,2,'00:00:32:38','00:00:32',NULL,'records/321650801416987.txt','2022-04-24 19:56:56'),(57,33,2,'00:00:27:58','00:00:27',NULL,'records/331650801546130.txt','2022-04-24 19:59:06');
/*!40000 ALTER TABLE `user_challenges_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`username` varchar(45) DEFAULT NULL,
`password` text,
`is_admin` tinyint(4) DEFAULT '0',
`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
`updated_at` datetime DEFAULT NULL,
PRIMARY KEY (`id`),
UNIQUE KEY `users_username_uindex` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (19,'admin','0192023a7bbd73250516f069df18b500',1,'2022-04-21 22:59:36',NULL),(32,'jettedumayas','9aa6e5f2256c17d2d430b100032b997c',0,'2022-04-24 19:54:46',NULL),(33,'kimkim','9aa6e5f2256c17d2d430b100032b997c',0,'2022-04-24 19:58:05',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-24 21:44:56
```
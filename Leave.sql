-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: hr_system
-- ------------------------------------------------------
-- Server version	8.0.20

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
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Defence ','This department focuses on national security, defense strategies, and military technology-related education or research.'),(2,'Software','This department focuses on software development, testing, deployment, and maintenance of digital solutions, supporting core IT infrastructure and innovation.'),(3,'Standardization','This department ensures compliance with national and international standards, promotes best practices, and develops protocols to maintain quality and consistency across operations.'),(4,'GIS (Geographic Information Systems)','This department specializes in spatial data analysis, mapping technologies, and the integration of geographic data to support planning and decision-making.'),(5,'Setcom (Satellite and Communication)','This department focuses on satellite-based communication systems, network infrastructure, and secure data transmission technologies for mission-critical applications.'),(6,'Admin (Administration)','This department manages organizational operations, resources, and personnel functions to ensure efficient workflow and policy implementation across all units.'),(7,'HR',NULL),(8,'Java',NULL);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `document_type` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `is_previous_company` tinyint(1) DEFAULT '0',
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `custom_document_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (1,70,'photo','/uploads/vanshu_13.jpg',0,'2025-07-08 01:14:34',NULL),(2,70,'ISA_affidavit','/uploads/vanshu_ISA_affidavit_Progress Report week9.pdf',0,'2025-07-08 01:14:34',NULL),(3,70,'Aadhaar','/uploads/vanshu_Aadhaar_Progress Report week9.pdf',0,'2025-07-08 01:14:34',NULL),(4,70,'police_verification','/uploads/vanshu_police_verification_Progress Report week9.pdf',0,'2025-07-08 01:14:34',NULL),(5,70,'offer_letter','/uploads/vanshu_offer_letter_Progress Report week9.pdf',0,'2025-07-08 01:14:34',NULL),(6,70,'passbook','/uploads/vanshu_passbook_Progress Report week9.pdf',0,'2025-07-08 01:14:34',NULL),(7,70,'experience_letter','/uploads/vanshu_experience_letter_Progress Report week9.pdf',0,'2025-07-08 01:14:34',NULL),(8,70,'qualification_degree_certificate','/uploads/vanshu_qualification_degree_certificate_Progress Report week9.pdf',0,'2025-07-08 01:14:34',NULL),(9,70,'Pan','/uploads/vanshu_Pan_Progress Report week9.pdf',0,'2025-07-08 01:14:34',NULL),(10,70,'joining_form','/uploads/vanshu_joining_form_Progress Report week9.pdf',0,'2025-07-08 01:14:34',NULL),(11,70,'LC_sign_stamp_document','/uploads/vanshu_LC_sign_stamp_document_Progress Report week9.pdf',0,'2025-07-08 01:14:34',NULL),(12,76,'photo','/uploads/jaya_13.jpg',0,'2025-07-15 01:03:37',NULL),(13,76,'ISA_affidavit','/uploads/jaya_ISA_affidavit_going ticket.pdf',0,'2025-07-15 01:03:37',NULL),(14,76,'Aadhaar','/uploads/jaya_Aadhaar_going ticket.pdf',0,'2025-07-15 01:03:37',NULL),(15,76,'police_verification','/uploads/jaya_police_verification_going ticket.pdf',0,'2025-07-15 01:03:37',NULL),(16,76,'offer_letter','/uploads/jaya_offer_letter_going ticket.pdf',0,'2025-07-15 01:03:37',NULL),(17,76,'passbook','/uploads/jaya_passbook_going ticket.pdf',0,'2025-07-15 01:03:38',NULL),(18,76,'experience_letter','/uploads/jaya_experience_letter_going ticket.pdf',0,'2025-07-15 01:03:38',NULL),(19,76,'qualification_degree_certificate','/uploads/jaya_qualification_degree_certificate_going ticket.pdf',0,'2025-07-15 01:03:38',NULL),(20,76,'Pan','/uploads/jaya_Pan_Progress Report week11.pdf',0,'2025-07-15 01:03:38',NULL),(21,76,'joining_form','/uploads/jaya_joining_form_going ticket.pdf',0,'2025-07-15 01:03:38',NULL),(22,76,'LC_sign_stamp_document','/uploads/jaya_LC_sign_stamp_document_going ticket.pdf',0,'2025-07-15 01:03:38',NULL),(34,67,'photo','D:\\hr_management_system\\hr-management\\uploads\\ash_photo_1753341737951_IMG_5172.HEIC',0,'2025-07-24 01:52:18',NULL),(35,67,'aadhaar','D:\\hr_management_system\\hr-management\\uploads\\ash_aadhaar_1753341737986_POCAE6879.JPG',0,'2025-07-24 01:52:18',NULL),(36,67,'pan','D:\\hr_management_system\\hr-management\\uploads\\ash_pan_1753341737992_POCAE6879.JPG',0,'2025-07-24 01:52:18',NULL),(37,67,'marksheets','D:\\hr_management_system\\hr-management\\uploads\\ash_marksheets_1753341737992_POCAE6879.JPG',0,'2025-07-24 01:52:18',NULL),(38,67,'offer_letter','D:\\hr_management_system\\hr-management\\uploads\\ash_offer_letter_1753341738000_WNNH4777.JPG',0,'2025-07-24 01:52:18',NULL),(39,67,'joining_form','D:\\hr_management_system\\hr-management\\uploads\\ash_joining_form_1753341738000_POCAE6879.JPG',0,'2025-07-24 01:52:18',NULL),(40,67,'isa_form','D:\\hr_management_system\\hr-management\\uploads\\ash_isa_form_1753341738006_WNNH4777.JPG',0,'2025-07-24 01:52:18',NULL),(41,67,'affidavit','D:\\hr_management_system\\hr-management\\uploads\\ash_affidavit_1753341738006_POCAE6879.JPG',0,'2025-07-24 01:52:18',NULL),(42,67,'police_verification','D:\\hr_management_system\\hr-management\\uploads\\ash_police_verification_1753341738013_WNNH4777.JPG',0,'2025-07-24 01:52:18',NULL),(43,67,'passbook_copy','D:\\hr_management_system\\hr-management\\uploads\\ash_passbook_copy_1753341738013_POCAE6879.JPG',0,'2025-07-24 01:52:18',NULL),(44,53,'photo','D:\\hr_management_system\\hr-management\\uploads\\asd_photo_1753341953712_POCAE6879.JPG',0,'2025-07-24 01:55:54',NULL),(45,53,'aadhaar','D:\\hr_management_system\\hr-management\\uploads\\asd_aadhaar_1753341953719_POCAE6879.JPG',0,'2025-07-24 01:55:54',NULL),(46,53,'pan','D:\\hr_management_system\\hr-management\\uploads\\asd_pan_1753341953719_WNNH4777.JPG',0,'2025-07-24 01:55:54',NULL),(47,53,'marksheets','D:\\hr_management_system\\hr-management\\uploads\\asd_marksheets_1753341953726_WNNH4777.JPG',0,'2025-07-24 01:55:54',NULL),(48,53,'offer_letter','D:\\hr_management_system\\hr-management\\uploads\\asd_offer_letter_1753341953726_WNNH4777.JPG',0,'2025-07-24 01:55:54',NULL),(49,53,'joining_form','D:\\hr_management_system\\hr-management\\uploads\\asd_joining_form_1753341953733_WNNH4777.JPG',0,'2025-07-24 01:55:54',NULL),(50,53,'isa_form','D:\\hr_management_system\\hr-management\\uploads\\asd_isa_form_1753341953733_POCAE6879.JPG',0,'2025-07-24 01:55:54',NULL),(51,53,'affidavit','D:\\hr_management_system\\hr-management\\uploads\\asd_affidavit_1753341953740_POCAE6879.JPG',0,'2025-07-24 01:55:54',NULL),(52,53,'police_verification','D:\\hr_management_system\\hr-management\\uploads\\asd_police_verification_1753341953740_WNNH4777.JPG',0,'2025-07-24 01:55:54',NULL),(53,53,'passbook_copy','D:\\hr_management_system\\hr-management\\uploads\\asd_passbook_copy_1753341953747_POCAE6879.JPG',0,'2025-07-24 01:55:54',NULL),(54,53,'additional_document','D:\\hr_management_system\\hr-management\\uploads\\asd_additional_document_1753341953747_Abhishek Kumar[051].pdf',0,'2025-07-24 01:55:54','resume'),(55,72,'photo','D:\\hr_management_system\\hr-management\\uploads\\prince_photo_1753342475199_IMG_5172.HEIC',0,'2025-07-24 02:04:35',NULL),(56,72,'aadhaar','D:\\hr_management_system\\hr-management\\uploads\\prince_aadhaar_1753342475199_POCAE6879.JPG',0,'2025-07-24 02:04:35',NULL),(57,72,'pan','D:\\hr_management_system\\hr-management\\uploads\\prince_pan_1753342475206_WNNH4777.JPG',0,'2025-07-24 02:04:35',NULL),(58,72,'marksheets','D:\\hr_management_system\\hr-management\\uploads\\prince_marksheets_1753342475206_POCAE6879.JPG',0,'2025-07-24 02:04:35',NULL),(59,72,'offer_letter','D:\\hr_management_system\\hr-management\\uploads\\prince_offer_letter_1753342475213_WNNH4777.JPG',0,'2025-07-24 02:04:35',NULL),(60,72,'joining_form','D:\\hr_management_system\\hr-management\\uploads\\prince_joining_form_1753342475213_POCAE6879.JPG',0,'2025-07-24 02:04:35',NULL),(61,72,'isa_form','D:\\hr_management_system\\hr-management\\uploads\\prince_isa_form_1753342475220_POCAE6879.JPG',0,'2025-07-24 02:04:35',NULL),(62,72,'affidavit','D:\\hr_management_system\\hr-management\\uploads\\prince_affidavit_1753342475220_POCAE6879.JPG',0,'2025-07-24 02:04:35',NULL),(63,72,'police_verification','D:\\hr_management_system\\hr-management\\uploads\\prince_police_verification_1753342475227_POCAE6879.JPG',0,'2025-07-24 02:04:35',NULL),(64,72,'passbook_copy','D:\\hr_management_system\\hr-management\\uploads\\prince_passbook_copy_1753342475227_POCAE6879.JPG',0,'2025-07-24 02:04:35',NULL),(65,68,'photo','D:\\hr_management_system\\hr-management\\uploads\\ajay_photo_1753348737454_POCAE6879.JPG',0,'2025-07-24 03:48:57',NULL),(66,68,'aadhaar','D:\\hr_management_system\\hr-management\\uploads\\ajay_aadhaar_1753348737495_POCAE6879.JPG',0,'2025-07-24 03:48:58',NULL),(67,68,'pan','D:\\hr_management_system\\hr-management\\uploads\\ajay_pan_1753348737502_WNNH4777.JPG',0,'2025-07-24 03:48:58',NULL),(68,68,'marksheets','D:\\hr_management_system\\hr-management\\uploads\\ajay_marksheets_1753348737509_POCAE6879.JPG',0,'2025-07-24 03:48:58',NULL),(69,68,'offer_letter','D:\\hr_management_system\\hr-management\\uploads\\ajay_offer_letter_1753348737509_WNNH4777.JPG',0,'2025-07-24 03:48:58',NULL),(70,68,'joining_form','D:\\hr_management_system\\hr-management\\uploads\\ajay_joining_form_1753348737516_POCAE6879.JPG',0,'2025-07-24 03:48:58',NULL),(71,68,'isa_form','D:\\hr_management_system\\hr-management\\uploads\\ajay_isa_form_1753348737516_WNNH4777.JPG',0,'2025-07-24 03:48:58',NULL),(72,68,'affidavit','D:\\hr_management_system\\hr-management\\uploads\\ajay_affidavit_1753348737523_POCAE6879.JPG',0,'2025-07-24 03:48:58',NULL),(73,68,'police_verification','D:\\hr_management_system\\hr-management\\uploads\\ajay_police_verification_1753348737523_POCAE6879.JPG',0,'2025-07-24 03:48:58',NULL),(74,68,'passbook_copy','D:\\hr_management_system\\hr-management\\uploads\\ajay_passbook_copy_1753348737531_POCAE6879.JPG',0,'2025-07-24 03:48:58',NULL),(75,59,'photo','D:\\hr_management_system\\hr-management\\uploads\\opop_photo_1753687334832_Screenshot 2025-05-10 022912.png',0,'2025-07-28 01:52:15',NULL),(76,59,'aadhaar','D:\\hr_management_system\\hr-management\\uploads\\opop_aadhaar_1753687334860_Screenshot 2025-05-09 005134.png',0,'2025-07-28 01:52:15',NULL),(77,59,'pan','D:\\hr_management_system\\hr-management\\uploads\\opop_pan_1753687334867_Screenshot 2025-05-09 005331.png',0,'2025-07-28 01:52:15',NULL),(78,59,'marksheets','D:\\hr_management_system\\hr-management\\uploads\\opop_marksheets_1753687334874_Screenshot 2025-05-09 011411.png',0,'2025-07-28 01:52:15',NULL),(79,59,'offer_letter','D:\\hr_management_system\\hr-management\\uploads\\opop_offer_letter_1753687334874_Screenshot 2025-05-09 162433.png',0,'2025-07-28 01:52:15',NULL),(80,59,'joining_form','D:\\hr_management_system\\hr-management\\uploads\\opop_joining_form_1753687334881_Resume.pdf',0,'2025-07-28 01:52:15',NULL),(81,59,'isa_form','D:\\hr_management_system\\hr-management\\uploads\\opop_isa_form_1753687334881_Screenshot 2025-05-14 124819.png',0,'2025-07-28 01:52:15',NULL),(82,59,'affidavit','D:\\hr_management_system\\hr-management\\uploads\\opop_affidavit_1753687334888_Screenshot 2025-05-09 005134.png',0,'2025-07-28 01:52:15',NULL),(83,59,'police_verification','D:\\hr_management_system\\hr-management\\uploads\\opop_police_verification_1753687334888_Screenshot 2025-05-09 162433.png',0,'2025-07-28 01:52:15',NULL),(84,59,'passbook_copy','D:\\hr_management_system\\hr-management\\uploads\\opop_passbook_copy_1753687334895_Screenshot 2025-05-11 171349.png',0,'2025-07-28 01:52:15',NULL),(85,60,'photo','D:\\hr_management_system\\hr-management\\uploads\\aadi_photo_1753687671806_Screenshot 2025-05-10 022940.png',0,'2025-07-28 01:57:52',NULL),(86,60,'aadhaar','D:\\hr_management_system\\hr-management\\uploads\\aadi_aadhaar_1753687671813_Screenshot 2025-05-09 005134.png',0,'2025-07-28 01:57:52',NULL),(87,60,'pan','D:\\hr_management_system\\hr-management\\uploads\\aadi_pan_1753687671813_Screenshot 2025-05-11 171349.png',0,'2025-07-28 01:57:52',NULL),(88,60,'marksheets','D:\\hr_management_system\\hr-management\\uploads\\aadi_marksheets_1753687671820_Screenshot 2025-05-09 005331.png',0,'2025-07-28 01:57:52',NULL),(89,60,'offer_letter','D:\\hr_management_system\\hr-management\\uploads\\aadi_offer_letter_1753687671820_Screenshot 2025-05-11 152104.png',0,'2025-07-28 01:57:52',NULL),(90,60,'joining_form','D:\\hr_management_system\\hr-management\\uploads\\aadi_joining_form_1753687671820_Resume.pdf',0,'2025-07-28 01:57:52',NULL),(91,60,'isa_form','D:\\hr_management_system\\hr-management\\uploads\\aadi_isa_form_1753687671827_Temprary ID card.pdf',0,'2025-07-28 01:57:52',NULL),(92,60,'affidavit','D:\\hr_management_system\\hr-management\\uploads\\aadi_affidavit_1753687671827_Screenshot 2025-05-09 005134.png',0,'2025-07-28 01:57:52',NULL),(93,60,'police_verification','D:\\hr_management_system\\hr-management\\uploads\\aadi_police_verification_1753687671834_Screenshot 2025-05-11 152104.png',0,'2025-07-28 01:57:52',NULL),(94,60,'passbook_copy','D:\\hr_management_system\\hr-management\\uploads\\aadi_passbook_copy_1753687671834_Screenshot 2025-05-12 223709.png',0,'2025-07-28 01:57:52',NULL),(95,60,'additional_document','D:\\hr_management_system\\hr-management\\uploads\\aadi_additional_document_1753687671841_Screenshot 2025-05-10 022856.png',0,'2025-07-28 01:57:52','Photo'),(106,68,'photo','D:\\hr_management_system\\hr-management\\uploads\\ajay_photo_1753696447865_Screenshot 2025-05-10 022856.png',0,'2025-07-28 04:24:08',NULL),(107,68,'aadhaar','D:\\hr_management_system\\hr-management\\uploads\\ajay_aadhaar_1753696447900_Screenshot 2025-05-09 005134.png',0,'2025-07-28 04:24:08',NULL),(108,68,'pan','D:\\hr_management_system\\hr-management\\uploads\\ajay_pan_1753696447907_Screenshot 2025-05-09 005331.png',0,'2025-07-28 04:24:08',NULL),(109,68,'marksheets','D:\\hr_management_system\\hr-management\\uploads\\ajay_marksheets_1753696447909_Screenshot 2025-05-09 011411.png',0,'2025-07-28 04:24:08',NULL),(110,68,'offer_letter','D:\\hr_management_system\\hr-management\\uploads\\ajay_offer_letter_1753696447914_Screenshot 2025-05-09 011411.png',0,'2025-07-28 04:24:08',NULL),(111,68,'joining_form','D:\\hr_management_system\\hr-management\\uploads\\ajay_joining_form_1753696447921_Screenshot 2025-05-11 164852.png',0,'2025-07-28 04:24:08',NULL),(112,68,'isa_form','D:\\hr_management_system\\hr-management\\uploads\\ajay_isa_form_1753696447921_Screenshot 2025-05-11 171349.png',0,'2025-07-28 04:24:08',NULL),(113,68,'affidavit','D:\\hr_management_system\\hr-management\\uploads\\ajay_affidavit_1753696447928_Screenshot 2025-05-11 192130.png',0,'2025-07-28 04:24:08',NULL),(114,68,'police_verification','D:\\hr_management_system\\hr-management\\uploads\\ajay_police_verification_1753696447928_Screenshot 2025-05-12 113523.png',0,'2025-07-28 04:24:08',NULL),(115,68,'passbook_copy','D:\\hr_management_system\\hr-management\\uploads\\ajay_passbook_copy_1753696447934_Screenshot 2025-05-12 225141.png',0,'2025-07-28 04:24:08',NULL),(116,59,'photo','D:\\hr_management_system\\hr-management\\uploads\\opop_photo_1753699138393_Screenshot 2025-05-09 011411.png',0,'2025-07-28 05:08:58',NULL),(117,59,'aadhaar','D:\\hr_management_system\\hr-management\\uploads\\opop_aadhaar_1753699138421_Screenshot 2025-05-12 113752.png',0,'2025-07-28 05:08:58',NULL),(118,59,'pan','D:\\hr_management_system\\hr-management\\uploads\\opop_pan_1753699138421_Screenshot 2025-05-09 005134.png',0,'2025-07-28 05:08:58',NULL),(119,59,'marksheets','D:\\hr_management_system\\hr-management\\uploads\\opop_marksheets_1753699138428_Screenshot 2025-05-09 005331.png',0,'2025-07-28 05:08:58',NULL),(120,59,'offer_letter','D:\\hr_management_system\\hr-management\\uploads\\opop_offer_letter_1753699138428_Screenshot 2025-05-09 011411.png',0,'2025-07-28 05:08:58',NULL),(121,59,'joining_form','D:\\hr_management_system\\hr-management\\uploads\\opop_joining_form_1753699138434_Screenshot 2025-05-11 152104.png',0,'2025-07-28 05:08:58',NULL),(122,59,'isa_form','D:\\hr_management_system\\hr-management\\uploads\\opop_isa_form_1753699138435_Screenshot 2025-05-11 164852.png',0,'2025-07-28 05:08:58',NULL),(123,59,'affidavit','D:\\hr_management_system\\hr-management\\uploads\\opop_affidavit_1753699138435_Screenshot 2025-05-11 192525.png',0,'2025-07-28 05:08:58',NULL),(124,59,'police_verification','D:\\hr_management_system\\hr-management\\uploads\\opop_police_verification_1753699138442_Screenshot 2025-05-12 110334.png',0,'2025-07-28 05:08:58',NULL),(125,59,'passbook_copy','D:\\hr_management_system\\hr-management\\uploads\\opop_passbook_copy_1753699138442_Screenshot 2025-05-12 223709.png',0,'2025-07-28 05:08:58',NULL),(126,58,'photo','D:\\hr_management_system\\hr-management\\uploads\\abhay_photo_1753788307749_Screenshot 2025-05-09 005134.png',0,'2025-07-29 05:55:08',NULL),(127,58,'aadhaar','D:\\hr_management_system\\hr-management\\uploads\\abhay_aadhaar_1753788307816_Screenshot 2025-05-09 005331.png',0,'2025-07-29 05:55:08',NULL),(128,58,'pan','D:\\hr_management_system\\hr-management\\uploads\\abhay_pan_1753788307822_Screenshot 2025-05-09 005331.png',0,'2025-07-29 05:55:08',NULL),(129,58,'marksheets','D:\\hr_management_system\\hr-management\\uploads\\abhay_marksheets_1753788307835_Screenshot 2025-05-10 022912.png',0,'2025-07-29 05:55:08',NULL),(130,58,'offer_letter','D:\\hr_management_system\\hr-management\\uploads\\abhay_offer_letter_1753788307836_Resume.pdf',0,'2025-07-29 05:55:08',NULL),(131,58,'joining_form','D:\\hr_management_system\\hr-management\\uploads\\abhay_joining_form_1753788307849_Screenshot 2025-05-11 192525.png',0,'2025-07-29 05:55:08',NULL),(132,58,'isa_form','D:\\hr_management_system\\hr-management\\uploads\\abhay_isa_form_1753788307857_Screenshot 2025-05-11 173252.png',0,'2025-07-29 05:55:08',NULL),(133,58,'affidavit','D:\\hr_management_system\\hr-management\\uploads\\abhay_affidavit_1753788307869_Screenshot 2025-05-09 005331.png',0,'2025-07-29 05:55:08',NULL),(134,58,'police_verification','D:\\hr_management_system\\hr-management\\uploads\\abhay_police_verification_1753788307869_Screenshot 2025-05-09 162433.png',0,'2025-07-29 05:55:08',NULL),(135,58,'passbook_copy','D:\\hr_management_system\\hr-management\\uploads\\abhay_passbook_copy_1753788307883_Screenshot 2025-05-09 005331.png',0,'2025-07-29 05:55:08',NULL),(136,58,'additional_document','D:\\hr_management_system\\hr-management\\uploads\\abhay_additional_document_1753788307887_Screenshot 2025-05-10 022912.png',0,'2025-07-29 05:55:08','resume'),(169,64,'photo','E:\\Hr_manag\\hr-management\\uploads\\shanu_photo_1754120433722_WhatsApp Image 2025-07-14 at 14.11.11_75ee7045.jpg',0,'2025-08-02 02:10:34',NULL),(170,56,'photo','E:\\Hr_manag\\hr-management\\uploads\\jasw_photo_1755684894350_Screenshot (8).png',0,'2025-08-20 04:44:54',NULL);
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holidays`
--

DROP TABLE IF EXISTS `holidays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holidays` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `type` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_holiday_date` (`date`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holidays`
--

LOCK TABLES `holidays` WRITE;
/*!40000 ALTER TABLE `holidays` DISABLE KEYS */;
INSERT INTO `holidays` VALUES (1,'Independence Day','2025-08-15','CUSTOM',NULL),(2,'Holiday','2025-06-29','SUNDAY',NULL),(3,'Holiday','2025-06-22','SUNDAY',NULL),(4,'Holiday','2025-06-15','SUNDAY',NULL),(5,'Holiday','2025-06-08','SUNDAY',NULL),(6,'Holiday','2025-06-01','SUNDAY',NULL),(7,'Holiday','2025-06-14','SATURDAY_2_4',NULL),(8,'Holiday','2025-06-28','SATURDAY_2_4',NULL),(9,'Samvatsari','2025-08-27','CUSTOM',NULL),(10,'Janmasthami','2025-08-16','CUSTOM',NULL),(11,'Eid','2025-06-07','CUSTOM',NULL),(12,'Makar Sankranti','2025-01-14','CUSTOM',NULL),(13,'Maha Shivratri','2025-02-26','CUSTOM',NULL),(14,'Holi','2025-03-14','CUSTOM',NULL),(15,'Holi','2025-03-15','CUSTOM',NULL),(16,'Ramjan-Eid','2025-03-31','CUSTOM',NULL),(17,'Mahavir Jyanti','2025-04-10','CUSTOM',NULL),(18,'Dr. Saheb Ambedkar\'s Birthday','2025-04-14','CUSTOM',NULL),(19,'Good friday','2025-04-18','CUSTOM',NULL),(20,'Parshuram Jayanti','2025-04-29','CUSTOM',NULL),(21,'EID','2025-09-05','CUSTOM',NULL),(22,'Gandhi\'s birthday','2025-10-02','CUSTOM',NULL),(23,'Diwali','2025-10-20','CUSTOM',NULL),(24,'Bhai bij','2025-10-23','CUSTOM',NULL),(25,'Vikramsamvant New year Day','2025-10-22','CUSTOM',NULL),(26,'Sardar patel birthday','2025-10-31','CUSTOM',NULL),(27,'Guru Nanak birthday','2025-11-05','CUSTOM',NULL),(28,'Christmas','2025-12-25','CUSTOM',NULL),(30,'Holiday','2025-01-12','SUNDAY',NULL),(31,'Holiday','2025-01-19','SUNDAY',NULL),(32,'Holiday','2025-01-26','SUNDAY',NULL),(33,'Holiday','2025-01-11','SATURDAY_2_4',NULL),(34,'Holiday','2025-01-25','SATURDAY_2_4',NULL),(35,'Holiday','2025-02-02','SUNDAY',NULL),(37,'Holiday','2025-02-09','SUNDAY',NULL),(38,'Holiday','2025-02-16','SUNDAY',NULL),(39,'Holiday','2025-02-23','SUNDAY',NULL),(40,'Holiday','2025-02-08','SATURDAY_2_4',NULL),(41,'Holiday','2025-02-22','SATURDAY_2_4',NULL),(42,'Holiday','2025-12-07','SUNDAY',NULL),(43,'Holiday','2025-12-14','SUNDAY',NULL),(44,'Holiday','2025-12-21','SUNDAY',NULL),(45,'Holiday','2025-12-28','SUNDAY',NULL),(46,'Holiday','2025-12-13','SATURDAY_2_4',NULL),(47,'Holiday','2025-12-27','SATURDAY_2_4',NULL),(48,'Holiday','2025-07-06','SUNDAY',NULL),(49,'Holiday','2025-07-13','SUNDAY',NULL),(50,'Holiday','2025-07-20','SUNDAY',NULL),(51,'Holiday','2025-07-27','SUNDAY',NULL),(52,'Holiday','2025-07-12','SATURDAY_2_4',NULL),(53,'Holiday','2025-07-26','SATURDAY_2_4',NULL),(54,'Holiday','2025-08-03','SUNDAY',NULL),(55,'Holiday','2025-08-10','SUNDAY',NULL),(56,'Holiday','2025-08-17','SUNDAY',NULL),(57,'Holiday','2025-08-24','SUNDAY',NULL),(58,'Holiday','2025-08-31','SUNDAY',NULL),(59,'Holiday','2025-08-09','SATURDAY_2_4',NULL),(60,'Holiday','2025-08-23','SATURDAY_2_4',NULL),(61,'Holiday','2025-03-02','SUNDAY',NULL),(62,'Holiday','2025-03-09','SUNDAY',NULL),(63,'Holiday','2025-03-16','SUNDAY',NULL),(64,'Holiday','2025-03-23','SUNDAY',NULL),(65,'Holiday','2025-03-30','SUNDAY',NULL),(66,'Holiday','2025-03-08','SATURDAY_2_4',NULL),(67,'Holiday','2025-03-22','SATURDAY_2_4',NULL),(68,'Holiday','2025-04-06','SUNDAY',NULL),(69,'Holiday','2025-04-13','SUNDAY',NULL),(70,'Holiday','2025-04-20','SUNDAY',NULL),(71,'Holiday','2025-04-27','SUNDAY',NULL),(72,'Holiday','2025-04-12','SATURDAY_2_4',NULL),(73,'Holiday','2025-04-26','SATURDAY_2_4',NULL),(74,'Holiday','2025-05-04','SUNDAY',NULL),(75,'Holiday','2025-05-11','SUNDAY',NULL),(76,'Holiday','2025-05-18','SUNDAY',NULL),(77,'Holiday','2025-05-25','SUNDAY',NULL),(78,'Holiday','2025-05-10','SATURDAY_2_4',NULL),(79,'Holiday','2025-05-24','SATURDAY_2_4',NULL),(80,'Holiday','2025-11-02','SUNDAY',NULL),(81,'Holiday','2025-11-09','SUNDAY',NULL),(82,'Holiday','2025-11-16','SUNDAY',NULL),(83,'Holiday','2025-11-23','SUNDAY',NULL),(84,'Holiday','2025-11-30','SUNDAY',NULL),(85,'Holiday','2025-11-08','SATURDAY_2_4',NULL),(86,'Holiday','2025-11-22','SATURDAY_2_4',NULL),(87,'Holiday','2025-10-05','SUNDAY',NULL),(88,'Holiday','2025-10-12','SUNDAY',NULL),(89,'Holiday','2025-10-19','SUNDAY',NULL),(90,'Holiday','2025-10-26','SUNDAY',NULL),(91,'Holiday','2025-10-11','SATURDAY_2_4',NULL),(92,'Holiday','2025-10-25','SATURDAY_2_4',NULL),(93,'Holiday','2025-09-07','SUNDAY',NULL),(94,'Holiday','2025-09-14','SUNDAY',NULL),(95,'Holiday','2025-09-21','SUNDAY',NULL),(96,'Holiday','2025-09-28','SUNDAY',NULL),(97,'Holiday','2025-09-13','SATURDAY_2_4',NULL),(98,'Holiday','2025-09-27','SATURDAY_2_4',NULL);
/*!40000 ALTER TABLE `holidays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_applications`
--

DROP TABLE IF EXISTS `leave_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_applications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `leave_type` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `applied_on` date NOT NULL,
  `remaining_leaves` double NOT NULL,
  `is_half_day` bit(1) DEFAULT NULL,
  `approver_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `leave_applications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=156 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_applications`
--

LOCK TABLES `leave_applications` WRITE;
/*!40000 ALTER TABLE `leave_applications` DISABLE KEYS */;
INSERT INTO `leave_applications` VALUES (96,52,'HALF_DAY_CL','2025-05-31','2025-05-31','sdf','APPROVED','2025-05-31',11.5,_binary '',50),(97,52,'CL','2025-06-05','2025-06-09','sdfg','APPROVED','2025-05-31',7.5,_binary '\0',50),(98,58,'EL','2025-06-02','2025-06-05','asdf','APPROVED','2025-06-01',16,_binary '\0',57),(99,56,'HALF_DAY_CL','2025-06-02','2025-06-02','sddf','REJECTED','2025-06-01',12,_binary '',52),(100,56,'CL','2025-06-03','2025-06-03','asdfv','REJECTED','2025-06-02',12,_binary '\0',52),(101,56,'HALF_DAY_EL','2025-06-04','2025-06-04','sdf','REJECTED','2025-06-03',20,_binary '',52),(102,56,'CL','2025-06-05','2025-06-05','asdfg','REJECTED','2025-06-04',1,_binary '\0',52),(103,56,'EL','2025-06-06','2025-06-15','asfdg','APPROVED','2025-06-05',0,_binary '\0',52),(104,59,'EL','2025-06-05','2025-06-14','asdf','APPROVED','2025-06-05',10,_binary '\0',52),(105,59,'CL','2025-06-15','2025-06-16','asdf','REJECTED','2025-06-05',1,_binary '\0',52),(106,59,'EL','2025-06-16','2025-06-17','fghj','APPROVED','2025-06-05',8,_binary '\0',52),(107,59,'EL','2025-06-18','2025-06-25','dfgh','APPROVED','2025-06-05',0,_binary '\0',52),(108,60,'CL','2025-08-04','2025-08-11','sdf','APPROVED','2025-06-09',0,_binary '\0',52),(109,60,'HALF_DAY_EL','2025-07-02','2025-07-02','asd','REJECTED','2025-06-10',10,_binary '',52),(110,60,'EL','2025-07-14','2025-07-18','aASD','APPROVED','2025-06-10',10,_binary '\0',52),(111,60,'EL','2025-06-10','2025-06-19','asd','APPROVED','2025-06-10',0,_binary '\0',52),(112,60,'EL','2025-08-12','2025-08-16','asc','APPROVED','2025-07-10',0,_binary '\0',52),(113,62,'EL','2025-07-10','2025-07-20','asd','REJECTED','2025-07-10',20,_binary '\0',52),(114,62,'EL','2025-08-10','2025-08-25','sdf','APPROVED','2025-06-10',0,_binary '\0',52),(115,63,'EL','2025-08-01','2025-08-15','Advance EL for August','APPROVED','2025-06-12',0,_binary '\0',52),(116,64,'EL','2025-08-01','2025-08-15','Advance EL for August','APPROVED','2025-06-12',0,_binary '\0',52),(117,64,'EL','2025-09-01','2025-09-05','Additional EL for September','APPROVED','2025-06-12',0,_binary '\0',52),(118,65,'EL','2025-06-13','2025-06-17','asd','APPROVED','2025-06-13',5,_binary '\0',52),(119,65,'EL','2025-12-10','2025-12-24','asdf','APPROVED','2025-06-13',0,_binary '\0',52),(121,65,'CL','2025-09-09','2025-09-16','asdxf','REJECTED','2025-06-13',6,_binary '\0',52),(122,66,'HALF_DAY_CL','2025-07-08','2025-07-08','sdcf','APPROVED','2025-06-13',0.5,_binary '',52),(123,65,'CL','2025-12-01','2025-12-06','df','REJECTED','2025-06-13',6,_binary '\0',52),(124,67,'CL','2025-09-01','2025-09-05','asd','APPROVED','2025-06-16',1,_binary '\0',52),(125,67,'CL','2025-06-16','2025-06-16','asd','APPROVED','2025-06-16',0,_binary '\0',52),(126,70,'HALF_DAY_CL','2025-06-23','2025-06-23','sdf','CANCELLED','2025-06-21',0.5,_binary '',56),(127,70,'HALF_DAY_CL','2025-06-26','2025-06-26','dfg','REJECTED','2025-06-21',0.5,_binary '',56),(128,56,'HALF_DAY_EL','2025-07-07','2025-07-07','df','APPROVED','2025-06-21',0,_binary '',52),(129,56,'HALF_DAY_EL','2025-08-19','2025-08-19','sdf','APPROVED','2025-06-21',9,_binary '',52),(130,70,'HALF_DAY_LWP','2025-06-24','2025-06-24','sdf','APPROVED','2025-06-23',300,_binary '',56),(131,70,'CL','2025-06-25','2025-06-30','zxc','APPROVED','2025-06-23',1.5,_binary '\0',56),(132,70,'EL','2025-07-01','2025-07-07','sdf','APPROVED','2025-06-23',3,_binary '\0',56),(133,70,'HALF_DAY_EL','2025-07-08','2025-07-08','sdf','APPROVED','2025-06-23',2.5,_binary '',56),(134,70,'LWP','2025-07-09','2025-07-14','sdf','APPROVED','2025-06-23',300,_binary '\0',56),(135,70,'HALF_DAY_LWP','2025-07-15','2025-07-15','df','APPROVED','2025-06-23',300,_binary '',56),(136,70,'PL','2025-07-17','2025-07-31','sdf','APPROVED','2025-06-23',0,_binary '\0',56),(137,70,'HALF_DAY_CL','2025-08-04','2025-08-04','dfgh','APPROVED','2025-06-23',1,_binary '',56),(138,71,'HALF_DAY_CL','2025-08-13','2025-08-13','sdf','APPROVED','2025-06-23',0.5,_binary '',70),(139,70,'CL','2025-08-11','2025-08-11','sdfsdf','APPROVED','2025-06-23',0,_binary '\0',56),(140,72,'HALF_DAY_CL','2025-06-23','2025-06-23','dfg','CANCELLED','2025-06-23',5,_binary '',50),(141,72,'HALF_DAY_EL','2025-06-24','2025-06-24','dfg','CANCELLED','2025-06-23',6,_binary '',50),(142,72,'HALF_DAY_LWP','2025-06-25','2025-06-25','sdfg','CANCELLED','2025-06-23',300,_binary '',50),(143,72,'CL','2025-06-26','2025-06-26','sdfg','CANCELLED','2025-06-23',6,_binary '\0',50),(144,72,'EL','2025-06-27','2025-06-30','sdfcg','CANCELLED','2025-06-23',10,_binary '\0',50),(145,52,'PL','2025-08-04','2025-08-18','xcvg','APPROVED','2025-06-24',0,_binary '\0',50),(146,73,'CL','2025-06-24','2025-06-24','sdf','REJECTED','2025-06-27',1,_binary '\0',70),(147,73,'CL','2025-06-26','2025-06-26','sdf','REJECTED','2025-06-27',1,_binary '\0',70),(148,73,'CL','2025-06-27','2025-06-28','sdf','REJECTED','2025-06-27',1,_binary '\0',70),(149,73,'CL','2025-06-28','2025-06-30','sdf','PENDING','2025-06-27',1,_binary '\0',70),(150,50,'PL','2025-06-30','2025-07-14','sdf','PENDING','2025-06-27',15,_binary '\0',48),(151,50,'HALF_DAY_CL','2025-06-23','2025-06-23','sdf','PENDING','2025-06-27',1,_binary '',48),(152,50,'HALF_DAY_CL','2025-06-25','2025-06-25','sdf','PENDING','2025-06-27',1,_binary '',48),(153,50,'HALF_DAY_CL','2025-06-26','2025-06-26','sdf','PENDING','2025-06-27',1,_binary '',48),(154,70,'EL','2025-08-24','2025-08-24','sdfsd','REJECTED','2025-06-28',12.5,_binary '\0',56),(155,56,'HALF_DAY_CL','2025-08-06','2025-08-06','sdfgv','APPROVED','2025-08-06',0.5,_binary '',52);
/*!40000 ALTER TABLE `leave_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monthly_cl_accrual`
--

DROP TABLE IF EXISTS `monthly_cl_accrual`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monthly_cl_accrual` (
  `user_id` bigint NOT NULL,
  `accrual` double DEFAULT NULL,
  `month` int NOT NULL,
  PRIMARY KEY (`user_id`,`month`),
  CONSTRAINT `FKpm1fbt35iy512t8xu335kk7em` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monthly_cl_accrual`
--

LOCK TABLES `monthly_cl_accrual` WRITE;
/*!40000 ALTER TABLE `monthly_cl_accrual` DISABLE KEYS */;
INSERT INTO `monthly_cl_accrual` VALUES (50,1,6),(50,1,7),(50,1,8),(50,1,9),(50,1,10),(50,1,11),(50,1,12),(52,1,6),(52,1,7),(52,1,8),(52,1,9),(52,1,10),(52,1,11),(52,1,12),(53,1,6),(53,1,7),(53,1,8),(53,1,9),(53,1,10),(53,1,11),(53,1,12),(55,1,6),(55,1,7),(55,1,8),(55,1,9),(55,1,10),(55,1,11),(55,1,12),(56,1,8),(56,1,9),(56,1,10),(56,1,11),(56,1,12),(57,1,6),(57,1,7),(57,1,8),(57,1,9),(57,1,10),(57,1,11),(57,1,12),(58,1,6),(58,1,7),(58,1,8),(58,1,9),(58,1,10),(58,1,11),(58,1,12),(59,1,1),(59,1,2),(59,1,3),(59,1,4),(59,1,5),(59,1,6),(59,1,7),(59,1,8),(59,1,9),(59,1,10),(59,1,11),(59,1,12),(60,1,1),(60,1,2),(60,1,3),(60,1,4),(60,1,5),(60,1,6),(60,1,7),(60,1,8),(60,1,9),(60,1,10),(60,1,11),(60,1,12),(61,1,1),(61,1,2),(61,1,3),(61,1,4),(61,1,5),(61,1,6),(61,1,7),(61,1,8),(61,1,9),(61,1,10),(61,1,11),(61,1,12),(62,1,7),(62,1,8),(62,1,9),(62,1,10),(62,1,11),(62,1,12),(63,1,6),(63,1,7),(63,1,8),(63,1,9),(63,1,10),(63,1,11),(63,1,12),(64,1,6),(64,1,7),(64,1,8),(64,1,9),(64,1,10),(64,1,11),(64,1,12),(65,1,1),(65,1,2),(65,1,3),(65,1,4),(65,1,5),(65,1,6),(65,1,7),(65,1,8),(65,1,9),(65,1,10),(65,1,11),(65,1,12),(66,1,6),(66,1,7),(66,1,8),(66,1,9),(66,1,10),(66,1,11),(66,1,12),(67,1,1),(67,1,2),(67,1,3),(67,1,4),(67,1,5),(67,1,6),(67,1,7),(67,1,8),(67,1,9),(67,1,10),(67,1,11),(67,1,12),(68,1,6),(68,1,7),(68,1,8),(68,1,9),(68,1,10),(68,1,11),(68,1,12),(70,1,1),(70,1,2),(70,1,3),(70,1,4),(70,1,5),(70,1,6),(70,1,7),(70,1,8),(70,1,9),(70,1,10),(70,1,11),(70,1,12),(71,1,6),(71,1,7),(71,1,8),(71,1,9),(71,1,10),(71,1,11),(71,1,12),(72,1,1),(72,1,2),(72,1,3),(72,1,4),(72,1,5),(72,1,6),(72,1,7),(72,1,8),(72,1,9),(72,1,10),(72,1,11),(72,1,12),(73,1,6),(73,1,7),(73,1,8),(73,1,9),(73,1,10),(73,1,11),(73,1,12),(76,1,1),(76,1,2),(76,1,3),(76,1,4),(76,1,5),(76,1,6),(76,1,7),(76,1,8),(76,1,9),(76,1,10),(76,1,11),(76,1,12);
/*!40000 ALTER TABLE `monthly_cl_accrual` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK71lqwbwtklmljk3qlsugr1mig` (`token`),
  KEY `FKk3ndxg5xp6v7wd4gjyusp15gq` (`user_id`),
  CONSTRAINT `FKk3ndxg5xp6v7wd4gjyusp15gq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pending_signups`
--

DROP TABLE IF EXISTS `pending_signups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pending_signups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `reporting_to_id` bigint DEFAULT NULL,
  `employee_id` varchar(255) NOT NULL,
  `join_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `employee_id` (`employee_id`),
  KEY `reporting_to_id` (`reporting_to_id`),
  CONSTRAINT `pending_signups_ibfk_1` FOREIGN KEY (`reporting_to_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pending_signups`
--

LOCK TABLES `pending_signups` WRITE;
/*!40000 ALTER TABLE `pending_signups` DISABLE KEYS */;
INSERT INTO `pending_signups` VALUES (1,'nmnm','nmnm','$2a$10$ZMMKYYP.z58F4sUJcrXECeVLzJP7OZrwunnMSBIwFkKoCUT8KaaWm','nmnm@gmail.com','Java','INTERN','Male',56,'nmnm1234','2025-06-30','REJECTED','wrong details','2025-06-28 11:55:08'),(5,'asdfghj','asdfghj','$2a$10$ilA5btBfw5MItDGzxjmMK.uhOpqp1yaQdrxKkkJZc4pkt2NirVNb2','asdfghj@gmail.com','Java','INTERN','Male',56,'asdfghj','2025-06-30','REJECTED','dont like it','2025-06-29 14:15:27'),(6,'Test User','testuser','$2a$10$aUQ.gZifyHl85nsFExFToeUykXJxYdWPcyj6T6s2mOl68/L/QIr9K','test@bisag-n.gov.in','Admin (Administration)','HR','Male',NULL,'E12345','2025-07-09','REJECTED','Admin decision','2025-07-09 07:01:45');
/*!40000 ALTER TABLE `pending_signups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'HR','Responsible for managing department tasks and overseeing team operations.'),(2,'Director','Responsible for overseeing department functions and strategic decisions.'),(3,'Employee','Handles day-to-day tasks and operations assigned by supervisors or department heads.\n\n'),(5,'PROJECT_MANAGER',NULL),(6,'ASSISTANT_DIRECTOR',NULL),(7,'SUPPORT',NULL),(8,'Intern',NULL),(9,'Sweeper',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `department` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `casual_leave_used` double NOT NULL DEFAULT '0',
  `casual_leave_remaining` double NOT NULL DEFAULT '0',
  `earned_leave_used` double DEFAULT '0',
  `earned_leave_remaining` double NOT NULL DEFAULT '0',
  `maternity_leave_used` double NOT NULL DEFAULT '0',
  `maternity_leave_remaining` double NOT NULL DEFAULT '182',
  `paternity_leave_used` double NOT NULL DEFAULT '0',
  `paternity_leave_remaining` double NOT NULL DEFAULT '15',
  `department_id` bigint DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'PENDING',
  `leave_without_payment` double NOT NULL,
  `half_day_lwp` double NOT NULL,
  `reporting_to` bigint DEFAULT NULL,
  `join_date` date NOT NULL DEFAULT (curdate()),
  `earned_leave_remaining_first_half` double DEFAULT NULL,
  `earned_leave_remaining_second_half` double DEFAULT NULL,
  `earned_leave_used_first_half` double NOT NULL DEFAULT '0',
  `earned_leave_used_second_half` double NOT NULL DEFAULT '0',
  `last_initialized_year` int DEFAULT NULL,
  `employee_id` varchar(255) NOT NULL,
  `disapprove_reason` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `father_name` varchar(255) DEFAULT NULL,
  `mother_name` varchar(255) DEFAULT NULL,
  `is_fresher` tinyint(1) DEFAULT '1',
  `profile_verification_status` varchar(255) NOT NULL,
  `emergency_contact_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_employee_id` (`employee_id`),
  KEY `fk_user_department` (`department_id`),
  KEY `fk_reporting_to` (`reporting_to`),
  KEY `idx_profile_verification_status` (`profile_verification_status`),
  CONSTRAINT `fk_reporting_to` FOREIGN KEY (`reporting_to`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_user_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'reblgamer40@gmail.com','Super Admin','$2a$10$ANks2o6gZ373FOQyF0TreOfETEyoNrcP0gFbcp2xINhRmWBgc5rKO','SUPER_ADMIN','superadmin',NULL,0,1,0,20,0,0,0,15,NULL,'ACTIVE',0,0,NULL,'2025-07-12',NULL,NULL,0,0,2025,'SA001',NULL,NULL,NULL,NULL,0,'PENDING',NULL),(42,'GIS','director@bisag-n.gov.in','Alice Smith','$2a$10$oCyEL5qY8fr.meTJhXlPfeeNURnNIcoZcTx5K8kVjkIPBQfL8kWR.','DIRECTOR','alicesmith','Female',0,12,0,20,0,180,0,15,1,'ACTIVE',0,0,NULL,'2025-06-03',NULL,NULL,0,0,NULL,'101',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(44,'GIS','asstdirector@bisag-n.gov.in','Bob Johnson','$2a$10$oCyEL5qY8fr.meTJhXlPfeeNURnNIcoZcTx5K8kVjkIPBQfL8kWR.','ASSISTANT_DIRECTOR','bobjohnson','Male',0,12,0,20,0,180,0,15,1,'ACTIVE',0,0,42,'2025-06-03',NULL,NULL,0,0,NULL,'102',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(45,'GIS','projmanager@bisag-n.gov.in','Charlie Brown','$2a$10$oCyEL5qY8fr.meTJhXlPfeeNURnNIcoZcTx5K8kVjkIPBQfL8kWR.','PROJECT_MANAGER','charliebrown','Male',0,12,0,20,0,180,0,15,1,'ACTIVE',0,0,44,'2025-06-03',NULL,NULL,0,0,NULL,'103',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(47,'GIS','employee@bisag-n.gov.in','David Wilson','$2a$10$oCyEL5qY8fr.meTJhXlPfeeNURnNIcoZcTx5K8kVjkIPBQfL8kWR.','EMPLOYEE','davidwilson','Male',0,12,0,20,0,180,0,15,1,'ACTIVE',0,0,45,'2025-06-03',NULL,NULL,0,0,NULL,'104',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(48,'Admin (Administration)','anant@gmail.com','Anant Agarwal','$2a$10$CgOWH4c5O38t/OV1FS0ra.EsvTPiaPsqi5zIt0SK0K8/zD7dywTRC','director','anant','Male',0,12,0,20,0,182,0,15,6,'ACTIVE',0,0,NULL,'2025-06-03',NULL,NULL,0,0,NULL,'105',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(49,NULL,'aaf@gmail.com','Aafreen Moyal','$2a$10$VNfxT2P5aVqlhF/9RscMr.BijsV7lXnEJl3PQt3yOiLgkd7zitzVe','director','aaf','Female',0,12,0,20,0,182,0,15,NULL,'ACTIVE',0,0,NULL,'2025-06-03',NULL,NULL,0,0,NULL,'106',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(50,'Software','harsh@gmail.com','Harshit Jain','$2a$10$HxRv0MTZ7bk10Wf7NEr0C.NZ236bvVb9DdGAQaqacmNQn/SoGfHHe','ASSISTANT_DIRECTOR','harsh','Male',0,3,0,20,0,182,0,15,2,'ACTIVE',0,0,48,'2025-06-03',NULL,NULL,0,0,2025,'107',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(51,'Software','himan@gmail.com','Himanshu Kumar','$2a$10$8WdcsqIpc.qBcfJNudWXjeFAWhyhrtRAJ8xNG2nLlXPsfToA2QK6C','ASSISTANT_DIRECTOR','himan','Male',0,12,0,20,0,182,0,15,2,'ACTIVE',0,0,48,'2025-06-03',NULL,NULL,0,0,NULL,'108',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(52,'Software','saksh@gmail.com','Saksham ','$2a$10$jGmJ9rH52jG9sqx7hwjI/OjABLZbNWL8jeaIqoxnjYdl1RzZPH0aK','PROJECT_MANAGER','saksh','Male',3.5,0,0,20,0,182,15,0,2,'ACTIVE',0,0,50,'2025-06-03',NULL,NULL,0,0,2025,'109',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(53,'Software','asd@gmail.com','asd','$2a$10$4PMLqXYud3Vt2JsmqLUHQuRIdSzAzI0UK7lJXpSetCN82yTSMKubi','EMPLOYEE','asd','Male',0,2,0,20,0,182,0,15,2,'ACTIVE',0,0,52,'2025-06-03',NULL,NULL,0,0,2025,'110',NULL,'1998-02-22','gfds','lkjhgf',1,'VERIFIED','9878675645'),(54,'Administration','sdf@gmail.com','aad','$2a$10$P.lSXJSOPCZDnKMANzjBguJr2fbH7gX76IrpkooU/2jlWNPkna9HG','HR','asda','Male',0,12,0,20,0,182,0,15,NULL,'ACTIVE',0,0,NULL,'2025-06-03',NULL,NULL,0,0,NULL,'111',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(55,'Administration','rebl@gmail.com','Rebl','$2a$10$efE.t6J6LeYUpi9nXz14te8iV9liRc8uTlY9GiuNwYJwxnfoDgIQG','HR','rebl','Male',0,2,0,20,0,182,0,15,NULL,'ACTIVE',0,0,NULL,'2025-06-03',NULL,NULL,0,0,2025,'112',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(56,'Software','jasw@gmail.com','Jaswant ','$2a$10$OGbsUYpB6K3qBpjLX5jrDejy4aocOsfhBLLKNMs9iwsYbm2wSovZK','EMPLOYEE','jasw','Male',0.5,0.5,0,9,0,0,0,15,2,'ACTIVE',0,0,52,'2025-08-01',NULL,NULL,10,1,2025,'113',NULL,'2004-02-11','asxdcvbn','sxdc',1,'SUBMITTED','7894561245'),(57,'Defence ','laksh@gmail.com','Lakshay Parashar','$2a$10$GH2P4hF0uVgoe4f2MyehheBzWdHmzgEgaHQ6/zVWo.ZpLSI3S6dVi','ASSISTANT_DIRECTOR','laksh','Male',0,3,0,20,0,0,0,15,1,'ACTIVE',0,0,51,'2025-06-03',NULL,NULL,0,0,2025,'114',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(58,'Defence ','abhay@gmail.com','Abhay','$2a$10$3LDYOGaIuhJhBehQMSWiOeOjR3ZvUfSuf.dNW0amSRiJrmB/qFs2K','PROJECT_MANAGER','abhay','Male',0,3,4,16,0,0,0,15,1,'ACTIVE',0,0,52,'2025-06-03',NULL,NULL,4,0,2025,'115',NULL,'1998-12-11','asdf','fghjk',1,'EDIT_ALLOWED','1234567898'),(59,'Software','opop@gmail.com','opop','$2a$10$e9ewLvlwScIOtq.5X8kw7.4WhuU/UfeL7z3avQGAcHLsunhLXLgUq','EMPLOYEE','opop','Male',0,7,0,10,0,0,0,15,2,'ACTIVE',0,0,52,'2025-01-01',NULL,NULL,20,0,2025,'116',NULL,'1998-11-11','asdfg','lkjhg',1,'PENDING','1234567890'),(60,'Software','aadi@gmail.com','Aditya Kumar','$2a$10$2LRfUxIgnnCzcccQGR.KQ.gLLQxSlz2vSFuZ0NsaltyTqpJrqFCZe','EMPLOYEE','aadi','Male',6,1,0,0,0,0,0,15,2,'ACTIVE',0,0,52,'2025-01-01',NULL,NULL,10,10,2025,'117',NULL,'1999-02-11','gfda','gfds',1,'VERIFIED','1234567898'),(61,'Software','asdf@gmail.com','asdf','$2a$10$fhZA1ZV4J4uvh.FVer.VTO7gVPKR49T/H7YaUx6z1uInR3tjI.h/G','EMPLOYEE','asdf','Female',0,6,0,10,0,182,0,0,2,'ACTIVE',0,0,52,'2025-01-01',NULL,NULL,0,0,NULL,'118',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(62,'Software','abhi@gmail.com','Abhishek Kumar','$2a$10$3DUVqKjniSeoiUIIL.WiMeARdeQJ7nm0ysB250e0tKU.dN.G0ZX5O','EMPLOYEE','abhi','Male',0,2,0,0,0,0,0,15,2,'ACTIVE',0,0,52,'2025-07-10',NULL,NULL,0,16,2025,'119',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(63,'Software','asdfg@gmail.com','asdfg','$2a$10$7u4I3DjjGEnGMEhYra5bDOt0/V2kfTov7z6n3IC04HqQp3ghX8yQm','EMPLOYEE','asdfg','Male',0,1,0,0,0,0,0,15,2,'ACTIVE',0,0,52,'2025-06-12',NULL,NULL,0,15,NULL,'120',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(64,'Software','shanu@gmail.com','shanu','$2a$10$bHatGUNpaaAKwZ3kXm3l8OK2p0S.MBu5enml/TyD3iUXs6W3fCYkm','EMPLOYEE','shanu','Male',0,3,0,0,0,0,0,15,2,'ACTIVE',0,0,52,'2025-06-12',NULL,NULL,0,20,2025,'121',NULL,'1888-12-12','asdfghjk','asdfghj',1,'EDIT_ALLOWED','7894561230'),(65,'Software','john@gmail.com','jessica','$2a$10$8RRRMN4QZm8qv77fYoK4iehGElld03KS83OZ2BBfFxbu3BS2KWWc2','EMPLOYEE','jess','Female',0,6,0,0,0,182,0,0,2,'ACTIVE',0,0,52,'2025-01-01',NULL,NULL,5,15,2025,'122',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(66,'Software','kavish@gmail.com','Kavish','$2a$10$7wuE233NWeLZcFV4EVGfkOA.n2V5kgRFfuwevOmeD.9Gk6qrOfun6','EMPLOYEE','kavish','Male',0,0.5,0,10,0,0,0,15,2,'ACTIVE',0,0,52,'2025-06-13',NULL,NULL,0,0,2025,'123',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(67,'Software','ash@gmail.com','ash','$2a$10$ccmnBTEICAIGL26/Z7Tc6eQCZf3zo0VykggtRszrymIqH0AeTiGYW','EMPLOYEE','ash','Male',5,2,0,20,0,0,0,15,2,'ACTIVE',0,0,52,'2025-01-01',NULL,NULL,0,0,2025,'124',NULL,'1999-12-11','zxd','asdfgh',1,'VERIFIED','8978675646'),(68,'Software','ajay@gmail.com','Ajay kumar','$2a$10$IuexVPVERREZTfBQAOB8CuZx1Sdt8A7uFgEIyhE8vgKmvJPu3WC5u','EMPLOYEE','ajay','Male',0,2,0,20,0,0,0,15,2,'ACTIVE',0,0,52,'2025-06-20',NULL,NULL,0,0,2025,'125',NULL,'1998-12-11','ghk',';lkjhg',1,'VERIFIED','1234567897'),(69,NULL,'ansh@gmail.com','Ansh','$2a$10$iw2bBD7yE7b4R7efhqkcEO84gQMlzSUJqXWrdKuMFzR/u3ZAZ2N0q','director','ansh','Male',0,10,0,0,0,0,0,15,NULL,'ACTIVE',0,0,NULL,'2025-06-19',NULL,NULL,0,0,NULL,'ansh1234',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(70,'GIS (Geographic Information Systems)','vanshu@gmail.com','Vanshu','$2a$10$ANks2o6gZ373FOQyF0TreOfETEyoNrcP0gFbcp2xINhRmWBgc5rKO','EMPLOYEE','vanshu','Male',5.5,1.5,0,3,0,0,15,0,4,'ACTIVE',4,1,56,'2025-01-01',NULL,NULL,0,8.5,2025,'vansh123',NULL,'2004-01-31','sdcfgh','sdfgvbh',1,'VERIFIED',NULL),(71,'Java','sparsh@gmail.com','Sparsh Bansal','$2a$10$.aDsMXIXNotWCI3PURMqi.UbTtq.FKI4ujc9coEUz/dQ5y1wLh4hO','INTERN','sparsh','Male',0,0.5,0,10,0,0,0,15,8,'ACTIVE',0,0,70,'2025-06-01',NULL,NULL,0,0,2025,'SP1234',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(72,'Java','prince@gmail.com','prince','$2a$10$Ot4iCapQGdqs3Yfjqs/t8OvLMFlbs0KQYISB4t1/UVH/b3y06YUwa','PROJECT_MANAGER','prince','Male',0,7,0,20,0,0,0,15,8,'ACTIVE',0,0,50,'2025-01-01',NULL,NULL,0,0,2025,'PR_12345',NULL,'1998-01-01','azsxdcfvg','asdfgh',1,'VERIFIED','1234545'),(73,'Java','dishita@gmail.com','dishita patel','$2a$10$C0p7HkUYqtsJZCjTTgeufePprrrB0Vyg7XqlUoGPsRene1fGQrVzW','EMPLOYEE','dishita','Female',0,1,0,20,0,182,0,0,8,'ACTIVE',0,0,70,'2025-06-27',NULL,NULL,0,0,2025,'DISH123',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(74,'Java','zxcv@gmail.com','asdxf','$2a$10$YbjjK8SJyv8KQasYeRhtn..F.9/5kNWCPEbO3f7kBJZioOs4zOlG6','EMPLOYEE','zxcv','Male',0,10,0,0,0,0,0,15,8,'REJECTED',0,0,56,'2025-06-30',NULL,NULL,0,0,NULL,'zxc123','missing details',NULL,NULL,NULL,1,'PENDING',NULL),(75,'Java','nmmn@gmail.com','nmnm','$2a$10$oEanBkXOTqJj9.0o80yY4uSzCEMaDV5V55aYxwlc/r8GzrXYVAMV.','INTERN','nmmn','Male',0,10,0,0,0,0,0,15,8,'ACTIVE',0,0,56,'2025-06-30',NULL,NULL,0,0,NULL,'nmmn1234',NULL,NULL,NULL,NULL,1,'PENDING',NULL),(76,'GIS (Geographic Information Systems)','jaya@gmail.com','Jaya Patel','$2a$10$EUffl7aMr5bzLzu14HFJ4e5E5YDfanC3Wjj86S1HD0TdOkp65/xM6','PROJECT_MANAGER','jaya','Female',0,7,0,20,0,182,0,0,4,'ACTIVE',0,0,57,'2022-09-12',NULL,NULL,0,0,2025,'jayaETH12',NULL,'2001-06-05','sdfghn','asdfghjk',1,'VERIFIED',NULL),(77,'Admin (Administration)','kavishh@gmail.com','kavishh','$2a$10$pMAH965wsBKfxT9I.U7xU.ZeR8B4RvbmZuo/4qXh7f03bsEnOE.fq','HR','kavishh','Male',0,10,0,0,0,0,0,15,6,'ACTIVE',0,0,NULL,'2025-07-15',NULL,NULL,0,0,NULL,'Eth12345',NULL,NULL,NULL,NULL,1,'PENDING',NULL);
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

-- Dump completed on 2025-08-26 10:20:37

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 29 août 2026 à 13:18
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `inspectsanbd`
--

DELIMITER $$
--
-- Procédures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `POMELO_AFTER_ADD_PRIMARY_KEY` (IN `SCHEMA_NAME_ARGUMENT` VARCHAR(255), IN `TABLE_NAME_ARGUMENT` VARCHAR(255), IN `COLUMN_NAME_ARGUMENT` VARCHAR(255))   BEGIN
	DECLARE HAS_AUTO_INCREMENT_ID INT(11);
	DECLARE PRIMARY_KEY_COLUMN_NAME VARCHAR(255);
	DECLARE PRIMARY_KEY_TYPE VARCHAR(255);
	DECLARE SQL_EXP VARCHAR(1000);
	SELECT COUNT(*)
		INTO HAS_AUTO_INCREMENT_ID
		FROM `information_schema`.`COLUMNS`
		WHERE `TABLE_SCHEMA` = (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA()))
			AND `TABLE_NAME` = TABLE_NAME_ARGUMENT
			AND `COLUMN_NAME` = COLUMN_NAME_ARGUMENT
			AND `COLUMN_TYPE` LIKE '%int%'
			AND `COLUMN_KEY` = 'PRI';
	IF HAS_AUTO_INCREMENT_ID THEN
		SELECT `COLUMN_TYPE`
			INTO PRIMARY_KEY_TYPE
			FROM `information_schema`.`COLUMNS`
			WHERE `TABLE_SCHEMA` = (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA()))
				AND `TABLE_NAME` = TABLE_NAME_ARGUMENT
				AND `COLUMN_NAME` = COLUMN_NAME_ARGUMENT
				AND `COLUMN_TYPE` LIKE '%int%'
				AND `COLUMN_KEY` = 'PRI';
		SELECT `COLUMN_NAME`
			INTO PRIMARY_KEY_COLUMN_NAME
			FROM `information_schema`.`COLUMNS`
			WHERE `TABLE_SCHEMA` = (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA()))
				AND `TABLE_NAME` = TABLE_NAME_ARGUMENT
				AND `COLUMN_NAME` = COLUMN_NAME_ARGUMENT
				AND `COLUMN_TYPE` LIKE '%int%'
				AND `COLUMN_KEY` = 'PRI';
		SET SQL_EXP = CONCAT('ALTER TABLE `', (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA())), '`.`', TABLE_NAME_ARGUMENT, '` MODIFY COLUMN `', PRIMARY_KEY_COLUMN_NAME, '` ', PRIMARY_KEY_TYPE, ' NOT NULL AUTO_INCREMENT;');
		SET @SQL_EXP = SQL_EXP;
		PREPARE SQL_EXP_EXECUTE FROM @SQL_EXP;
		EXECUTE SQL_EXP_EXECUTE;
		DEALLOCATE PREPARE SQL_EXP_EXECUTE;
	END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `POMELO_BEFORE_DROP_PRIMARY_KEY` (IN `SCHEMA_NAME_ARGUMENT` VARCHAR(255), IN `TABLE_NAME_ARGUMENT` VARCHAR(255))   BEGIN
	DECLARE HAS_AUTO_INCREMENT_ID TINYINT(1);
	DECLARE PRIMARY_KEY_COLUMN_NAME VARCHAR(255);
	DECLARE PRIMARY_KEY_TYPE VARCHAR(255);
	DECLARE SQL_EXP VARCHAR(1000);
	SELECT COUNT(*)
		INTO HAS_AUTO_INCREMENT_ID
		FROM `information_schema`.`COLUMNS`
		WHERE `TABLE_SCHEMA` = (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA()))
			AND `TABLE_NAME` = TABLE_NAME_ARGUMENT
			AND `Extra` = 'auto_increment'
			AND `COLUMN_KEY` = 'PRI'
			LIMIT 1;
	IF HAS_AUTO_INCREMENT_ID THEN
		SELECT `COLUMN_TYPE`
			INTO PRIMARY_KEY_TYPE
			FROM `information_schema`.`COLUMNS`
			WHERE `TABLE_SCHEMA` = (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA()))
				AND `TABLE_NAME` = TABLE_NAME_ARGUMENT
				AND `COLUMN_KEY` = 'PRI'
			LIMIT 1;
		SELECT `COLUMN_NAME`
			INTO PRIMARY_KEY_COLUMN_NAME
			FROM `information_schema`.`COLUMNS`
			WHERE `TABLE_SCHEMA` = (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA()))
				AND `TABLE_NAME` = TABLE_NAME_ARGUMENT
				AND `COLUMN_KEY` = 'PRI'
			LIMIT 1;
		SET SQL_EXP = CONCAT('ALTER TABLE `', (SELECT IFNULL(SCHEMA_NAME_ARGUMENT, SCHEMA())), '`.`', TABLE_NAME_ARGUMENT, '` MODIFY COLUMN `', PRIMARY_KEY_COLUMN_NAME, '` ', PRIMARY_KEY_TYPE, ' NOT NULL;');
		SET @SQL_EXP = SQL_EXP;
		PREPARE SQL_EXP_EXECUTE FROM @SQL_EXP;
		EXECUTE SQL_EXP_EXECUTE;
		DEALLOCATE PREPARE SQL_EXP_EXECUTE;
	END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `affectation`
--

CREATE TABLE `affectation` (
  `IdAffectation` int(11) NOT NULL,
  `NomOrdre` varchar(80) NOT NULL,
  `MatrAgent` varchar(64) NOT NULL,
  `Fonction` varchar(50) NOT NULL,
  `EcritureDeleguee` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `affectation`
--

INSERT INTO `affectation` (`IdAffectation`, `NomOrdre`, `MatrAgent`, `Fonction`, `EcritureDeleguee`) VALUES
(1, 'OM-2026-001', 'AGT0002', 'chef_equipe', 0),
(2, 'OM-2026-001', 'AGT0003', 'chef_adjoint', 0),
(3, 'OM-2026-001', 'AGT0001', 'membre', 0),
(4, 'OM-2026-002', 'AGT0002', 'chef_equipe', 0),
(5, 'OM-2026-002', 'AGT0003', 'chef_equipe', 0),
(6, 'OM-2026-002', 'AGT0001', 'membre', 0),
(7, 'OM-2026-003', 'AGT0002', 'chef_equipe', 0),
(8, 'OM-2026-003', 'AGT0003', 'chef_adjoint', 0),
(9, 'OM-2026-003', 'AGT0001', 'membre', 0),
(10, 'OM-2026-004', 'AGT0005', 'chef_equipe', 0),
(11, 'OM-2026-004', 'AGT0004', 'chef_adjoint', 0),
(12, 'OM-2026-004', 'AGT0003', 'membre', 0),
(13, 'OM-2026-004', 'AGT0001', 'membre', 0),
(14, 'OM-2026-005', 'AGT0002', 'chef_equipe', 0),
(15, 'OM-2026-005', 'AGT0004', 'chef_adjoint', 0),
(16, 'OM-2026-005', 'AGT0005', 'membre', 0),
(17, 'OM-2026-006', 'AGT0005', 'chef_equipe', 0),
(18, 'OM-2026-006', 'AGT0004', 'chef_adjoint', 1),
(19, 'OM-2026-006', 'AGT0003', 'membre', 0);

-- --------------------------------------------------------

--
-- Structure de la table `agents`
--

CREATE TABLE `agents` (
  `MatrAgent` varchar(64) NOT NULL,
  `NomAgent` varchar(200) NOT NULL,
  `TelAgent` varchar(40) DEFAULT NULL,
  `Actif` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `agents`
--

INSERT INTO `agents` (`MatrAgent`, `NomAgent`, `TelAgent`, `Actif`) VALUES
('AGT0001', 'PUMU ANNUS', '0843352870', 1),
('AGT0002', 'DACHE TSHIMBADI', '0843352874', 1),
('AGT0003', 'GRADI MABIALA', '0843352890', 1),
('AGT0004', 'DEO MANDE', '0843352874', 1),
('AGT0005', 'DJESSY', '0843352874', 1);

-- --------------------------------------------------------

--
-- Structure de la table `aspnetroleclaims`
--

CREATE TABLE `aspnetroleclaims` (
  `Id` int(11) NOT NULL,
  `RoleId` varchar(255) NOT NULL,
  `ClaimType` longtext DEFAULT NULL,
  `ClaimValue` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `aspnetroles`
--

CREATE TABLE `aspnetroles` (
  `Id` varchar(255) NOT NULL,
  `Name` varchar(256) DEFAULT NULL,
  `NormalizedName` varchar(256) DEFAULT NULL,
  `ConcurrencyStamp` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `aspnetroles`
--

INSERT INTO `aspnetroles` (`Id`, `Name`, `NormalizedName`, `ConcurrencyStamp`) VALUES
('041c5406-9654-4548-a76f-061ec00ad996', 'Directeur Provincial', 'DIRECTEUR PROVINCIAL', NULL),
('41298905-c904-4fcf-b624-c23d04c07ddc', 'Agent du Secrétariat', 'AGENT DU SECRÉTARIAT', NULL),
('722bdaa4-682a-4d96-9803-a9a005dc33de', 'Chef d\'établissement', 'CHEF D\'ÉTABLISSEMENT', NULL),
('9dace318-19b9-47a2-8a07-7a722b721e7a', 'Contrôleur', 'CONTRÔLEUR', NULL),
('fdc9ade5-80c9-4a62-8796-2138741c50c3', 'Administrateur système', 'ADMINISTRATEUR SYSTÈME', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `aspnetuserclaims`
--

CREATE TABLE `aspnetuserclaims` (
  `Id` int(11) NOT NULL,
  `UserId` varchar(255) NOT NULL,
  `ClaimType` longtext DEFAULT NULL,
  `ClaimValue` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `aspnetuserlogins`
--

CREATE TABLE `aspnetuserlogins` (
  `LoginProvider` varchar(255) NOT NULL,
  `ProviderKey` varchar(255) NOT NULL,
  `ProviderDisplayName` longtext DEFAULT NULL,
  `UserId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `aspnetuserroles`
--

CREATE TABLE `aspnetuserroles` (
  `UserId` varchar(255) NOT NULL,
  `RoleId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `aspnetuserroles`
--

INSERT INTO `aspnetuserroles` (`UserId`, `RoleId`) VALUES
('2a9fe897-7e11-49fd-908b-1667788a12df', '9dace318-19b9-47a2-8a07-7a722b721e7a'),
('387df19e-d4b9-492a-9e9c-dfd1a20825ea', '9dace318-19b9-47a2-8a07-7a722b721e7a'),
('42a6ccd9-1a6e-432b-82b0-3726438f6b61', '9dace318-19b9-47a2-8a07-7a722b721e7a'),
('49b9a74d-1299-4e42-9817-bb3c1f7ce77b', '9dace318-19b9-47a2-8a07-7a722b721e7a'),
('8550bdea-bd4e-4915-87a5-276088cfdbb9', '41298905-c904-4fcf-b624-c23d04c07ddc'),
('b9a1ced9-0bf2-466e-aa6d-abad150e0c98', '9dace318-19b9-47a2-8a07-7a722b721e7a'),
('dffd1c0f-84e5-4b54-a527-428250ffe498', '041c5406-9654-4548-a76f-061ec00ad996'),
('usr-001', 'fdc9ade5-80c9-4a62-8796-2138741c50c3');

-- --------------------------------------------------------

--
-- Structure de la table `aspnetusers`
--

CREATE TABLE `aspnetusers` (
  `Id` varchar(255) NOT NULL,
  `Nom` varchar(200) NOT NULL,
  `Statut` varchar(40) NOT NULL,
  `Telephone` varchar(40) DEFAULT NULL,
  `Role` varchar(100) NOT NULL,
  `EcoleId` varchar(64) DEFAULT NULL,
  `AgentId` varchar(64) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UserName` varchar(256) DEFAULT NULL,
  `NormalizedUserName` varchar(256) DEFAULT NULL,
  `Email` varchar(256) DEFAULT NULL,
  `NormalizedEmail` varchar(256) DEFAULT NULL,
  `EmailConfirmed` tinyint(1) NOT NULL,
  `PasswordHash` longtext DEFAULT NULL,
  `SecurityStamp` longtext DEFAULT NULL,
  `ConcurrencyStamp` longtext DEFAULT NULL,
  `PhoneNumber` longtext DEFAULT NULL,
  `PhoneNumberConfirmed` tinyint(1) NOT NULL,
  `TwoFactorEnabled` tinyint(1) NOT NULL,
  `LockoutEnd` datetime(6) DEFAULT NULL,
  `LockoutEnabled` tinyint(1) NOT NULL,
  `AccessFailedCount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `aspnetusers`
--

INSERT INTO `aspnetusers` (`Id`, `Nom`, `Statut`, `Telephone`, `Role`, `EcoleId`, `AgentId`, `CreatedAt`, `UserName`, `NormalizedUserName`, `Email`, `NormalizedEmail`, `EmailConfirmed`, `PasswordHash`, `SecurityStamp`, `ConcurrencyStamp`, `PhoneNumber`, `PhoneNumberConfirmed`, `TwoFactorEnabled`, `LockoutEnd`, `LockoutEnabled`, `AccessFailedCount`) VALUES
('2a9fe897-7e11-49fd-908b-1667788a12df', 'GRADI MABIALA', 'actif', NULL, 'Contrôleur', NULL, 'AGT0003', '2026-08-26 08:17:05.882585', 'Grady@gmail.com', 'GRADY@GMAIL.COM', 'Grady@gmail.com', 'GRADY@GMAIL.COM', 1, 'AQAAAAIAAYagAAAAEE26N8NyHimG03nzmztmTsAboiW1X0l1fU2oP1OSu+r8cIm9ewYZJFgp+qqbdjXggQ==', 'EPVAKHY2RPNSWWGROFLZV5AW6M44JF6G', '251924ad-f2dc-4792-8d06-9c016062c7bd', NULL, 0, 0, NULL, 1, 0),
('387df19e-d4b9-492a-9e9c-dfd1a20825ea', 'DACHE TSHIMBADI', 'actif', NULL, 'Contrôleur', NULL, 'AGT0002', '2026-08-26 08:14:39.242253', 'Dache@gmail.com', 'DACHE@GMAIL.COM', 'Dache@gmail.com', 'DACHE@GMAIL.COM', 1, 'AQAAAAIAAYagAAAAEORcbFkAqjAt/6/ZIEv0NgoaRdwY9jtiI9kmXCugauUx6vHBQw1GcZ8NSNIFapttCA==', 'VCNMK24BECPWRC4JWS7E2VZ4HRRXYLKG', '9be32b80-520d-4c62-a6a9-30eac72c2d82', NULL, 0, 0, NULL, 1, 0),
('42a6ccd9-1a6e-432b-82b0-3726438f6b61', 'PUMU ANNUS', 'actif', NULL, 'Contrôleur', NULL, 'AGT0001', '2026-08-26 08:17:45.196997', 'Pumu@gmail.com', 'PUMU@GMAIL.COM', 'Pumu@gmail.com', 'PUMU@GMAIL.COM', 1, 'AQAAAAIAAYagAAAAEDwIvl9ZQFI4neuJdK8FtATTuNN3wFp6OVxzgT39hIBzoANIFKBVVR479jkOnKYyZw==', 'I3YEYJS2ZYCTJ65CS6JSV2WAFRH55BBH', 'b5f2e4b9-5bf6-43d8-8121-11fc0a27c8e1', NULL, 0, 0, NULL, 1, 0),
('49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'DJESSY', 'actif', NULL, 'Contrôleur', NULL, 'AGT0005', '2026-08-26 08:16:17.610040', 'Djessy@gmail.com', 'DJESSY@GMAIL.COM', 'Djessy@gmail.com', 'DJESSY@GMAIL.COM', 1, 'AQAAAAIAAYagAAAAENeV5IXjljXj5+Qz/Vra0muwE5YctcQHt9GxHE0ZELpfFqd353aXjRkIk/mWN+Dczg==', '5TCFRQ2AIJFUCMEPMAM57WPITTPAMWKO', '1f6e4f52-c177-4471-90f3-487263d766bb', NULL, 0, 0, NULL, 1, 0),
('8550bdea-bd4e-4915-87a5-276088cfdbb9', 'NTIAMA NDENDE', 'actif', NULL, 'Agent du Secrétariat', NULL, NULL, '2026-08-26 08:13:29.550925', 'ntiama@gmail.com', 'NTIAMA@GMAIL.COM', 'ntiama@gmail.com', 'NTIAMA@GMAIL.COM', 1, 'AQAAAAIAAYagAAAAEONpjSalZhtqm45FroOhks/VNd4Tf2lsJ8hLW8d7CGAoRobOL4ICtMIXn1wRNO9aog==', 'ISA5FQLK73L4LRSFRUZTAYG3CX47JII4', 'a8f83585-6196-47b5-84cc-3677235e1bcd', NULL, 0, 0, NULL, 1, 0),
('b9a1ced9-0bf2-466e-aa6d-abad150e0c98', 'DEO MANDE', 'actif', NULL, 'Contrôleur', NULL, 'AGT0004', '2026-08-26 08:15:28.988268', 'mandedeo17@gmail.com', 'MANDEDEO17@GMAIL.COM', 'mandedeo17@gmail.com', 'MANDEDEO17@GMAIL.COM', 1, 'AQAAAAIAAYagAAAAEGG8qzjBqjRanAHZvQhERjVD3RnFRh/xuTtJvikjxd5XWWAHvowyBC49OnyH+yOpVQ==', 'RMPLSBPHL7RBGQKFH2QSILKJIY4FUZNF', '5b061338-bfe5-4f4f-a334-6aeb9b88dbc5', NULL, 0, 0, NULL, 1, 0),
('dffd1c0f-84e5-4b54-a527-428250ffe498', 'RUTH MBOMA', 'actif', NULL, 'Directeur Provincial', NULL, NULL, '2026-08-26 08:12:26.503428', 'ruth@gmail.com', 'RUTH@GMAIL.COM', 'ruth@gmail.com', 'RUTH@GMAIL.COM', 1, 'AQAAAAIAAYagAAAAEKCexWn8aqhXsPuCNGRZ1R3jYHb+k8pGh3Csh+P5P7sqSbfxuOqWr20h1/UWvDEoow==', '6V26XG3DABSIXXMPV3JX5Y4WADSTMJQP', 'cba9f52d-1e03-45f3-8ac6-b795f5292221', NULL, 0, 0, NULL, 1, 0),
('usr-001', 'Admin Système', 'actif', NULL, 'Administrateur système', NULL, NULL, '2026-08-24 23:05:50.386859', 'admin@inspect-san.cd', 'ADMIN@INSPECT-SAN.CD', 'admin@inspect-san.cd', 'ADMIN@INSPECT-SAN.CD', 1, 'AQAAAAIAAYagAAAAENaxZFPj8e2RCtid5qKZ83y+XW7hE7f0c+CfGWvMW0FWjSRHNFhs52kEawDg3wd8nQ==', '5PFWYGMRVFQ4YPYN6XE2PNHV4XGSITHF', 'd706b614-9c2a-45d0-9edc-bedebc678123', NULL, 0, 0, NULL, 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `aspnetusertokens`
--

CREATE TABLE `aspnetusertokens` (
  `UserId` varchar(255) NOT NULL,
  `LoginProvider` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Value` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `CodeCategories` int(11) NOT NULL,
  `Designation` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`CodeCategories`, `Designation`) VALUES
(1, 'Ecole simple'),
(2, 'Complexe Scolaire'),
(3, 'Groupe Scolaire'),
(4, 'EP'),
(5, 'Institut');

-- --------------------------------------------------------

--
-- Structure de la table `chefetablissement`
--

CREATE TABLE `chefetablissement` (
  `Matricule` varchar(64) NOT NULL,
  `NomComplet` varchar(200) NOT NULL,
  `Telephone` varchar(40) NOT NULL,
  `AnneeDebutActivite` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `chefetablissement`
--

INSERT INTO `chefetablissement` (`Matricule`, `NomComplet`, `Telephone`, `AnneeDebutActivite`) VALUES
('CHEF001', 'DEBORA MWAKA', '+243810002002', 2018),
('CHEF002', 'GRACE TSHIMANGA', '0850665928', 2005),
('CHEF003', 'NATHAN MBIEME', '0843352890', 2006),
('CHEF004', 'BILLY MATIAMBA', '0843352870', 2017);

-- --------------------------------------------------------

--
-- Structure de la table `decision`
--

CREATE TABLE `decision` (
  `NumDecision` varchar(80) NOT NULL,
  `DecisionFin` varchar(50) NOT NULL,
  `NumOrdre` varchar(80) NOT NULL,
  `NumAgrement` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `decision`
--

INSERT INTO `decision` (`NumDecision`, `DecisionFin`, `NumOrdre`, `NumAgrement`) VALUES
('DEC/2026/0001', 'rehabilitation', 'OM-2026-001', '1283939348'),
('DEC/2026/0002', 'rehabilitation', 'OM-2026-002', 'AGR/2023/008'),
('DEC/2026/0003', 'rehabilitation', 'OM-2026-003', '1283939348'),
('DEC/2026/0004', 'rehabilitation', 'OM-2026-004', '12839393'),
('DEC/2026/0005', 'rehabilitation', 'OM-2026-005', 'AGR/2023/008'),
('DEC/2026/0006', 'rehabilitation', 'OM-2026-006', 'AGR002/2026');

-- --------------------------------------------------------

--
-- Structure de la table `etablissement`
--

CREATE TABLE `etablissement` (
  `NumAgrement` varchar(100) NOT NULL,
  `Id` varchar(64) NOT NULL,
  `Denomination` varchar(250) NOT NULL,
  `RegGes` varchar(50) NOT NULL,
  `SousDivision` varchar(50) NOT NULL,
  `IDDinacope` varchar(50) NOT NULL,
  `NumNotification` varchar(100) DEFAULT NULL,
  `AdresseEtablissement` varchar(500) NOT NULL,
  `MatriculeChef` varchar(64) DEFAULT NULL,
  `CodeCategories` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `etablissement`
--

INSERT INTO `etablissement` (`NumAgrement`, `Id`, `Denomination`, `RegGes`, `SousDivision`, `IDDinacope`, `NumNotification`, `AdresseEtablissement`, `MatriculeChef`, `CodeCategories`) VALUES
('12839393', 'eco-20260825162429-f31f0e3c1fd54', 'COMPLEXE SCOLAIRE MARTH', 'public', 'SP004', 'DIN-KIN-MA-34', '636384648', 'KUYALA, N° 35, SANS-FILS, KISENSO', 'CHEF001', 1),
('1283939348', 'eco-20260825013430-f08727f1ebe04', 'COMPLEXE SCOLAIRE ELU', 'prive_conventionne', 'SP002', 'DIN-KIN-MA-0234', 'NOT/EPST/009', 'KUYALA, N° 35, SANS-FILS, KISENSO', 'CHEF004', 2),
('AGR/2023/008', 'eco-20260825112442-fd5bff4e15564', 'LYCEE SAINTE GERMAINE', 'prive_conventionne', 'SP002', 'DIN-KIN-MA-0032', 'NOT/EPST/010', 'KUYALA, N° 35, SANS-FILS, KISENSO', 'CHEF004', 1),
('AGR002/2026', 'eco-20260826091247-7ae287e35c344', 'COMPLEXE SCOLAIRE KUYALA', 'prive_conventionne', 'SP003', 'ID001205206', 'NOT/EPST/235', 'KUYALA, N° 35, SANS-FILS, KISENSO', 'CHEF002', 2);

-- --------------------------------------------------------

--
-- Structure de la table `journalentries`
--

CREATE TABLE `journalentries` (
  `Id` varchar(64) NOT NULL,
  `UtilisateurId` varchar(64) NOT NULL,
  `Module` varchar(100) NOT NULL,
  `Action` varchar(100) NOT NULL,
  `Detail` varchar(2000) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `journalentries`
--

INSERT INTO `journalentries` (`Id`, `UtilisateurId`, `Module`, `Action`, `Detail`, `CreatedAt`) VALUES
('log-20260824230648-1-b8f12c4471644ca', 'usr-001', 'Authentification', 'connexion', 'Connexion de Admin Système', '2026-08-24 23:06:48.104188'),
('log-20260825005632-1-3a4adfd1ebff486', 'systeme', 'Paramètres', 'création', 'Catégorie Ecole simple', '2026-08-25 00:56:32.781731'),
('log-20260825005710-1-0ebb3d089b164d5', 'systeme', 'Paramètres', 'création', 'Catégorie Complexe Scolaire', '2026-08-25 00:57:10.862078'),
('log-20260825005735-1-3cb258d7a275469', 'systeme', 'Paramètres', 'création', 'Catégorie Groupe Scolaire', '2026-08-25 00:57:35.382315'),
('log-20260825005933-1-1334b6c2c8d64d3', 'systeme', 'Paramètres', 'création', 'Produit Détergents multi-surfaces', '2026-08-25 00:59:33.080939'),
('log-20260825010021-1-df711aaeef8b420', 'systeme', 'Paramètres', 'création', 'Produit Nettoyant pour sols', '2026-08-25 01:00:21.511303'),
('log-20260825010115-1-bdc6345ec1954b2', 'systeme', 'Paramètres', 'création', 'Produit Detergents-désinfectants', '2026-08-25 01:01:15.389651'),
('log-20260825010221-1-0ddf271f0b1b420', 'systeme', 'Paramètres', 'création', 'Produit Désinfectants pour les mains', '2026-08-25 01:02:21.501310'),
('log-20260825010256-1-fa95be8a0c18429', 'systeme', 'Paramètres', 'création', 'Produit Produits specifiques', '2026-08-25 01:02:56.419468'),
('log-20260825010357-1-e213547d1c9b4b8', 'systeme', 'Paramètres', 'création', 'Outil Balais', '2026-08-25 01:03:57.340533'),
('log-20260825010428-1-ce87d39bc5ed470', 'systeme', 'Paramètres', 'création', 'Outil Seaux avec essoereur', '2026-08-25 01:04:28.049577'),
('log-20260825010447-1-8e88be4726ec4ee', 'systeme', 'Paramètres', 'création', 'Outil Raclettes pour sols', '2026-08-25 01:04:47.450581'),
('log-20260825010533-1-e26c450ee25f4d6', 'systeme', 'Paramètres', 'création', 'Outil Autolaveuses', '2026-08-25 01:05:33.585401'),
('log-20260825013315-1-60367454b3124be', 'systeme', 'Chefs', 'création', 'Préfet BILLY MATIAMBA', '2026-08-25 01:33:15.809028'),
('log-20260825013430-1-9a3b623207744cf', 'systeme', 'Écoles', 'création', 'Établissement COMPLEXE SCOLAIRE ELU créé', '2026-08-25 01:34:30.125292'),
('log-20260825013519-1-a918cac9c0224cd', 'systeme', 'Agents', 'création', 'Agent PUMU ANNUS créé', '2026-08-25 01:35:19.373409'),
('log-20260825013538-1-5cd340b0295f414', 'systeme', 'Agents', 'création', 'Agent DACHE TSHIMBADI créé', '2026-08-25 01:35:38.341854'),
('log-20260825013603-1-5b2ca1678acd4a4', 'systeme', 'Agents', 'création', 'Agent GRADI MABIALA créé', '2026-08-25 01:36:03.208163'),
('log-20260825013735-1-4ab015d57e9f47f', 'systeme', 'Missions', 'création', 'Mission OM-2026-001 créée', '2026-08-25 01:37:35.347941'),
('log-20260825013742-2-633cd26f68c5405', 'usr-001', 'Missions', 'signature', 'Mission OM-2026-001 signée', '2026-08-25 01:37:42.820875'),
('log-20260825021241-1-1edd55b047e54f7', 'systeme', 'Fiches', 'création', 'Fiche OM-2026-001 créée', '2026-08-25 02:12:41.665790'),
('log-20260825021241-2-8d05fb6b475e441', 'systeme', 'Missions', 'en cours', 'Mission OM-2026-001 passée en cours', '2026-08-25 02:12:41.742417'),
('log-20260825021306-1-9ac6e7c577fd4c4', 'usr-001', 'Authentification', 'déconnexion', 'Déconnexion de Admin Système', '2026-08-25 02:13:06.891814'),
('log-20260825080432-1-613f55418f6b4df', 'usr-001', 'Authentification', 'connexion', 'Connexion de Admin Système', '2026-08-25 08:04:32.340782'),
('log-20260825080611-2-e6b173fc9212411', 'usr-001', 'Fiches', 'soumission', 'Fiche OM-2026-001 soumise au chef', '2026-08-25 08:06:11.385746'),
('log-20260825080614-2-1600e99359ce4e4', 'usr-001', 'Fiches', 'validation', 'Fiche OM-2026-001 — Lu et approuvé', '2026-08-25 08:06:14.144424'),
('log-20260825112442-1-872e5785bd984bd', 'systeme', 'Écoles', 'création', 'Établissement LYCEE SAINTE GERMAINE créé', '2026-08-25 11:24:42.560217'),
('log-20260825112619-1-e7cdcc65b4004a5', 'systeme', 'Missions', 'création', 'Mission OM-2026-002 créée', '2026-08-25 11:26:19.055276'),
('log-20260825112711-2-8047d04b79a242a', 'usr-001', 'Missions', 'signature', 'Mission OM-2026-002 signée', '2026-08-25 11:27:11.107217'),
('log-20260825112934-1-5cb88c2add19448', 'systeme', 'Fiches', 'création', 'Fiche OM-2026-002 créée', '2026-08-25 11:29:34.052996'),
('log-20260825112934-2-c55bc9185c0b49a', 'systeme', 'Missions', 'en cours', 'Mission OM-2026-002 passée en cours', '2026-08-25 11:29:34.073726'),
('log-20260825113025-2-fa5a67cdc6e649c', 'usr-001', 'Fiches', 'soumission', 'Fiche OM-2026-002 soumise au chef', '2026-08-25 11:30:25.024094'),
('log-20260825113028-2-f90b1551431e42c', 'usr-001', 'Fiches', 'validation', 'Fiche OM-2026-002 — Lu et approuvé', '2026-08-25 11:30:28.068337'),
('log-20260825113319-1-e06ab2212037443', 'usr-001', 'Décisions', 'création', 'Décision DEC/2026/0001 créée', '2026-08-25 11:33:19.508466'),
('log-20260825113319-2-e08ccab00c154ef', 'usr-001', 'Missions', 'clôture', 'Mission OM-2026-001 clôturée (décision DEC/2026/0001)', '2026-08-25 11:33:19.524568'),
('log-20260825113446-1-49de72d3d7c942d', 'usr-001', 'Décisions', 'création', 'Décision DEC/2026/0002 créée', '2026-08-25 11:34:46.784950'),
('log-20260825113446-2-d620ca1ac7354c1', 'usr-001', 'Missions', 'clôture', 'Mission OM-2026-002 clôturée (décision DEC/2026/0002)', '2026-08-25 11:34:46.792655'),
('log-20260825120935-1-d7a86599447b427', 'systeme', 'Missions', 'création', 'Mission OM-2026-003 créée', '2026-08-25 12:09:35.584917'),
('log-20260825120942-2-a50f36f16e1f4dd', 'usr-001', 'Missions', 'signature', 'Mission OM-2026-003 signée', '2026-08-25 12:09:42.249502'),
('log-20260825124732-1-c718b7b12fc8481', 'systeme', 'Fiches', 'création', 'Fiche OM-2026-003 créée', '2026-08-25 12:47:32.715734'),
('log-20260825124732-2-da20820553cb4a6', 'systeme', 'Missions', 'en cours', 'Mission OM-2026-003 passée en cours', '2026-08-25 12:47:32.795255'),
('log-20260825124738-2-9c16956054a4403', 'usr-001', 'Fiches', 'soumission', 'Fiche OM-2026-003 soumise au chef', '2026-08-25 12:47:38.196427'),
('log-20260825124748-2-53c9addd10bf4f2', 'usr-001', 'Fiches', 'validation', 'Fiche OM-2026-003 — Lu et approuvé', '2026-08-25 12:47:48.713394'),
('log-20260825124805-1-c8d346203a4e4d7', 'usr-001', 'Décisions', 'création', 'Décision DEC/2026/0003 créée', '2026-08-25 12:48:05.372224'),
('log-20260825124805-2-bcde41a6736b48c', 'usr-001', 'Missions', 'clôture', 'Mission OM-2026-003 clôturée (décision DEC/2026/0003)', '2026-08-25 12:48:05.394085'),
('log-20260825161227-1-918c3d80c3934d8', 'usr-001', 'Authentification', 'déconnexion', 'Déconnexion de Admin Système', '2026-08-25 16:12:27.291307'),
('log-20260825161349-1-541517f971994ca', 'usr-001', 'Authentification', 'connexion', 'Connexion de Admin Système', '2026-08-25 16:13:49.312738'),
('log-20260825161446-1-fdfa68868c62431', 'usr-001', 'Authentification', 'déconnexion', 'Déconnexion de Admin Système', '2026-08-25 16:14:46.174439'),
('log-20260825161543-1-e48e303827394dc', 'usr-001', 'Authentification', 'connexion', 'Connexion de Admin Système', '2026-08-25 16:15:43.849328'),
('log-20260825162019-1-fca5b14ac3b2431', 'systeme', 'Chefs', 'création', 'Chef d\'établissement DEBORA MWAKA', '2026-08-25 16:20:19.166237'),
('log-20260825162429-1-7f7f742a14ac44f', 'systeme', 'Écoles', 'création', 'Établissement COMPLEXE SCOLAIRE MARTH créé', '2026-08-25 16:24:29.696798'),
('log-20260825162514-1-a59bc5621c2847c', 'systeme', 'Agents', 'création', 'Agent DEO MANDE créé', '2026-08-25 16:25:14.431561'),
('log-20260825162543-1-7baa53259b264b5', 'systeme', 'Agents', 'création', 'Agent DJESSY créé', '2026-08-25 16:25:43.847478'),
('log-20260825162828-1-15f1c93697344ef', 'systeme', 'Missions', 'création', 'Mission OM-2026-004 créée', '2026-08-25 16:28:28.734994'),
('log-20260825162844-2-b6bb3f28b00b424', 'usr-001', 'Missions', 'signature', 'Mission OM-2026-004 signée', '2026-08-25 16:28:44.681476'),
('log-20260825164035-1-948fc057fff7449', 'systeme', 'Fiches', 'création', 'Fiche OM-2026-004 créée', '2026-08-25 16:40:35.016596'),
('log-20260825164035-2-c8c0fe19bdb6485', 'systeme', 'Missions', 'en cours', 'Mission OM-2026-004 passée en cours', '2026-08-25 16:40:35.047381'),
('log-20260825164045-2-e03482ae5fd3485', 'usr-001', 'Fiches', 'soumission', 'Fiche OM-2026-004 soumise au chef', '2026-08-25 16:40:45.671458'),
('log-20260825164058-2-add0619e031a489', 'usr-001', 'Fiches', 'validation', 'Fiche OM-2026-004 — Lu et approuvé', '2026-08-25 16:40:58.333065'),
('log-20260825164229-1-db3105ddee204e2', 'usr-001', 'Décisions', 'création', 'Décision DEC/2026/0004 créée', '2026-08-25 16:42:29.886434'),
('log-20260825164229-2-c5d2d074cf7a4be', 'usr-001', 'Missions', 'clôture', 'Mission OM-2026-004 clôturée (décision DEC/2026/0004)', '2026-08-25 16:42:29.909167'),
('log-20260825180113-1-33eb448eaee541a', 'systeme', 'Missions', 'création', 'Mission OM-2026-005 créée', '2026-08-25 18:01:13.711030'),
('log-20260825180117-2-535ffb73e19640c', 'usr-001', 'Missions', 'signature', 'Mission OM-2026-005 signée', '2026-08-25 18:01:17.635423'),
('log-20260825180954-1-0f01cb4517d9473', 'systeme', 'Fiches', 'création', 'Fiche OM-2026-005 créée', '2026-08-25 18:09:54.912261'),
('log-20260825180954-2-072c17dd8d3047b', 'systeme', 'Missions', 'en cours', 'Mission OM-2026-005 passée en cours', '2026-08-25 18:09:54.996657'),
('log-20260825181015-2-2e37c0c8d6ad48f', 'usr-001', 'Fiches', 'soumission', 'Fiche OM-2026-005 soumise au chef', '2026-08-25 18:10:15.937163'),
('log-20260825181023-2-7ac41ffe0f1a493', 'usr-001', 'Fiches', 'validation', 'Fiche OM-2026-005 — Lu et approuvé', '2026-08-25 18:10:23.312114'),
('log-20260825184200-1-a8881b5c37db4e5', 'usr-001', 'Décisions', 'création', 'Décision DEC/2026/0005 créée', '2026-08-25 18:42:00.109855'),
('log-20260825184200-2-76b8d7518f674f3', 'usr-001', 'Missions', 'clôture', 'Mission OM-2026-005 clôturée (décision DEC/2026/0005)', '2026-08-25 18:42:00.283625'),
('log-20260825184240-1-95277ad3a6c3449', 'usr-001', 'Authentification', 'déconnexion', 'Déconnexion de Admin Système', '2026-08-25 18:42:40.008451'),
('log-20260825232843-1-05e03f7acffa4e2', 'usr-001', 'Authentification', 'connexion', 'Connexion de Admin Système', '2026-08-25 23:28:43.513870'),
('log-20260826081226-1-ad92d1a0e33a44d', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Utilisateurs', 'création', 'Utilisateur RUTH MBOMA créé', '2026-08-26 08:12:26.898798'),
('log-20260826081329-1-40d742d72b4e485', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Utilisateurs', 'création', 'Utilisateur NTIAMA NDENDE créé', '2026-08-26 08:13:29.762518'),
('log-20260826081439-1-82248eec08b24b5', '387df19e-d4b9-492a-9e9c-dfd1a20825ea', 'Utilisateurs', 'création', 'Utilisateur DACHE TSHIMBADI créé', '2026-08-26 08:14:39.453045'),
('log-20260826081529-1-5e40d2892ed5415', 'b9a1ced9-0bf2-466e-aa6d-abad150e0c98', 'Utilisateurs', 'création', 'Utilisateur DEO MANDE créé', '2026-08-26 08:15:29.210269'),
('log-20260826081617-1-3a778795322b44c', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'Utilisateurs', 'création', 'Utilisateur DJESSY créé', '2026-08-26 08:16:17.821217'),
('log-20260826081706-1-c6e9b40ba62b4b5', '2a9fe897-7e11-49fd-908b-1667788a12df', 'Utilisateurs', 'création', 'Utilisateur GRADI MABIALA créé', '2026-08-26 08:17:06.080853'),
('log-20260826081745-1-e11909b63fac453', '42a6ccd9-1a6e-432b-82b0-3726438f6b61', 'Utilisateurs', 'création', 'Utilisateur PUMU ANNUS créé', '2026-08-26 08:17:45.406312'),
('log-20260826081823-1-075f4490ba4743b', 'usr-001', 'Authentification', 'déconnexion', 'Déconnexion de Admin Système', '2026-08-26 08:18:23.247155'),
('log-20260826081850-1-b9814e917c2a4d2', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Authentification', 'connexion', 'Connexion de RUTH MBOMA', '2026-08-26 08:18:50.907385'),
('log-20260826081926-1-85921413488442a', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Authentification', 'déconnexion', 'Déconnexion de RUTH MBOMA', '2026-08-26 08:19:26.957778'),
('log-20260826081934-1-8cb488831b4b455', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'connexion', 'Connexion de NTIAMA NDENDE', '2026-08-26 08:19:34.752125'),
('log-20260826082027-1-7ff3f8d0c64142c', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'déconnexion', 'Déconnexion de NTIAMA NDENDE', '2026-08-26 08:20:27.857378'),
('log-20260826082108-1-289a670f14f649c', 'usr-001', 'Authentification', 'connexion', 'Connexion de Admin Système', '2026-08-26 08:21:08.939861'),
('log-20260826082205-1-ad5de5f73523475', 'usr-001', 'Authentification', 'déconnexion', 'Déconnexion de Admin Système', '2026-08-26 08:22:05.356977'),
('log-20260826082230-1-40cdbef5f8c9400', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'Authentification', 'connexion', 'Connexion de DJESSY', '2026-08-26 08:22:30.133808'),
('log-20260826082347-1-9d941adfc5e745d', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'Authentification', 'déconnexion', 'Déconnexion de DJESSY', '2026-08-26 08:23:47.390810'),
('log-20260826082405-1-bdc60d20fe3542e', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Authentification', 'connexion', 'Connexion de RUTH MBOMA', '2026-08-26 08:24:05.255158'),
('log-20260826082418-1-565604c6a27a4b5', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Authentification', 'déconnexion', 'Déconnexion de RUTH MBOMA', '2026-08-26 08:24:18.859203'),
('log-20260826082424-1-73290e25533a4db', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'connexion', 'Connexion de NTIAMA NDENDE', '2026-08-26 08:24:24.320509'),
('log-20260826082438-1-1a0faa1d789b467', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'déconnexion', 'Déconnexion de NTIAMA NDENDE', '2026-08-26 08:24:38.851026'),
('log-20260826082447-1-f9a9893654af4cb', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'Authentification', 'connexion', 'Connexion de DJESSY', '2026-08-26 08:24:47.676191'),
('log-20260826090713-1-90ad4226fdcb45e', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'Authentification', 'déconnexion', 'Déconnexion de DJESSY', '2026-08-26 09:07:13.385695'),
('log-20260826090728-1-a26d69b2ea824e7', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Authentification', 'connexion', 'Connexion de RUTH MBOMA', '2026-08-26 09:07:28.414195'),
('log-20260826090936-1-6fc8ee3af44f439', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Authentification', 'déconnexion', 'Déconnexion de RUTH MBOMA', '2026-08-26 09:09:36.770450'),
('log-20260826090953-1-b99f16d2024d4fd', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'connexion', 'Connexion de NTIAMA NDENDE', '2026-08-26 09:09:53.203928'),
('log-20260826091119-1-e1c15d65c38f4f2', 'systeme', 'Chefs', 'création', 'Chef d\'établissement GRACE TSHIMANGA', '2026-08-26 09:11:19.984044'),
('log-20260826091247-1-3f3ea79662ac408', 'systeme', 'Écoles', 'création', 'Établissement COMPLEXE SCOLAIRE KUYALA créé', '2026-08-26 09:12:47.520926'),
('log-20260826091304-1-61e03e72137a4e5', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'déconnexion', 'Déconnexion de NTIAMA NDENDE', '2026-08-26 09:13:04.516035'),
('log-20260826091702-1-1d5ad2e47d70441', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'connexion', 'Connexion de NTIAMA NDENDE', '2026-08-26 09:17:02.952606'),
('log-20260826091726-1-12cede9fb2e14f1', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'déconnexion', 'Déconnexion de NTIAMA NDENDE', '2026-08-26 09:17:26.707528'),
('log-20260826091735-1-8f82849866a1455', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Authentification', 'connexion', 'Connexion de RUTH MBOMA', '2026-08-26 09:17:35.341483'),
('log-20260826091915-1-8d137585fd4d452', 'systeme', 'Missions', 'création', 'Mission OM-2026-006 créée', '2026-08-26 09:19:15.676651'),
('log-20260826092354-2-10a7f7c88097417', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Missions', 'signature', 'Mission OM-2026-006 signée', '2026-08-26 09:23:54.837615'),
('log-20260826092443-1-b64525fc8699473', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Authentification', 'déconnexion', 'Déconnexion de RUTH MBOMA', '2026-08-26 09:24:43.092732'),
('log-20260826092528-1-2ebf23faa67b424', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'Authentification', 'connexion', 'Connexion de DJESSY', '2026-08-26 09:25:28.860393'),
('log-20260826092731-1-a89c12afdf8148b', 'systeme', 'Fiches', 'création', 'Fiche OM-2026-006 créée', '2026-08-26 09:27:31.370234'),
('log-20260826092731-2-0a0b60f457d3439', 'systeme', 'Missions', 'en cours', 'Mission OM-2026-006 passée en cours', '2026-08-26 09:27:31.390792'),
('log-20260826092743-1-2b9985e35a6845d', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'Authentification', 'déconnexion', 'Déconnexion de DJESSY', '2026-08-26 09:27:43.354768'),
('log-20260826092817-1-29d3a743713f4d7', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'connexion', 'Connexion de NTIAMA NDENDE', '2026-08-26 09:28:17.042143'),
('log-20260826092905-1-7c67850702874b2', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'déconnexion', 'Déconnexion de NTIAMA NDENDE', '2026-08-26 09:29:05.224358'),
('log-20260826092913-1-37e00d0305fb430', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Authentification', 'connexion', 'Connexion de RUTH MBOMA', '2026-08-26 09:29:13.042213'),
('log-20260826092929-1-e2572f401ab94a9', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Authentification', 'déconnexion', 'Déconnexion de RUTH MBOMA', '2026-08-26 09:29:29.336183'),
('log-20260826092945-1-70845f3fb7a440a', '2a9fe897-7e11-49fd-908b-1667788a12df', 'Authentification', 'connexion', 'Connexion de GRADI MABIALA', '2026-08-26 09:29:45.778927'),
('log-20260826093020-1-f283420142ed482', '2a9fe897-7e11-49fd-908b-1667788a12df', 'Authentification', 'déconnexion', 'Déconnexion de GRADI MABIALA', '2026-08-26 09:30:20.576295'),
('log-20260826093027-1-0bee9523602c4b4', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'Authentification', 'connexion', 'Connexion de DJESSY', '2026-08-26 09:30:27.885616'),
('log-20260826100912-1-c125af26649449d', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'Authentification', 'déconnexion', 'Déconnexion de DJESSY', '2026-08-26 10:09:12.506416'),
('log-20260826100951-1-585c38bd4db1416', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'connexion', 'Connexion de NTIAMA NDENDE', '2026-08-26 10:09:51.518062'),
('log-20260826101153-1-75d52e444f6f441', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'déconnexion', 'Déconnexion de NTIAMA NDENDE', '2026-08-26 10:11:53.051654'),
('log-20260826101206-1-7da1732cd29546c', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Authentification', 'connexion', 'Connexion de RUTH MBOMA', '2026-08-26 10:12:06.165534'),
('log-20260826102748-1-cddd3a7076c3451', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Authentification', 'déconnexion', 'Déconnexion de RUTH MBOMA', '2026-08-26 10:27:48.040979'),
('log-20260826102828-1-9b6a37e12de441e', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'Authentification', 'connexion', 'Connexion de DJESSY', '2026-08-26 10:28:28.559930'),
('log-20260826121608-1-41b7b7c4ffe5455', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'Missions', 'délégation écriture', 'Mission OM-2026-006 — écriture cédée à l\'adjoint DEO MANDE (agt-20260825162514-bb644de7d13e4)', '2026-08-26 12:16:08.793531'),
('log-20260826121615-1-c2d4b808b9d8401', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'Authentification', 'déconnexion', 'Déconnexion de DJESSY', '2026-08-26 12:16:15.201378'),
('log-20260826121647-1-e55ee83b29ae44e', 'b9a1ced9-0bf2-466e-aa6d-abad150e0c98', 'Authentification', 'connexion', 'Connexion de DEO MANDE', '2026-08-26 12:16:47.847865'),
('log-20260826121714-2-3fca2d6a334d409', 'b9a1ced9-0bf2-466e-aa6d-abad150e0c98', 'Fiches', 'soumission', 'Fiche OM-2026-006 soumise pour validation chef (tablette) — agent b9a1ced9-0bf2-466e-aa6d-abad150e0c98', '2026-08-26 12:17:14.471928'),
('log-20260826121746-2-21062e5de7ee48f', 'b9a1ced9-0bf2-466e-aa6d-abad150e0c98', 'Fiches', 'validation tablette', 'Fiche OM-2026-006 — Lu et approuvé par GRACE TSHIMANGA (enregistré par agent b9a1ced9-0bf2-466e-aa6d-abad150e0c98)', '2026-08-26 12:17:46.507277'),
('log-20260826121813-1-ebc94ee5ceb44e9', 'b9a1ced9-0bf2-466e-aa6d-abad150e0c98', 'Authentification', 'déconnexion', 'Déconnexion de DEO MANDE', '2026-08-26 12:18:13.213696'),
('log-20260826121915-1-c1fd56ade4304ba', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'Authentification', 'connexion', 'Connexion de DJESSY', '2026-08-26 12:19:15.755748'),
('log-20260826160607-1-12aec5e66cca433', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'Authentification', 'connexion', 'Connexion de DJESSY', '2026-08-26 16:06:07.508413'),
('log-20260826183119-1-11524af25fde4f6', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', 'Authentification', 'déconnexion', 'Déconnexion de DJESSY', '2026-08-26 18:31:19.992954'),
('log-20260826183150-1-b0ae74726e8042f', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'connexion', 'Connexion de NTIAMA NDENDE', '2026-08-26 18:31:50.962473'),
('log-20260826183242-1-e9ff72ad68c148a', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'déconnexion', 'Déconnexion de NTIAMA NDENDE', '2026-08-26 18:32:42.061571'),
('log-20260826183306-1-fe13d3dde17f459', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Authentification', 'connexion', 'Connexion de RUTH MBOMA', '2026-08-26 18:33:06.530508'),
('log-20260826183425-1-6fc27f6e8b9c4ad', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Décisions', 'création', 'Décision DEC/2026/0006 créée', '2026-08-26 18:34:25.353028'),
('log-20260826183425-2-57502595cbdd43e', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Missions', 'clôture', 'Mission OM-2026-006 clôturée (décision DEC/2026/0006)', '2026-08-26 18:34:25.638685'),
('log-20260826184411-1-1dbef151aca04c4', 'dffd1c0f-84e5-4b54-a527-428250ffe498', 'Authentification', 'déconnexion', 'Déconnexion de RUTH MBOMA', '2026-08-26 18:44:11.495750'),
('log-20260826184740-1-d283625263574b0', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'connexion', 'Connexion de NTIAMA NDENDE', '2026-08-26 18:47:40.219598'),
('log-20260826184903-1-e23bbaea3c60473', 'systeme', 'Chefs', 'création', 'Chef d\'établissement NATHAN MBIEME', '2026-08-26 18:49:03.671262'),
('log-20260826185844-1-690717950f7f421', '8550bdea-bd4e-4915-87a5-276088cfdbb9', 'Authentification', 'déconnexion', 'Déconnexion de NTIAMA NDENDE', '2026-08-26 18:58:44.243291'),
('log-20260829074038-1-1cb8b35f744140d', 'usr-001', 'Authentification', 'connexion', 'Connexion de Admin Système', '2026-08-29 07:40:38.249539'),
('log-20260829080511-1-f98816a97ea247f', 'systeme', 'Agents', 'création', 'Agent GEMIMA MBIEME créé', '2026-08-29 08:05:11.535397'),
('log-20260829080753-1-a7a7a2c0f58f459', 'systeme', 'Agents', 'suppression', 'Agent GEMIMA MBIEME supprimé', '2026-08-29 08:07:53.844118'),
('log-20260829110534-1-0f859e1abd10499', 'usr-001', 'Authentification', 'déconnexion', 'Déconnexion de Admin Système', '2026-08-29 11:05:34.743222');

-- --------------------------------------------------------

--
-- Structure de la table `mission`
--

CREATE TABLE `mission` (
  `NumOrdre` varchar(80) NOT NULL,
  `Id` varchar(64) NOT NULL,
  `DateDebut` datetime(6) DEFAULT NULL,
  `DateFin` datetime(6) DEFAULT NULL,
  `NbreBatiment` int(11) NOT NULL,
  `EtatBatiment` varchar(50) NOT NULL,
  `NbrToiletteFille` int(11) NOT NULL,
  `NbrToiletteGarcon` int(11) NOT NULL,
  `NbrEleve` int(11) NOT NULL,
  `NbreProduit` int(11) NOT NULL,
  `CodeProduit` int(11) DEFAULT NULL,
  `NbreOutil` int(11) NOT NULL,
  `CodeOutil` int(11) DEFAULT NULL,
  `Observation` longtext DEFAULT NULL,
  `Validite` varchar(50) DEFAULT NULL,
  `NumAgrement` varchar(100) NOT NULL,
  `MontPer` decimal(18,2) DEFAULT NULL,
  `StatutFiche` varchar(50) DEFAULT NULL,
  `NomEquipe` varchar(150) NOT NULL,
  `Objet` varchar(500) DEFAULT NULL,
  `SigneLe` datetime(6) DEFAULT NULL,
  `SignePar` varchar(64) DEFAULT NULL,
  `ProduitsAutres` varchar(200) DEFAULT NULL,
  `ProduitsAutresQuantite` int(11) DEFAULT NULL,
  `RecommandationPreliminaire` varchar(100) NOT NULL,
  `ValideePar` varchar(64) DEFAULT NULL,
  `ValideeLe` datetime(6) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `OutilsAutres` varchar(200) DEFAULT NULL,
  `OutilsAutresQuantite` int(11) DEFAULT NULL,
  `RapportEquipeDeposeLe` datetime(6) DEFAULT NULL,
  `RapportEquipeDeposePar` varchar(64) DEFAULT NULL,
  `RapportSecretariatDeposeLe` datetime(6) DEFAULT NULL,
  `RapportSecretariatDeposePar` varchar(64) DEFAULT NULL,
  `RapportClos` tinyint(1) NOT NULL DEFAULT 0,
  `RapportClosLe` datetime(6) DEFAULT NULL,
  `RapportClosPar` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `mission`
--

INSERT INTO `mission` (`NumOrdre`, `Id`, `DateDebut`, `DateFin`, `NbreBatiment`, `EtatBatiment`, `NbrToiletteFille`, `NbrToiletteGarcon`, `NbrEleve`, `NbreProduit`, `CodeProduit`, `NbreOutil`, `CodeOutil`, `Observation`, `Validite`, `NumAgrement`, `MontPer`, `StatutFiche`, `NomEquipe`, `Objet`, `SigneLe`, `SignePar`, `ProduitsAutres`, `ProduitsAutresQuantite`, `RecommandationPreliminaire`, `ValideePar`, `ValideeLe`, `CreatedAt`, `OutilsAutres`, `OutilsAutresQuantite`, `RapportEquipeDeposeLe`, `RapportEquipeDeposePar`, `RapportSecretariatDeposeLe`, `RapportSecretariatDeposePar`, `RapportClos`, `RapportClosLe`, `RapportClosPar`) VALUES
('OM-2026-001', 'mis-20260825013735-c72d11d6414a4', '2026-08-25 00:00:00.000000', '2026-08-30 00:00:00.000000', 5, 'Satisfaisant', 6, 5, 150, 40, 4, 30, 4, 'DEO DEO DEO ', 'cloture', '1283939348', NULL, 'validee', 'Equipe-OM-2026-001', 'Controle sanitaire ', '2026-08-25 01:37:42.766838', 'usr-001', NULL, NULL, 'Maintien', 'usr-001', '2026-08-25 08:06:14.124895', '2026-08-25 01:37:35.073461', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('OM-2026-002', 'mis-20260825112618-da5b5c88caad4', '2026-08-25 00:00:00.000000', '2026-09-06 00:00:00.000000', 3, 'Satisfaisant', 4, 5, 500, 109, 4, 152, 4, 'DEI DEONDEO?', 'cloture', 'AGR/2023/008', NULL, 'validee', 'Equipe-OM-2026-002', 'Controle ', '2026-08-25 11:27:11.045174', 'usr-001', NULL, NULL, 'Maintien', 'usr-001', '2026-08-25 11:30:28.048607', '2026-08-25 11:26:18.747463', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('OM-2026-003', 'mis-20260825120935-3cd3cdb87f684', '2026-08-25 00:00:00.000000', '2026-08-30 00:00:00.000000', 10, 'Bon', 20, 30, 1000, 10, 4, 13, 4, 'DEO DEO ', 'cloture', '1283939348', NULL, 'validee', 'Equipe-OM-2026-003', NULL, '2026-08-25 12:09:42.192386', 'usr-001', NULL, NULL, 'Maintien', 'usr-001', '2026-08-25 12:47:48.686824', '2026-08-25 12:09:35.203173', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('OM-2026-004', 'mis-20260825162828-d042080ac7284', '2026-08-25 00:00:00.000000', '2026-09-06 00:00:00.000000', 4, 'Bon', 3, 4, 1000, 89, 1, 57, 4, 'DEO DEO ', 'cloture', '12839393', NULL, 'validee', 'Equipe-OM-2026-004', NULL, '2026-08-25 16:28:44.605586', 'usr-001', NULL, NULL, 'Maintien', 'usr-001', '2026-08-25 16:40:58.302948', '2026-08-25 16:28:28.245475', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('OM-2026-005', 'mis-20260825180113-6deb17f1ade04', '2026-08-25 00:00:00.000000', '2026-09-06 00:00:00.000000', 10, 'Bon', 30, 40, 100, 20, 4, 45, 4, 'DEO MANDE DEO MANDE ', 'cloture', 'AGR/2023/008', 1000.00, 'validee', 'Equipe-OM-2026-005', NULL, '2026-08-25 18:01:17.577554', 'usr-001', NULL, NULL, 'Maintien', 'usr-001', '2026-08-25 18:10:23.293814', '2026-08-25 18:01:13.319314', NULL, NULL, '2026-08-26 18:30:56.747583', '49b9a74d-1299-4e42-9817-bb3c1f7ce77b', NULL, NULL, 0, NULL, NULL),
('OM-2026-006', 'mis-20260826091915-67c6f936282e4', '2026-08-27 00:00:00.000000', '2026-09-06 00:00:00.000000', 10, 'Satisfaisant', 5, 6, 1500, 200, 4, 110, 4, 'DEO MANDE EST BEAU GARCON TSHI ', 'cloture', 'AGR002/2026', 1000.00, 'validee', 'Equipe-OM-2026-006', NULL, '2026-08-26 09:23:54.758149', 'dffd1c0f-84e5-4b54-a527-428250ffe498', NULL, NULL, 'Maintien', 'b9a1ced9-0bf2-466e-aa6d-abad150e0c98', '2026-08-26 12:17:46.484578', '2026-08-26 09:19:15.312921', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `missionoutil`
--

CREATE TABLE `missionoutil` (
  `Id` int(11) NOT NULL,
  `NumOrdre` varchar(80) NOT NULL,
  `CodeOutil` int(11) NOT NULL,
  `Quantite` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `missionoutil`
--

INSERT INTO `missionoutil` (`Id`, `NumOrdre`, `CodeOutil`, `Quantite`) VALUES
(1, 'OM-2026-001', 4, 10),
(2, 'OM-2026-001', 1, 20),
(3, 'OM-2026-002', 4, 30),
(4, 'OM-2026-002', 1, 60),
(5, 'OM-2026-002', 3, 62),
(6, 'OM-2026-003', 4, 13),
(7, 'OM-2026-004', 4, 23),
(8, 'OM-2026-004', 1, 34),
(9, 'OM-2026-005', 4, 45),
(10, 'OM-2026-006', 4, 100),
(11, 'OM-2026-006', 1, 10);

-- --------------------------------------------------------

--
-- Structure de la table `missionproduit`
--

CREATE TABLE `missionproduit` (
  `Id` int(11) NOT NULL,
  `NumOrdre` varchar(80) NOT NULL,
  `CodeProduit` int(11) NOT NULL,
  `Quantite` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `missionproduit`
--

INSERT INTO `missionproduit` (`Id`, `NumOrdre`, `CodeProduit`, `Quantite`) VALUES
(1, 'OM-2026-001', 4, 10),
(2, 'OM-2026-001', 1, 20),
(3, 'OM-2026-001', 3, 10),
(4, 'OM-2026-002', 4, 10),
(5, 'OM-2026-002', 1, 29),
(6, 'OM-2026-002', 3, 30),
(7, 'OM-2026-002', 2, 40),
(8, 'OM-2026-003', 4, 10),
(9, 'OM-2026-004', 1, 10),
(10, 'OM-2026-004', 3, 34),
(11, 'OM-2026-004', 2, 45),
(12, 'OM-2026-005', 4, 10),
(13, 'OM-2026-005', 1, 10),
(14, 'OM-2026-006', 4, 100),
(15, 'OM-2026-006', 1, 100);

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `Id` varchar(64) NOT NULL,
  `Titre` varchar(200) NOT NULL,
  `Message` varchar(2000) NOT NULL,
  `Lu` tinyint(1) NOT NULL,
  `UserId` varchar(64) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`Id`, `Titre`, `Message`, `Lu`, `UserId`, `CreatedAt`) VALUES
('ntf-20260825013742-1-97c4a553ae3a411', 'Mission signée', 'La mission OM-2026-001 a été signée.', 0, NULL, '2026-08-25 01:37:42.779980'),
('ntf-20260825080611-1-765fbf22f5244b0', 'Fiche à valider', 'La fiche OM-2026-001 attend votre « Lu et approuvé ».', 0, NULL, '2026-08-25 08:06:11.346200'),
('ntf-20260825080614-1-515c0561fcf645a', 'Fiche validée', 'La fiche OM-2026-001 a été validée (Lu et approuvé).', 0, NULL, '2026-08-25 08:06:14.134478'),
('ntf-20260825112711-1-ff5ee002495a419', 'Mission signée', 'La mission OM-2026-002 a été signée.', 0, NULL, '2026-08-25 11:27:11.059854'),
('ntf-20260825113025-1-5a9068375d5848a', 'Fiche à valider', 'La fiche OM-2026-002 attend votre « Lu et approuvé ».', 0, NULL, '2026-08-25 11:30:25.016044'),
('ntf-20260825113028-1-2276e9c9042442b', 'Fiche validée', 'La fiche OM-2026-002 a été validée (Lu et approuvé).', 0, NULL, '2026-08-25 11:30:28.055875'),
('ntf-20260825113319-3-54df91b3185249c', 'Décision sur votre établissement', 'Décision DEC/2026/0001 (Réhabilitation) pour COMPLEXE SCOLAIRE ELU.', 0, NULL, '2026-08-25 11:33:19.554228'),
('ntf-20260825113446-3-1bc6888081a1402', 'Décision sur votre établissement', 'Décision DEC/2026/0002 (Réhabilitation) pour LYCEE SAINTE GERMAINE.', 0, NULL, '2026-08-25 11:34:46.807387'),
('ntf-20260825120942-1-bb4fda19fea842c', 'Mission signée', 'La mission OM-2026-003 a été signée.', 0, NULL, '2026-08-25 12:09:42.206262'),
('ntf-20260825124738-1-70cf5797b10f4bc', 'Fiche à valider', 'La fiche OM-2026-003 attend votre « Lu et approuvé ».', 1, NULL, '2026-08-25 12:47:38.140767'),
('ntf-20260825124748-1-2e32c7217b5149c', 'Fiche validée', 'La fiche OM-2026-003 a été validée (Lu et approuvé).', 0, NULL, '2026-08-25 12:47:48.700529'),
('ntf-20260825124805-3-b881efc2e2754ed', 'Décision sur votre établissement', 'Décision DEC/2026/0003 (Réhabilitation) pour COMPLEXE SCOLAIRE ELU.', 1, NULL, '2026-08-25 12:48:05.409778'),
('ntf-20260825162844-1-879c5f6ec5394da', 'Mission signée', 'La mission OM-2026-004 a été signée.', 1, NULL, '2026-08-25 16:28:44.628909'),
('ntf-20260825164045-1-a7ce6b5b480645d', 'Fiche à valider', 'La fiche OM-2026-004 attend votre « Lu et approuvé ».', 0, NULL, '2026-08-25 16:40:45.664157'),
('ntf-20260825164058-1-d20f3761ba85447', 'Fiche validée', 'La fiche OM-2026-004 a été validée (Lu et approuvé).', 0, NULL, '2026-08-25 16:40:58.322481'),
('ntf-20260825164229-3-fb6262fa8474424', 'Décision sur votre établissement', 'Décision DEC/2026/0004 (Réhabilitation) pour COMPLEXE SCOLAIRE MARTH.', 0, NULL, '2026-08-25 16:42:29.926956'),
('ntf-20260825180117-1-c9f0d2b07bcf470', 'Mission signée', 'La mission OM-2026-005 a été signée.', 0, NULL, '2026-08-25 18:01:17.592006'),
('ntf-20260825181015-1-2822bc300cc548f', 'Fiche à valider', 'La fiche OM-2026-005 attend votre « Lu et approuvé ».', 0, NULL, '2026-08-25 18:10:15.871933'),
('ntf-20260825181023-1-e48edad4293645d', 'Fiche validée', 'La fiche OM-2026-005 a été validée (Lu et approuvé).', 0, NULL, '2026-08-25 18:10:23.302459'),
('ntf-20260825184200-3-379fe096c84447b', 'Décision sur votre établissement', 'Décision DEC/2026/0005 (Réhabilitation) pour LYCEE SAINTE GERMAINE.', 0, NULL, '2026-08-25 18:42:00.322548'),
('ntf-20260826092354-1-e190cb5c33784ed', 'Mission signée', 'La mission OM-2026-006 a été signée.', 0, NULL, '2026-08-26 09:23:54.783998'),
('ntf-20260826121714-1-fd0cc453dbab420', 'Fiche à valider', 'La fiche OM-2026-006 attend le « Lu et approuvé » du chef d\'établissement (circuit tablette).', 0, NULL, '2026-08-26 12:17:14.442256'),
('ntf-20260826121746-1-158aaad5d13e41d', 'Fiche validée', 'La fiche OM-2026-006 a été validée (Lu et approuvé) — GRACE TSHIMANGA.', 1, NULL, '2026-08-26 12:17:46.501901'),
('ntf-20260826183425-3-4473878b78af44d', 'Décision sur votre établissement', 'Décision DEC/2026/0006 (Réhabilitation) pour COMPLEXE SCOLAIRE KUYALA.', 1, NULL, '2026-08-26 18:34:25.724323');

-- --------------------------------------------------------

--
-- Structure de la table `outilutilise`
--

CREATE TABLE `outilutilise` (
  `CodeOutile` int(11) NOT NULL,
  `LibelleOutile` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `outilutilise`
--

INSERT INTO `outilutilise` (`CodeOutile`, `LibelleOutile`) VALUES
(1, 'Balais'),
(2, 'Seaux avec essoereur'),
(3, 'Raclettes pour sols'),
(4, 'Autolaveuses');

-- --------------------------------------------------------

--
-- Structure de la table `photos`
--

CREATE TABLE `photos` (
  `Id` int(11) NOT NULL,
  `FicheControleId` varchar(64) NOT NULL,
  `Nom` varchar(250) NOT NULL,
  `Legende` varchar(250) NOT NULL,
  `Url` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `photos`
--

INSERT INTO `photos` (`Id`, `FicheControleId`, `Nom`, `Legende`, `Url`) VALUES
(1, 'mis-20260825013735-c72d11d6414a4', 'Gemini_Generated_Image_9nso559nso559nso.png', 'Gemini_Generated_Image_9nso559nso559nso.png', '/uploads/fiches/mis-20260825013735-c72d11d6414a4/20260825021242-0c8dba7f5b7d4265a4c99e88dbd60ba0.png'),
(2, 'mis-20260825013735-c72d11d6414a4', 'IMG-20260812-WA0177.jpg', 'IMG-20260812-WA0177.jpg', '/uploads/fiches/mis-20260825013735-c72d11d6414a4/20260825021242-a52606ce627c482c9d4e5185ffde815d.jpg'),
(3, 'mis-20260825112618-da5b5c88caad4', 'Gemini_Generated_Image_9nso559nso559nso.png', 'Gemini_Generated_Image_9nso559nso559nso.png', '/uploads/fiches/mis-20260825112618-da5b5c88caad4/20260825112934-57501fa3e0534e2d9a9019f5ca14e4d2.png'),
(4, 'mis-20260825112618-da5b5c88caad4', 'IMG-20260812-WA0177.jpg', 'IMG-20260812-WA0177.jpg', '/uploads/fiches/mis-20260825112618-da5b5c88caad4/20260825112934-a0585f91f90142b5b280d852f5993d29.jpg'),
(5, 'mis-20260825120935-3cd3cdb87f684', 'Gemini_Generated_Image_9nso559nso559nso.png', 'Gemini_Generated_Image_9nso559nso559nso.png', '/uploads/fiches/mis-20260825120935-3cd3cdb87f684/20260825124733-a16775cf585b42b0ab48505ced12eede.png'),
(6, 'mis-20260825120935-3cd3cdb87f684', 'IMG-20260812-WA0177.jpg', 'IMG-20260812-WA0177.jpg', '/uploads/fiches/mis-20260825120935-3cd3cdb87f684/20260825124733-bbe215aff385402eb5fd44b32266f9e8.jpg'),
(7, 'mis-20260825162828-d042080ac7284', 'Gemini_Generated_Image_9nso559nso559nso (1).png', 'Gemini_Generated_Image_9nso559nso559nso (1).png', '/uploads/fiches/mis-20260825162828-d042080ac7284/20260825164035-56bab4622da346b5b478193be42f704b.png'),
(8, 'mis-20260825162828-d042080ac7284', 'Gemini_Generated_Image_9nso559nso559nso.png', 'Gemini_Generated_Image_9nso559nso559nso.png', '/uploads/fiches/mis-20260825162828-d042080ac7284/20260825164035-d1d8dbc940794cd48068a26ab1713dde.png'),
(9, 'mis-20260825180113-6deb17f1ade04', 'Gemini_Generated_Image_9nso559nso559nso (1).png', 'Gemini_Generated_Image_9nso559nso559nso (1).png', '/uploads/fiches/mis-20260825180113-6deb17f1ade04/20260825180955-1450bab8eeaf469aaa2693c9f851e1d7.png'),
(10, 'mis-20260825180113-6deb17f1ade04', 'Gemini_Generated_Image_9nso559nso559nso.png', 'Gemini_Generated_Image_9nso559nso559nso.png', '/uploads/fiches/mis-20260825180113-6deb17f1ade04/20260825180955-6808e65da6cf4f088657e141f95d4ee2.png'),
(11, 'mis-20260826091915-67c6f936282e4', 'OM-2026-006-1', 'OM-2026-006-1', '/uploads/fiches/mis-20260826091915-67c6f936282e4/20260826092731-909c8b79d0e6464aaed74e5f5195072d.png'),
(12, 'mis-20260826091915-67c6f936282e4', 'OM-2026-006-2', 'OM-2026-006-2', '/uploads/fiches/mis-20260826091915-67c6f936282e4/20260826092731-097b1219f71c4d0d81de8533cd662e15.png'),
(13, 'mis-20260826091915-67c6f936282e4', 'OM-2026-006-3', 'OM-2026-006-3', '/uploads/fiches/mis-20260826091915-67c6f936282e4/20260826092731-7ea616beea1d434c9aa4e3fa1acbe419.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `produitutilise`
--

CREATE TABLE `produitutilise` (
  `CodeProduit` int(11) NOT NULL,
  `LibeleProduit` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `produitutilise`
--

INSERT INTO `produitutilise` (`CodeProduit`, `LibeleProduit`) VALUES
(4, 'Désinfectants pour les mains'),
(1, 'Détergents multi-surfaces'),
(3, 'Detergents-désinfectants'),
(2, 'Nettoyant pour sols'),
(5, 'Produits specifiques');

-- --------------------------------------------------------

--
-- Structure de la table `sousprovince`
--

CREATE TABLE `sousprovince` (
  `Code` varchar(10) NOT NULL,
  `Libelle` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `sousprovince`
--

INSERT INTO `sousprovince` (`Code`, `Libelle`) VALUES
('SP001', 'Kinsenso 1'),
('SP002', 'Kinsenso 2'),
('SP003', 'Lemba 1'),
('SP004', 'Lemba 2'),
('SP005', 'Limete 1'),
('SP006', 'Limete 2'),
('SP007', 'Limete 3'),
('SP008', 'Matete 1'),
('SP009', 'Matete 2'),
('SP010', 'Ngaba');

-- --------------------------------------------------------

--
-- Structure de la table `__efmigrationshistory`
--

CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `__efmigrationshistory`
--

INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES
('20260824225538_InitialSchemaAlignment', '8.0.13'),
('20260824233932_RefTablesAddAutoIncrementId', '8.0.13'),
('20260825003058_CodesAsAutoIncrementPk', '8.0.13'),
('20260825012637_PrefetTableAndEcoleFk', '8.0.13'),
('20260825020618_MissionProduitOutilJunction', '8.0.13'),
('20260825101014_RenamePrefetToChefEtablissement', '8.0.13'),
('20260825111434_AddOutilsAutresOnMission', '8.0.13'),
('20260825174612_DomainSchemaCleanupMatriculeMontPer', '8.0.13'),
('20260826013400_AddEcritureDelegueeOnAffectation', '8.0.13'),
('20260826180000_SousProvinceAndRapportFlags', '8.0.13'),
('20260829091000_AddActifOnAgents', '8.0.13');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `affectation`
--
ALTER TABLE `affectation`
  ADD PRIMARY KEY (`IdAffectation`),
  ADD UNIQUE KEY `IX_Affectation_NomOrdre_MatrAgent` (`NomOrdre`,`MatrAgent`),
  ADD KEY `IX_Affectation_MatrAgent` (`MatrAgent`);

--
-- Index pour la table `agents`
--
ALTER TABLE `agents`
  ADD PRIMARY KEY (`MatrAgent`),
  ADD KEY `IX_Agents_NomAgent` (`NomAgent`),
  ADD KEY `IX_Agents_Actif` (`Actif`);

--
-- Index pour la table `aspnetroleclaims`
--
ALTER TABLE `aspnetroleclaims`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_AspNetRoleClaims_RoleId` (`RoleId`);

--
-- Index pour la table `aspnetroles`
--
ALTER TABLE `aspnetroles`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `RoleNameIndex` (`NormalizedName`);

--
-- Index pour la table `aspnetuserclaims`
--
ALTER TABLE `aspnetuserclaims`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_AspNetUserClaims_UserId` (`UserId`);

--
-- Index pour la table `aspnetuserlogins`
--
ALTER TABLE `aspnetuserlogins`
  ADD PRIMARY KEY (`LoginProvider`,`ProviderKey`),
  ADD KEY `IX_AspNetUserLogins_UserId` (`UserId`);

--
-- Index pour la table `aspnetuserroles`
--
ALTER TABLE `aspnetuserroles`
  ADD PRIMARY KEY (`UserId`,`RoleId`),
  ADD KEY `IX_AspNetUserRoles_RoleId` (`RoleId`);

--
-- Index pour la table `aspnetusers`
--
ALTER TABLE `aspnetusers`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_AspNetUsers_AgentId` (`AgentId`),
  ADD UNIQUE KEY `UserNameIndex` (`NormalizedUserName`),
  ADD KEY `EmailIndex` (`NormalizedEmail`),
  ADD KEY `IX_AspNetUsers_EcoleId` (`EcoleId`);

--
-- Index pour la table `aspnetusertokens`
--
ALTER TABLE `aspnetusertokens`
  ADD PRIMARY KEY (`UserId`,`LoginProvider`,`Name`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`CodeCategories`);

--
-- Index pour la table `chefetablissement`
--
ALTER TABLE `chefetablissement`
  ADD PRIMARY KEY (`Matricule`),
  ADD KEY `IX_ChefEtablissement_NomComplet` (`NomComplet`);

--
-- Index pour la table `decision`
--
ALTER TABLE `decision`
  ADD PRIMARY KEY (`NumDecision`),
  ADD KEY `IX_Decision_NumAgrement` (`NumAgrement`),
  ADD KEY `IX_Decision_NumOrdre` (`NumOrdre`);

--
-- Index pour la table `etablissement`
--
ALTER TABLE `etablissement`
  ADD PRIMARY KEY (`NumAgrement`),
  ADD UNIQUE KEY `IX_Etablissement_Id` (`Id`),
  ADD UNIQUE KEY `IX_Etablissement_IDDinacope` (`IDDinacope`),
  ADD KEY `IX_Etablissement_CodeCategories` (`CodeCategories`),
  ADD KEY `IX_Etablissement_MatriculeChef` (`MatriculeChef`);

--
-- Index pour la table `journalentries`
--
ALTER TABLE `journalentries`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_JournalEntries_CreatedAt` (`CreatedAt`);

--
-- Index pour la table `mission`
--
ALTER TABLE `mission`
  ADD PRIMARY KEY (`NumOrdre`),
  ADD UNIQUE KEY `AK_Mission_Id` (`Id`),
  ADD UNIQUE KEY `IX_Mission_Id` (`Id`),
  ADD KEY `IX_Mission_CodeOutil` (`CodeOutil`),
  ADD KEY `IX_Mission_CodeProduit` (`CodeProduit`),
  ADD KEY `IX_Mission_DateFin` (`DateFin`),
  ADD KEY `IX_Mission_NumAgrement` (`NumAgrement`),
  ADD KEY `IX_Mission_Validite` (`Validite`);

--
-- Index pour la table `missionoutil`
--
ALTER TABLE `missionoutil`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_MissionOutil_NumOrdre_CodeOutil` (`NumOrdre`,`CodeOutil`),
  ADD KEY `IX_MissionOutil_CodeOutil` (`CodeOutil`);

--
-- Index pour la table `missionproduit`
--
ALTER TABLE `missionproduit`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_MissionProduit_NumOrdre_CodeProduit` (`NumOrdre`,`CodeProduit`),
  ADD KEY `IX_MissionProduit_CodeProduit` (`CodeProduit`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Notifications_CreatedAt` (`CreatedAt`),
  ADD KEY `IX_Notifications_UserId` (`UserId`);

--
-- Index pour la table `outilutilise`
--
ALTER TABLE `outilutilise`
  ADD PRIMARY KEY (`CodeOutile`);

--
-- Index pour la table `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Photos_FicheControleId` (`FicheControleId`);

--
-- Index pour la table `produitutilise`
--
ALTER TABLE `produitutilise`
  ADD PRIMARY KEY (`CodeProduit`),
  ADD KEY `IX_ProduitUtilise_LibeleProduit` (`LibeleProduit`);

--
-- Index pour la table `sousprovince`
--
ALTER TABLE `sousprovince`
  ADD PRIMARY KEY (`Code`),
  ADD UNIQUE KEY `IX_SousProvince_Libelle` (`Libelle`);

--
-- Index pour la table `__efmigrationshistory`
--
ALTER TABLE `__efmigrationshistory`
  ADD PRIMARY KEY (`MigrationId`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `affectation`
--
ALTER TABLE `affectation`
  MODIFY `IdAffectation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `aspnetroleclaims`
--
ALTER TABLE `aspnetroleclaims`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `aspnetuserclaims`
--
ALTER TABLE `aspnetuserclaims`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `CodeCategories` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `missionoutil`
--
ALTER TABLE `missionoutil`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `missionproduit`
--
ALTER TABLE `missionproduit`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `outilutilise`
--
ALTER TABLE `outilutilise`
  MODIFY `CodeOutile` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `photos`
--
ALTER TABLE `photos`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `produitutilise`
--
ALTER TABLE `produitutilise`
  MODIFY `CodeProduit` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `affectation`
--
ALTER TABLE `affectation`
  ADD CONSTRAINT `FK_Affectation_Agents_MatrAgent` FOREIGN KEY (`MatrAgent`) REFERENCES `agents` (`MatrAgent`),
  ADD CONSTRAINT `FK_Affectation_Mission_NomOrdre` FOREIGN KEY (`NomOrdre`) REFERENCES `mission` (`NumOrdre`) ON DELETE CASCADE;

--
-- Contraintes pour la table `aspnetroleclaims`
--
ALTER TABLE `aspnetroleclaims`
  ADD CONSTRAINT `FK_AspNetRoleClaims_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `aspnetuserclaims`
--
ALTER TABLE `aspnetuserclaims`
  ADD CONSTRAINT `FK_AspNetUserClaims_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `aspnetuserlogins`
--
ALTER TABLE `aspnetuserlogins`
  ADD CONSTRAINT `FK_AspNetUserLogins_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `aspnetuserroles`
--
ALTER TABLE `aspnetuserroles`
  ADD CONSTRAINT `FK_AspNetUserRoles_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AspNetUserRoles_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `aspnetusertokens`
--
ALTER TABLE `aspnetusertokens`
  ADD CONSTRAINT `FK_AspNetUserTokens_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `decision`
--
ALTER TABLE `decision`
  ADD CONSTRAINT `FK_Decision_Etablissement_NumAgrement` FOREIGN KEY (`NumAgrement`) REFERENCES `etablissement` (`NumAgrement`),
  ADD CONSTRAINT `FK_Decision_Mission_NumOrdre` FOREIGN KEY (`NumOrdre`) REFERENCES `mission` (`NumOrdre`);

--
-- Contraintes pour la table `etablissement`
--
ALTER TABLE `etablissement`
  ADD CONSTRAINT `FK_Etablissement_Categories_CodeCategories` FOREIGN KEY (`CodeCategories`) REFERENCES `categories` (`CodeCategories`) ON DELETE NO ACTION,
  ADD CONSTRAINT `FK_Etablissement_ChefEtablissement_MatriculeChef` FOREIGN KEY (`MatriculeChef`) REFERENCES `chefetablissement` (`Matricule`) ON DELETE SET NULL;

--
-- Contraintes pour la table `mission`
--
ALTER TABLE `mission`
  ADD CONSTRAINT `FK_Mission_Etablissement_NumAgrement` FOREIGN KEY (`NumAgrement`) REFERENCES `etablissement` (`NumAgrement`),
  ADD CONSTRAINT `FK_Mission_OutilUtilise_CodeOutil` FOREIGN KEY (`CodeOutil`) REFERENCES `outilutilise` (`CodeOutile`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_Mission_ProduitUtilise_CodeProduit` FOREIGN KEY (`CodeProduit`) REFERENCES `produitutilise` (`CodeProduit`) ON DELETE SET NULL;

--
-- Contraintes pour la table `missionoutil`
--
ALTER TABLE `missionoutil`
  ADD CONSTRAINT `FK_MissionOutil_Mission_NumOrdre` FOREIGN KEY (`NumOrdre`) REFERENCES `mission` (`NumOrdre`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_MissionOutil_OutilUtilise_CodeOutil` FOREIGN KEY (`CodeOutil`) REFERENCES `outilutilise` (`CodeOutile`);

--
-- Contraintes pour la table `missionproduit`
--
ALTER TABLE `missionproduit`
  ADD CONSTRAINT `FK_MissionProduit_Mission_NumOrdre` FOREIGN KEY (`NumOrdre`) REFERENCES `mission` (`NumOrdre`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_MissionProduit_ProduitUtilise_CodeProduit` FOREIGN KEY (`CodeProduit`) REFERENCES `produitutilise` (`CodeProduit`);

--
-- Contraintes pour la table `photos`
--
ALTER TABLE `photos`
  ADD CONSTRAINT `FK_Photos_Mission_FicheControleId` FOREIGN KEY (`FicheControleId`) REFERENCES `mission` (`Id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 16 août 2026 à 15:51
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
('399b4875-006d-493a-bc15-fedf7200e1cf', 'Contrôleur', 'CONTRÔLEUR', NULL),
('6834dbdb-a8a6-47ec-b5ed-ec46940cae10', 'Administrateur système', 'ADMINISTRATEUR SYSTÈME', NULL),
('c5453380-996f-4e9a-958a-f0dd62c0645f', 'Directeur Provincial', 'DIRECTEUR PROVINCIAL', NULL),
('ea6427b7-6636-4291-84fa-272d374bef96', 'Chef d\'établissement', 'CHEF D\'ÉTABLISSEMENT', NULL),
('f6e428cb-c623-4496-bc07-a5daf8b41f4a', 'Agent du Secrétariat', 'AGENT DU SECRÉTARIAT', NULL);

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
('usr-001', '6834dbdb-a8a6-47ec-b5ed-ec46940cae10');

-- --------------------------------------------------------

--
-- Structure de la table `aspnetusers`
--

CREATE TABLE `aspnetusers` (
  `Id` varchar(255) NOT NULL,
  `Nom` varchar(200) NOT NULL,
  `Equipe` varchar(100) DEFAULT NULL,
  `Statut` varchar(40) NOT NULL,
  `Telephone` varchar(40) DEFAULT NULL,
  `Role` varchar(100) NOT NULL,
  `EcoleId` varchar(64) DEFAULT NULL,
  `EquipeId` varchar(64) DEFAULT NULL,
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
  `AccessFailedCount` int(11) NOT NULL,
  `ControleurId` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `aspnetusers`
--

INSERT INTO `aspnetusers` (`Id`, `Nom`, `Equipe`, `Statut`, `Telephone`, `Role`, `EcoleId`, `EquipeId`, `CreatedAt`, `UserName`, `NormalizedUserName`, `Email`, `NormalizedEmail`, `EmailConfirmed`, `PasswordHash`, `SecurityStamp`, `ConcurrencyStamp`, `PhoneNumber`, `PhoneNumberConfirmed`, `TwoFactorEnabled`, `LockoutEnd`, `LockoutEnabled`, `AccessFailedCount`, `ControleurId`) VALUES
('usr-001', 'Admin Système', NULL, 'actif', '+243810001370', 'Administrateur système', NULL, NULL, '2026-08-12 23:51:50.691781', 'admin@inspect-san.cd', 'ADMIN@INSPECT-SAN.CD', 'admin@inspect-san.cd', 'ADMIN@INSPECT-SAN.CD', 1, 'AQAAAAIAAYagAAAAEMnxYfSwzPcQZn1LW8/9EVgbT1HwbDgA4hPKM/nxQ9e19UPJINppruHhnV38DizkYw==', 'RIBW362YPUQXOQEHAXCR2LYZ5ODSMBEJ', 'cbc6a642-b091-405a-8f51-88868e147ac5', NULL, 0, 0, NULL, 1, 0, NULL);

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
-- Structure de la table `chefs`
--

CREATE TABLE `chefs` (
  `Id` varchar(64) NOT NULL,
  `NomComplet` varchar(200) NOT NULL,
  `IdDinacope` varchar(50) NOT NULL,
  `Telephone` varchar(40) NOT NULL,
  `EcoleId` varchar(64) NOT NULL,
  `AncienneteEnseignement` int(11) DEFAULT NULL,
  `AncienneteChef` int(11) DEFAULT NULL,
  `AncienneteEcole` int(11) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `communes`
--

CREATE TABLE `communes` (
  `Id` varchar(64) NOT NULL,
  `Nom` varchar(150) NOT NULL,
  `Code` varchar(50) DEFAULT NULL,
  `Actif` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `controleurs`
--

CREATE TABLE `controleurs` (
  `Id` varchar(64) NOT NULL,
  `NomComplet` varchar(200) NOT NULL,
  `Telephone` varchar(40) DEFAULT NULL,
  `EquipeId` varchar(64) NOT NULL,
  `Actif` tinyint(1) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `decisions`
--

CREATE TABLE `decisions` (
  `Id` varchar(64) NOT NULL,
  `Numero` varchar(80) NOT NULL,
  `RapportId` varchar(64) NOT NULL,
  `EcoleId` varchar(64) NOT NULL,
  `TypeDecisionId` varchar(64) NOT NULL,
  `DelaiExecution` varchar(100) DEFAULT NULL,
  `StatutExecution` varchar(50) NOT NULL,
  `Motif` longtext DEFAULT NULL,
  `Commentaire` longtext DEFAULT NULL,
  `DecidePar` varchar(64) DEFAULT NULL,
  `DecideLe` datetime(6) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ecoledocuments`
--

CREATE TABLE `ecoledocuments` (
  `Id` int(11) NOT NULL,
  `Nom` varchar(250) NOT NULL,
  `Taille` varchar(50) NOT NULL,
  `Date` datetime(6) NOT NULL,
  `EcoleId` varchar(64) NOT NULL,
  `Url` varchar(500) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ecoles`
--

CREATE TABLE `ecoles` (
  `Id` varchar(64) NOT NULL,
  `Denomination` varchar(250) NOT NULL,
  `RegimeId` varchar(64) NOT NULL,
  `CommuneId` varchar(64) NOT NULL,
  `IdDinacope` varchar(50) NOT NULL,
  `NumAgrement` varchar(100) DEFAULT NULL,
  `NumNotification` varchar(100) DEFAULT NULL,
  `Adresse_Quartier` varchar(120) NOT NULL,
  `Adresse_Avenue` varchar(150) NOT NULL,
  `Adresse_Numero` varchar(30) NOT NULL,
  `Statut` varchar(50) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `equipes`
--

CREATE TABLE `equipes` (
  `Id` varchar(64) NOT NULL,
  `Nom` varchar(150) NOT NULL,
  `Actif` tinyint(1) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `ChefControleurId` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `fichephotos`
--

CREATE TABLE `fichephotos` (
  `Id` int(11) NOT NULL,
  `Nom` varchar(250) NOT NULL,
  `Legende` varchar(250) NOT NULL,
  `Url` varchar(500) NOT NULL,
  `FicheControleId` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `fichescontrole`
--

CREATE TABLE `fichescontrole` (
  `Id` varchar(64) NOT NULL,
  `Numero` varchar(80) NOT NULL,
  `OrdreMissionId` varchar(64) NOT NULL,
  `EcoleId` varchar(64) NOT NULL,
  `ChefId` varchar(64) DEFAULT NULL,
  `Statut` varchar(50) NOT NULL,
  `Batiments_NombreBatiments` int(11) NOT NULL,
  `Batiments_EtatGeneral` varchar(50) NOT NULL,
  `Batiments_NombreEleves` int(11) NOT NULL,
  `Batiments_ToilettesFilles` varchar(120) NOT NULL,
  `Batiments_ToilettesGarcons` varchar(120) NOT NULL,
  `Impact7_MontantPercu` varchar(80) NOT NULL,
  `Impact7_ProduitsJson` longtext NOT NULL,
  `Impact7_Quantite` varchar(250) NOT NULL,
  `ProduitsAutres` varchar(500) NOT NULL,
  `Observations` longtext DEFAULT NULL,
  `RecommandationPreliminaire` varchar(100) NOT NULL,
  `ValideePar` varchar(64) DEFAULT NULL,
  `ValideeLe` datetime(6) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `journalentries`
--

CREATE TABLE `journalentries` (
  `Id` varchar(64) NOT NULL,
  `UtilisateurId` varchar(64) NOT NULL,
  `Module` varchar(100) NOT NULL,
  `Action` varchar(100) NOT NULL,
  `Detail` varchar(1000) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `journalentries`
--

INSERT INTO `journalentries` (`Id`, `UtilisateurId`, `Module`, `Action`, `Detail`, `CreatedAt`) VALUES
('log-20260816134231-1-931c3d52fd434a5', 'usr-001', 'Authentification', 'connexion', 'Connexion de Admin Système', '2026-08-16 13:42:31.441138'),
('log-20260816134936-1-3ec4af7c14754c3', 'usr-001', 'Authentification', 'connexion', 'Connexion de Admin Système', '2026-08-16 13:49:36.347446');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `Id` varchar(64) NOT NULL,
  `Titre` varchar(200) NOT NULL,
  `Message` varchar(1000) NOT NULL,
  `Lu` tinyint(1) NOT NULL,
  `UserId` varchar(64) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ordresmission`
--

CREATE TABLE `ordresmission` (
  `Id` varchar(64) NOT NULL,
  `Numero` varchar(80) NOT NULL,
  `EcoleId` varchar(64) NOT NULL,
  `EquipeId` varchar(64) NOT NULL,
  `Statut` varchar(50) NOT NULL,
  `DateEmission` datetime(6) DEFAULT NULL,
  `DebutValidite` datetime(6) DEFAULT NULL,
  `FinValidite` datetime(6) DEFAULT NULL,
  `DateMission` datetime(6) DEFAULT NULL,
  `SigneLe` datetime(6) DEFAULT NULL,
  `SignePar` varchar(64) DEFAULT NULL,
  `Objet` varchar(500) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `rapportfiches`
--

CREATE TABLE `rapportfiches` (
  `RapportId` varchar(64) NOT NULL,
  `FicheControleId` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `rapports`
--

CREATE TABLE `rapports` (
  `Id` varchar(64) NOT NULL,
  `Numero` varchar(80) NOT NULL,
  `EcoleId` varchar(64) NOT NULL,
  `FicheIdsJson` longtext NOT NULL,
  `Synthese` longtext NOT NULL,
  `Statut` varchar(50) NOT NULL,
  `DeposeLe` datetime(6) DEFAULT NULL,
  `DeposePar` varchar(64) DEFAULT NULL,
  `AccuseReceptionLe` datetime(6) DEFAULT NULL,
  `AccusePar` varchar(64) DEFAULT NULL,
  `TransmisLe` datetime(6) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `regimes`
--

CREATE TABLE `regimes` (
  `Id` varchar(64) NOT NULL,
  `Nom` varchar(150) NOT NULL,
  `Code` varchar(50) DEFAULT NULL,
  `Actif` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `typesdecision`
--

CREATE TABLE `typesdecision` (
  `Id` varchar(64) NOT NULL,
  `Nom` varchar(150) NOT NULL,
  `Code` varchar(50) DEFAULT NULL,
  `Libelle` varchar(200) DEFAULT NULL,
  `Actif` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
('20260812234242_InitialTeamSchema', '8.0.13'),
('20260813121240_AddChefEquipeAndUserControleurId', '8.0.13'),
('20260814234529_PersistJournalNotificationsAndDocumentUrl', '8.0.13');

--
-- Index pour les tables déchargées
--

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
  ADD UNIQUE KEY `UserNameIndex` (`NormalizedUserName`),
  ADD UNIQUE KEY `IX_AspNetUsers_ControleurId` (`ControleurId`),
  ADD KEY `EmailIndex` (`NormalizedEmail`),
  ADD KEY `IX_AspNetUsers_EcoleId` (`EcoleId`),
  ADD KEY `IX_AspNetUsers_EquipeId` (`EquipeId`);

--
-- Index pour la table `aspnetusertokens`
--
ALTER TABLE `aspnetusertokens`
  ADD PRIMARY KEY (`UserId`,`LoginProvider`,`Name`);

--
-- Index pour la table `chefs`
--
ALTER TABLE `chefs`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Chefs_EcoleId` (`EcoleId`),
  ADD KEY `IX_Chefs_IdDinacope` (`IdDinacope`);

--
-- Index pour la table `communes`
--
ALTER TABLE `communes`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Communes_Nom` (`Nom`);

--
-- Index pour la table `controleurs`
--
ALTER TABLE `controleurs`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Controleurs_EquipeId` (`EquipeId`);

--
-- Index pour la table `decisions`
--
ALTER TABLE `decisions`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Decisions_Numero` (`Numero`),
  ADD KEY `IX_Decisions_EcoleId` (`EcoleId`),
  ADD KEY `IX_Decisions_RapportId` (`RapportId`),
  ADD KEY `IX_Decisions_StatutExecution` (`StatutExecution`),
  ADD KEY `IX_Decisions_TypeDecisionId` (`TypeDecisionId`);

--
-- Index pour la table `ecoledocuments`
--
ALTER TABLE `ecoledocuments`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_EcoleDocuments_EcoleId` (`EcoleId`);

--
-- Index pour la table `ecoles`
--
ALTER TABLE `ecoles`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Ecoles_IdDinacope` (`IdDinacope`),
  ADD KEY `IX_Ecoles_CommuneId` (`CommuneId`),
  ADD KEY `IX_Ecoles_RegimeId` (`RegimeId`),
  ADD KEY `IX_Ecoles_Statut` (`Statut`);

--
-- Index pour la table `equipes`
--
ALTER TABLE `equipes`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Equipes_ChefControleurId` (`ChefControleurId`),
  ADD KEY `IX_Equipes_Nom` (`Nom`);

--
-- Index pour la table `fichephotos`
--
ALTER TABLE `fichephotos`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_FichePhotos_FicheControleId` (`FicheControleId`);

--
-- Index pour la table `fichescontrole`
--
ALTER TABLE `fichescontrole`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_FichesControle_Numero` (`Numero`),
  ADD KEY `IX_FichesControle_ChefId` (`ChefId`),
  ADD KEY `IX_FichesControle_CreatedAt` (`CreatedAt`),
  ADD KEY `IX_FichesControle_EcoleId` (`EcoleId`),
  ADD KEY `IX_FichesControle_OrdreMissionId` (`OrdreMissionId`),
  ADD KEY `IX_FichesControle_Statut` (`Statut`);

--
-- Index pour la table `journalentries`
--
ALTER TABLE `journalentries`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_JournalEntries_CreatedAt` (`CreatedAt`),
  ADD KEY `IX_JournalEntries_Module` (`Module`),
  ADD KEY `IX_JournalEntries_UtilisateurId` (`UtilisateurId`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Notifications_CreatedAt` (`CreatedAt`),
  ADD KEY `IX_Notifications_Lu` (`Lu`),
  ADD KEY `IX_Notifications_UserId` (`UserId`);

--
-- Index pour la table `ordresmission`
--
ALTER TABLE `ordresmission`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_OrdresMission_Numero` (`Numero`),
  ADD KEY `IX_OrdresMission_DebutValidite_FinValidite` (`DebutValidite`,`FinValidite`),
  ADD KEY `IX_OrdresMission_EcoleId` (`EcoleId`),
  ADD KEY `IX_OrdresMission_EquipeId` (`EquipeId`),
  ADD KEY `IX_OrdresMission_Statut` (`Statut`);

--
-- Index pour la table `rapportfiches`
--
ALTER TABLE `rapportfiches`
  ADD PRIMARY KEY (`RapportId`,`FicheControleId`),
  ADD KEY `IX_RapportFiches_FicheControleId` (`FicheControleId`);

--
-- Index pour la table `rapports`
--
ALTER TABLE `rapports`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Rapports_Numero` (`Numero`),
  ADD KEY `IX_Rapports_DeposeLe` (`DeposeLe`),
  ADD KEY `IX_Rapports_EcoleId` (`EcoleId`),
  ADD KEY `IX_Rapports_Statut` (`Statut`);

--
-- Index pour la table `regimes`
--
ALTER TABLE `regimes`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Regimes_Nom` (`Nom`);

--
-- Index pour la table `typesdecision`
--
ALTER TABLE `typesdecision`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_TypesDecision_Code` (`Code`),
  ADD KEY `IX_TypesDecision_Nom` (`Nom`);

--
-- Index pour la table `__efmigrationshistory`
--
ALTER TABLE `__efmigrationshistory`
  ADD PRIMARY KEY (`MigrationId`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

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
-- AUTO_INCREMENT pour la table `ecoledocuments`
--
ALTER TABLE `ecoledocuments`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `fichephotos`
--
ALTER TABLE `fichephotos`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

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
-- Contraintes pour la table `chefs`
--
ALTER TABLE `chefs`
  ADD CONSTRAINT `FK_Chefs_Ecoles_EcoleId` FOREIGN KEY (`EcoleId`) REFERENCES `ecoles` (`Id`);

--
-- Contraintes pour la table `controleurs`
--
ALTER TABLE `controleurs`
  ADD CONSTRAINT `FK_Controleurs_Equipes_EquipeId` FOREIGN KEY (`EquipeId`) REFERENCES `equipes` (`Id`);

--
-- Contraintes pour la table `decisions`
--
ALTER TABLE `decisions`
  ADD CONSTRAINT `FK_Decisions_Ecoles_EcoleId` FOREIGN KEY (`EcoleId`) REFERENCES `ecoles` (`Id`),
  ADD CONSTRAINT `FK_Decisions_Rapports_RapportId` FOREIGN KEY (`RapportId`) REFERENCES `rapports` (`Id`),
  ADD CONSTRAINT `FK_Decisions_TypesDecision_TypeDecisionId` FOREIGN KEY (`TypeDecisionId`) REFERENCES `typesdecision` (`Id`);

--
-- Contraintes pour la table `ecoledocuments`
--
ALTER TABLE `ecoledocuments`
  ADD CONSTRAINT `FK_EcoleDocuments_Ecoles_EcoleId` FOREIGN KEY (`EcoleId`) REFERENCES `ecoles` (`Id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `ecoles`
--
ALTER TABLE `ecoles`
  ADD CONSTRAINT `FK_Ecoles_Communes_CommuneId` FOREIGN KEY (`CommuneId`) REFERENCES `communes` (`Id`),
  ADD CONSTRAINT `FK_Ecoles_Regimes_RegimeId` FOREIGN KEY (`RegimeId`) REFERENCES `regimes` (`Id`);

--
-- Contraintes pour la table `equipes`
--
ALTER TABLE `equipes`
  ADD CONSTRAINT `FK_Equipes_Controleurs_ChefControleurId` FOREIGN KEY (`ChefControleurId`) REFERENCES `controleurs` (`Id`);

--
-- Contraintes pour la table `fichephotos`
--
ALTER TABLE `fichephotos`
  ADD CONSTRAINT `FK_FichePhotos_FichesControle_FicheControleId` FOREIGN KEY (`FicheControleId`) REFERENCES `fichescontrole` (`Id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `fichescontrole`
--
ALTER TABLE `fichescontrole`
  ADD CONSTRAINT `FK_FichesControle_Chefs_ChefId` FOREIGN KEY (`ChefId`) REFERENCES `chefs` (`Id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_FichesControle_Ecoles_EcoleId` FOREIGN KEY (`EcoleId`) REFERENCES `ecoles` (`Id`),
  ADD CONSTRAINT `FK_FichesControle_OrdresMission_OrdreMissionId` FOREIGN KEY (`OrdreMissionId`) REFERENCES `ordresmission` (`Id`);

--
-- Contraintes pour la table `ordresmission`
--
ALTER TABLE `ordresmission`
  ADD CONSTRAINT `FK_OrdresMission_Ecoles_EcoleId` FOREIGN KEY (`EcoleId`) REFERENCES `ecoles` (`Id`),
  ADD CONSTRAINT `FK_OrdresMission_Equipes_EquipeId` FOREIGN KEY (`EquipeId`) REFERENCES `equipes` (`Id`);

--
-- Contraintes pour la table `rapportfiches`
--
ALTER TABLE `rapportfiches`
  ADD CONSTRAINT `FK_RapportFiches_FichesControle_FicheControleId` FOREIGN KEY (`FicheControleId`) REFERENCES `fichescontrole` (`Id`),
  ADD CONSTRAINT `FK_RapportFiches_Rapports_RapportId` FOREIGN KEY (`RapportId`) REFERENCES `rapports` (`Id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `rapports`
--
ALTER TABLE `rapports`
  ADD CONSTRAINT `FK_Rapports_Ecoles_EcoleId` FOREIGN KEY (`EcoleId`) REFERENCES `ecoles` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

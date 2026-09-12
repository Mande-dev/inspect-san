-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 12 sep. 2026 à 02:29
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
-- Structure de la table `affectation`
--

CREATE TABLE `affectation` (
  `IdAffectation` int(11) NOT NULL,
  `NomOrdre` varchar(80) NOT NULL,
  `MatrAgent` varchar(64) NOT NULL,
  `Fonction` varchar(50) NOT NULL,
  `EcritureDeleguee` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
('usr-001', 'Admin Système', 'actif', NULL, 'Administrateur système', NULL, NULL, '2026-08-24 23:05:50.386859', 'admin@inspect-san.cd', 'ADMIN@INSPECT-SAN.CD', 'admin@inspect-san.cd', 'ADMIN@INSPECT-SAN.CD', 1, 'AQAAAAIAAYagAAAAENaxZFPj8e2RCtid5qKZ83y+XW7hE7f0c+CfGWvMW0FWjSRHNFhs52kEawDg3wd8nQ==', '5PFWYGMRVFQ4YPYN6XE2PNHV4XGSITHF', 'e1eaad03-861c-45f1-88e4-beffeb7ce88a', NULL, 0, 0, NULL, 1, 0);

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

-- --------------------------------------------------------

--
-- Structure de la table `outilutilise`
--

CREATE TABLE `outilutilise` (
  `CodeOutile` int(11) NOT NULL,
  `LibelleOutile` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Structure de la table `produitutilise`
--

CREATE TABLE `produitutilise` (
  `CodeProduit` int(11) NOT NULL,
  `LibeleProduit` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  MODIFY `IdAffectation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `missionproduit`
--
ALTER TABLE `missionproduit`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `outilutilise`
--
ALTER TABLE `outilutilise`
  MODIFY `CodeOutile` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `photos`
--
ALTER TABLE `photos`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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

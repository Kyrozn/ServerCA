-- Adminer 4.8.1 MySQL 11.5.2-MariaDB-ubu2404 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

CREATE DATABASE `CocktailAppDB`;
USE `CocktailAppDB`;

CREATE TABLE `Users`
(
    `ID`        uuid PRIMARY KEY,
    `Email`     varchar(100) UNIQUE NOT NULL,
    `FirstName` varchar(100)        NOT NULL,
    `LastName`  varchar(100)        NOT NULL,
    `Password`  varchar(100)        NOT NULL,
    `Role`      enum('User', 'Admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE `Cocktails`
(
    `ID`          uuid PRIMARY KEY,
    `Name`        varchar(100) UNIQUE NOT NULL,
    `Description` text,
    `Recipe`      text,
    `Taste`       enum('Sweet', 'Sour', 'Strong') NOT NULL,
    `Volume`      decimal(5, 2)       NOT NULL COMMENT 'in cL',
    `Alcohol`     decimal(5, 2) DEFAULT 0 COMMENT 'in cL',
    `Image`       tinyint(1) DEFAULT 0,
    `CreatorID`   uuid,
    `Valid`       tinyint(1) DEFAULT 0,
    FOREIGN KEY (CreatorID) REFERENCES Users (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE `Ingredients`
(
    `ID`             uuid PRIMARY KEY,
    `Name`           varchar(100) NOT NULL,
    `Categ`          enum('Alcohol', 'Juice', 'Sirop', 'Soft', 'Trim', 'Other') NOT NULL,
    `AlcoholContent` decimal(5, 2) DEFAULT 0 COMMENT 'in percentage'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE `CocktailIngredients`
(
    `CocktailID`   uuid,
    `IngredientID` uuid,
    PRIMARY KEY (CocktailID, IngredientID),
    FOREIGN KEY (CocktailID) REFERENCES Cocktails (ID),
    FOREIGN KEY (IngredientID) REFERENCES Ingredients (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE `Ratings`
(
    `CocktailID` uuid,
    `UserID`     uuid,
    `Rating`     INT NOT NULL COMMENT '0 to 5',
    CHECK (Rating >= 0 AND Rating <= 5),
    PRIMARY KEY (CocktailID, UserID),
    FOREIGN KEY (CocktailID) REFERENCES Cocktails (ID),
    FOREIGN KEY (UserID) REFERENCES Users (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
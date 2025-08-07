-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 04, 2025 at 03:53 PM
-- Wersja serwera: 8.0.39
-- Wersja PHP: 8.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `property_managament_system`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `dzialki`
--

CREATE TABLE `dzialki` (
  `ID` int NOT NULL,
  `numer_seryjny_dzialki` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nr_dzialki` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `powierzchnia` decimal(8,4) NOT NULL,
  `ID_miejscowosci` int NOT NULL,
  `ID_wlasciciela` int NOT NULL,
  `nr_kw` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `hipoteka` tinyint(1) NOT NULL,
  `ID_rodzaju` int NOT NULL,
  `opis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `ID_przeznaczenia` int NOT NULL,
  `ID_mpzp` int NOT NULL,
  `ID_planu_ogolnego` int NOT NULL,
  `ID_dzierzawy` int DEFAULT NULL,
  `spolka_wodna` tinyint(1) NOT NULL,
  `ID_nabycia` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `dzierzawcy`
--

CREATE TABLE `dzierzawcy` (
  `ID` int NOT NULL,
  `imie` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nazwisko` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `telefon` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `dzierzawy`
--

CREATE TABLE `dzierzawy` (
  `ID` int NOT NULL,
  `ID_dzierzawcy` int NOT NULL,
  `data_rozpoczecia` date NOT NULL,
  `data_zakonczenia` date NOT NULL,
  `wysokosc_czynszu` decimal(7,2) NOT NULL,
  `data_wystawienia_fv_czynszowej` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `klasy_gruntu`
--

CREATE TABLE `klasy_gruntu` (
  `ID` int NOT NULL,
  `klasa` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `przelicznik` decimal(3,2) NOT NULL,
  `okreg_podatkowy` int NOT NULL,
  `podatek` enum('rolny','leśny','zwolniony') COLLATE utf8mb4_general_ci DEFAULT 'rolny'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `lokalizacje`
--

CREATE TABLE `lokalizacje` (
  `ID` int NOT NULL,
  `wojewodztwo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `powiat` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `gmina` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `podatek_rolny` decimal(8,4) DEFAULT NULL,
  `podatek_lesny` decimal(8,4) DEFAULT NULL,
  `okreg_podatkowy` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `miejscowosci`
--

CREATE TABLE `miejscowosci` (
  `ID` int NOT NULL,
  `ID_lokalizacji` int NOT NULL,
  `nazwa` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `mpzp`
--

CREATE TABLE `mpzp` (
  `ID` int NOT NULL,
  `kod` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `opis` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `nabycia`
--

CREATE TABLE `nabycia` (
  `ID` int NOT NULL,
  `data_nabycia` date NOT NULL,
  `nr_aktu` varchar(21) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sprzedawca` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cena_zakupu` decimal(8,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `plany_ogolne`
--

CREATE TABLE `plany_ogolne` (
  `ID` int NOT NULL,
  `kod` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `opis` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `powierzchnie_dzialek`
--

CREATE TABLE `powierzchnie_dzialek` (
  `ID` int NOT NULL,
  `ID_dzialki` int NOT NULL,
  `ID_klasy` int NOT NULL,
  `powierzchnia` decimal(8,4) NOT NULL,
  `zwolniona_powierzchnia` decimal(8,4) NOT NULL DEFAULT '0.0000'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `przeznaczenia_dzialek`
--

CREATE TABLE `przeznaczenia_dzialek` (
  `ID` int NOT NULL,
  `typ` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `rodzaje_dzialek`
--

CREATE TABLE `rodzaje_dzialek` (
  `ID` int NOT NULL,
  `nazwa` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `uzytkownicy`
--

CREATE TABLE `uzytkownicy` (
  `ID` int NOT NULL,
  `imie` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nazwisko` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `haslo` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `rola` enum('ADMIN','SEKRETARIAT','KSIEGOWOSC') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `wlasciciele`
--

CREATE TABLE `wlasciciele` (
  `ID` int NOT NULL,
  `imie` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nazwisko` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `telefon` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `dzialki`
--
ALTER TABLE `dzialki`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `numer_seryjny_dzialki` (`numer_seryjny_dzialki`),
  ADD KEY `ID_wlasciciela` (`ID_wlasciciela`),
  ADD KEY `ID_rodzaju` (`ID_rodzaju`),
  ADD KEY `ID_przeznaczenia` (`ID_przeznaczenia`),
  ADD KEY `ID_mpzp` (`ID_mpzp`),
  ADD KEY `ID_planu_ogolnego` (`ID_planu_ogolnego`),
  ADD KEY `ID_miejscowosci` (`ID_miejscowosci`),
  ADD KEY `ID_nabycia` (`ID_nabycia`),
  ADD KEY `ID_dzierzawy` (`ID_dzierzawy`);

--
-- Indeksy dla tabeli `dzierzawcy`
--
ALTER TABLE `dzierzawcy`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `dzierzawy`
--
ALTER TABLE `dzierzawy`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_dzierzawcy` (`ID_dzierzawcy`);

--
-- Indeksy dla tabeli `klasy_gruntu`
--
ALTER TABLE `klasy_gruntu`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `lokalizacje`
--
ALTER TABLE `lokalizacje`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `miejscowosci`
--
ALTER TABLE `miejscowosci`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_lokalizacji` (`ID_lokalizacji`);

--
-- Indeksy dla tabeli `mpzp`
--
ALTER TABLE `mpzp`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `nabycia`
--
ALTER TABLE `nabycia`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `plany_ogolne`
--
ALTER TABLE `plany_ogolne`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `powierzchnie_dzialek`
--
ALTER TABLE `powierzchnie_dzialek`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_dzialki` (`ID_dzialki`),
  ADD KEY `ID_klasy` (`ID_klasy`);

--
-- Indeksy dla tabeli `przeznaczenia_dzialek`
--
ALTER TABLE `przeznaczenia_dzialek`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `rodzaje_dzialek`
--
ALTER TABLE `rodzaje_dzialek`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `uzytkownicy`
--
ALTER TABLE `uzytkownicy`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `wlasciciele`
--
ALTER TABLE `wlasciciele`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dzialki`
--
ALTER TABLE `dzialki`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dzierzawcy`
--
ALTER TABLE `dzierzawcy`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dzierzawy`
--
ALTER TABLE `dzierzawy`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `klasy_gruntu`
--
ALTER TABLE `klasy_gruntu`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lokalizacje`
--
ALTER TABLE `lokalizacje`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `miejscowosci`
--
ALTER TABLE `miejscowosci`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mpzp`
--
ALTER TABLE `mpzp`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nabycia`
--
ALTER TABLE `nabycia`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `plany_ogolne`
--
ALTER TABLE `plany_ogolne`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `powierzchnie_dzialek`
--
ALTER TABLE `powierzchnie_dzialek`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `przeznaczenia_dzialek`
--
ALTER TABLE `przeznaczenia_dzialek`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rodzaje_dzialek`
--
ALTER TABLE `rodzaje_dzialek`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `uzytkownicy`
--
ALTER TABLE `uzytkownicy`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `wlasciciele`
--
ALTER TABLE `wlasciciele`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dzialki`
--
ALTER TABLE `dzialki`
  ADD CONSTRAINT `dzialki_ibfk_1` FOREIGN KEY (`ID_wlasciciela`) REFERENCES `wlasciciele` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `dzialki_ibfk_2` FOREIGN KEY (`ID_rodzaju`) REFERENCES `rodzaje_dzialek` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `dzialki_ibfk_3` FOREIGN KEY (`ID_przeznaczenia`) REFERENCES `przeznaczenia_dzialek` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `dzialki_ibfk_4` FOREIGN KEY (`ID_mpzp`) REFERENCES `mpzp` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `dzialki_ibfk_5` FOREIGN KEY (`ID_planu_ogolnego`) REFERENCES `plany_ogolne` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `dzialki_ibfk_7` FOREIGN KEY (`ID_miejscowosci`) REFERENCES `miejscowosci` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `dzialki_ibfk_8` FOREIGN KEY (`ID_nabycia`) REFERENCES `nabycia` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `dzialki_ibfk_9` FOREIGN KEY (`ID_dzierzawy`) REFERENCES `dzierzawy` (`ID`) ON DELETE SET NULL;

--
-- Constraints for table `dzierzawy`
--
ALTER TABLE `dzierzawy`
  ADD CONSTRAINT `dzierzawy_ibfk_1` FOREIGN KEY (`ID_dzierzawcy`) REFERENCES `dzierzawcy` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `miejscowosci`
--
ALTER TABLE `miejscowosci`
  ADD CONSTRAINT `miejscowosci_ibfk_1` FOREIGN KEY (`ID_lokalizacji`) REFERENCES `lokalizacje` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `powierzchnie_dzialek`
--
ALTER TABLE `powierzchnie_dzialek`
  ADD CONSTRAINT `powierzchnie_dzialek_ibfk_1` FOREIGN KEY (`ID_dzialki`) REFERENCES `dzialki` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `powierzchnie_dzialek_ibfk_2` FOREIGN KEY (`ID_klasy`) REFERENCES `klasy_gruntu` (`ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

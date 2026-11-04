-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- VersiÃ³n del servidor:         10.4.13-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL VersiÃ³n:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Volcando estructura para tabla samplerestrho.position
CREATE TABLE IF NOT EXISTS `position` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) NOT NULL DEFAULT '',
  `INITIALS` varchar(50) DEFAULT NULL,
  `ICON` varchar(50) DEFAULT NULL,
  KEY `ID` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 CHARSET=latin1 COMMENT='List position';

-- Volcando datos para la tabla samplerestrho.position: ~22 rows (aproximadamente)
/*!40000 ALTER TABLE `position` DISABLE KEYS */;
INSERT INTO `position` (`ID`, `NAME`, `INITIALS`, `ICON`) VALUES
	(1, 'Accountant', NULL, 'fa-solid fa-receipt'),
	(2, 'Chief Executive Officer', 'CEO', 'fa-regular fa-id-card'),
	(3, 'Chief Financial Officer', 'CFO', 'fa-solid fa-person-chalkboard'),
	(4, 'Chief Marketing Officer', 'CMO', 'fa-solid fa-user-shield'),
	(5, 'Chief Operating Officer', 'COO', 'fa-solid fa-user-astronaut'),
	(6, 'Developer', NULL, 'fa-solid fa-user-gear'),
	(7, 'Development Lead', NULL, 'fa-solid fa-user-ninja'),
	(8, 'Integration Specialist', NULL, 'fa-solid fa-user-clock'),
	(9, 'Junior Technical Author', NULL, 'fa-solid fa-users-gear'),
	(10, 'Marketing Designer', NULL, 'fa-solid fa-user-tag'),
	(11, 'Office Manager', NULL, 'fa-regular fa-id-card'),
	(12, 'Personnel Lead', NULL, 'fa-solid fa-poo'),
	(13, 'Post-Sales Support', NULL, 'fa-solid fa-user-tie'),
	(14, 'Pre-Sales Support', NULL, 'fa-solid fa-person-dots-from-line'),
	(15, 'Regional Director', NULL, 'fa-solid fa-address-book'),
	(16, 'Regional Marketing', NULL, 'fa-solid fa-id-card-clip'),
	(17, 'Sales Assistant', NULL, 'fa-solid fa-person-drowning'),
	(18, 'Senior Marketing Designer', NULL, 'fa-solid fa-skull'),
	(19, 'Software Engineer', NULL, 'fa-solid fa-user'),
	(20, 'System Architect', NULL, 'fa-solid fa-person-dress-burst'),
	(21, 'Systems Administrator', NULL, 'fa-solid fa-house-chimney-user'),
	(22, 'Technical Author', NULL, 'fa-solid fa-user-pen');
/*!40000 ALTER TABLE `position` ENABLE KEYS */;


-- Volcando estructura para tabla samplerestrho.employee
CREATE TABLE IF NOT EXISTS `employee` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) NOT NULL DEFAULT '',
  `POSITION` int(11) NOT NULL DEFAULT 0,
  `OFFICE` varchar(35) NOT NULL DEFAULT '',
  `EXTENSION` int(11) DEFAULT 0,
  `STARTDATE` varchar(10) DEFAULT NULL,
  `SALARY` double DEFAULT NULL,
  KEY `ID` (`ID`) USING BTREE,
  KEY `FK_POSITION_EMPLOYEE` (`POSITION`),
  CONSTRAINT `FK_POSITION_EMPLOYEE` FOREIGN KEY (`POSITION`) REFERENCES `position` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=latin1 COMMENT='Tabla de empleados de prueba';

-- Volcando datos para la tabla samplerestrho.employee: ~36 rows (aproximadamente)
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` (`ID`, `NAME`, `POSITION`, `OFFICE`, `EXTENSION`, `STARTDATE`, `SALARY`) VALUES
	(1, 'Angelica Ramos', 2, 'London', 5797, '09/10/2009', 1200000),
	(2, 'Ashton Third Cox', 9, 'San Francisco', 1562, '12/01/2009', 86000),
	(3, 'Airi Solavoski', 1, 'Tokyo', 5407, '28/11/2008', 162700),
	(5, 'Ashton Third Cox', 9, 'San Francisco', 1562, '12/01/2009', 86000),
	(6, 'Bradley Fourth Fourth ', 19, 'London', 2558, '13/10/2012', 132000),
	(7, 'Brenden Fifth', 19, 'San Francisco', 1313, '07/06/2011', 206850),
	(8, 'Brielle Williamson', 8, 'ParÃ­s', 4804, '02/12/2012', 372000),
	(9, 'Caesar Vance', 14, 'New York Sip', 8330, '12/12/2011', 106450),
	(11, 'Charde Marshall', 15, 'San Francisco', 6741, '16/10/2008', 470600),
	(13, 'Dai Rios', 7, 'Edinburgh', 2291, '26/09/2012', 217500),
	(14, 'Doris Wilder', 17, 'Sidney', 3023, '20/09/2010', 85600),
	(15, 'Fiona Green', 5, 'San Francisco', 2947, '11/03/2010', 850000),
	(16, 'Garrett Winters', 1, 'Tokyo', 8422, '25/07/2011', 170750),
	(18, 'Gavin Joyce', 6, 'Edinburgh', 8822, '22/12/2010', 92575),
	(19, 'Gloria Little', 19, 'New York', 1721, '10/04/2009', 237500),
	(20, 'Haley Kennedy', 18, 'London', 3597, '18/12/2012', 313500),
	(22, 'Jena Gaines', 11, 'London', 3814, '19/12/2008', 90560),
	(23, 'Jenette Caldwell', 6, 'New York', 1937, '03/09/2011', 345000),
	(24, 'Jennifer Chang', 15, 'Singapore', 9239, '14/11/2010', 357650),
	(25, 'Martena Mccray', 13, 'Edinburgh', 8240, '09/03/2011', 324050),
	(26, 'Michael Silva', 10, 'London', 1581, '27/11/2012', 198500),
	(27, 'Michelle House', 8, 'Sidney', 2769, '02/06/2011', 95400),
	(28, 'Paul Byrd', 3, 'New York', 3059, '09/06/2010', 725000),
	(29, 'Prescott Bartlett', 22, 'London', 3606, '07/05/2011', 145000),
	(30, 'Quinn Flynn', 19, 'Edinburgh', 9497, '03/03/2013', 342000),
	(31, 'Rhona Davidson', 8, 'Tokyo', 6200, '14/10/2010', 327900),
	(32, 'Shou Itou', 16, 'Tokyo', 8899, '14/08/2011', 163000),
	(33, 'Sonya Frost', 19, 'Edinburgh', 1667, '13/12/2008', 103600),
	(34, 'Suki Burks', 6, 'London', 6832, '22/10/2009', 114500),
	(35, 'Tatyana Fitzpatrick', 15, 'London', 1965, '17/03/2010', 385750),
	(36, 'Tiger Nixon', 20, 'Edinburgh', 5421, '25/04/2011', 320800),
	(37, 'Unity Butler', 10, 'San Francisco', 5384, '09/12/2009', 85675),
	(38, 'Yuri Berry', 4, 'New York', 6154, '25/06/2009', 675000),
	(39, 'Eulalio Mora', 6, 'New York', 2231, '2020/12/11', 250000),
	(44, 'Aristobulo Washington', 21, 'New York', 1234, '', 80000),
	(46, 'Coyote Lentivurus', 6, 'San Francisco', 2231, '2020/12/01', 67500);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;

-- Volcando estructura para tabla samplerestrho.metric
CREATE TABLE IF NOT EXISTS `metric` (
  `ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `USER` varchar(50) NOT NULL DEFAULT '',
  `APP` varchar(50) NOT NULL,
  `APP_UUID` varchar(50) NOT NULL DEFAULT '',
  `PAGE` varchar(50) NOT NULL DEFAULT '',
  `PAGE_UUID` varchar(50) NOT NULL DEFAULT '',
  `TYPE` varchar(200) NOT NULL DEFAULT '',
  `TIMESPAN` datetime NOT NULL,
  `DESCRIPTION` varchar(2000) DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla samplerestrho.metric: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `metric` DISABLE KEYS */;
/*!40000 ALTER TABLE `metric` ENABLE KEYS */;

-- Volcando estructura para tabla samplerestrho.person
CREATE TABLE IF NOT EXISTS `person` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) DEFAULT NULL,
  `SURNAME` varchar(50) DEFAULT NULL,
  `AGE` int(11) DEFAULT NULL,
  `SEX` char(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8 COMMENT='Test REST';

-- Volcando datos para la tabla samplerestrho.person: ~11 rows (aproximadamente)
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` (`NAME`, `SURNAME`, `AGE`, `SEX`) VALUES
	('Eulalio', 'Mora', 20, 'M'),
	('AristÃ³bulo', 'Washington', 14, 'M'),
	('Kate', 'Pit', 25, 'F'),
	('Eustaquio', 'NuÃ±ez', 7, 'M'),
	('Gertrudis', 'Gutierrez', 70, 'F'),
	('Sergio', 'LÃ³pez', 75, 'M'),
	('Julieta', 'Vanegas', 45, 'F'),
	('Jhon', 'Smith', 43, 'M'),
	('Petra', 'Rasford', 53, 'F'),
	('Josefina', 'Gustamante', 91, 'F'),
	('Patricia', 'Rodriguez', 60, 'F');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;


-- Volcando estructura para tabla samplerestrho.user
CREATE TABLE IF NOT EXISTS `user` (
  `ALIAS` varchar(20) DEFAULT NULL,
  `NAME` varchar(30) DEFAULT NULL,
  `PASSWORD` varchar(20) DEFAULT NULL,
  KEY `USER_ID` (`ALIAS`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='User Rho';

-- Volcando datos para la tabla samplerestrho.user: ~5 rows (aproximadamente)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`ALIAS`, `NAME`, `PASSWORD`) VALUES
	('admin', 'Administration', 'Rho2023'),
	('sales', 'Sales', 'Rho2023'),
	('developer', 'Developer', 'Rho2023'),
	('support', 'Support', 'Rho2023'),
	('manager', 'Manager', 'Rho2023');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

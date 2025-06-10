-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 10-06-2025 a las 16:24:04
-- Versión del servidor: 8.0.39
-- Versión de PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `episodios`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `episodios`
--

CREATE TABLE `episodios` (
  `id` int UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text,
  `fecha_emision` date NOT NULL,
  `temporada` int NOT NULL,
  `numero_episodio` int NOT NULL,
  `duracion_minutos` int DEFAULT NULL,
  `id_serie` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `episodios`
--

INSERT INTO `episodios` (`id`, `titulo`, `descripcion`, `fecha_emision`, `temporada`, `numero_episodio`, `duracion_minutos`, `id_serie`) VALUES
(12, 'El Comienzo', 'El primer episodio de la serie.', '2024-01-01', 1, 1, 45, 1),
(13, 'Segunda Oportunidad', 'Los protagonistas enfrentan un nuevo reto.', '2024-01-08', 1, 2, 47, 1),
(14, 'Nuevas Alianzas', 'Aparece un nuevo personaje clave.', '2024-01-15', 1, 3, 42, 1),
(15, 'Revelaciones', 'Un secreto importante sale a la luz.', '2024-01-22', 1, 4, 44, 1),
(16, 'Final de Temporada', 'El desenlace sorprende a todos.', '2024-01-29', 1, 5, 50, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `series`
--

CREATE TABLE `series` (
  `id` int UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `genero` varchar(100) DEFAULT NULL,
  `descripcion` text,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `series`
--

INSERT INTO `series` (`id`, `nombre`, `genero`, `descripcion`, `fecha_inicio`, `fecha_fin`) VALUES
(1, 'Breaking Bad', 'Policíaca', 'Un profesor que vende droga', '2025-05-01', '2025-05-03'),
(2, 'Stranger Things', 'Ciencia ficción', 'Un grupo de niños investiga sucesos paranormales en su pueblo.', '2016-07-15', '2018-09-29'),
(4, 'Dark', 'Ciencia ficción', 'Un pueblo alemán esconde un misterio que atraviesa generaciones y viajes en el tiempo', '2017-12-01', '2020-06-27'),
(5, 'La Casa de Papel', 'Acción', 'Un grupo de criminales asalta la Fábrica Nacional de Moneda y Timbre con un plan meticuloso', '2017-05-02', '2021-12-03'),
(6, 'The Crown', 'Drama histórico', 'La historia del reinado de Isabel II desde su juventud hasta su madurez', '2016-11-04', '2023-12-14'),
(7, 'The Mandalorian', 'Ciencia ficción', 'Un cazarrecompensas recorre la galaxia en la era posterior al Imperio Galáctico', '2019-11-12', '2023-11-15'),
(8, 'Euphoria', 'Drama', 'Un grupo de adolescentes explora el amor, la identidad y las adicciones en la era moderna', '2019-06-16', '2022-02-27');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `episodios`
--
ALTER TABLE `episodios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `fk_serie` (`id_serie`);

--
-- Indices de la tabla `series`
--
ALTER TABLE `series`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `episodios`
--
ALTER TABLE `episodios`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `series`
--
ALTER TABLE `series`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `episodios`
--
ALTER TABLE `episodios`
  ADD CONSTRAINT `fk_serie` FOREIGN KEY (`id_serie`) REFERENCES `series` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

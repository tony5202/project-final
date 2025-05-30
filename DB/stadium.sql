-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 30, 2025 at 03:58 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stadium`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `st_id` int(11) NOT NULL,
  `emp_id` int(11) DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  `pre_pay` decimal(10,2) DEFAULT 0.00,
  `post_pay` decimal(10,2) DEFAULT 0.00,
  `slip_payment` varchar(255) DEFAULT NULL,
  `booking_type` enum('Football','Event') NOT NULL DEFAULT 'Football',
  `booking_date` date NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`booking_id`, `user_id`, `st_id`, `emp_id`, `start_time`, `end_time`, `price`, `status`, `pre_pay`, `post_pay`, `slip_payment`, `booking_type`, `booking_date`, `createdAt`) VALUES
(50, 2, 4, NULL, '2025-05-03 00:00:00', '2025-05-03 23:59:00', 2000000.00, 'completed', 600000.00, 0.00, '1746121091205-755309289.jpg', 'Event', '2025-05-02', '2025-05-02 00:38:11'),
(51, 2, 5, NULL, '2025-05-02 08:00:00', '2025-05-02 10:00:00', 400000.00, 'completed', 120000.00, 0.00, '1746121320445-880439541.jpg', 'Football', '2025-05-02', '2025-05-02 00:42:00'),
(52, 2, 5, NULL, '2025-05-03 00:00:00', '2025-05-03 23:59:00', 1300000.00, 'completed', 390000.00, 0.00, '1746121343785-386570127.jpg', 'Event', '2025-05-02', '2025-05-02 00:42:23'),
(53, 2, 7, NULL, '2025-05-02 08:00:00', '2025-05-02 10:00:00', 360000.00, 'completed', 108000.00, 0.00, '1746121463188-592839370.jpg', 'Football', '2025-05-02', '2025-05-02 00:44:23'),
(57, 2, 5, NULL, '2025-05-02 12:00:00', '2025-05-02 14:00:00', 400000.00, 'completed', 120000.00, 280000.00, '1746123218424-474460818.jpg', 'Football', '2025-05-02', '2025-05-02 01:13:38'),
(58, 2, 5, NULL, '2025-05-02 14:00:00', '2025-05-02 16:00:00', 400000.00, 'completed', 120000.00, 280000.00, '1746124261224-155429242.jpg', 'Football', '2025-05-02', '2025-05-02 01:31:01'),
(59, 2, 5, NULL, '2025-05-02 16:00:00', '2025-05-02 18:00:00', 400000.00, 'completed', 120000.00, 280000.00, '1746124719873-135986588.jpg', 'Football', '2025-05-02', '2025-05-02 01:38:40'),
(75, 16, 4, NULL, '2025-05-16 00:00:00', '2025-05-16 23:59:00', 2000000.00, 'cancelled', 600000.00, 0.00, '1746196882544-208620699.jpg', 'Event', '2025-03-15', '2025-05-02 21:41:23'),
(76, 16, 7, NULL, '2025-05-10 00:00:00', '2025-05-10 23:59:00', 1700000.00, 'cancelled', 510000.00, 0.00, '1746210736611-920464077.jpg', 'Event', '2025-05-09', '2025-05-03 01:32:16'),
(77, 16, 7, NULL, '2025-05-17 08:00:00', '2025-05-17 10:00:00', 360000.00, 'completed', 108000.00, 252000.00, '1746211179169-541535907.jpg', 'Football', '2025-05-03', '2025-05-03 01:39:39'),
(78, 16, 4, NULL, '2025-05-30 00:00:00', '2025-05-30 23:59:00', 2000000.00, 'confirmed', 600000.00, 0.00, '1746212946749-199529271.jpg', 'Event', '2025-05-29', '2025-05-03 02:09:06'),
(81, 16, 7, NULL, '2025-05-03 10:00:00', '2025-05-03 12:00:00', 360000.00, 'completed', 108000.00, 252000.00, '1746215135986-337750793.jpg', 'Football', '2025-05-03', '2025-05-03 02:45:36'),
(82, 16, 4, NULL, '2025-05-10 00:00:00', '2025-05-10 23:59:00', 2000000.00, 'confirmed', 600000.00, 0.00, '1746215598759-276800107.jpg', 'Event', '2025-05-03', '2025-05-03 02:53:18'),
(83, 16, 5, NULL, '2025-05-14 08:00:00', '2025-05-14 10:00:00', 400000.00, 'completed', 120000.00, 280000.00, '1746217841800-421736179.jpg', 'Football', '2025-05-03', '2025-05-03 03:30:41'),
(85, 16, 7, 6, '2025-05-03 14:00:00', '2025-05-03 16:00:00', 360000.00, 'confirmed', 108000.00, 252000.00, '1746219530220-457933108.jpg', 'Football', '2025-05-03', '2025-05-03 03:58:50'),
(87, 17, 4, NULL, '2025-05-06 18:00:00', '2025-05-06 20:00:00', 500000.00, 'completed', 150000.00, 350000.00, '1746450839842-479954067.jpg', 'Football', '2025-05-06', '2025-05-05 20:14:00'),
(88, 17, 5, NULL, '2025-05-06 18:00:00', '2025-05-06 20:00:00', 400000.00, 'completed', 120000.00, 280000.00, '1746523138516-869070129.jpg', 'Football', '2025-05-06', '2025-05-06 16:18:58'),
(89, 17, 7, NULL, '2025-05-07 00:00:00', '2025-05-07 23:59:00', 1700000.00, 'completed', 510000.00, 1190000.00, '1746523433058-360444707.jpg', 'Event', '2025-05-06', '2025-05-06 16:23:53'),
(99, 20, 4, 6, '2025-05-18 16:00:00', '2025-05-18 18:00:00', 500000.00, 'completed', 150000.00, 350000.00, '1747558469952-705842878.jpg', 'Football', '2025-05-18', '2025-05-18 15:54:30'),
(101, 21, 4, 6, '2025-05-23 18:00:00', '2025-05-23 20:00:00', 500000.00, 'completed', 150000.00, 350000.00, '1747995513556-154761572.jpg', 'Football', '2025-05-23', '2025-05-23 17:18:33'),
(102, 22, 4, 6, '2025-05-25 18:00:00', '2025-05-25 20:00:00', 500000.00, 'completed', 150000.00, 350000.00, '1747999355940-830887166.png', 'Football', '2025-05-25', '2025-05-23 18:22:36'),
(103, 2, 5, 6, '2025-05-25 00:00:00', '2025-05-25 23:59:00', 1300000.00, 'completed', 390000.00, 910000.00, '1748090948523-942254098.jpg', 'Event', '2025-05-24', '2025-05-24 19:49:08'),
(104, 2, 7, 6, '2025-05-25 00:00:00', '2025-05-25 23:59:00', 1700000.00, 'completed', 510000.00, 1190000.00, '1748091242353-928167014.jpg', 'Event', '2025-05-23', '2025-05-24 19:54:02'),
(105, 2, 7, 6, '2025-05-27 00:00:00', '2025-05-27 23:59:00', 1700000.00, 'completed', 510000.00, 1190000.00, '1748091553331-775565368.jpg', 'Event', '2025-05-25', '2025-05-24 19:59:13'),
(106, 23, 5, 6, '2025-05-26 00:00:00', '2025-05-26 23:59:00', 1300000.00, 'completed', 390000.00, 910000.00, '1748117871957-699463081.png', 'Event', '2025-05-25', '2025-05-25 03:17:52'),
(107, 23, 4, 6, '2025-05-26 14:00:00', '2025-05-26 16:00:00', 500000.00, 'cancelled', 150000.00, 0.00, '1748170405364-601154360.png', 'Football', '2025-05-26', '2025-05-25 17:53:25'),
(108, 23, 4, 6, '2025-05-26 16:00:00', '2025-05-26 18:00:00', 500000.00, 'completed', 150000.00, 350000.00, '1748170459129-977119202.png', 'Football', '2025-05-26', '2025-05-25 17:54:19'),
(109, 23, 7, NULL, '2025-05-26 00:00:00', '2025-05-26 23:59:00', 1700000.00, 'pending', 510000.00, 0.00, '1748177416376-705197671.png', 'Event', '2025-05-25', '2025-05-25 19:50:18'),
(110, 23, 7, 6, '2025-05-26 00:00:00', '2025-05-26 23:59:00', 1700000.00, 'completed', 510000.00, 1190000.00, '1748180776159-860253392.png', 'Event', '2025-05-25', '2025-05-25 20:46:16'),
(111, 2, 7, 6, '2025-05-28 12:00:00', '2025-05-28 14:00:00', 360000.00, 'confirmed', 108000.00, 0.00, '1748232402598-762571493.png', 'Football', '2025-05-28', '2025-05-26 11:06:42'),
(112, 2, 4, 6, '2025-05-26 12:00:00', '2025-05-26 14:00:00', 500000.00, 'completed', 150000.00, 350000.00, '1748232434484-175908139.png', 'Football', '2025-05-26', '2025-05-26 11:07:14'),
(113, 24, 5, 6, '2025-05-27 00:00:00', '2025-05-27 23:59:00', 1300000.00, 'confirmed', 390000.00, 0.00, '1748248675302-808281388.png', 'Event', '2025-05-26', '2025-05-26 15:37:55'),
(114, 24, 4, 6, '2025-05-27 00:00:00', '2025-05-27 23:59:00', 2000000.00, 'confirmed', 600000.00, 0.00, '1748248706771-232814602.png', 'Event', '2025-05-26', '2025-05-26 15:38:26'),
(115, 23, 5, 6, '2025-05-30 00:00:00', '2025-05-30 23:59:00', 1300000.00, 'confirmed', 390000.00, 0.00, '1748263075017-539032199.png', 'Event', '2025-05-29', '2025-05-26 19:37:55'),
(116, 23, 7, 6, '2025-05-30 08:00:00', '2025-05-30 10:00:00', 360000.00, 'confirmed', 108000.00, 0.00, '1748263116172-398383457.png', 'Football', '2025-05-30', '2025-05-26 19:38:36'),
(117, 23, 7, 6, '2025-05-29 08:00:00', '2025-05-29 10:00:00', 360000.00, 'confirmed', 108000.00, 0.00, '1748265451693-618958288.png', 'Football', '2025-05-29', '2025-05-26 20:17:31'),
(118, 24, 8, 6, '2025-05-27 16:00:00', '2025-05-27 18:00:00', 500000.00, 'completed', 150000.00, 350000.00, '1748335195900-721833783.jpg', 'Football', '2025-05-27', '2025-05-27 15:39:55'),
(119, 23, 8, 6, '2025-05-28 00:00:00', '2025-05-28 23:59:00', 1400000.00, 'completed', 420000.00, 980000.00, '1748336056848-48322608.jpg', 'Event', '2025-05-27', '2025-05-27 15:54:16');

-- --------------------------------------------------------

--
-- Table structure for table `checkin`
--

CREATE TABLE `checkin` (
  `id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `st_id` int(11) NOT NULL,
  `checkin_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `checkin`
--

INSERT INTO `checkin` (`id`, `book_id`, `st_id`, `checkin_date`) VALUES
(4, 53, 7, '2025-05-02 00:47:26'),
(5, 52, 5, '2025-05-02 00:47:58'),
(6, 50, 4, '2025-05-02 00:58:47'),
(7, 57, 5, '2025-05-02 01:15:00'),
(8, 58, 5, '2025-05-02 01:31:25'),
(9, 59, 5, '2025-05-02 01:39:22'),
(10, 77, 7, '2025-05-03 02:36:37'),
(11, 81, 7, '2025-05-03 02:46:03'),
(14, 83, 5, '2025-05-03 04:06:42'),
(15, 85, 7, '2025-05-03 04:08:04'),
(16, 87, 4, '2025-05-06 16:05:20'),
(17, 88, 5, '2025-05-06 16:19:33'),
(18, 89, 7, '2025-05-06 18:06:35'),
(19, 99, 4, '2025-05-18 15:54:55'),
(20, 101, 4, '2025-05-23 17:21:00'),
(21, 103, 5, '2025-05-24 19:50:28'),
(22, 104, 7, '2025-05-24 19:55:30'),
(23, 102, 4, '2025-05-25 17:06:58'),
(24, 106, 5, '2025-05-25 18:01:55'),
(25, 105, 7, '2025-05-25 20:28:32'),
(26, 110, 7, '2025-05-25 20:49:59'),
(27, 108, 4, '2025-05-26 10:26:30'),
(28, 112, 4, '2025-05-26 11:08:33'),
(29, 118, 8, '2025-05-27 15:50:19'),
(30, 119, 8, '2025-05-28 18:45:20');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `emp_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `bd` date DEFAULT NULL,
  `role` enum('admin','manager') DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`emp_id`, `name`, `phone`, `address`, `username`, `password`, `bd`, `role`) VALUES
(5, 'ທະນາໄຊ ລາດຂະວົງ', '22012018', 'ບ້ານ ໜອງພະຍາ,ເມືອງ ໄຊທານີ,ແຂວງ ນະຄອນຫຼວງວຽງຈັນ', 'tony', 'ๅ/-ภถ', '2003-07-23', 'admin'),
(6, 'ພຸດທະເສນ', '52000314', 'ບ້ານ ສາຍນ້ຳເງິນ,ເມືອງ ໄຊທານີ,ແຂວງ ນະຄອນຫຼວງວຽງຈັນ', 'send', '12345', '2025-04-01', 'manager');

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

CREATE TABLE `expense` (
  `id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `detail` text DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `date` date NOT NULL,
  `id_pro` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expense`
--

INSERT INTO `expense` (`id`, `amount`, `detail`, `total`, `date`, `id_pro`, `quantity`) VALUES
(2, 150000.00, 'ຊື້ເຄື່ອງດື່ມ', 1500000.00, '2025-05-03', 30, 10),
(3, 500000.00, 'ນຳເຂົ້າ', 25000000.00, '2025-05-03', 20, 50),
(4, 200000.00, 'ໝາກບານແຕກ', 200000.00, '2025-05-03', NULL, NULL),
(5, 300000.00, 'ນຳເຂົ້າ', 7200000.00, '2025-05-03', 22, 24),
(6, 100000.00, 'ຕະໜາງຂາດ', 100000.00, '2025-05-03', NULL, NULL),
(7, 50000.00, 'ຊື້ເຄື່ອງດື່ມ', 1000000.00, '2025-05-04', 37, 20),
(9, 100000.00, 'ຊື້ເຄື່ອງດື່ມ', 800000.00, '2025-05-03', 36, 8),
(10, 15000.00, 'ຊື້ເຄື່ອງ', 360000.00, '2025-05-05', 35, 24),
(11, 11000.00, 'ຊື້ເຄື່ອງ', 209000.00, '2025-05-06', 29, 19),
(12, 15000.00, 'ຊື້ເຄື່ອງ ເບຍ', 360000.00, '2025-05-06', 22, 24),
(13, 7000.00, 'ຊື້ເຄື່ອງ', 84000.00, '2025-05-12', 38, 12),
(14, 3000.00, 'ຊື້ເຄື່ອງດື່ມ', 45000.00, '2025-05-12', 36, 15),
(15, 12000.00, 'ຊື້ເຂົ້ານົມ', 288000.00, '2025-05-26', 26, 24),
(16, 100000.00, 'ດອກໄຟເດີ່ນ 1 ເພ 2 ໜ່ວຍ', 100000.00, '2025-05-26', NULL, NULL),
(17, 12000.00, 'ຊື້ເຂົ້ານົມ', 144000.00, '2025-05-26', 26, 12),
(18, 200000.00, 'ຫຍ້າທຽມຂາດ 9x5', 200000.00, '2025-05-27', NULL, NULL),
(19, 400000.00, 'ຊື້ເຊືອກມາເຮັດຄອກລົດ', 400000.00, '2025-05-28', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `price`, `category`, `quantity`, `image`) VALUES
(20, 'ເບຍລາວແກ້ວໃຫຍ່ 600ML', 22000.00, 'ເຄື່ອງດື່ມແອວກໍຮໍ', 40, '1745672103741-258155065.png'),
(22, 'ເບຍເຫຍນິເກັ້ນ', 25000.00, 'ເຄື່ອງດື່ມແອວກໍຮໍ', 44, '1746273934216-922975157.png'),
(23, 'ນ້ຳອັດລົມຕຸກກາງ', 22000.00, 'ນ້ຳອັດລົມ', 0, '1746274227598-672847417.png'),
(24, 'ນ້ຳອັດລົມຕຸກນ້ອຍ', 12000.00, 'ນ້ຳອັດລົມ', 0, '1746274347508-834774206.png'),
(25, 'ນ້ຳອັດລົມຕຸກກະປອງ', 10000.00, 'ນ້ຳອັດລົມ', 0, '1746274417525-671601393.png'),
(26, 'ເຂົ້າໜົມເລ', 16000.00, 'ອາຫານຫວ່າງ', 36, '1746274763425-637048348.png'),
(27, 'ເບນໂຕະ ນ້ອຍ', 7000.00, 'ອາຫານຫວ່າງ', 0, '1746275074413-762490129.png'),
(28, 'ເບນໂຕະ ໃຫຍ່', 16000.00, 'ອາຫານຫວ່າງ', 0, '1746275151001-513481365.png'),
(29, 'ສະຕິງ', 12000.00, 'ເຄື່ອງດື່ມຊູກຳລັງ', 8, '1746275323203-439871572.jpg'),
(30, 'ມອນເຕີ້', 16000.00, 'ເຄື່ອງດື່ມຊູກຳລັງ', 26, '1746275441086-1305455.png'),
(31, 'red bull', 15000.00, 'ເຄື່ອງດື່ມຊູກຳລັງ', 0, '1746275493501-644070247.png'),
(32, 'M150', 10000.00, 'ເຄື່ອງດື່ມຊູກຳລັງ', 0, '1746275706981-320872064.png'),
(33, 'ສະປອນເຊີ້', 11000.00, 'ເຄື່ອງດື່ມແຮ່ທາດ', 0, '1746275853667-447645964.png'),
(34, 'Magnum ແບບແທ່ງ', 40000.00, 'ຂອງຫວານ', 0, '1746276032511-703993509.png'),
(35, 'Magnum ແບບກ່ອງ', 35000.00, 'ຂອງຫວານ', 6, '1746276063034-567762773.png'),
(36, 'ນຳ້ຫົວເສືອ ກາງ', 7000.00, 'ນ້ຳດື່ມ', 3, '1746276479723-672954146.jpg'),
(37, 'ນຳ້ຫົວເສືອ ນ້ອຍ', 5000.00, 'ນ້ຳດື່ມ', 3, '1746276560042-908583979.jpg'),
(38, 'ນຳ້ຫົວເສືອ ໃຫຍ່', 10000.00, 'ນ້ຳດື່ມ', 4, '1746276668562-731896996.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `star` int(11) NOT NULL CHECK (`star` between 1 and 5),
  `review` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`id`, `user_id`, `star`, `review`, `created_at`) VALUES
(6, 2, 4, 'sslfkwrfk', '2025-04-30 16:30:00'),
(7, 2, 5, 'goood', '2025-04-30 16:30:59'),
(8, 2, 5, 'Good', '2025-04-30 16:37:16'),
(9, 2, 3, 'stadium 2 No goood', '2025-04-30 16:37:40'),
(10, 2, 3, 'No Good st3', '2025-04-30 16:42:09'),
(11, 2, 1, 'lkreglerk', '2025-04-30 16:45:48'),
(12, 2, 5, 'st 1 Good', '2025-04-30 16:50:41'),
(13, 2, 3, 'No', '2025-04-30 16:51:48'),
(14, 2, 5, 'gooo', '2025-04-30 16:59:22'),
(16, 2, 5, 'di khui', '2025-04-30 17:09:35'),
(17, 2, 4, 'gg', '2025-04-30 17:09:55'),
(18, 2, 5, 'googg bro', '2025-04-30 17:20:33'),
(19, 2, 5, '1224', '2025-04-30 17:30:13'),
(20, 2, 2, '12345', '2025-04-30 17:30:51'),
(21, 2, 5, '555', '2025-04-30 17:37:53'),
(22, 2, 5, '6666', '2025-04-30 17:42:40'),
(23, 2, 5, '7711', '2025-04-30 17:49:09'),
(24, 14, 5, 'app Goood', '2025-04-30 18:56:50'),
(25, 2, 5, 'ແອັບນີ້ໂຄດດີ', '2025-05-02 02:28:44'),
(26, 17, 5, 'ລະບົບຈອງຄືດີແຮງ', '2025-05-05 20:17:38'),
(27, 18, 5, 'ລະບົບຈັດການລະບົບນີ້ໂຄດດີ', '2025-05-07 15:51:53'),
(28, 19, 5, 'ເດີນນີ້ດີມີເຫ້ຍໃຫ້ເບິ່ງນຳ', '2025-05-08 01:05:56'),
(29, 20, 3, 'ໄຟເດີ່ນ3ບໍ່ແຈ້ງປານໃດເດີ້', '2025-05-18 16:00:51'),
(30, 21, 5, 'vary GOOOD stadium 2', '2025-05-23 17:23:45'),
(31, 22, 5, 'ເດີ່ນບານເເຈ້ງດີແລະເຕາະມ່ວນຫຍ້າທຽມນຸ້ມດີບໍ່ເຈັບ', '2025-05-23 18:19:37'),
(32, 22, 5, 'ດີຫລາຍ', '2025-05-23 18:19:44'),
(33, 24, 5, 'ລະບົບໂຄດດີເລີຍເອົາໄປ5ດາວ', '2025-05-26 16:15:41');

-- --------------------------------------------------------

--
-- Table structure for table `sale`
--

CREATE TABLE `sale` (
  `id` int(11) NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `receivedmoney` decimal(10,2) NOT NULL,
  `date_time` datetime NOT NULL DEFAULT current_timestamp(),
  `emp_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale`
--

INSERT INTO `sale` (`id`, `totalAmount`, `receivedmoney`, `date_time`, `emp_id`) VALUES
(9, 228000.00, 300000.00, '2025-05-11 20:55:52', 6),
(10, 35000.00, 40000.00, '2025-05-11 21:47:29', 6),
(11, 7000.00, 10000.00, '2025-05-11 21:51:14', 6),
(12, 5000.00, 10000.00, '2025-05-12 15:30:25', 6),
(13, 7000.00, 10000.00, '2025-05-12 15:31:20', 6),
(14, 35000.00, 40000.00, '2025-05-12 15:36:21', 6),
(15, 7000.00, 10000.00, '2025-05-12 16:22:33', 6),
(16, 35000.00, 40000.00, '2025-05-12 16:39:14', 6),
(17, 5000.00, 6000.00, '2025-05-12 16:40:25', 6),
(18, 5000.00, 6000.00, '2025-05-12 16:47:04', 6),
(19, 35000.00, 40000.00, '2025-05-12 16:51:15', 6),
(20, 35000.00, 40000.00, '2025-05-12 16:56:31', 6),
(21, 35000.00, 40000.00, '2025-05-12 17:01:51', 6),
(22, 7000.00, 8000.00, '2025-05-12 17:30:04', 6),
(23, 10000.00, 12000.00, '2025-05-12 17:30:52', 6),
(24, 35000.00, 400000.00, '2025-05-12 17:31:38', 6),
(25, 127000.00, 200000.00, '2025-05-12 21:25:53', 6),
(26, 48000.00, 50000.00, '2025-05-16 19:03:18', 6),
(27, 22000.00, 30000.00, '2025-05-16 19:04:43', 6),
(28, 10000.00, 11000.00, '2025-05-16 19:10:18', 6),
(29, 32000.00, 50000.00, '2025-05-16 19:10:32', 6),
(30, 140000.00, 200000.00, '2025-05-16 19:28:05', 6),
(31, 258000.00, 300000.00, '2025-05-16 19:29:48', 6),
(32, 70000.00, 9999999.00, '2025-05-24 19:33:11', 6),
(33, 57000.00, 600000.00, '2025-05-24 19:33:54', 6),
(34, 38000.00, 700000.00, '2025-05-25 16:57:40', 6),
(35, 15000.00, 99999999.99, '2025-05-25 18:03:37', 6),
(36, 35000.00, 4000000.00, '2025-05-25 18:03:59', 6),
(37, 14000.00, 1500000.00, '2025-05-26 10:58:30', 6);

-- --------------------------------------------------------

--
-- Table structure for table `sale_detail`
--

CREATE TABLE `sale_detail` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale_detail`
--

INSERT INTO `sale_detail` (`id`, `sale_id`, `quantity`, `price`, `product_id`) VALUES
(6, 9, 1, 35000.00, 35),
(7, 9, 1, 16000.00, 30),
(8, 9, 2, 25000.00, 22),
(9, 10, 1, 35000.00, 35),
(10, 11, 1, 7000.00, 36),
(11, 12, 1, 5000.00, 37),
(12, 13, 1, 7000.00, 36),
(13, 14, 5, 7000.00, 36),
(14, 15, 1, 7000.00, 36),
(15, 16, 1, 35000.00, 35),
(16, 17, 1, 5000.00, 37),
(17, 18, 1, 5000.00, 37),
(18, 19, 1, 35000.00, 35),
(19, 20, 1, 35000.00, 35),
(20, 21, 1, 35000.00, 35),
(21, 22, 1, 7000.00, 36),
(22, 23, 1, 10000.00, 38),
(23, 24, 1, 35000.00, 35),
(24, 25, 6, 5000.00, 37),
(25, 25, 2, 10000.00, 38),
(26, 25, 1, 7000.00, 36),
(27, 25, 2, 35000.00, 35),
(28, 26, 4, 12000.00, 29),
(29, 27, 1, 22000.00, 20),
(30, 28, 1, 10000.00, 38),
(31, 29, 2, 16000.00, 30),
(32, 30, 2, 10000.00, 38),
(33, 30, 1, 5000.00, 37),
(34, 30, 3, 7000.00, 36),
(35, 30, 2, 35000.00, 35),
(36, 30, 2, 12000.00, 29),
(37, 31, 2, 35000.00, 35),
(38, 31, 2, 25000.00, 22),
(39, 31, 4, 22000.00, 20),
(40, 31, 1, 16000.00, 30),
(41, 31, 1, 10000.00, 38),
(42, 31, 1, 5000.00, 37),
(43, 31, 1, 7000.00, 36),
(44, 31, 1, 12000.00, 29),
(45, 32, 2, 35000.00, 35),
(46, 33, 1, 7000.00, 36),
(47, 33, 1, 35000.00, 35),
(48, 33, 1, 5000.00, 37),
(49, 33, 1, 10000.00, 38),
(50, 34, 2, 7000.00, 36),
(51, 34, 2, 12000.00, 29),
(52, 35, 3, 5000.00, 37),
(53, 36, 1, 35000.00, 35),
(54, 37, 2, 7000.00, 36);

-- --------------------------------------------------------

--
-- Table structure for table `stadium`
--

CREATE TABLE `stadium` (
  `st_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `price2` decimal(10,2) DEFAULT NULL,
  `dtail` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stadium`
--

INSERT INTO `stadium` (`st_id`, `price`, `price2`, `dtail`, `image`, `status`) VALUES
(4, 500000.00, 2000000.00, 'ເດີ່ນ1', '1745669147809-133652120.png', 'active'),
(5, 400000.00, 1300000.00, 'ເດິ່ນ2', '1745669231188-331641214.jpg', 'active'),
(7, 360000.00, 1700000.00, 'ເດິ່ນ3', '1745671665496-580642188.jpg', 'active'),
(8, 500000.00, 1400000.00, 'ເດີ່ນ4', '1748335116847-864359904.png', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `name`, `email`, `phone`) VALUES
(2, 'tony', '123456', 'yo', 'tongdggdy09@gmail.com', '52000314'),
(3, 'yo', '1234567', 'ໂທນີ້', 'Thony@gmail.com ', '52000314'),
(4, 'tt', '526262626', 'hdhd', 'tony@outlook.com ', '22072633'),
(5, 'ttt', '6262626262', 'yeuuw', 'twtw@', '22072633'),
(6, 'yoy', '123456', 'yt', 'geegg@', '22072633'),
(7, 'ueheh', '999999', 'tyg', 'uwsh@', '22072633'),
(8, 'send', '098765', 'ພຸດທະເສນ', 'abc@gmail.com', '02093045'),
(9, 'nin', '123456', 'panin', 'nin@', '22072633'),
(10, 'noy', '123456', 'noy na ja', 'noy@', '52000324'),
(11, 'op', '123456', 'opop', 'opopop@', '22072633'),
(12, 'ninnoy', '123456', 'pa', 'panon09@gmail.com', '52000314'),
(13, 'yin', '111111', 'y', 'tiyiy09@gmail.com', '22072633'),
(14, 'huk', '111111', 'hk', 'hok00@gmail.com', '22012018'),
(15, 'ker', 'Juso54612629', 'ທັກນະວັດ', 'psksi8759@gmail.com', '02056473'),
(16, 'noyna', '123456', 'ນ້ອຍ', 'niy90@gmail.com', '22012018'),
(17, 'teng', '123456', 'ເຕັ່ງ', 'teng09@gmail.com', '52301789'),
(18, 'nut', '123456', 'ນັດ', 'nut098@gmail.com', '22012017'),
(19, 'non', 'Non12345', 'Non', 'buknoner545@gmail.com', '02099114627'),
(20, 'jonh', '123456', 'ຈອນນີ້', 'jobg727@gmail.com', '52009314'),
(21, 'nu', '123456', 'nuny', 'nonu09@gmail.com', '52999314'),
(22, 'nic', 'nic/-8988', 'nic', 'nicolas@6252.com', '02093418988'),
(23, 'namfon', '123456', 'ນ້ຳຝົນ', 'namfon@gmail.com', '22042014'),
(24, 'kham', '123456', 'ຄຳປານ', 'khamparn32@gmail.com', '52000314');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `st_id` (`st_id`),
  ADD KEY `emp_id` (`emp_id`);

--
-- Indexes for table `checkin`
--
ALTER TABLE `checkin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `st_id` (`st_id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`emp_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pro` (`id_pro`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sale`
--
ALTER TABLE `sale`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sale_employee` (`emp_id`);

--
-- Indexes for table `sale_detail`
--
ALTER TABLE `sale_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `stadium`
--
ALTER TABLE `stadium`
  ADD PRIMARY KEY (`st_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT for table `checkin`
--
ALTER TABLE `checkin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `emp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `sale`
--
ALTER TABLE `sale`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `sale_detail`
--
ALTER TABLE `sale_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `stadium`
--
ALTER TABLE `stadium`
  MODIFY `st_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`st_id`) REFERENCES `stadium` (`st_id`),
  ADD CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`emp_id`) REFERENCES `employee` (`emp_id`);

--
-- Constraints for table `checkin`
--
ALTER TABLE `checkin`
  ADD CONSTRAINT `checkin_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `booking` (`booking_id`),
  ADD CONSTRAINT `checkin_ibfk_2` FOREIGN KEY (`st_id`) REFERENCES `stadium` (`st_id`);

--
-- Constraints for table `expense`
--
ALTER TABLE `expense`
  ADD CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`id_pro`) REFERENCES `product` (`id`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `sale`
--
ALTER TABLE `sale`
  ADD CONSTRAINT `fk_sale_employee` FOREIGN KEY (`emp_id`) REFERENCES `employee` (`emp_id`);

--
-- Constraints for table `sale_detail`
--
ALTER TABLE `sale_detail`
  ADD CONSTRAINT `sale_detail_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sale` (`id`),
  ADD CONSTRAINT `sale_detail_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

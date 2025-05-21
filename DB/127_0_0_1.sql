-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2025 at 02:45 PM
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
-- Database: `ball`
--
CREATE DATABASE IF NOT EXISTS `ball` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `ball`;

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `emp_id` int(11) DEFAULT NULL,
  `st_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `slip_payment` varchar(255) DEFAULT NULL,
  `pre_pay` decimal(10,2) DEFAULT NULL,
  `post_pay` decimal(10,2) DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `checkin`
--

CREATE TABLE `checkin` (
  `id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `st_id` int(11) NOT NULL,
  `checkin_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `emp_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `bd` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

CREATE TABLE `expense` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `detail` text DEFAULT NULL,
  `date` date NOT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `cat_id` int(11) NOT NULL,
  `stock_id` int(11) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `star` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sale`
--

CREATE TABLE `sale` (
  `id` int(11) NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `receivedmoney` decimal(10,2) NOT NULL,
  `date_time` datetime NOT NULL,
  `user_id` int(11) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `sale_detail`
--

CREATE TABLE `sale_detail` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `pro_name` varchar(100) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `stadium`
--

CREATE TABLE `stadium` (
  `st_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `detail` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `proname` varchar(100) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `role` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `emp_id` (`emp_id`),
  ADD KEY `st_id` (`st_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

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
  ADD PRIMARY KEY (`emp_id`);

--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cat_id` (`cat_id`),
  ADD KEY `stock_id` (`stock_id`);

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
  ADD KEY `user_id` (`user_id`);

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
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
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
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `checkin`
--
ALTER TABLE `checkin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `emp_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sale`
--
ALTER TABLE `sale`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sale_detail`
--
ALTER TABLE `sale_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stadium`
--
ALTER TABLE `stadium`
  MODIFY `st_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stock`
--
ALTER TABLE `stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`emp_id`) REFERENCES `employee` (`emp_id`),
  ADD CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`st_id`) REFERENCES `stadium` (`st_id`);

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
  ADD CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`cat_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`id`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `sale`
--
ALTER TABLE `sale`
  ADD CONSTRAINT `sale_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `sale_detail`
--
ALTER TABLE `sale_detail`
  ADD CONSTRAINT `sale_detail_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sale` (`id`),
  ADD CONSTRAINT `sale_detail_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);
--
-- Database: `ball_1`
--
CREATE DATABASE IF NOT EXISTS `ball_1` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `ball_1`;

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `bookingId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `empId` int(11) DEFAULT NULL,
  `stadiumId` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `slip_payment` varchar(255) DEFAULT NULL,
  `pre_pay` decimal(10,2) DEFAULT NULL,
  `post_pay` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `checkin`
--

CREATE TABLE `checkin` (
  `checkinId` int(11) NOT NULL,
  `bookingId` int(11) NOT NULL,
  `check_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `empId` int(11) NOT NULL,
  `bd` date DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

CREATE TABLE `expense` (
  `id` int(11) NOT NULL,
  `productId` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `detail` text DEFAULT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `catId` int(11) NOT NULL,
  `stockId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `star` int(11) NOT NULL CHECK (`star` >= 1 and `star` <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sale`
--

CREATE TABLE `sale` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `receivedmoney` decimal(10,2) NOT NULL,
  `date_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `saledetail`
--

CREATE TABLE `saledetail` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `bookingId` int(11) DEFAULT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stadium`
--

CREATE TABLE `stadium` (
  `stadiumId` int(11) NOT NULL,
  `detail` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('admin','user','employee') NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`bookingId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `empId` (`empId`),
  ADD KEY `stadiumId` (`stadiumId`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `checkin`
--
ALTER TABLE `checkin`
  ADD PRIMARY KEY (`checkinId`),
  ADD KEY `bookingId` (`bookingId`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`empId`);

--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `catId` (`catId`),
  ADD KEY `stockId` (`stockId`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `sale`
--
ALTER TABLE `sale`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `saledetail`
--
ALTER TABLE `saledetail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `bookingId` (`bookingId`),
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `stadium`
--
ALTER TABLE `stadium`
  ADD PRIMARY KEY (`stadiumId`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `bookingId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `checkin`
--
ALTER TABLE `checkin`
  MODIFY `checkinId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `empId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sale`
--
ALTER TABLE `sale`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `saledetail`
--
ALTER TABLE `saledetail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stadium`
--
ALTER TABLE `stadium`
  MODIFY `stadiumId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stock`
--
ALTER TABLE `stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`empId`) REFERENCES `employee` (`empId`) ON DELETE SET NULL,
  ADD CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`stadiumId`) REFERENCES `stadium` (`stadiumId`) ON DELETE CASCADE;

--
-- Constraints for table `checkin`
--
ALTER TABLE `checkin`
  ADD CONSTRAINT `checkin_ibfk_1` FOREIGN KEY (`bookingId`) REFERENCES `booking` (`bookingId`) ON DELETE CASCADE;

--
-- Constraints for table `expense`
--
ALTER TABLE `expense`
  ADD CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`catId`) REFERENCES `category` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`stockId`) REFERENCES `stock` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sale`
--
ALTER TABLE `sale`
  ADD CONSTRAINT `sale_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `saledetail`
--
ALTER TABLE `saledetail`
  ADD CONSTRAINT `saledetail_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sale` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `saledetail_ibfk_2` FOREIGN KEY (`bookingId`) REFERENCES `booking` (`bookingId`) ON DELETE SET NULL,
  ADD CONSTRAINT `saledetail_ibfk_3` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE;
--
-- Database: `ball_2`
--
CREATE DATABASE IF NOT EXISTS `ball_2` DEFAULT CHARACTER SET utf32 COLLATE utf32_general_ci;
USE `ball_2`;

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `emp_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `slip_payment` varchar(255) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `checkins`
--

CREATE TABLE `checkins` (
  `checkin_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `checkin_time` datetime DEFAULT NULL,
  `checkout_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `emp_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exposes`
--

CREATE TABLE `exposes` (
  `expose_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `expose_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `stock_up` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sites`
--

CREATE TABLE `sites` (
  `site_id` int(11) NOT NULL,
  `site_name` varchar(100) NOT NULL,
  `site_type` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `fk_booking_user` (`user_id`),
  ADD KEY `fk_booking_site` (`site_id`),
  ADD KEY `fk_booking_emp` (`emp_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `checkins`
--
ALTER TABLE `checkins`
  ADD PRIMARY KEY (`checkin_id`),
  ADD KEY `fk_checkin_booking` (`booking_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`emp_id`);

--
-- Indexes for table `exposes`
--
ALTER TABLE `exposes`
  ADD PRIMARY KEY (`expose_id`),
  ADD KEY `fk_expose_product` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `fk_product_category` (`category_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `fk_review_user` (`user_id`),
  ADD KEY `fk_review_booking` (`booking_id`);

--
-- Indexes for table `sites`
--
ALTER TABLE `sites`
  ADD PRIMARY KEY (`site_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `checkins`
--
ALTER TABLE `checkins`
  MODIFY `checkin_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `emp_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exposes`
--
ALTER TABLE `exposes`
  MODIFY `expose_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sites`
--
ALTER TABLE `sites`
  MODIFY `site_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `fk_booking_emp` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`emp_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_booking_site` FOREIGN KEY (`site_id`) REFERENCES `sites` (`site_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_booking_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `checkins`
--
ALTER TABLE `checkins`
  ADD CONSTRAINT `fk_checkin_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `exposes`
--
ALTER TABLE `exposes`
  ADD CONSTRAINT `fk_expose_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_review_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Database: `ecom`
--
CREATE DATABASE IF NOT EXISTS `ecom` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ecom`;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `cartTotal` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `orderedById` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(18, 'water', '2025-03-16 11:27:45.000', '2025-03-16 11:27:45.000'),
(19, 'phone', '2025-03-16 11:28:01.545', '2025-03-16 11:28:01.545'),
(20, 'lnefl', '2025-03-16 12:13:30.397', '2025-03-16 12:13:30.397'),
(24, 'dnwei', '2025-03-16 12:18:59.618', '2025-03-16 12:18:59.618'),
(25, 'ສະ', '2025-03-16 12:20:12.012', '2025-03-16 12:20:12.012');

-- --------------------------------------------------------

--
-- Table structure for table `image`
--

CREATE TABLE `image` (
  `id` int(11) NOT NULL,
  `asset_id` varchar(191) NOT NULL,
  `public_id` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `productId` int(11) NOT NULL,
  `secure_url` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `cartTotal` double NOT NULL,
  `orderStatus` varchar(191) NOT NULL DEFAULT 'Not process',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `orderedById` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `cartTotal`, `orderStatus`, `createdAt`, `updatedAt`, `orderedById`) VALUES
(1, 850, 'com', '2025-03-14 14:41:51.273', '2025-03-14 15:08:57.460', 3),
(2, 850, 'Not process', '2025-03-14 14:51:40.131', '2025-03-14 14:51:40.131', 3);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `price` double NOT NULL,
  `sold` int(11) NOT NULL DEFAULT 0,
  `quantity` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `categoryId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `title`, `description`, `price`, `sold`, `quantity`, `createdAt`, `updatedAt`, `categoryId`) VALUES
(6, 'coe i 9', 'com', 1, 0, 1, '2025-03-16 12:49:39.213', '2025-03-16 12:49:39.213', 20),
(7, 'coe i 9', 'com', 1, 0, 1, '2025-03-16 12:49:41.029', '2025-03-16 12:49:41.029', 20),
(8, 'coe i 349i53-45i34-', 'com', 1, 0, 1, '2025-03-16 12:50:28.413', '2025-03-17 12:18:43.920', 20),
(9, 'wate', 'com', 12932, 0, 10, '2025-03-16 12:53:43.690', '2025-03-16 12:53:43.690', 24),
(10, 'ຄອມ', 'ດີ', 13333, 0, 12, '2025-03-16 12:59:03.491', '2025-03-16 12:59:03.491', 20),
(13, 'coe i 9', 'com', 1, 0, 1, '2025-03-16 12:59:49.442', '2025-03-16 12:59:49.442', 25),
(16, 'coe i 9', 'com', 1, 0, 1, '2025-03-16 13:04:27.094', '2025-03-16 13:04:27.094', 20),
(17, 'coe i 999', 'com', 1, 0, 1, '2025-03-16 13:04:54.314', '2025-03-17 12:21:11.138', 20),
(18, 'coe i 9', 'com', 1, 0, 1, '2025-03-16 13:09:18.487', '2025-03-16 13:09:18.487', 20),
(19, 'coe i 9', 'com', 1, 0, 1, '2025-03-16 13:09:31.214', '2025-03-16 13:09:31.214', 20),
(20, 'coe i 8', 'com', 1, 0, 11, '2025-03-16 13:16:36.517', '2025-03-16 13:16:36.517', 24),
(21, 'pone 18', 'ddd', 900000, 0, 5, '2025-03-16 13:31:50.922', '2025-03-16 13:31:50.922', 19),
(22, 'pone 18', 'ddd', 900000, 0, 5, '2025-03-16 13:31:54.684', '2025-03-16 13:31:54.684', 19),
(23, 'pone 18', 'ddd', 900000, 0, 5, '2025-03-16 13:32:01.869', '2025-03-16 13:32:01.869', 19),
(24, 'pone 18', 'ddd', 900000, 0, 5, '2025-03-16 13:32:12.091', '2025-03-16 13:32:12.091', 19),
(25, 'pone 18', 'ddd', 900000, 0, 5, '2025-03-16 13:32:14.963', '2025-03-16 13:32:14.963', 19),
(26, 'pone 18', 'ddd', 900000, 0, 5, '2025-03-16 13:34:49.118', '2025-03-16 13:34:49.118', 19);

-- --------------------------------------------------------

--
-- Table structure for table `productoncart`
--

CREATE TABLE `productoncart` (
  `id` int(11) NOT NULL,
  `cartid` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productonorder`
--

CREATE TABLE `productonorder` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) DEFAULT NULL,
  `name` varchar(191) DEFAULT NULL,
  `picture` varchar(191) DEFAULT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'user',
  `enabled` tinyint(1) NOT NULL DEFAULT 1,
  `address` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `name`, `picture`, `role`, `enabled`, `address`, `createdAt`, `updatedAt`) VALUES
(1, 'tony', '$2b$10$rVTV3hoMMgO84iQfb6SSCOja0n3JF6Akzb/JugLtEsT216Yj74Awa', NULL, NULL, 'user', 1, NULL, '2025-03-12 19:44:52.458', '2025-03-12 19:44:52.458'),
(2, 'ny', '$2b$10$Di7BxjUJIcW.KeGfPQKCyu/yKMeIl14HXMly7chUI9snQk2gflZFG', NULL, NULL, 'admin', 0, NULL, '2025-03-12 19:45:19.904', '2025-03-14 12:35:45.368'),
(3, 'yoy', '$2b$10$PqsdzmKhBEvlAEKV5.gZdue5yMlddPjonnou.b7Neora.Zy9C7YKi', NULL, NULL, 'admin', 1, 'nogn', '2025-03-14 09:21:10.787', '2025-03-14 13:34:34.557'),
(4, 'ppsspprpg7788@gmail.com', '$2b$10$UdJ6/nfXFM6MUisle00rte0v9GUhFzM8fibJ1f7cac8d/o3Rc09ea', NULL, NULL, 'admin', 1, NULL, '2025-03-15 13:39:58.297', '2025-03-15 13:39:58.297'),
(5, 'ppsspprp7788@gmail.com', '$2b$10$pMi8FNU9Ur2tCe8bfe7KuuKk9qFRUCe3xYlcUfNV85Hr77xWT/IRi', NULL, NULL, 'user', 1, NULL, '2025-03-15 13:52:03.654', '2025-03-15 13:52:03.654'),
(6, 'thonylardsavong09@gmail.com', '$2b$10$22zORTC8/BJ1PDVrLcjPaOJ0Doh60n1q.hSKbAl7bf7tZPstXuFvS', NULL, NULL, 'admin', 1, NULL, '2025-03-16 08:59:25.889', '2025-03-16 08:59:25.889');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('55b86d5d-1702-42a9-ba30-5836f3a64511', '94d476ee234156242165a5b313a316d67a196db5aa459a07e931b3b45a1fbda7', '2025-03-12 19:20:06.018', '20250312192005_ecom', NULL, NULL, '2025-03-12 19:20:05.539', 1),
('d6f8dfea-2043-47ac-a6c5-af6075c19a76', 'b55479cb50a85b3544c837695e79077eecc128164b5397f76e7f4221461e1497', '2025-03-12 20:36:56.738', '20250312203656_updatecategory_id', NULL, NULL, '2025-03-12 20:36:56.664', 1),
('e3d4b887-cf5b-4f7e-980f-6426d1b36256', 'f581b05da9c84ecd8b46041e957d8abc3787c90e521535fb93f53828f850f16c', '2025-03-12 20:45:00.515', '20250312204500_update_schema', NULL, NULL, '2025-03-12 20:45:00.506', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Cart_orderedById_fkey` (`orderedById`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Image_productId_fkey` (`productId`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Order_orderedById_fkey` (`orderedById`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Product_categoryId_fkey` (`categoryId`);

--
-- Indexes for table `productoncart`
--
ALTER TABLE `productoncart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ProductOnCart_cartid_fkey` (`cartid`),
  ADD KEY `ProductOnCart_productId_fkey` (`productId`);

--
-- Indexes for table `productonorder`
--
ALTER TABLE `productonorder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ProductOnOrder_productId_fkey` (`productId`),
  ADD KEY `ProductOnOrder_orderId_fkey` (`orderId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `image`
--
ALTER TABLE `image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `productoncart`
--
ALTER TABLE `productoncart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `productonorder`
--
ALTER TABLE `productonorder`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `Cart_orderedById_fkey` FOREIGN KEY (`orderedById`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `image`
--
ALTER TABLE `image`
  ADD CONSTRAINT `Image_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `Order_orderedById_fkey` FOREIGN KEY (`orderedById`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `productoncart`
--
ALTER TABLE `productoncart`
  ADD CONSTRAINT `ProductOnCart_cartid_fkey` FOREIGN KEY (`cartid`) REFERENCES `cart` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ProductOnCart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `productonorder`
--
ALTER TABLE `productonorder`
  ADD CONSTRAINT `ProductOnOrder_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ProductOnOrder_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Database: `lad`
--
CREATE DATABASE IF NOT EXISTS `lad` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `lad`;

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `fname` text NOT NULL,
  `lname` text NOT NULL,
  `address` text NOT NULL,
  `tel` text NOT NULL,
  `salary` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- Database: `phpmyadmin`
--
CREATE DATABASE IF NOT EXISTS `phpmyadmin` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `phpmyadmin`;

-- --------------------------------------------------------

--
-- Table structure for table `pma__bookmark`
--

CREATE TABLE `pma__bookmark` (
  `id` int(10) UNSIGNED NOT NULL,
  `dbase` varchar(255) NOT NULL DEFAULT '',
  `user` varchar(255) NOT NULL DEFAULT '',
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `query` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Bookmarks';

-- --------------------------------------------------------

--
-- Table structure for table `pma__central_columns`
--

CREATE TABLE `pma__central_columns` (
  `db_name` varchar(64) NOT NULL,
  `col_name` varchar(64) NOT NULL,
  `col_type` varchar(64) NOT NULL,
  `col_length` text DEFAULT NULL,
  `col_collation` varchar(64) NOT NULL,
  `col_isNull` tinyint(1) NOT NULL,
  `col_extra` varchar(255) DEFAULT '',
  `col_default` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Central list of columns';

-- --------------------------------------------------------

--
-- Table structure for table `pma__column_info`
--

CREATE TABLE `pma__column_info` (
  `id` int(5) UNSIGNED NOT NULL,
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `column_name` varchar(64) NOT NULL DEFAULT '',
  `comment` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `mimetype` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `transformation` varchar(255) NOT NULL DEFAULT '',
  `transformation_options` varchar(255) NOT NULL DEFAULT '',
  `input_transformation` varchar(255) NOT NULL DEFAULT '',
  `input_transformation_options` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Column information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__designer_settings`
--

CREATE TABLE `pma__designer_settings` (
  `username` varchar(64) NOT NULL,
  `settings_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Settings related to Designer';

--
-- Dumping data for table `pma__designer_settings`
--

INSERT INTO `pma__designer_settings` (`username`, `settings_data`) VALUES
('root', '{\"snap_to_grid\":\"off\",\"angular_direct\":\"direct\",\"relation_lines\":\"true\",\"full_screen\":\"off\",\"small_big_all\":\">\",\"side_menu\":\"true\"}');

-- --------------------------------------------------------

--
-- Table structure for table `pma__export_templates`
--

CREATE TABLE `pma__export_templates` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL,
  `export_type` varchar(10) NOT NULL,
  `template_name` varchar(64) NOT NULL,
  `template_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved export templates';

--
-- Dumping data for table `pma__export_templates`
--

INSERT INTO `pma__export_templates` (`id`, `username`, `export_type`, `template_name`, `template_data`) VALUES
(1, 'root', 'database', 'black-Up', '{\"quick_or_custom\":\"quick\",\"what\":\"sql\",\"structure_or_data_forced\":\"0\",\"table_select[]\":[\"booking\",\"checkin\",\"employee\",\"expense\",\"product\",\"review\",\"sale\",\"sale_detail\",\"stadium\",\"user\"],\"table_structure[]\":[\"booking\",\"checkin\",\"employee\",\"expense\",\"product\",\"review\",\"sale\",\"sale_detail\",\"stadium\",\"user\"],\"table_data[]\":[\"booking\",\"checkin\",\"employee\",\"expense\",\"product\",\"review\",\"sale\",\"sale_detail\",\"stadium\",\"user\"],\"aliases_new\":\"\",\"output_format\":\"sendit\",\"filename_template\":\"@DATABASE@\",\"remember_template\":\"on\",\"charset\":\"utf-8\",\"compression\":\"none\",\"maxsize\":\"\",\"codegen_structure_or_data\":\"data\",\"codegen_format\":\"0\",\"csv_separator\":\",\",\"csv_enclosed\":\"\\\"\",\"csv_escaped\":\"\\\"\",\"csv_terminated\":\"AUTO\",\"csv_null\":\"NULL\",\"csv_columns\":\"something\",\"csv_structure_or_data\":\"data\",\"excel_null\":\"NULL\",\"excel_columns\":\"something\",\"excel_edition\":\"win\",\"excel_structure_or_data\":\"data\",\"json_structure_or_data\":\"data\",\"json_unicode\":\"something\",\"latex_caption\":\"something\",\"latex_structure_or_data\":\"structure_and_data\",\"latex_structure_caption\":\"Structure of table @TABLE@\",\"latex_structure_continued_caption\":\"Structure of table @TABLE@ (continued)\",\"latex_structure_label\":\"tab:@TABLE@-structure\",\"latex_relation\":\"something\",\"latex_comments\":\"something\",\"latex_mime\":\"something\",\"latex_columns\":\"something\",\"latex_data_caption\":\"Content of table @TABLE@\",\"latex_data_continued_caption\":\"Content of table @TABLE@ (continued)\",\"latex_data_label\":\"tab:@TABLE@-data\",\"latex_null\":\"\\\\textit{NULL}\",\"mediawiki_structure_or_data\":\"structure_and_data\",\"mediawiki_caption\":\"something\",\"mediawiki_headers\":\"something\",\"htmlword_structure_or_data\":\"structure_and_data\",\"htmlword_null\":\"NULL\",\"ods_null\":\"NULL\",\"ods_structure_or_data\":\"data\",\"odt_structure_or_data\":\"structure_and_data\",\"odt_relation\":\"something\",\"odt_comments\":\"something\",\"odt_mime\":\"something\",\"odt_columns\":\"something\",\"odt_null\":\"NULL\",\"pdf_report_title\":\"\",\"pdf_structure_or_data\":\"structure_and_data\",\"phparray_structure_or_data\":\"data\",\"sql_include_comments\":\"something\",\"sql_header_comment\":\"\",\"sql_use_transaction\":\"something\",\"sql_compatibility\":\"NONE\",\"sql_structure_or_data\":\"structure_and_data\",\"sql_create_table\":\"something\",\"sql_auto_increment\":\"something\",\"sql_create_view\":\"something\",\"sql_procedure_function\":\"something\",\"sql_create_trigger\":\"something\",\"sql_backquotes\":\"something\",\"sql_type\":\"INSERT\",\"sql_insert_syntax\":\"both\",\"sql_max_query_size\":\"50000\",\"sql_hex_for_binary\":\"something\",\"sql_utc_time\":\"something\",\"texytext_structure_or_data\":\"structure_and_data\",\"texytext_null\":\"NULL\",\"xml_structure_or_data\":\"data\",\"xml_export_events\":\"something\",\"xml_export_functions\":\"something\",\"xml_export_procedures\":\"something\",\"xml_export_tables\":\"something\",\"xml_export_triggers\":\"something\",\"xml_export_views\":\"something\",\"xml_export_contents\":\"something\",\"yaml_structure_or_data\":\"data\",\"\":null,\"lock_tables\":null,\"as_separate_files\":null,\"csv_removeCRLF\":null,\"excel_removeCRLF\":null,\"json_pretty_print\":null,\"htmlword_columns\":null,\"ods_columns\":null,\"sql_dates\":null,\"sql_relation\":null,\"sql_mime\":null,\"sql_disable_fk\":null,\"sql_views_as_tables\":null,\"sql_metadata\":null,\"sql_create_database\":null,\"sql_drop_table\":null,\"sql_if_not_exists\":null,\"sql_simple_view_export\":null,\"sql_view_current_user\":null,\"sql_or_replace_view\":null,\"sql_truncate\":null,\"sql_delayed\":null,\"sql_ignore\":null,\"texytext_columns\":null}');

-- --------------------------------------------------------

--
-- Table structure for table `pma__favorite`
--

CREATE TABLE `pma__favorite` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Favorite tables';

-- --------------------------------------------------------

--
-- Table structure for table `pma__history`
--

CREATE TABLE `pma__history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db` varchar(64) NOT NULL DEFAULT '',
  `table` varchar(64) NOT NULL DEFAULT '',
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp(),
  `sqlquery` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='SQL history for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__navigationhiding`
--

CREATE TABLE `pma__navigationhiding` (
  `username` varchar(64) NOT NULL,
  `item_name` varchar(64) NOT NULL,
  `item_type` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Hidden items of navigation tree';

-- --------------------------------------------------------

--
-- Table structure for table `pma__pdf_pages`
--

CREATE TABLE `pma__pdf_pages` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `page_nr` int(10) UNSIGNED NOT NULL,
  `page_descr` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='PDF relation pages for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__recent`
--

CREATE TABLE `pma__recent` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Recently accessed tables';

--
-- Dumping data for table `pma__recent`
--

INSERT INTO `pma__recent` (`username`, `tables`) VALUES
('root', '[{\"db\":\"stadium\",\"table\":\"sale\"},{\"db\":\"stadium\",\"table\":\"sale_detail\"},{\"db\":\"stadium\",\"table\":\"stadium\"},{\"db\":\"stadium\",\"table\":\"product\"},{\"db\":\"stadium\",\"table\":\"employee\"},{\"db\":\"stadium\",\"table\":\"review\"},{\"db\":\"stadium\",\"table\":\"user\"},{\"db\":\"stadium\",\"table\":\"booking\"},{\"db\":\"stadium\",\"table\":\"checkin\"},{\"db\":\"stadium\",\"table\":\"expense\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `pma__relation`
--

CREATE TABLE `pma__relation` (
  `master_db` varchar(64) NOT NULL DEFAULT '',
  `master_table` varchar(64) NOT NULL DEFAULT '',
  `master_field` varchar(64) NOT NULL DEFAULT '',
  `foreign_db` varchar(64) NOT NULL DEFAULT '',
  `foreign_table` varchar(64) NOT NULL DEFAULT '',
  `foreign_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Relation table';

-- --------------------------------------------------------

--
-- Table structure for table `pma__savedsearches`
--

CREATE TABLE `pma__savedsearches` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `search_name` varchar(64) NOT NULL DEFAULT '',
  `search_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved searches';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_coords`
--

CREATE TABLE `pma__table_coords` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `pdf_page_number` int(11) NOT NULL DEFAULT 0,
  `x` float UNSIGNED NOT NULL DEFAULT 0,
  `y` float UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table coordinates for phpMyAdmin PDF output';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_info`
--

CREATE TABLE `pma__table_info` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `display_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_uiprefs`
--

CREATE TABLE `pma__table_uiprefs` (
  `username` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `prefs` text NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Tables'' UI preferences';

--
-- Dumping data for table `pma__table_uiprefs`
--

INSERT INTO `pma__table_uiprefs` (`username`, `db_name`, `table_name`, `prefs`, `last_update`) VALUES
('root', 'stadium', 'employee', '{\"sorted_col\":\"`employee`.`username` ASC\"}', '2025-05-02 10:51:27');

-- --------------------------------------------------------

--
-- Table structure for table `pma__tracking`
--

CREATE TABLE `pma__tracking` (
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `version` int(10) UNSIGNED NOT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `schema_snapshot` text NOT NULL,
  `schema_sql` text DEFAULT NULL,
  `data_sql` longtext DEFAULT NULL,
  `tracking` set('UPDATE','REPLACE','INSERT','DELETE','TRUNCATE','CREATE DATABASE','ALTER DATABASE','DROP DATABASE','CREATE TABLE','ALTER TABLE','RENAME TABLE','DROP TABLE','CREATE INDEX','DROP INDEX','CREATE VIEW','ALTER VIEW','DROP VIEW') DEFAULT NULL,
  `tracking_active` int(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Database changes tracking for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__userconfig`
--

CREATE TABLE `pma__userconfig` (
  `username` varchar(64) NOT NULL,
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `config_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User preferences storage for phpMyAdmin';

--
-- Dumping data for table `pma__userconfig`
--

INSERT INTO `pma__userconfig` (`username`, `timevalue`, `config_data`) VALUES
('root', '2025-05-21 12:45:21', '{\"Console\\/Mode\":\"collapse\",\"lang\":\"en_GB\"}');

-- --------------------------------------------------------

--
-- Table structure for table `pma__usergroups`
--

CREATE TABLE `pma__usergroups` (
  `usergroup` varchar(64) NOT NULL,
  `tab` varchar(64) NOT NULL,
  `allowed` enum('Y','N') NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User groups with configured menu items';

-- --------------------------------------------------------

--
-- Table structure for table `pma__users`
--

CREATE TABLE `pma__users` (
  `username` varchar(64) NOT NULL,
  `usergroup` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Users and their assignments to user groups';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pma__central_columns`
--
ALTER TABLE `pma__central_columns`
  ADD PRIMARY KEY (`db_name`,`col_name`);

--
-- Indexes for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `db_name` (`db_name`,`table_name`,`column_name`);

--
-- Indexes for table `pma__designer_settings`
--
ALTER TABLE `pma__designer_settings`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_user_type_template` (`username`,`export_type`,`template_name`);

--
-- Indexes for table `pma__favorite`
--
ALTER TABLE `pma__favorite`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__history`
--
ALTER TABLE `pma__history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`,`db`,`table`,`timevalue`);

--
-- Indexes for table `pma__navigationhiding`
--
ALTER TABLE `pma__navigationhiding`
  ADD PRIMARY KEY (`username`,`item_name`,`item_type`,`db_name`,`table_name`);

--
-- Indexes for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  ADD PRIMARY KEY (`page_nr`),
  ADD KEY `db_name` (`db_name`);

--
-- Indexes for table `pma__recent`
--
ALTER TABLE `pma__recent`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__relation`
--
ALTER TABLE `pma__relation`
  ADD PRIMARY KEY (`master_db`,`master_table`,`master_field`),
  ADD KEY `foreign_field` (`foreign_db`,`foreign_table`);

--
-- Indexes for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_savedsearches_username_dbname` (`username`,`db_name`,`search_name`);

--
-- Indexes for table `pma__table_coords`
--
ALTER TABLE `pma__table_coords`
  ADD PRIMARY KEY (`db_name`,`table_name`,`pdf_page_number`);

--
-- Indexes for table `pma__table_info`
--
ALTER TABLE `pma__table_info`
  ADD PRIMARY KEY (`db_name`,`table_name`);

--
-- Indexes for table `pma__table_uiprefs`
--
ALTER TABLE `pma__table_uiprefs`
  ADD PRIMARY KEY (`username`,`db_name`,`table_name`);

--
-- Indexes for table `pma__tracking`
--
ALTER TABLE `pma__tracking`
  ADD PRIMARY KEY (`db_name`,`table_name`,`version`);

--
-- Indexes for table `pma__userconfig`
--
ALTER TABLE `pma__userconfig`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__usergroups`
--
ALTER TABLE `pma__usergroups`
  ADD PRIMARY KEY (`usergroup`,`tab`,`allowed`);

--
-- Indexes for table `pma__users`
--
ALTER TABLE `pma__users`
  ADD PRIMARY KEY (`username`,`usergroup`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pma__history`
--
ALTER TABLE `pma__history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  MODIFY `page_nr` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Database: `stadium`
--
CREATE DATABASE IF NOT EXISTS `stadium` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `stadium`;

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
(80, 16, 4, NULL, '2025-05-31 08:00:00', '2025-05-31 10:00:00', 500000.00, 'cancelled', 150000.00, 0.00, '1746215084334-530424999.jpg', 'Football', '2025-05-31', '2025-05-03 02:44:44'),
(81, 16, 7, NULL, '2025-05-03 10:00:00', '2025-05-03 12:00:00', 360000.00, 'completed', 108000.00, 252000.00, '1746215135986-337750793.jpg', 'Football', '2025-05-03', '2025-05-03 02:45:36'),
(82, 16, 4, NULL, '2025-05-10 00:00:00', '2025-05-10 23:59:00', 2000000.00, 'confirmed', 600000.00, 0.00, '1746215598759-276800107.jpg', 'Event', '2025-05-03', '2025-05-03 02:53:18'),
(83, 16, 5, NULL, '2025-05-14 08:00:00', '2025-05-14 10:00:00', 400000.00, 'completed', 120000.00, 280000.00, '1746217841800-421736179.jpg', 'Football', '2025-05-03', '2025-05-03 03:30:41'),
(84, 16, 5, NULL, '2025-05-24 00:00:00', '2025-05-24 23:59:00', 1300000.00, 'confirmed', 390000.00, 0.00, '1746217866397-293206143.jpg', 'Event', '2025-05-23', '2025-05-03 03:31:06'),
(85, 16, 7, NULL, '2025-05-03 14:00:00', '2025-05-03 16:00:00', 360000.00, 'completed', 108000.00, 252000.00, '1746219530220-457933108.jpg', 'Football', '2025-05-03', '2025-05-03 03:58:50'),
(86, 16, 7, NULL, '2025-05-21 00:00:00', '2025-05-21 23:59:00', 1700000.00, 'cancelled', 510000.00, 0.00, '1746220451538-555110179.jpg', 'Event', '2025-05-20', '2025-05-03 04:14:12'),
(87, 17, 4, NULL, '2025-05-06 18:00:00', '2025-05-06 20:00:00', 500000.00, 'completed', 150000.00, 350000.00, '1746450839842-479954067.jpg', 'Football', '2025-05-06', '2025-05-05 20:14:00'),
(88, 17, 5, NULL, '2025-05-06 18:00:00', '2025-05-06 20:00:00', 400000.00, 'completed', 120000.00, 280000.00, '1746523138516-869070129.jpg', 'Football', '2025-05-06', '2025-05-06 16:18:58'),
(89, 17, 7, NULL, '2025-05-07 00:00:00', '2025-05-07 23:59:00', 1700000.00, 'completed', 510000.00, 1190000.00, '1746523433058-360444707.jpg', 'Event', '2025-05-06', '2025-05-06 16:23:53'),
(90, 17, 7, NULL, '2025-05-06 18:00:00', '2025-05-06 20:00:00', 360000.00, 'confirmed', 108000.00, 0.00, '1746523456716-746813683.jpg', 'Football', '2025-05-06', '2025-05-06 16:24:18'),
(91, 17, 7, NULL, '2025-05-22 00:00:00', '2025-05-22 23:59:00', 1700000.00, 'confirmed', 510000.00, 0.00, '1746532155302-55825105.jpg', 'Event', '2025-05-21', '2025-05-06 18:49:16'),
(92, 17, 7, 5, '2025-05-20 00:00:00', '2025-05-20 23:59:00', 1700000.00, 'confirmed', 510000.00, 0.00, '1746539017546-771506483.jpg', 'Event', '2025-05-19', '2025-05-06 20:43:39'),
(93, 17, 7, 5, '2025-05-21 14:00:00', '2025-05-21 16:00:00', 360000.00, 'cancelled', 108000.00, 0.00, '1746539689259-390955509.jpg', 'Football', '2025-05-21', '2025-05-06 20:54:49'),
(94, 17, 5, NULL, '2025-05-07 16:00:00', '2025-05-07 18:00:00', 400000.00, 'pending', 120000.00, 0.00, '1746607187446-781492775.jpg', 'Football', '2025-05-07', '2025-05-07 15:39:47'),
(95, 17, 5, NULL, '2025-05-07 18:00:00', '2025-05-07 20:00:00', 400000.00, 'pending', 120000.00, 0.00, '1746607206228-976422208.jpg', 'Football', '2025-05-07', '2025-05-07 15:40:06'),
(96, 17, 7, NULL, '2025-05-08 14:00:00', '2025-05-08 16:00:00', 360000.00, 'pending', 108000.00, 0.00, '1746607235294-770792360.jpg', 'Football', '2025-05-08', '2025-05-07 15:40:35'),
(97, 18, 7, NULL, '2025-05-08 18:00:00', '2025-05-08 20:00:00', 360000.00, 'pending', 108000.00, 0.00, '1746607872357-630446031.jpg', 'Football', '2025-05-08', '2025-05-07 15:51:12'),
(98, 19, 4, 6, '2025-05-11 14:00:00', '2025-05-11 16:00:00', 500000.00, 'confirmed', 150000.00, 0.00, '1746641012073-320878524.jpg', 'Football', '2025-05-11', '2025-05-08 01:03:33'),
(99, 20, 4, 6, '2025-05-18 16:00:00', '2025-05-18 18:00:00', 500000.00, 'completed', 150000.00, 350000.00, '1747558469952-705842878.jpg', 'Football', '2025-05-18', '2025-05-18 15:54:30'),
(100, 20, 5, NULL, '2025-05-19 00:00:00', '2025-05-19 23:59:00', 1300000.00, 'pending', 390000.00, 0.00, '1747558945339-507685587.jpg', 'Event', '2025-05-18', '2025-05-18 16:02:26');

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
(19, 99, 4, '2025-05-18 15:54:55');

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
(5, 'ທະນາໄຊ', '22012018', 'ບ້ານ ໜອງພະຍາ,ເມືອງ ໄຊທານີ,ແຂວງ ນະຄອນຫຼວງວຽງຈັນ', 'tony', '12345', '2004-07-16', 'admin'),
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
(14, 3000.00, 'ຊື້ເຄື່ອງດື່ມ', 45000.00, '2025-05-12', 36, 15);

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
(26, 'ເຂົ້າໜົມເລ', 16000.00, 'ອາຫານຫວ່າງ', 0, '1746274763425-637048348.png'),
(27, 'ເບນໂຕະ ນ້ອຍ', 7000.00, 'ອາຫານຫວ່າງ', 0, '1746275074413-762490129.png'),
(28, 'ເບນໂຕະ ໃຫຍ່', 16000.00, 'ອາຫານຫວ່າງ', 0, '1746275151001-513481365.png'),
(29, 'ສະຕິງ', 12000.00, 'ເຄື່ອງດື່ມຊູກຳລັງ', 10, '1746275323203-439871572.jpg'),
(30, 'ມອນເຕີ້', 16000.00, 'ເຄື່ອງດື່ມຊູກຳລັງ', 26, '1746275441086-1305455.png'),
(31, 'red bull', 15000.00, 'ເຄື່ອງດື່ມຊູກຳລັງ', 0, '1746275493501-644070247.png'),
(32, 'M150', 10000.00, 'ເຄື່ອງດື່ມຊູກຳລັງ', 0, '1746275706981-320872064.png'),
(33, 'ສະປອນເຊີ້', 11000.00, 'ເຄື່ອງດື່ມແຮ່ທາດ', 0, '1746275853667-447645964.png'),
(34, 'Magnum ແບບແທ່ງ', 40000.00, 'ຂອງຫວານ', 0, '1746276032511-703993509.png'),
(35, 'Magnum ແບບກ່ອງ', 35000.00, 'ຂອງຫວານ', 10, '1746276063034-567762773.png'),
(36, 'ນຳ້ຫົວເສືອ ກາງ', 7000.00, 'ນ້ຳດື່ມ', 8, '1746276479723-672954146.jpg'),
(37, 'ນຳ້ຫົວເສືອ ນ້ອຍ', 5000.00, 'ນ້ຳດື່ມ', 7, '1746276560042-908583979.jpg'),
(38, 'ນຳ້ຫົວເສືອ ໃຫຍ່', 10000.00, 'ນ້ຳດື່ມ', 5, '1746276668562-731896996.jpg');

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
(1, 4, 4, 'ສະໜາມສະອາດ, ແຕ່ໄຟບໍ່ສະຫວ່າງພໍ', '2025-04-29 21:33:55'),
(2, 9, 4, 'vayry Good', '2025-04-29 22:08:34'),
(3, 9, 5, 'ditsout', '2025-04-30 01:18:31'),
(5, 2, 1, 'stadium No Good', '2025-04-30 16:15:48'),
(6, 2, 4, 'sslfkwrfk', '2025-04-30 16:30:00'),
(7, 2, 5, 'goood', '2025-04-30 16:30:59'),
(8, 2, 5, 'Good', '2025-04-30 16:37:16'),
(9, 2, 3, 'stadium 2 No goood', '2025-04-30 16:37:40'),
(10, 2, 3, 'No Good st3', '2025-04-30 16:42:09'),
(11, 2, 1, 'lkreglerk', '2025-04-30 16:45:48'),
(12, 2, 5, 'st 1 Good', '2025-04-30 16:50:41'),
(13, 2, 3, 'No', '2025-04-30 16:51:48'),
(14, 2, 5, 'gooo', '2025-04-30 16:59:22'),
(15, 2, 3, 'diii haemg', '2025-04-30 16:59:44'),
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
(29, 20, 3, 'ໄຟເດີ່ນ3ບໍ່ແຈ້ງປານໃດເດີ້', '2025-05-18 16:00:51');

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
(31, 258000.00, 300000.00, '2025-05-16 19:29:48', 6);

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
(44, 31, 1, 12000.00, 29);

-- --------------------------------------------------------

--
-- Table structure for table `stadium`
--

CREATE TABLE `stadium` (
  `st_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `price2` decimal(10,2) DEFAULT NULL,
  `dtail` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stadium`
--

INSERT INTO `stadium` (`st_id`, `price`, `price2`, `dtail`, `image`) VALUES
(4, 500000.00, 2000000.00, 'ເດີ່ນ1', '1745669147809-133652120.png'),
(5, 400000.00, 1300000.00, 'ເດິ່ນ2', '1745669231188-331641214.jpg'),
(7, 360000.00, 1700000.00, 'ເດິ່ນ3', '1745671665496-580642188.jpg');

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
(20, 'jonh', '123456', 'ຈອນນີ້', 'jobg727@gmail.com', '52009314');

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
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `checkin`
--
ALTER TABLE `checkin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `emp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `sale`
--
ALTER TABLE `sale`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `sale_detail`
--
ALTER TABLE `sale_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `stadium`
--
ALTER TABLE `stadium`
  MODIFY `st_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

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
--
-- Database: `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;
--
-- Database: `test_up`
--
CREATE DATABASE IF NOT EXISTS `test_up` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `test_up`;

-- --------------------------------------------------------

--
-- Table structure for table `imployee`
--

CREATE TABLE `imployee` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `position` text NOT NULL,
  `image` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `imployee`
--

INSERT INTO `imployee` (`id`, `name`, `position`, `image`) VALUES
(9, 'kefw;', 'elkw', '1744963687311-590880295.png'),
(10, 'kermg;', 'felkw', '1744963805427-71528320.jpg'),
(11, 'wot3', '42;lt', '1744964008280-213758433.jpg'),
(12, ';lwr', 'dfkr', '1744964278475-425005589.png');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `category` text NOT NULL,
  `image` varchar(200) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `category`, `image`, `price`) VALUES
(3, 'tonyjfnerlk', '2025-04-06', '1744459862647-808898982.png', 1234),
(4, 'tonyjfnerlk', '2025-04-06', '1744460220221-233023962.png', 1234),
(5, 'ສະບາຍດີ', 'store', '1744464367509-954222662.png', 923),
(6, 'juso5461', 'house', '1744464616838-799049792.png', 923),
(7, 'tony', 'เครื่องใช้ในบ้าน', '1744469589157-4458322.jpg', 43635),
(8, 'tony', 'เครื่องใช้ในบ้าน', '1744469687594-267603846.jpg', 43635),
(9, 'juso5461', 'อาหารและเครื่องดื่ม', '1744469942347-365111839.jpg', 4556),
(10, 'juso5461', 'อาหารและเครื่องดื่ม', '1744469966455-126464275.jpg', 4556),
(11, 'juso5461', 'เครื่องใช้ในบ้าน', '1744470208938-600911128.jpg', 923),
(12, 'tony', 'เครื่องเขียน', '1744470267107-758324204.jpg', 923),
(13, 'ສະບາຍດີ', 'อุปกรณ์อิเล็กทรอนิกส์', '1744470333798-470515506.png', 923),
(14, 'juso5461', 'อาหารและเครื่องดื่ม', '1744961814508-416439721.png', 46664),
(15, 'tony', 'อุปกรณ์อิเล็กทรอนิกส์', '1744961850680-70946569.jpg', 456474),
(16, 'huk', 'เครื่องเขียน', '1744961882684-768995254.jpg', 1000);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `date` datetime NOT NULL,
  `image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `date`, `image`) VALUES
(1, 'tony', '2025-04-06 00:00:00', '1743948772749.png'),
(2, 'tony', '2025-04-06 00:00:00', 'https://storage.googleapis.com/tonyotp-5d9d3.appspot.com/upload_register/1743952026623_188864.png'),
(3, 'tony', '2025-04-06 00:00:00', 'https://storage.googleapis.com/tonyotp-5d9d3.appspot.com/upload_register/1743952627292_188864.png'),
(4, 'tony', '2025-04-06 00:00:00', 'https://storage.googleapis.com/tonyotp-5d9d3.appspot.com/upload_register/1743952733474_Screenshot 2025-04-04 222353.png'),
(5, 'tony', '2025-04-06 00:00:00', 'https://storage.googleapis.com/tonyotp-5d9d3.appspot.com/upload_register/1744117933347_Screenshot 2025-04-04 222353.png'),
(6, 'tonyjfnerlk', '2025-04-06 00:00:00', 'https://storage.googleapis.com/tonyotp-5d9d3.appspot.com/upload_register/1744117974192_Screenshot 2025-04-04 222353.png'),
(7, 'er3;f', '2025-04-17 00:00:00', 'https://storage.googleapis.com/tonyotp-5d9d3.appspot.com/upload_register/1744120270421_1000000034.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `imployee`
--
ALTER TABLE `imployee`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `imployee`
--
ALTER TABLE `imployee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Use database
USE mern_db;

-- Create Users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    avatar VARCHAR(255),
    token VARCHAR(255),
    refreshtoken VARCHAR(255)
);

-- Create Vehicles table
CREATE TABLE Vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(50) NOT NULL,
    type ENUM('Boat', 'Trailer') NOT NULL,
    material ENUM('GRP', 'Wood', 'Aluminium', 'Steel') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    location VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    description VARCHAR(1020),
    photo VARCHAR(255),
    date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    owner_id INT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES Users(id)
);

-- Create Boats table
CREATE TABLE Boats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT,
    category ENUM('SailBoat', 'PowerBoat', 'Inflatable', 'SmallBoat') NOT NULL,
    length DECIMAL(5, 2),
    beam DECIMAL(5, 2),
    engine ENUM('OutBoard', 'InBoard', 'No') NOT NULL,
    power INT,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id)
);

-- Create SailBoats table
CREATE TABLE SailBoats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    boat_id INT,
    mastHeight DECIMAL(5, 2),
    sailArea INT,
    draught DECIMAL(5, 2),
    FOREIGN KEY (boat_id) REFERENCES Boats(id)
);

-- Create PowerBoats table
CREATE TABLE PowerBoats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    boat_id INT,
    engineType ENUM('Diesel', 'Electric', 'Gas') NOT NULL,
    speed INT,
    FOREIGN KEY (boat_id) REFERENCES Boats(id)
);

-- Create Inflatable table
CREATE TABLE Inflatable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    boat_id INT,
    persons INT,
    FOREIGN KEY (boat_id) REFERENCES Boats(id)
);

-- Create SmallBoats table
CREATE TABLE SmallBoats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    boat_id INT,
    FOREIGN KEY (boat_id) REFERENCES Boats(id)
);

-- Create Trailers table
CREATE TABLE Trailers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT,
    payload INT,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id)
);

-- Create LikedBy table to track likes
CREATE TABLE LikedBy (
    user_id INT,
    vehicle_id INT,
    PRIMARY KEY (user_id, vehicle_id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id)
);

-- Create RequestLogs table
CREATE TABLE RequestLogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    url_accessed VARCHAR(255) NOT NULL,
    method ENUM('GET', 'POST', 'PUT', 'DELETE') NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_agent VARCHAR(255) NOT NULL
);

-- Create ErrorLogs table
CREATE TABLE ErrorLogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45),
    url_accessed VARCHAR(255),
    method ENUM('GET', 'POST', 'PUT', 'DELETE'),
    error_message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);


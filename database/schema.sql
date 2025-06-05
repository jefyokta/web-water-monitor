CREATE DATABASE IF NOT EXISTS water_monitor;

USE water_monitor;

CREATE TABLE IF NOT EXISTS tmp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ph FLOAT,
    temperature FLOAT,
    tds FLOAT,
    distance FLOAT,
    update_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ph FLOAT,
    temperature FLOAT,
    tds FLOAT,
    distance FLOAT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

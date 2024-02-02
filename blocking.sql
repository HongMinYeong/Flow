-- Active: 1706855949612@@127.0.0.1@3306@project

create database project CHARACTER set utf8mb4 collate utf8mb4_unicode_ci;

USE project;

CREATE TABLE blocking (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    extension VARCHAR(200) NULL UNIQUE
);
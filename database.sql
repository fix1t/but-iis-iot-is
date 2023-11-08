CREATE DATABASE iot;

-- IN PROGRESS...

CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    mail VARCHAR(255),
    role ENUM("Admin", "Registered"),
    birth DATE,
    bio TEXT,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE System (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description TEXT,
    owner_id INT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (owner_id) REFERENCES User(id)
);

CREATE TABLE Device (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    user_alias VARCHAR(255)
);

CREATE TABLE Type (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255)
);

CREATE TABLE Parameter (
    name VARCHAR(255),
    FOREIGN KEY (type_id) REFERENCES Type(id) ON DELETE CASCADE
);


--TO-DO:
-- [ ] User that use system
-- [ ] User Request to join System
-- [ ] Device connect to System
-- [ ] Type connect to Device
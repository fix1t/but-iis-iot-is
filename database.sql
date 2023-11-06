CREATE DATABASE iot;

-- IN PROGRESS...

CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    mail VARCHAR(255),
    role ENUM("Admin", "Registered"),
    bio TEXT,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE System (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description TEXT,
    owner_id INT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES Users(id)
);

CREATE TABLE Device (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    user_alias VARCHAR(255)
);

CREATE TABLE Device_type (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255)
);

CREATE TABLE Parameter (
    name VARCHAR(255),
    FOREIGN KEY (type_id) REFERENCES D(id) ON DELETE CASCADE
);


--TO-DO:
-- [ ] User that use system
-- [ ] User Request to join System
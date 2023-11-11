CREATE DATABASE iot;

CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    mail VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN,
    birth DATE,
    gender ENUM('male', 'female', 'other'),
    bio TEXT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE System (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES User(id)
);

CREATE TABLE SystemUser (
    system_id INT NOT NULL,
    user_id INT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (system_id, user_id),
    FOREIGN KEY (system_id) REFERENCES System(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE SystemUserRequest (
    id INT PRIMARY KEY AUTO_INCREMENT,
    system_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') NOT NULL,
    message TEXT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (system_id) REFERENCES System(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE Type (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Device (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_id INT NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    user_alias VARCHAR(255),
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES Type(id) ON DELETE CASCADE
);

CREATE TABLE SystemDevice (
    device_id INT NOT NULL,
    system_id INT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (device_id, system_id),
    FOREIGN KEY (device_id) REFERENCES Device(id) ON DELETE CASCADE,
    FOREIGN KEY (system_id) REFERENCES System(id) ON DELETE CASCADE
);

-- Template table - what parameters a device type has
CREATE TABLE Parameter (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (type_id) REFERENCES Type(id) ON DELETE CASCADE
);

-- Table that stores the value of a parameter of a device at a certain time
CREATE TABLE DeviceParameter (
    device_id INT NOT NULL,
    parameter_id INT NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (device_id, parameter_id, recorded_at),
    FOREIGN KEY (device_id) REFERENCES Device(id) ON DELETE CASCADE,
    FOREIGN KEY (parameter_id) REFERENCES Parameter(id) ON DELETE CASCADE
);

CREATE TABLE KPI (
    id INT PRIMARY KEY AUTO_INCREMENT,
    system_id INT NOT NULL,
    parameter_id INT NOT NULL,
    threshold DECIMAL(10,2) NOT NULL,
    operation ENUM('greater', 'less', 'equal', 'not_equal') NOT NULL,
    FOREIGN KEY (system_id) REFERENCES System(id) ON DELETE CASCADE,
    FOREIGN KEY (parameter_id) REFERENCES Parameter(id) ON DELETE CASCADE
);

DROP DATABASE IF EXISTS employment_db;
CREATE DATABASE employment_db;

USE employment_db;

CREATE TABLE department (
    id INT NOT NULL PRIMARY KEY,
    d_name VARCHAR(30) NOT NULL
);

CREATE TABLE d_role (
    id INT NOT NULL PRIMARY KEY, 
    title VARCHAR (30) NOT NULL, 
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL
)

CREATE TABLE employee (
    id INT NOT NULL PRIMARY KEY, 
    first_name VARCHAR (30) NOT NULL, 
    last_name VARCHAR (30) NOT NULL, 
    role_id INT NOT NULL, 
    manager_id INT, 
)
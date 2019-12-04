DROP DATABASE IF EXISTS shop_db;
CREATE DATABASE shop_db; 

USE shop_db;

CREATE TABLE products (
    id INTEGER AUTO_INCREMENT,
    product_name VARCHAR(75) NOT NULL,
    department_name VARCHAR(75) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE departments (
    department_id INTEGER AUTO_INCREMENT,
    department_name VARCHAR(75) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL, 
    PRIMARY KEY (department_id)
);
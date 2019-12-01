require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.UN,
    password: process.env.PW,
    database: 'shop_db'
});

connection.connect(function(error) {
    if (error) throw error;
    console.log("Connected!");
});




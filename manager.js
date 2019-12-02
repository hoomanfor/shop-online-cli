require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var {table} = require('table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.UN,
    password: process.env.PW,
    database: 'shop_db'
});

connection.connect(function(error) {
    if (error) throw error;
    // console.log("Connected!");
});
 
var data,
    output;
var ids = [];

data = [
    ['id', 'name', 'price', 'inventory']
];

inquirer.prompt(
    {
        type: "list",
        message: "Greetings Manager! Select a Menu item to proceed.",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        name: "action"
    }
).then(function(response) {
    console.log(response.action)
});
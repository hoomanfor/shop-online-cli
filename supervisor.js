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

data = [
    ['id', 'name', 'price', 'inventory']
];

function menu() {
    inquirer.prompt(
        {
            type: "list",
            message: "Greetings Supervisor! Select a Menu item to proceed.",
            choices: ["View Product Sales by Department", "Create New Department"],
            name: "action"
        }
    ).then(function(response) {
        var action = response.action; 
        switch (action) {
            case "View Product Sales by Department":
                console.log(action);
            break;
            case "Create New Department":
                console.log(action);
            break;
            default:
                console.log("Default!");
        }
    })
}

menu();
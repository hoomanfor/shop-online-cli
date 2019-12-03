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
            message: "Greetings Manager! Select a Menu item to proceed.",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "action"
        }
    ).then(function(response) {
        console.log(response.action)
        var action = response.action; 
        switch (action) {
            case "View Products for Sale":
                connection.query("SELECT * FROM products", function(error, response) {
                    if (error) throw error;
                    response.forEach(function(element) {
                        var row = [];
                        row.push(element.id, element.product_name, "$" + element.price.toFixed(2), element.stock_quantity);
                        data.push(row);
                    })
                output = table(data);
                console.log(output);
                returnToMenu()
                })
            break;
            case "View Low Inventory":
                connection.query("SELECT * FROM products", function(error, response) {
                    if (error) throw error;
                    response.forEach(function(element) {
                        var row = [];
                        if (element.stock_quantity < 5) {
                            row.push(element.id, element.product_name, "$" + element.price.toFixed(2), element.stock_quantity);
                            data.push(row);
                        }
                    })
                    if (data.length > 1) {
                        output = table(data);
                        console.log(output);
                        returnToMenu()
                    } else {
                        console.log("");
                        console.log("Each product has an inventory count greater than 5.")
                        console.log("");
                        returnToMenu()
                    }
                })
            break;
            default:
                console.log("Default!");
        }
    });
}

function returnToMenu() {
    inquirer.prompt(
        {
            type: 'confirm',
            message: 'Would you like to return to the Menu?',
            name: 'confirm'
        }
    ).then(function(response) {
        if (response.confirm) {
            menu();
        } else {
            connection.end(); 
        }
    })
}

menu();
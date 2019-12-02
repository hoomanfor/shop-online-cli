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
    ['id', 'name', 'price']
];

function displayProducts() {
    connection.query("SELECT * FROM products", function(error, response) {
        if (error) throw error;
        response.forEach(function(element) {
            var row = [];
            row.push(element.id, element.product_name, "$" + element.price.toFixed(2));
            data.push(row);
            // console.log(element.id + " - " + element.product_name + " - " + element.price);
        })
    output = table(data);
    console.log(output);
    connection.end(); 
    })
}

displayProducts()
 
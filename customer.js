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
    ['id', 'name', 'price']
];

function displayProducts() {
    connection.query("SELECT * FROM products", function(error, response) {
        if (error) throw error;
        response.forEach(function(element) {
            var row = [];
            ids.push(element.id);
            row.push(element.id, element.product_name, "$" + element.price.toFixed(2));
            data.push(row);
            // console.log(element.id + " - " + element.product_name + " - " + element.price);
        })
    output = table(data);
    console.log(output);
    buy(); 
    })
}

function buy() {
    inquirer.prompt([
        {
            type: "number",
            message: "What is the ID # of the product you would like to purchase?",
            name: "id",
            validate: function(input) {
                if (ids.indexOf(input) == -1) {
                    return "You have entered an invalid product ID #"
                } else {
                    return true; 
                }
            }
        },
        {
            type: "number",
            message: "How many of this item would you like to purchase?",
            name: "quantity"
        }
    ]).then(function(response) {
        // console.log(response.id);
        // console.log(response.quantity);
        var id = response.id;
        var quantity = response.quantity;
        connection.query("SELECT * FROM products WHERE ?? = ?", [ "id", id ], function(error, response) {
            if (error) throw error;
            var inventory = response[0].stock_quantity;
            var price = response[0].price;
            var sales = response[0].product_sales;
            if (inventory < quantity) {
                console.log("Sorry, we do not have a quantity of " + quantity + " in stock.");
                console.log("Our current inventory of ID # " + id + " is " + inventory + "."); 
                buy();
            } else {
                inventory -= quantity;
                var total = quantity * price;
                sales += total; 
                connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: inventory
                    },
                    {
                        id: id
                    }
                ], function(error, response) {
                    console.log("Transaction complete! The total paid is $" + total.toFixed(2));
                    connection.end();
                });
                connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        product_sales: sales
                    },
                    {
                        id: id
                    }
                ], function(error, response) {
                })
            }
        })
    })
}

displayProducts();



 
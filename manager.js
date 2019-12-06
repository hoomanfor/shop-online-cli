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
        data = [
            ['id', 'name', 'price', 'inventory']
        ];
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
            case "Add to Inventory":
                connection.query("SELECT * FROM products", function(error, response) {
                    if (error) throw error;
                    var ids = [];
                    response.forEach(function(element) {
                        ids.push(element.id);
                    })
                    inquirer.prompt([
                        {
                            type: "number",
                            message: "What is the ID # of the product you would like to add inventory to?",
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
                            message: "How many are you adding to the inventory?",
                            name: "quantity"
                        }
                    ]).then(function(answers) {
                        var id = answers.id;
                        var quantity = answers.quantity;
                        connection.query("SELECT * FROM products WHERE ?",
                        {
                            id: id
                        }, function(error, response) {
                            var stock = response[0].stock_quantity;
                            stock += quantity; 
                            connection.query("UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: stock
                                },
                                {
                                    id: id
                                }
                            ], function(error, data) {
                                if (error) throw error; 
                                console.log("");
                                console.log("The new inventory of Product ID # " + id + " is " + stock + "!");
                                console.log("");
                                returnToMenu()
                            });
                        })
                    })
                })
            break;
            case "Add New Product":
                inquirer.prompt([
                    {
                        type: "input",
                        message: "What is the product name?",
                        name: "name"
                    },
                    {
                        type: "input",
                        message: "Which department does the product belong to?",
                        name: "dep"
                    },
                    {
                        type: "number",
                        message: "What is the unit cost of this product in USD?",
                        name: "price"
                    },
                    {
                        type: "number",
                        message: "What is the inventory count of this product?",
                        name: "inventory"
                    }
                ]).then(function(response) {
                    var name = response.name;
                    var dep = response.dep;
                    var price = response.price;
                    var inventory = response.inventory; 
                    var values = [[name, dep, price, inventory, 0]];
                    connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) VALUES ?", 
                    [values], function(error, response) {
                        if (error) throw error; 
                        console.log("");
                        console.log("New product added to the database!");
                        console.log("");
                        returnToMenu()
                    })
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
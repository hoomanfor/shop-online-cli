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
    ['department id', 'department name', 'overhead costs', 'product sales', 'total profit']
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
                var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, "
                query += "SUM(products.product_sales) AS product_sales, "
                query += "(departments.over_head_costs-SUM(products.product_sales)) AS total_profit "
                query += "FROM shop_db.departments "
                query += "INNER JOIN shop_db.products "
                query += "ON departments.department_name=products.department_name "
                query += "GROUP BY departments.department_id"
                connection.query(query, function(error, response) {
                    if (error) throw error;
                    response.forEach(function(element) {
                        var row = [];
                        row.push(element.department_id, element.department_name, "$" + element.over_head_costs.toFixed(2), 
                        "$" + element.product_sales.toFixed(2), "$" + element.total_profit.toFixed(2));
                        data.push(row);
                    })
                    output = table(data);
                    console.log(output);
                })
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
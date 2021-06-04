// dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');

// create the connection for the sql database
const connection = mysql.createConnection({
  host: 'localhost', 
  port: 3306,
  user: 'root',
  password: 'Dragging0-Karma-Plow',
  database: 'employees_db'
});

// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  start();
});

const start = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: "What would you like to do?",
      choices: [
        'Add Department',
        'Add Role',
        'Add Employee',
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Update Employee Role',
      ]
    })
    .then((answer) => {

    });
};


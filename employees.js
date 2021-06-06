// dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

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

// starts the CLI
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
      switch(answer.action) {
        case 'Add Department':
          addDepartment();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'View all Roles':
          viewAllRoles();
          break;
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
      }
    });
};

// define functions
const addDepartment = () => {

};

const addRole = () => {

};

const addEmployee = () => {
  inquirer
  .prompt([
    {
      name: 'firstName',
      type: 'input',
      message: "What is the employee's first name?"
    },
    {
      name: 'lastName',
      type: 'input',
      message: "What is the employee's last name?"
    },
    {
      name: 'role',
      type: 'rawlist',
      roles() {
        connection.query('SELECT * FROM role', (err, results) => {
          if (err) throw err;
          const roleArray = [];
          results.forEach(({ role_id }) => {
            roleArray.push(role_id);
          });
          return roleArray;
        });
      },
      message: "What is the employee's role?"
    },
    {
      name: 'manager',
      type: 'rawlist',
      // since there is no manager table, where to get manager info?
      managers() {
        connection.query('SELECT * FROM ', (err, results) => {
          if (err) throw err;
          const managerArray = [];
          results.forEach(({ manager_id }) => {
            managerArray.push(manager_id);
          });
          return managerArray;
        });
      },
      message: "Who is the employee's manager?"
    }
  ])
  .then((answer) => {
    connection.query(
      'INSERT INTO employee SET ?',
      {
        first_name: answer.firstName,
        last_name: answer.lastName,
        role_id: answer.role,
        manager_id: answer.manager,
      },
      (err) => {
        if (err) throw err;
        console.log(`Added ${answer.firstName} ${answer.lastName} to the database`);
        start();
      }
    )
  });
};

const viewAllDepartments = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

const viewAllRoles = () => {
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

const viewAllEmployees = () => {
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

const updateEmployeeRole = () => {

};
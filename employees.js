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
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Employee Role'
      ]
    })
    .then((answer) => {
      switch(answer.action) {
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
      }
    });
};

// define functions
const viewAllDepartments = () => {
  connection.query('SELECT department.id, department.name FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

const viewAllRoles = () => {
  connection.query('SELECT role.id, role.title, role.salary, role.department_id FROM role', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

const viewAllEmployees = () => {
  connection.query('SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id FROM employee', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

const addDepartment = () => {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: "What is the name of the department?",
    })
    .then((answer) => {
      connection.query(
        'INSERT INTO department SET ?',
        {
          name: answer.name
        },
        (err) => {
          if (err) throw err;
          console.log(`Added ${answer.name} Department to the database`);
          start();
        }
      );
    });
};  

const addRole = () => {
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: "What is title of the role?",
      },
      {
        name: 'salary',
        type: 'input',
        message: "What is salary of the role?",
      },
      {
        name: 'departmentId',
        type: 'input',
        message: "What is the department ID of the role?",
      }
    ])
    .then((answer) => {
      connection.query(
        'INSERT INTO role SET ?',
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId
        },
        (err) => {
          if (err) throw err;
          console.log(`Added ${answer.title} Role to the database`);
          start();
        }
      );
    });
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
        manager_id: answer.manager
      },  
      (err) => {
        if (err) throw err;
        console.log(`Added ${answer.firstName} ${answer.lastName} to the database`);
        start();
      }  
    )  
  });  
};  

const updateEmployeeRole = () => {

};
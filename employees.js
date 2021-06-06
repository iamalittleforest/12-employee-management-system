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
  connection.query('SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

const viewAllEmployees = () => {
  connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager_id FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id', (err, res) => {
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
      name: 'roleId',
      type: 'list',
      message: "What is the employee's role?",
      choices: roles()
    },  
    {
      name: 'managerId',
      type: 'list',
      message: "Who is the employee's manager?",
      choices: employees()  
    }  
  ])  
  .then((answer) => {
    connection.query(
      'INSERT INTO employee SET ?',
      {
        first_name: answer.firstName,
        last_name: answer.lastName,
        role_id: answer.roleId,
        manager_id: answer.managerId
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
  inquirer
  .prompt([
    {
      name: 'name',
      type: 'list',
      message: "Which employee's role do you want to update?",
      choices: employees()
    },
    {
      name: 'roleId',
      type: 'list',
      message: "What is the employee's new role?",
      choices: roles()
    }
  ])
  .then((answer) => {
    connection.query(
      'UPDATE role SET ? WHERE ?',
      [
        {
          title: answer.title
        },
        {
          id: answer.id
        }
      ],
      (err) => {
        if (err) throw err;
        console.log(`Updated ${answer.id}'s Role`);
        start();
      }
    );
  });
};

// functions used for addEmployee and updateEmployeeRole functions
const roles = () => {
  connection.query('SELECT * FROM role', (err, results) => {
    if (err) throw err;
    const roleArray = [];
    results.forEach(({ id }) => {
      roleArray.push(id);
    });  
    return roleArray;
  });  
};

const employees = () => {
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    const employeeArray = [];
    results.forEach(({ id }) => {
      employeeArray.push(id);
    });  
    return employeeArray;
  });
};
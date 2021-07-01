// dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require('util');
const cTable = require('console.table');

// create the connection for the sql database
const connection = mysql.createConnection({
  host: 'localhost', 
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME
});

// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  start();
});

// promisify all connection queries
connection.query = util.promisify(connection.query)

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
        'Delete Department',
        'Delete Role',
        'Delete Employee',
        'Update Employee Role',
        'Update Employee Manager',
        'Exit'
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
        case 'Delete Department':
          deleteDepartment();
          break;
        case 'Delete Role':
          deleteRole();
          break;
        case 'Delete Employee':
          deleteEmployee();
          break;        
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'Update Employee Manager':
          updateEmployeeManager();
          break;
        case 'Exit':
          connection.end();
          break;
      }
    });
};

// define view functions
const viewAllDepartments = () => {
  connection.query('SELECT department.id, department.name FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

const viewAllRoles = () => {
  connection.query('SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

const viewAllEmployees = () => {
  connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee AS manager RIGHT JOIN employee ON employee.manager_id = manager.id LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id`, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

// define add functions
const addDepartment = () => {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'What is the name of the department?',
    })
    .then((answer) => {
      connection.query(
        'INSERT INTO department SET ?',
        {
          name: answer.name
        },
        (err) => {
          if (err) throw err;
          console.log(`Added ${answer.name} department to the database`);
          start();
        }
      );
    });
};  

const addRole = async() => {
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'What is the title of the role?',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary of the role?',
      },
      {
        name: 'departmentId',
        type: 'list',
        message: 'What department is the role in?',
        choices: await departmentChoices()
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
          console.log(`Added ${answer.title} role to the database`);
          start();
        }
      );
    });
};  

const addEmployee = async() => {
  inquirer
  .prompt([
    {
      name: 'firstName',
      type: 'input',
      message: `What is the employee's first name?`
    },  
    {
      name: 'lastName',
      type: 'input',
      message: `What is the employee's last name?`
    },  
    {
      name: 'roleId',
      type: 'list',
      message: `What is the employee's role?`,
      choices: await roleChoices()
    },  
    {
      name: 'managerId',
      type: 'list',
      message: `Who is the employee's manager?`,
      choices: await employeeChoices()  
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

// define delete functions
const deleteDepartment = async() => {
  inquirer
    .prompt({
      name: 'departmentId',
      type: 'list',
      message: 'Which department do you want to remove?',
      choices: await departmentChoices()
    })
    .then((answer) => {
      connection.query(
        'DELETE FROM department WHERE ?',
        {
          id: answer.departmentId
        },
        (err) => {
          if (err) throw err;
          console.log('Removed department from the database');
          start();
        }
      );
    });
};

const deleteRole = async() => {
  inquirer
    .prompt({
      name: 'roleId',
      type: 'list',
      message: 'Which role do you want to remove?',
      choices: await roleChoices()
    })
    .then((answer) => {
      connection.query(
        'DELETE FROM role WHERE ?',
        {
          id: answer.roleId
        },
        (err) => {
          if (err) throw err;
          console.log('Removed role from the database');
          start();
        }
      );
    });
};

const deleteEmployee = async() => {
  inquirer
    .prompt({
      name: 'employeeId',
      type: 'list',
      message: 'Which employee do you want to remove?',
      choices: await employeeChoices()
    })
    .then((answer) => {
      connection.query(
        'DELETE FROM employee WHERE ?',
        {
          id: answer.employeeId
        },
        (err) => {
          if (err) throw err;
          console.log('Removed employee from the database');
          start();
        }
      );
    });
};

// define update functions
const updateEmployeeRole = async() => {
  inquirer
  .prompt([
    {
      name: 'id',
      type: 'list',
      message: `Which employee's role do you want to update?`,
      choices: await employeeChoices()
    },
    {
      name: 'roleId',
      type: 'list',
      message: `What is the employee's new role?`,
      choices: await roleChoices()
    }
  ])
  .then((answer) => {
    connection.query(
      'UPDATE employee SET ? WHERE ?',
      [
        {
          role_id: answer.roleId
        },
        {
          id: answer.id,
        }
      ],
      (err) => {
        if (err) throw err;
        console.log(`Updated employee's role`);
        start();
      }
    );
  });
};

const updateEmployeeManager = async() => {
  inquirer
  .prompt([
    {
      name: 'id',
      type: 'list',
      message: `Which employee's manager do you want to update?`,
      choices: await employeeChoices()
    },
    {
      name: 'managerId',
      type: 'list',
      message: `Who is the employee's new manager?`,
      choices: await employeeChoices()
    }
  ])
  .then((answer) => {
    connection.query(
      'UPDATE employee SET ? WHERE ?',
      [
        {
          manager_id: answer.managerId
        },
        {
          id: answer.id,
        }
      ],
      (err) => {
        if (err) throw err;
        console.log(`Updated employee's manager`);
        start();
      }
    );
  });
};

// query functions that pull choices 
const departmentChoices = async() => await connection.query('SELECT department.name AS name, department.id AS value FROM department ORDER BY name');

const roleChoices = async() => await connection.query('SELECT role.title AS name, role.id AS value FROM role ORDER by name');

const employeeChoices = async() => await connection.query(`SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS name, employee.id AS value FROM employee ORDER BY name`);

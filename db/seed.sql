-- department seeds --
INSERT INTO department (name)
VALUE ('Content');
INSERT INTO department (name)
VALUE ('Design');
INSERT INTO department (name)
VALUE ('Development');
INSERT INTO department (name)
VALUE ('Release and Management');

-- role seeds --
INSERT INTO role (title, salary, department_id)
VALUE ('Animator', 85000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ('Concept Artist', 95000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ('Game Designer', 90000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ('Level Designer', 80000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ('Story Designer', 70000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ('Game Developer', 110000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ('Project Manager', 120000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ('QA Engineer', 65000, 4);

-- employee seeds --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ('Amy', 'Dixon', 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ('Lindsey', 'Weaver', 7, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ('Derrick', 'Barton', 2, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ('Irvin', 'Gray', 6, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ('Tina', 'McKinney', 4, 10);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ('Don', 'Harrington', 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ('Juanita', 'Barnett', 3, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ('Armando', 'Griffith', 8, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ('Minnie', 'Manning', 5, 10);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ('Jacqueline', 'Burgess', 6, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ('Brett', 'Wong', 8, 9);
// inquirer for prompts/responses
// application start:
// view all departments
// add department
// view all roles
// add role
// view all employees
// add employee
// update employee role

// view all depts => 
// table showing dept names and dept id
// view all roles =>
// view all employees =>
// table showing employee id, first/last, job title, depts, salaries, managers
// add dept => enter new dept name; add to db
// add role => enter name, salary, dept; add to db
// add employee => enter first/last, role, manager; add to db
// update employee role => select employee, select new role; add to db

// for addRole() and addEmp() department and role prompt choices,
// use arrays populated with data from tables?

const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const { genDeptArr, genRoleArr, genEmpArr } = require('./helpers/helpers.js')

const connection = mysql2.createConnection(

    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'password',
        database: 'employees_db'
    },
    console.log(`Connected to the Employee database.`)
);

// console.log(genDeptArr(connection));


var deptsArr;
var roleArr;
var empArr;

const start = () => {

    deptsArr = genDeptArr(connection);
    // console.log('deptsArr', deptsArr);
    roleArr = genRoleArr(connection);
    // // console.log(roleArr, roleArr);
    empArr = genEmpArr(connection);
    // // console.log(roleArr, roleArr);
    inquirer.prompt(
        [
            {
                name: 'master_select_list',
                type: 'rawlist',
                message: 'What would you like to do?',
                choices: [
                    'VIEW ALL DEPARTMENTS',
                    'ADD DEPARTMENT',
                    'VIEW ALL ROLES',
                    'ADD ROLE',
                    'VIEW ALL EMPLOYEES',
                    'ADD EMPLOYEE',
                    'UPDATE EMPLOYEE ROLE',
                    'VIEW EMPLOYEES BY MANAGER',
                    'EXIT'
                ]
            }
        ]
    )
        .then(choice => {
            switch (choice.master_select_list) {
                case 'VIEW ALL DEPARTMENTS':
                    viewDepts();
                    break;

                case 'ADD DEPARTMENT':
                    addDept();
                    break;

                case 'VIEW ALL ROLES':
                    viewRoles();
                    break;

                case 'ADD ROLE':
                    addRole();
                    break;

                case 'VIEW ALL EMPLOYEES':
                    viewEmps();
                    break;

                case 'ADD EMPLOYEE':
                    addEmp();
                    break;

                case 'UPDATE EMPLOYEE ROLE':
                    updateEmp();
                    break;

                case 'VIEW EMPLOYEES BY MANAGER':
                    viewEmpMan();
                    break;

                case 'EXIT':
                    connection.end();
                    break;
            }
        })
}

const viewDepts = () => {
    console.log('test')
    connection.query(`SELECT * FROM departments`, (err, res) => {
        if (err) {
            console.error(err);
        }
        console.table(res);
        start();
    })
}

const addDept = () => {
    inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'Enter new department name.'
        }
    ])
        .then(response => {
            // console.log(response);
            connection.query(`INSERT INTO departments (name) VALUES ('${response.department}')`, (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    connection.query(`SELECT * FROM departments`, (err, res) => {
                        if (err) {
                            console.error(err);
                        } else {
                            // console.table(res);
                            console.log(`${response.department} department added.`)
                        }
                    });
                };
            });
            start();
        });
};

const viewRoles = () => {
    connection.query(`SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles INNER JOIN departments ON roles.department_id=departments.id`, (err, res) => {
        if (err) {
            console.error(err);
        }
        console.table(res);
        start();
    })
}

const addRole = () => {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Enter new role title.'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter new role salary.'
        },
        {
            name: 'department',
            type: 'rawlist',
            message: 'Select new role department.',
            choices: deptsArr
        }
    ])
        .then((responses) => {
            let deptID;
            connection.query(`SELECT * FROM departments`, (err, departments) => {
                // console.log(departments);
                if (err) {
                    console.error(err);
                }
                for (i = 0; i < departments.length; i++) {
                    if (responses.department === departments[i].name) {
                        deptID = departments[i].id;
                    }
                }
                connection.query(`INSERT INTO roles SET ?`, { title: responses.title, salary: responses.salary, department_id: deptID }, (err, res) => {
                    if (err) {
                        console.error(err);
                    } else {
                        connection.query(`SELECT * FROM roles`, (err, res) => {
                            if (err) {
                                console.error(err);
                            } else {
                                // console.table(res);
                                console.log(`${responses.title} role added.`)
                                // start();
                            }
                        });
                    };
                    start();
                }
                )
            })
        })
};

const viewEmps = () => {
    connection.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, employees.manager_id FROM employees INNER JOIN roles on employees.role_id=roles.id INNER JOIN departments ON departments.id=roles.department_id`, (err, res) => {
        if (err) {
            console.error(err);
        }
        console.table(res);
        start();
    })
}

const addEmp = () => {
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: "What is your new employee's first name?"
        },
        {
            name: 'last_name',
            type: 'input',
            message: "What is your new employee's last name?"
        },
        {
            name: 'title',
            type: 'rawlist',
            message: "What is your new employee's title?",
            choices: roleArr
        },
        {
            name: 'manager_name',
            type: 'rawlist',
            message: "Who is your new employee's manager?",
            choices: empArr
        }
    ])
        .then((response) => {
            // convertManagerInfo = () => {
            let manID;
            connection.query(`SELECT * FROM employees`, (err, employees) => {
                // console.log(employees);
                if (err) {
                    console.error(err);
                }
                for (i = 0; i < employees.length; i++) {
                    if (response.manager_name.includes(employees[i].last_name)) {
                        manID = employees[i].id;
                    }
                }

                let roleID;
                connection.query(`SELECT * FROM roles`, (err, roles) => {
                    // console.log(roles);
                    if (err) {
                        console.error(err);
                    }
                    for (i = 0; i < roles.length; i++) {
                        if (response.title === roles[i].title) {
                            roleID = roles[i].id;
                        }
                    }
                    // console.log(roleID);
                    connection.query(`INSERT INTO employees SET ?`, { first_name: response.first_name, last_name: response.last_name, role_id: roleID, manager_id: manID }, (err, res) => {
                        if (err) {
                            console.error(err);
                        } else {
                            connection.query(`SELECT * from employees`, (err, res) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    // console.table(res);
                                    console.log(`New employee added.`)
                                }
                            });
                        };
                        start();
                    });
                })
            })
        });

}

const updateEmp = () => {
    inquirer.prompt([
        {
            name: 'employee',
            type: 'rawlist',
            message: 'Which employee would you like to update?',
            choices: empArr
        },
        {
            name: 'new_title',
            type: 'rawlist',
            message: "What is your new employee's new title?",
            choices: roleArr
        }
    ])
        .then((responses) => {
            let empID;
            connection.query(`SELECT * FROM employees`, (err, employees) => {
                // console.log(employees);
                if (err) {
                    console.error(err);
                }
                for (i = 0; i < employees.length; i++) {
                    if (responses.employee.includes(employees[i].last_name)) {
                        empID = employees[i].id;
                    }
                }

                let roleID;
                connection.query(`SELECT * FROM roles`, (err, roles) => {
                    // console.log(roles);
                    if (err) {
                        console.error(err);
                    }
                    for (i = 0; i < roles.length; i++) {
                        if (responses.new_title === roles[i].title) {
                            roleID = roles[i].id;
                            // console.log(roleID);
                        }
                    }

                    connection.query(`UPDATE employees SET role_id = '${roleID}' WHERE id = '${empID}'`, (err, res) => {
                        if (err) {
                            console.error(err);
                        } else {
                            viewEmps()
                        };
                    })
                })

            })
        })
};

const viewEmpMan = () => {
    connection.query(
        `SELECT CONCAT(employees.first_name, " ", employees.last_name) AS name, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employees LEFT JOIN employees manager on manager.id=employees.manager_id`, (err, results) => {
            if (err) {
                console.error(err);
            } else {
                console.table(results);
            };
            start();
        }
    )
}

start();
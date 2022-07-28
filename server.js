const inquirer = require('inquirer');
const mysql2 = require('mysql2');
// imports helper functions
const { genDeptArr, genRoleArr, genEmpArr } = require('./helpers/helpers.js')

// creates connection to mysql database
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

// instantiate variables for returning departments, roles, employees arrays
var deptsArr;
var roleArr;
var empArr;

// starts app
const start = () => {

    // defines variables as arrays returned in helper functions
    deptsArr = genDeptArr(connection);
    roleArr = genRoleArr(connection);
    empArr = genEmpArr(connection);

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

// view departments function
const viewDepts = () => {
    // select and console.table everything in departments table
    connection.query(`SELECT * FROM departments`, (err, res) => {
        if (err) {
            console.error(err);
        }
        console.table(res);
        start();
    })
}

// add department function
const addDept = () => {
    inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'Enter new department name.'
        }
    ])
        .then(response => {
            // inserts new department name into departments table
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

// view roles function
const viewRoles = () => {
    // returns a table with role id, role title, role salary, and department name
    connection.query(`SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles INNER JOIN departments ON roles.department_id=departments.id`, (err, res) => {
        if (err) {
            console.error(err);
        }
        console.table(res);
        start();
    })
}

// function to add role
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
            // returns departments array as choices
            choices: deptsArr
        }
    ])
        .then((responses) => {
            // instantiate department id variable
            // used to convert department name into department id
            let deptID;
            connection.query(`SELECT * FROM departments`, (err, departments) => {
                // console.log(departments);
                if (err) {
                    console.error(err);
                }
                // iterate through departments object array
                for (i = 0; i < departments.length; i++) {
                    // if department response === a department name in the array of objects
                    if (responses.department === departments[i].name) {
                        // var deptID = that department's id
                        deptID = departments[i].id;
                    }
                }
                // insert responses into roles table
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

// view employees function
const viewEmps = () => {
    // returns table with employee id, employee names, employee title, department name, salary, and manager id
    connection.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, employees.manager_id FROM employees INNER JOIN roles on employees.role_id=roles.id INNER JOIN departments ON departments.id=roles.department_id`, (err, res) => {
        if (err) {
            console.error(err);
        }
        console.table(res);
        start();
    })
}

// add employee function
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
            // returns roles array as choices
            choices: roleArr
        },
        {
            name: 'manager_name',
            type: 'rawlist',
            message: "Who is your new employee's manager?",
            // returns employees array as choices
            choices: empArr
        }
    ])
        .then((response) => {
            // instantiate manager id variable
            // used to convert manager name to manager id
            let manID;
            connection.query(`SELECT * FROM employees`, (err, employees) => {
                if (err) {
                    console.error(err);
                }
                // iterates through array of employee objects
                for (i = 0; i < employees.length; i++) {
                    // if manager name response includes employee last name from an object in the array
                    if (response.manager_name.includes(employees[i].last_name)) {
                        // manID = that employee's id number
                        manID = employees[i].id;
                    }
                }

                // instantiate role id variable
                // used to convert role title into role id
                let roleID;
                connection.query(`SELECT * FROM roles`, (err, roles) => {
                    if (err) {
                        console.error(err);
                    }
                    // iterates through array of roles objects
                    for (i = 0; i < roles.length; i++) {
                        // if title response === title in a role object
                        if (response.title === roles[i].title) {
                            // roleID = that role's id
                            roleID = roles[i].id;
                        }
                    }
                    // inserts new employee into employees table
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

// update employee function
const updateEmp = () => {
    inquirer.prompt([
        {
            name: 'employee',
            type: 'rawlist',
            message: 'Which employee would you like to update?',
            // returns employee array as choices
            choices: empArr
        },
        {
            name: 'new_title',
            type: 'rawlist',
            message: "What is your new employee's new title?",
            // returns roles array as choices
            choices: roleArr
        }
    ])
        .then((responses) => {
            // instantiate employee id variable
            let empID;
            connection.query(`SELECT * FROM employees`, (err, employees) => {
                // console.log(employees);
                if (err) {
                    console.error(err);
                }
                // iterate through employee objects
                for (i = 0; i < employees.length; i++) {
                    // if employee response name includes a last name in an employee object
                    if (responses.employee.includes(employees[i].last_name)) {
                        // empID = that object's id
                        empID = employees[i].id;
                    }
                }
                // see lines 266-278
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
                    // update employee's role id where that employee's id = empID
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

// view employee by manager function
const viewEmpMan = () => {
    // returns table with concatenated employee name and concatenated manager name
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
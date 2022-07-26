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
const genDeptArr = require('./helpers/helpers.js')

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

let deptsArr = genDeptArr(connection);
// console.log('deptsArr', deptsArr);

const start = () => {
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

                case 'EXIT':
                    break;
            }
        })
}

const viewDepts = () => {
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
                }
                console.log(`${response.department} department added.`)

            })
            start();
        })
}

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
        .then((response) => {
            console.log(response);
            start();
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

}

const updateEmp = () => {

}

start();
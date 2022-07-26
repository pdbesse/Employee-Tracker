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

const inquirer = require('inquirer');
const mysql2 = require('mysql2');

const connection = mysql2.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'password',
        database: 'employees'
    },
    console.log(`Connected to the Employee database.`)
);

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
    connection.query('SELECT * FROM departments', (err, res) => {
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
        connection.query('INSERT INTO departments', {name: response.name}), (err, res) => {
            if (err) {
                console.error(err);
            }
            console.log(`${res} department added.`)
            start();
        }
    })
}

const viewRoles = () => {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) {
            console.error(err);
        }
        console.table(res);
        start();
    })
}

const addRole = () => {

}

const viewEmps = () => {
    connection.query('SELECT * FROM employees', (err, res) => {
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
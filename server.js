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

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'password',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );


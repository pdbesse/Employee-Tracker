// generate departments array function
const genDeptArr = (connection) => {
    // instantiate empty departments array
    let deptArr = [];
    // selects all departments
    connection.query(`SELECT * FROM departments`, (err, departments) => {
        if (err) {
            console.error(err);
        }
        // iterates through department objects
        for (i = 0; i < departments.length; i++) {
            // pushes department name to deptArr
            deptArr.push(departments[i].name);
        };
    });
    // function returns the department name array
    return deptArr;
};

// generate role array function
const genRoleArr = (connection) => {
    // instantiate empy roles array
    let roleArr = [];
    // selects all roles
    connection.query(`SELECT * FROM roles`, (err, roles) => {
        if (err) {
            console.error(err);
        }
        // iterates through roles objects
        for (i = 0; i < roles.length; i++) {
            // pushes role title to roles titles array
            roleArr.push(roles[i].title);
        };
    });
    // function returns the roles titles array
    return roleArr;
};

// function to generate employees array
const genEmpArr = (connection) => {
    // instantiate empty employees array
    let empArr = [];
    // selects all employees
    connection.query(`SELECT * FROM employees`, (err, employees) => {
        if (err) {
            console.error(err);
        }
        // iterates through employee objects
        for (i = 0; i < employees.length; i++) {
            // pushes concatenated employee names to employee names array
            empArr.push(employees[i].first_name + " " + employees[i].last_name);
        };
    });
    // function returns employee names array
    return empArr;
};

// export helper functions
module.exports = {genDeptArr, genRoleArr, genEmpArr};
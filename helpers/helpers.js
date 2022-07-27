const genDeptArr = (connection) => {
    let deptArr = [];
    connection.query(`SELECT * FROM departments`, (err, departments) => {
        // console.log(departments);
        if (err) {
            console.error(err);
        }
        for (i = 0; i < departments.length; i++) {
            deptArr.push(departments[i].name);
        };
    });
    // console.log('helper', deptArr);
    return deptArr;
};

const genRoleArr = (connection) => {
    let roleArr = [];
    connection.query(`SELECT * FROM roles`, (err, roles) => {
        // console.log(roles);
        if (err) {
            console.error(err);
        }
        for (i = 0; i < roles.length; i++) {
            roleArr.push(roles[i].title);
        };
    });
    // console.log('helper', roleArr);
    console.log(roleArr);
    return roleArr;
};

const genEmpArr = (connection) => {
    let empArr = [];
    connection.query(`SELECT * FROM employees`, (err, employees) => {
        // console.log(employees);
        if (err) {
            console.error(err);
        }
        for (i = 0; i < employees.length; i++) {
            empArr.push(employees[i].first_name + " " + employees[i].last_name);
        };
    });
    // console.log('helper', empArr);
    return empArr;
};

module.exports = {genDeptArr, genRoleArr, genEmpArr};
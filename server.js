const express = require ('express');
// Import and require mysql2
const mysql = require ('mysql2');
const { inherits } = require('util');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3000;
const app = express();

// Express middleware 
app.use(express.urlencoded({ extended: false})); 
app.use(express.json());

const db = mysql.createConnection (
    {
        host: 'localhost',
        user: 'root',
        password: 'QuynhTan02_14',
        database: 'employment_db'
    },
    console.log(`Connected to the employment_db database.`)
);

const questions = async () => {
 let ask = await inquirer.prompt ([
    {
        type: 'list', 
        name: 'choice',
        message: 'What Would You Like To Do?',
        choices: ['View Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View Department', 'Add Department'],
    }]);

switch (ask) {
    case 'View Employees':
        viewEmployee()
        break 
    case 'Add Employee':
        addEmployee()
        break 
    case 'Update Employee Role':
        updateEmployee()
        break 
    case 'View All Roles':
        viewRole()
        break
    case 'Add Role': 
        addRole()
        break
    case 'View Department': 
        viewDepartment()
        break
    case 'Add Department': 
        addDepartment()
        break
} 
};

questions();

viewEmployee = () => {
    db.query('SELECT * FROM employee;',  (err, results) => {
        console.log(results);
        questions();
    } )
};

addEmployee = async () => {
    let roles = await db.query('SELECT * FROM d_role;');
    let managers = await db.query('SELECT * FROM employee');
    let answer = inquire.prompt ([
            {
                type: 'input', 
                name: 'firstName', 
                message: 'What is the first name of employee?'
            },
            {
                type: 'input', 
                name: 'lastName', 
                message: 'What is the last name of employee?'
            },
            {
                type: 'list', 
                name: 'roleId', 
                message: 'What is the role of the employee?', 
                choices: roles.map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    }
                })
            },
            {
                type: 'list',
                name: 'employeeManager',
                message: "Who is the manager of the employee?",
                choices: managers.map((manager) => {
                    return {
                        name: manager.first_name + " " + manager.last_name,
                        value: manager.id
                    }
                })
            }

        ])

        let result = await db.query('INSERT INTO employee SET ?', {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.roleId,
            manager_id: answer.employeeManager
        });

        console.log(`${answer.firstName} ${answer.lastName} is added to the list`)
    };

updateEmployee = async () => {
    let employee = await db.query('SELECT * FROM employee;');
    let pickEmployee = inquire.prompt([
        {
            type: 'list',
            name: 'name', 
            message: 'Which employee do you want to update?',
            choices: employee.map((employeeName) => {
                return{
                name: employeeName.first_name + " " + employeeName.last_name,
                value: employeeName.id
                }
            })
        }
    ]);
    let roles = await db.query('SELECT * FROM role;');

    let update = inquire.prompt([
        {
            type: 'list', 
            name: 'role', 
            message: 'Which role do you want to update?',
            choices: roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
        }
    ]);

    let result = await db.query('UPDATE employee SET ? WHERE ?', [{role_id: update.role}, {id: pickEmployee.name}]);

    console.log(`${answer.name} is updated to the list`);
}

viewRole = async () => {
    db.query('SELECT tile, salary, department_id FROM d_role;',  (err, results) => {
        console.log(results);
    })
};

addRole = async () => {
    let department = await db.query('SELECT * FROM department;');
    let answer = await inquire.prompt([
        {
            type: 'input',
            name: 'newRole', 
            message: 'What is the name of the new role?'
        },
        {
            type: 'input', 
            name: 'salary', 
            message: 'What is the salary for this role?'
        },
        {
            type: 'list',
            name: 'id',
            message: 'What is the id for this role?', 
            choices: department.map((newId) => {
                return {
                    name: newId.d_name, 
                    value: newId.id
                }
            })
        }
    ]);

    let result = await db.query('INSERT INTO role SET?', {
        title: answer.newRole, 
        salary: answer.salary,
        d_id: answer.id
    })

    console.log(`${answer.newRole} added to the list`);
};

viewDepartment = async () => {
    db.query('SELECT * FROM department', (err, result) => {
        console.log(result);
    });
};

addDepartment = async () => {
    let answer = await inquire.prompt ([
        {
            type: 'input', 
            name: 'departmentName', 
            message: 'What is the department name?'
        }
    ]);
    let result = await db.query('INSERT INTO department SET?', {
        d_name: answer.departmentName
    });

    console.log(`${answer.departmentName} added to the list`);
}

app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
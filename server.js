const express = require ('express');
// Import and require mysql2
const mysql = require ('mysql2');
const { inherits } = require('util');
const inquirer = require('inquirer');
const { table } = require('console');
const { start } = require('repl');

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
 const ask = await inquirer.prompt ([
    {
        type: 'list', 
        name: 'choice',
        message: 'What Would You Like To Do?',
        choices: ['View Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View Department', 'Add Department'],
    }]);

switch (ask.choice) {
    case 'View Employees':
        viewEmployee();
        break 
    case 'Add Employee':
        addEmployee();
        break 
    case 'Update Employee Role':
        updateEmployee();
        break 
    case 'View All Roles':
        viewRole();
        break
    case 'Add Role': 
        addRole();
        break
    case 'View Department': 
        viewDepartment();
        break
    case 'Add Department': 
        addDepartment();
        break
} 
};

questions();

viewEmployee = () => {
    db.query('SELECT * FROM employee;',  (err, results) => {
        console.log(results);
        console.table(results);
    } )
    questions();
};

addEmployee = async () => {
    const roles = await db.promise().query('SELECT DISTINCT title, id FROM d_role;');
    // console.log(roles[0]);
    const managers = await db.promise().query('SELECT * FROM employee;');
    // console.log(managers);
    
    const answer =  await inquirer.prompt([
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
                choices: roles[0].map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    };
                })
            },
            {
                type: 'list',
                name: 'employeeManager',
                message: "Who is the manager of the employee?",
                choices: managers[0].map((manager) => {
                    return {
                        name: manager.first_name + " " + manager.last_name,
                        value: manager.id
                    }
                })
            }

        ])

        const result = await db.promise().query('INSERT INTO employee SET ?', {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.roleId,
            manager_id: answer.employeeManager
        });

        console.log(`${answer.firstName} ${answer.lastName} is added to the list`);
        console.table(result);
        questions();
    };

updateEmployee = async () => {
    const employee = await db.promise().query('SELECT * FROM employee;');
    
    const pickEmployee = await inquirer.prompt([
        {
            type: 'list',
            name: 'name', 
            message: 'Which employee do you want to update?',
            choices: employee[0].map((employeeName) => {
                return{
                name: employeeName.first_name + " " + employeeName.last_name,
                value: employeeName.id
                }
            })
        }
    ]);
    const roles = await db.promise().query('SELECT * FROM d_role;');

    const update = await inquirer.prompt([
        {
            type: 'list', 
            name: 'role', 
            message: 'Which role do you want to update?',
            choices: roles[0].map((role) => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
        }
    ]);

    const result = await db.promise().query('UPDATE employee SET ? WHERE ?', [{role_id: update.role}, {id: pickEmployee.name}]);

    console.log(`${pickEmployee.name} is updated to the list`);
    questions();
}

viewRole = async () => {
    db.query('SELECT * FROM d_role;',  (err, results) => {
        console.table(results);
    })
    questions();
};

addRole = async () => {
    const department = await db.promise().query('SELECT * FROM department;');
    const answer = await inquirer.prompt([
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
            choices: department[0].map((newId) => {
                return {
                    name: newId.d_name, 
                    value: newId.id
                }
            })
        }
    ]);

    const result = await db.promise().query('INSERT INTO d_role SET?', {
        title: answer.newRole, 
        salary: answer.salary,
        id: answer.id
    })

    console.log(`${answer.newRole} added to the list`);
    questions();
};

viewDepartment = () => {
    db.query('SELECT * FROM department', (err, result) => {
        console.table(result);
    });
    questions();
};

addDepartment = async () => {
    const answer = await inquirer.prompt ([
        {
            type: 'input', 
            name: 'departmentName', 
            message: 'What is the department name?'
        }
    ]);
    const result = await db.promise().query('INSERT INTO department SET?', {
        d_name: answer.departmentName
    });

    console.log(`${answer.departmentName} added to the list`);
    console.table(result);
    questions();
}

app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
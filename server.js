const express = require ('express');
// Import and require mysql2
const mysql = require ('mysql2');

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

const questions = () => {
    return inquirer.prompt ([
    {
        type: 'list', 
        name: 'choice',
        message: 'What Would You Like To Do?',
        choices: ['View Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View Department', 'Add Department'],
    }])
}

switch (choices) {
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

viewEmployee = () => {
    db.query('SELECT employee.first_name, employee.last_name, employee.id, d_role.title AS name,  FROM employee JOIN employee ON d_role.employee = employee.view',  (err, results) => {
        console.log(results);
    } )
}

addEmployee = () => {
    db.query (`SELECT employee.id AS 'employeeID', CONCAT (employee.first_name, ' ', employee.last_name) AS name FROM employee `, (err, results) => {
        console.log(results);
    })
    db.query('SELECT * FROM role', (err, results) => {
        prompt ([
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
                name: 'role', 
                message: 'What is the role of the employee?', 
                choices: []
            }, 

        ])
    })
}

app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
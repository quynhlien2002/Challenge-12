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




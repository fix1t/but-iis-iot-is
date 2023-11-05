const express = require('express');
const router = express.Router();
const connection = require('./db');

// Create table
router.get('/createusertable', (req, res) => {
    let sql = 'CREATE TABLE User (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(255), mail VARCHAR(255), bio TEXT, created TIMESTAMP NOT NULL DEFAULT NOW())';
    connection.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send('User Table Created...');
    });
});

// Drop table
router.get('/deleteusertable', (req, res) => {
    let sql = 'DROP TABLE User';
    connection.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send('User Table Droped...');
    });
});

// Insert user
router.get('/adduser', (req, res) => {
    let user = {username:'Gabos', mail:'astrofix@vutbr.cz', bio: 'Hmmmmmmmmm'};
    let sql = 'INSERT INTO User SET ?';
    connection.query(sql, user, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send('User Added');
    });
});

// Select users
router.get('/getusers', (req, res) => {
    let sql = 'SELECT * FROM User';
    connection.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(result)
        res.send('Users fetched..');
    });
});

// Select single user
router.get('/getuser/:id', (req, res) => {
    let sql = `SELECT * FROM User WHERE id = ${req.params.id}`;
    connection.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(result)
        res.send('User fetched..');
    });
});

module.exports = router;
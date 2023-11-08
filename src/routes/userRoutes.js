const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create table
router.get('/createusertable', (req, res) => {
    let sql = 'CREATE TABLE User (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(255), mail VARCHAR(255), role ENUM(\'Admin\', \'Registered\'), bio TEXT, created TIMESTAMP NOT NULL DEFAULT NOW())';
    db.query(sql, (error, result) => {
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
    db.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send('User Table Droped...');
    });
});

// Insert user
router.post('/adduser', (req, res) => {
    const { username, email, bio } = req.body;
    let user = { username, mail: email, role: 'Registered', bio };

    let sql = 'INSERT INTO User SET ?';
    db.query(sql, user, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.redirect('/');
    });
});

// Delete user
router.delete('/users/:id', (req, res) => {
    let sql = `DELETE FROM User WHERE id = ${req.params.id}`;
    db.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).send('User deleted successfully');
    });
});

// Select users
router.get('/getusers', (req, res) => {
    let sql = 'SELECT * FROM User';
    db.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(result);
    });
});

// Select single user
router.get('/getuser/:id', (req, res) => {
    let sql = `SELECT * FROM User WHERE id = ${req.params.id}`;
    db.query(sql, (error, result) => {
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
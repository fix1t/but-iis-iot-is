const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Register user
router.post('/register', (req, res) => {
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

// Select all users
router.get('/users/get', (req, res) => {
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
router.get('/users/:id', (req, res) => {
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
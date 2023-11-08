const express = require('express');
const fileRouter = express.Router();
const path = require('path');

fileRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

fileRouter.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, '../users.html'));
});

fileRouter.get('/style.css', function(req, res) {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, '../style.css'));
});

fileRouter.get('/user.js', function(req, res) {
    res.setHeader('Content-Type', 'text/js');
    res.sendFile(path.join(__dirname, '../user.js'));
});

module.exports = fileRouter;
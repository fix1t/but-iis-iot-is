//import express from 'express';
const express = require('express');
const db = require('./db');
const routes = require('./routes');

const app = express();
const port = 8000;

app.use('/', routes);

app.get('/', (req, res) => { res.send('<h1 style="color:blue">HomePage</h1>') });

// Close the connection when the application is shutting down
process.on('SIGINT', () => {
    db.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection:', err.stack);
        }
        console.log('MySQL connection closed.');
        process.exit(0);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
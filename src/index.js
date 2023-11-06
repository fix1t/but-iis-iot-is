const express = require('express');
const db = require('./db');
const routes = require('./routes');
const path = require('path');

const app = express();
const port = 8000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', routes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// Close the connection when the application is shutting down
process.on('SIGINT', () => {
    db.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection:', err.stack);
        } else {
            console.log('MySQL connection closed.');
        }
        process.exit(err ? 1 : 0);
    });
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'iis-project-db-but-iis-iot.a.aivencloud.com',
    user: 'fituser',
    port: '24776',
    password: 'AVNS_y267I2ZS8e6KG-UdTz9',
    database: 'iot',
});

// Connect
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id', connection.threadId);
});

module.exports = connection;
import express from 'express'
import db from './config/db.js'
import fileRoutes from './routes/files-routes.js'
import userRoutes from './routes/users-routes.js'
import path from 'path'

const app = express();
const port = 8000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(path.resolve(), 'public')));

app.use('/', fileRoutes);
app.use('/api/users', userRoutes);

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

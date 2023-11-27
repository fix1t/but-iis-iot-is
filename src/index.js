import express from 'express'
import cookieParser from 'cookie-parser';
import db from './config/db.js'
import fileRoutes from './routes/files-routes.js'
import userRoutes from './routes/users-routes.js'
import systemRoutes from './routes/systems-routes.js'
import userSystemRoutes from './routes/users-systems-routes.js'
import deviceRoutes from './routes/devices-routes.js'
import typeRoutes from './routes/types-routes.js'
import Broker from './models/broker-model.js'
import path from 'path'

const app = express();
const port = 8000;

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(path.resolve(), 'public')));

app.use('/', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/systems', systemRoutes);
app.use('/api/user/system', userSystemRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/types', typeRoutes);

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

// Call simulateBroker every hour
setInterval(async () => {
	try {
		await Broker.simulateBroker();
	} catch (error) {
		console.error('An error occurred:', error);
	}
},61 * 60 * 1000);


app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));

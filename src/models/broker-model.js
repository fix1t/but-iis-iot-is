import db from '../config/db.js';

class Broker {
	static async simulateBroker() {
		// Fetch all devices and their corresponding parameters in a single query
		const [deviceParameters] = await db.promise().query(`
			SELECT Devices.id AS device_id, Parameters.id AS parameter_id, Parameters.type_id
			FROM Devices
			JOIN Parameters ON Devices.type_id = Parameters.type_id
		`);
		// Prepare an array to hold the insert commands
		const inserts = [];
	
		for (const { device_id, parameter_id, type_id } of deviceParameters) {
			// Fetch the last written value for the current device-parameter pair
			const [lastValues] = await db.promise().query('SELECT value FROM DeviceParameters WHERE device_id = ? AND parameter_id = ? ORDER BY recorded_at DESC LIMIT 1', [device_id, parameter_id]);
			const lastValue = lastValues.length > 0 ? parseFloat(lastValues[0].value) : 0;
	
			// Generate a random value between 0 and 10
			let randomValue = Math.floor(Math.random() * 11);
	
			// Generate a random boolean
			let isAdding = Math.random() < 0.5;
	
			// Ensure that the value stays between 0 and 100
			if (lastValue < 10) {
				isAdding = true;
			} else if (lastValue > 90) {
				isAdding = false;
			}
			// Add or subtract the random value based on the random boolean
			const value = isAdding ? lastValue + randomValue : lastValue - randomValue;

			// Prepare an SQL command to insert the new value
			inserts.push(`(${device_id}, ${parameter_id}, ${value})`);
			console.log(`device_id: ${device_id}, parameter_id: ${parameter_id}, value: ${value}`);
		}
		// Execute all the insert commands in a single query
		await db.promise().query(`
			INSERT INTO DeviceParameters(device_id, parameter_id, value)
			VALUES ${inserts.join(', ')}
		`);
	}	
}
export default Broker;

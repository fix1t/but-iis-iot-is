import db from '../config/db.js';
/*
class Broker {

	static async simulateBroker() {
		// Fetch all devices
		const [devices] = await db.promise().query('SELECT * FROM Devices');
	
		for (const device of devices) {
			// Fetch all parameters for the current device type
			const [parameters] = await db.promise().query('SELECT * FROM Parameters WHERE type_id = ?', [device.type_id]);
	
			for (const parameter of parameters) {
				// Generate a random value between 0 and 100
				const value = Math.floor(Math.random() * 101);
	
				// Insert the generated value into the DeviceParameters table
				console.log(device.id, parameter.id, value);
				await db.promise().query('INSERT INTO DeviceParameters(device_id, parameter_id, value) VALUES (?, ?, ?)', [device.id, parameter.id, value]);
			}
		}
	}
*/
class Broker {
	static async simulateBroker() {
		// Fetch all devices
		const [devices] = await db.promise().query('SELECT * FROM Devices');
	
		for (const device of devices) {
			// Fetch all parameters for the current device type
			const [parameters] = await db.promise().query('SELECT * FROM Parameters WHERE type_id = ?', [device.type_id]);
	
			for (const parameter of parameters) {
				// Fetch the last written value for the current device-parameter pair
				const [lastValues] = await db.promise().query('SELECT value FROM DeviceParameters WHERE device_id = ? AND parameter_id = ? ORDER BY recorded_at DESC LIMIT 1', [device.id, parameter.id]);
				const lastValue = lastValues.length > 0 ? parseFloat(lastValues[0].value) : 0;
	
				// Generate a random value between 0 and 10
				let randomValue = Math.floor(Math.random() * 5);
				console.log(randomValue);
	
				// Add the random value to the last written value
				console.log( device.id, parameter.id, lastValue);
				// Generate a random boolean
				let isAdding = Math.random() < 0.5;
				// ensure that the value stays between 0 and 100
				if (lastValue < 10 ){
					isAdding = true;
				}
				else if (lastValue > 90){
					isAdding = false;
				}
				// Add or subtract the random value based on the random boolean
				const value = isAdding ? lastValue + randomValue : lastValue - randomValue;
	
				// Insert the updated value into the DeviceParameters table
				console.log(device.id, parameter.id, value);
				await db.promise().query('INSERT INTO DeviceParameters(device_id, parameter_id, value) VALUES (?, ?, ?)', [device.id, parameter.id, value]);
			}
		}
	}

	/*
	static async simulateBroker() {
		// Fetch all devices
		const [results] = await db.promise().query(`
		SELECT Devices.*, Parameters.* 
		FROM Devices 
		JOIN Types ON Devices.type_id = Types.id 
		JOIN Parameters ON Types.id = Parameters.type_id
	`);

		for (const result of results) {
			// Generate a random value between 0 and 100
			const value = Math.floor(Math.random() * 101);

			// Insert the generated value into the DeviceParameters table
			console.log(result.device_id, result.parameter_id, value);
			//await db.promise().query('INSERT INTO DeviceParameters(device_id, parameter_id, value) VALUES (?, ?, ?)', [result.device_id, result.parameter_id, value]);
		}
	}
	*/
}

export default Broker;

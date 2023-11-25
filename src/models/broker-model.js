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
                await db.promise().query('INSERT INTO DeviceParameters(device_id, parameter_id, value) VALUES (?, ?, ?)', [device.id, parameter.id, value]);
            }
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
				// Generate a random value between 0 and 100
				const value = Math.floor(Math.random() * 101);
	
				// Insert the generated value into the DeviceParameters table
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

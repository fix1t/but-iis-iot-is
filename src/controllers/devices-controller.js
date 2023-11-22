import Device from '../models/device-model.js';
import System from '../models/system-model.js';
import { login } from './files-controller.js';

export const createDeviceInSystem = async (req, res) => {
	const user = req.user;
	const { name, type_id, system_id, description, userAlias } = req.body;

	// Check requirred fields
	if (!name || !type_id || !system_id) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	//TODO: Check if the user has access to the system

	const device = new Device(user.id, type_id, name, description, userAlias);

	try {
		console.log('Creating device');
		await device.save();
		// await System.addDeviceToSystem(system_id, device.id);
		res.status(201).json({ message: 'Device created successfully' });
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

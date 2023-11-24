import Device from '../models/device-model.js';
import Parameter from '../models/parameter-model.js';
import System from '../models/system-model.js';
import Type from '../models/type-model.js';
import { ERROR, INFO } from '../utils/logger.js';

export const createDevice = async (req, res) => {
	const user = req.user;
	const systemId = req.params.system_id;
	const { name, type_id, description, userAlias } = req.body;

	INFO(`Creating device ${name} in system ${systemId}`);

	// Check requirred fields
	if (!name || !type_id || !user) {
		ERROR(`Missing required fields`);
		return res.status(400).json({ error: 'Missing required fields' });
	}

	// Check if the type_id is valid
	if (!(await Type.findById(type_id))) {
		ERROR(`Invalid type_id`);
		return res.status(400).json({ error: 'Invalid type_id' });
	}

	const device = new Device(user.id, type_id, name, description, userAlias);

	try {
		// Save the device
		await device.save();
		await device.getId();

		// Get the type parameters
		const parameters = await Parameter.findByTypeId(type_id);

		// Add the parameters to the device
		for (const parameter of parameters) {
			device.addParameter(parameter.id);
		}

		// Add the device to the system
		if (systemId) {
			await System.addDeviceToSystem(systemId, device.id);
		}

		await res.status(201).json({ message: 'Device created successfully', device_id: device.id });
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export const getMyDevices = async (req, res) => {
	const user = req.user;

	try {
		const devices = await Device.findByOwnerId(user.id);
		res.status(200).json(devices);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export const getDeviceById = async (req, res) => {
	const deviceId = req.params.device_id;

	try {
		const device = await Device.findById(deviceId);
		res.status(200).json(device);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export const updateDevice = async (req, res) => {
	const { name, description, user_alias } = req.body;
	const user = req.user;
	let deviceToUpdate;
	try {
		deviceToUpdate = await Device.findById(req.params.device_id);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
	if (!deviceToUpdate) {
		res.status(404).json({ error: 'Device not found' });
		return;
	}
	if (deviceToUpdate.owner_id !== user.id && !user.isAdmin) {
		res.status(401).json({ error: 'You do not have sufficient rights to edit this device' });
		return;
	}

	deviceToUpdate.name = name;
	deviceToUpdate.description = description;
	deviceToUpdate.user_alias = user_alias;
	try {
		await deviceToUpdate.update();
		res.status(200).json({ message: 'Device updated successfully' });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export const deleteDevice = async (req, res) => {
	const user = req.user;
	const deviceId = req.params.device_id;
	console.log(req.params.owner_id);
	console.log(user.id);
	let deviceToDelete;
	try {
		deviceToDelete = await Device.findById(deviceId);
		console.log(deviceToDelete);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
	if (!deviceToDelete) {
		res.status(404).json({ error: 'Device not found' });
		return;
	}
	if (deviceToDelete.owner_id !== user.id && !user.isAdmin) {
		res.status(401).json({ error: 'You are not the owner. Only owner can delete a device.' });
		return;
	}
	console.log(user.id, deviceToDelete.owner_id);
	try {
		await Device.deleteById(deviceToDelete.id);
		res.status(200).json({ message: 'Device deleted successfully' });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export const getAllTypes = async (req, res) => {
	try {
		const types = await Type.findAll();
		res.status(200).json(types);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

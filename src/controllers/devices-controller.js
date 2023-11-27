import Device from '../models/device-model.js';
import Parameter from '../models/parameter-model.js';
import System from '../models/system-model.js';
import User from '../models/user-model.js';
import Type from '../models/type-model.js';
import Broker from '../models/broker-model.js';
import { DEBUG, ERROR, INFO } from '../utils/logger.js';

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
		if (parameters) {
			// Get the current date/time in UTC
			let nowUtc = new Date();

			// Subtract one hour
			nowUtc.setHours(nowUtc.getHours());

			// Format to MySQL's datetime format
			let nowUtcFormatted = nowUtc.toISOString().slice(0, 19).replace('T', ' ');
			
			for (const parameter of parameters) {
				device.addParameter(parameter.id, nowUtcFormatted);
			}
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
    const user = req.user;
    const deviceId = req.params.device_id;
    try {
        const device = await Device.findById(deviceId);
        const isOwner = device.owner_id === user.id || user.is_admin;
        DEBUG(`[getDeviceById] User ${user.id} is owner of device ${deviceId}: ${isOwner}, ${device.owner_id} , ${user.id} , ${user.is_admin}`)

        // Fetch the type name
        const type = await Type.findById(device.type_id);

        // Fetch the owner name
        const owner = await User.findById(device.owner_id);

		Broker.simulateBroker();
		
        res.status(200).json({ ...device, isOwner, type_name: type.name, owner_name: owner.username });
    } catch (error) {
        console.error('Error executing query:', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getFreeDevices = async (req, res) => {
	try {
		const device = await Device.findAllFree();
		res.status(200).json(device);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export const getMyFreeDevices = async (req, res) => {
	const user = req.user;
	try {
		const device = await Device.findAllMyFree(user.id);
		res.status(200).json(device);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export const addDeviceToSystem = async (req, res) => {
	const systemId = req.params.system_id;
	const { device_id } = req.body;

	try {
		const device = await Device.findById(device_id);
		await System.addDeviceToSystem(systemId, device.id);
		res.status(201).json({ message: 'Device added successfully', device_id: device.id });
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export const updateDevice = async (req, res) => {
	const deviceId = req.params.device_id;
	const { name, description, user_alias } = req.body;
	const user = req.user;
	let deviceToUpdate;
	INFO(`Updating device ${deviceId}`);

	// Check if the device exists
	try {
		deviceToUpdate = await Device.findById(deviceId);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Internal Server Error' });
		return;
	}

	if (!deviceToUpdate) {
		res.status(404).json({ error: 'Device not found' });
		return;
	}

	if (deviceToUpdate.owner_id !== user.id && !user.is_admin) {
		res.status(401).json({ error: 'You do not have sufficient rights to edit this device' });
		return;
	}

	if (!name || name.trim() === '') {
        res.status(400).json({ error: 'Name is required' });
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
	if (deviceToDelete.owner_id !== user.id && !user.is_admin) {
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

export const canEditKpis = async (req, res) => {
	const user = req.user;
	const deviceId = req.params.device_id;
	if (await canEditKpisBool(user, deviceId)) {
		res.status(200).json({ canEditKpis: true });
	}
	else {
		res.status(200).json({ canEditKpis: false });
	}
}


export const canEditKpisBool = async (user, deviceId) => {
	// Check if user is an admin
	if (user.is_admin) {
		return true;
	}

	try {
		// Check if device is in any system
		const system = await System.findByDeviceId(deviceId);

		DEBUG(`System: ${JSON.stringify(system, null, 2)}`);
		DEBUG(`User: ${JSON.stringify(user, null, 2)}`);
		DEBUG(`Device: ${JSON.stringify(deviceId, null, 2)}`);

		if (system != null) {
			DEBUG(`Got system ${system.id}`);
			// Find the system owner
			if (system.owner_id === user.id) {
				INFO(`User ${user.id} is owner of system ${system.id}`);
				return true;
			}
		} else {
			const device = await Device.findById(deviceId);
			if (device.owner_id === user.id) {
				INFO(`User ${user.id} is owner of device ${device.id}`);
				return true;
			}
		}
		INFO(`User ${user.id} is not owner of system or device`);
		return false;
	} catch (error) {
		console.error('Error executing query:', error.stack);
		return false;
	}
}

export const removeDeviceFromSystem = async (req, res) => {
	const deviceId = req.params.device_id;
	const systemId = req.params.system_id;

	try {
		const success = await System.removeDeviceFromSystem(systemId, deviceId);

		if (success) {
			res.status(200).json({ message: 'Device removed successfully' });
		} else {
			res.status(404).json({ error: 'System or Device not found' });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

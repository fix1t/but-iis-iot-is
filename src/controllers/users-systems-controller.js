/**
 * @file users-systems-controller.js
 * @author Jakub Mikyšek (xmikys03)
 * @brief MVC - Controller for User System Interactions (adding and removing Users, dealing with User Request)
 */

import SystemRequest from '../models/system-request-model.js'

export const createRequest = async (req, res) => {
	const system_id = req.params.system_id;
	const user_id = req.user.id;
	const { message } = req.body;

	// TO-DO Check if System_id exists
	// TO-DO Check if User doesn't create request for his own System

	try {
		const systemRequest = new SystemRequest(system_id, user_id, message);

		await systemRequest.save();
		res.status(201).json({ message: 'System Request created successfully' });
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getAllSystemUsers = async (req, res) => {
	const system_id = req.params.system_id;

	try {
		const result = await SystemRequest.findSystemUsers(system_id);
		res.json(result);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getAllUsersNotInSystem = async (req, res) => {
	const system_id = req.params.system_id;

	try {
		const result = await SystemRequest.findUsersNotInSystem(system_id);
		res.json(result);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getSystemRequests = async (req, res) => {
	const system_id = req.params.system_id;

	try {
		const result = await SystemRequest.getSystemRequestsById(system_id);
		res.json(result);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const addUser = async (req, res) => {
	const system_id = req.params.system_id;
	const { user_id } = req.body;

	try {
		await SystemRequest.addUserToSystem(system_id, user_id);
		res.status(201).json({ message: 'User added successfully' });
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const addUserByRequest = async (req, res) => {
	const { system_id, user_id } = req.body;

	try {
		await SystemRequest.addUserToSystem(system_id, user_id);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const acceptRequest = async (req, res) => {
	const request_id = req.params.request_id;
	const status = "accepted";

	try {
		const result = await SystemRequest.updateRequest(request_id, status);

		// Fetch data using method getRequestDetails
		const { system_id, user_id } = await SystemRequest.getRequestDetails(request_id);

		// Accepted Request -> Add User to the System
		await addUserByRequest({ body: { system_id, user_id } }, res);

		res.json(result);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const rejectRequest = async (req, res) => {
	const request_id = req.params.request_id;
	const status = "rejected";

	try {
		const result = await SystemRequest.updateRequest(request_id, status);
		res.json(result);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const leaveSystem = async (req, res) => {
	const system_id = req.params.system_id;
	const user_id = req.user.id;

	try {
		const success = await SystemRequest.removeUserFromSystem(system_id, user_id);
		if (success) {
			res.status(200).json({ message: 'System left successfully' });
		} else {
			res.status(404).json({ error: 'System not found' });
		}
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const removeUser = async (req, res) => {
	const system_id = req.params.system_id;
	const { user_id } = req.body;

	try {
		const success = await SystemRequest.removeUserFromSystem(system_id, user_id);
		if (success) {
			res.status(200).json({ message: 'User removed from System successfully' });
		} else {
			res.status(404).json({ error: 'System not found' });
		}
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

function isRequestStatusValid(status) {
	return status == 'pending' || status == 'accepted' || status == 'rejected';
}

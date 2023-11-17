/**
 * @file users-systems-controller.js
 * @author Jakub Mikyšek (xmikys03)
 * @brief MVC - Controller for User System Interactions (adding and removing Users, dealing with User Request)
 */

import db from '../config/db.js';
import SystemRequest from '../models/system-request-model.js'

export const createRequest = async (req, res) => {
	const { system_id, message } = req.body;
	const user_id = req.user.id;

	// Check if System_id exists
	// Check if User doesn't create request for his own System

	try {
		const systemRequest = new SystemRequest(system_id, user_id, message);

		await systemRequest.save();
		res.status(201).json({ message: 'System Request created successfully' });
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const usersSystem = async (req, res) => {
	const id = req.params.id;

	try {
		const result = await SystemRequest.usersSystem(id);
		res.json(result);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const usersNotSystem = async (req, res) => {
	const id = req.params.id;

	try {
		const result = await SystemRequest.usersNotSystem(id);
		res.json(result);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const requestsSystem = async (req, res) => {
	const id = req.params.id;

	try {
		const result = await SystemRequest.systemRequests(id);
		res.json(result);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const addUser = async (req, res) => {

	let sql = `INSERT INTO SystemUsers SET ?`;
	const { system_id, user_id } = req.body;
	let join = { system_id, user_id };

	db.query(sql, join, (error, result) => {
		if (error) {
			console.error('Error executing query:', error.stack);
			res.status(500).json({ error: 'Internal Server Error' });
			return;
		}
		//res.status(200).json({ message: 'User added to the System successfully' });
	});
};

export const acceptRequest = async (req, res) => {
	const id = req.params.id;
	const status = "accepted";

	try {
		const result = await SystemRequest.updateRequest(id, status);

		// Fetch data using method getRequestDetails
		const { system_id, user_id } = await SystemRequest.getRequestDetails(id);

		// Accepted Request -> Add User to the System
		await addUser({ body: { system_id, user_id } }, res);

		res.json(result);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const rejectRequest = async (req, res) => {
	const id = req.params.id;
	const status = "rejected";

	try {
		const result = await SystemRequest.updateRequest(id, status);
		res.json(result);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const leaveSystem = async (req, res) => {
	const systemId = req.params.id;
	const userId = req.user.id;

	try {
        const success = await SystemRequest.leaveSystem(systemId, userId);
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
	const { system_id, user_id } = req.body;
	const systemId = system_id;
	const userId = user_id;

	try {
        const success = await SystemRequest.leaveSystem(systemId, userId);
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

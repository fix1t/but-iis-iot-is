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
	let sql = `SELECT Users.id, Users.username, Users.email, Users.birth, Users.bio, SystemUsers.created
				FROM SystemUsers
				INNER JOIN Users ON Users.id = SystemUsers.user_id
				WHERE system_id = ?
				ORDER BY SystemUsers.created`;
	const id = req.params.id;

	db.query(sql, [id], (error, result) => {
		if (error) {
			console.error('Error executing query:', error.stack);
			res.status(500).json({ error: 'Internal Server Error' });
			return;
		}
		res.json(result);
	});
};

export const usersNotSystem = async (req, res) => {
	let sql = `SELECT id, username, email, bio
				FROM Users
				WHERE id NOT IN (
					SELECT user_id
					FROM SystemUsers
					WHERE system_id = ?
				)`;
	const id = req.params.id;

	db.query(sql, [id], (error, result) => {
		if (error) {
			console.error('Error executing query:', error.stack);
			res.status(500).json({ error: 'Internal Server Error' });
			return;
		}
		res.json(result);
	});
};

export const requestsSystem = async (req, res) => {
	let sql = `SELECT 
					Users.username, Users.email, Users.birth, Users.bio,
					Systems.name AS system_name,
					SUR.status, SUR.message, SUR.created, SUR.id
				FROM SystemUserRequests AS SUR
				INNER JOIN Users ON Users.id = SUR.user_id
				INNER JOIN Systems ON Systems.id = SUR.system_id
				WHERE system_id = ?
				AND SUR.status = 'pending'
				ORDER BY SUR.created`;
	const id = req.params.id;

	db.query(sql, [id], (error, result) => {
		if (error) {
			console.error('Error executing query:', error.stack);
			res.status(500).json({ error: 'Internal Server Error' });
			return;
		}
		res.json(result);
	});
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
	let sql = `DELETE FROM SystemUsers WHERE system_id = ? AND user_id = ?`;
	const systemId = req.params.id;
	const userId = req.user.id;

	db.query(sql, [systemId, userId], (error, result) => {
		if (error) {
			console.error('Error executing query:', error.stack);
			res.status(500).json({ error: 'Internal Server Error' });
			return;
		}
		res.status(200).json({ message: 'System left successfully' });
	});
};

export const removeUser = async (req, res) => {
	let sql = `DELETE FROM SystemUsers WHERE system_id = ? AND user_id = ?`;
	const { system_id, user_id } = req.body;
	const systemId = system_id;
	const userId = user_id;

	db.query(sql, [systemId, userId], (error, result) => {
		if (error) {
			console.error('Error executing query:', error.stack);
			res.status(500).json({ error: 'Internal Server Error' });
			return;
		}
		res.status(200).json({ message: 'User removed successfully' });
	});
};

function isRequestStatusValid(status) {
	return status == 'pending' || status == 'accepted' || status == 'rejected';
}

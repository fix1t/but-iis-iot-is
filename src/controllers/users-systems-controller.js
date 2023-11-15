import db from '../config/db.js';
//import SystemUser from '../models/system-user-model.js'

export const createRequest = async (req, res) => {
	const { system_id, message } = req.body;
	let request = { system_id, user_id: req.user.id, status: 'pending', message };

	// TO-DO Check if System_id exists

	let sql = 'INSERT INTO SystemUserRequests SET ?';
	db.query(sql, request, (error, result) => {
		if (error) {
			console.error('Error executing query:', error.stack);
			res.status(500).json({ error: 'Internal Server Error' });
			return;
		}
		res.status(200).json({ message: 'System Request created successfully' });
	});
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
		res.json(result);
	});
};

export const acceptRequest = async (req, res) => {
	let sql = `UPDATE SystemUserRequests
				SET status = 'accepted'
				WHERE id = ?`;
	const id = req.params.id;

	try {
		await new Promise((resolve, reject) => {
			db.query(sql, [id], (error, result) => {
				if (error) {
					console.error('Error executing query:', error.stack);
					reject(error);
					return;
				}
				resolve(result);
			});
		});

		// Fetch data using getRequestDetails
		const { system_id, user_id } = await getRequestDetails(id);

		// Trigger addUser function
		addUser({ body: { system_id, user_id } }, res);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const rejectRequest = async (req, res) => {
	let sql = `UPDATE SystemUserRequests
				SET status = 'rejected'
				WHERE id = ?`;
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

function getRequestDetails(id) {
	return new Promise((resolve, reject) => {
		let sql = `SELECT system_id, user_id
                    FROM SystemUserRequests
                    WHERE id = ?`;

		db.query(sql, [id], (error, result) => {
			if (error) {
				console.error('Error executing query:', error.stack);
				reject(error);
				return;
			}
			resolve(result[0]);
		});
	});
}

function isRequestStatusValid(status) {
	return status == 'pending' || status == 'accepted' || status == 'rejected';
}

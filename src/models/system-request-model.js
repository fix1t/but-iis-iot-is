/**
 * @file system-request-model.js
 * @author Jakub Mikyšek (xmikys03)
 * @brief MVC - Model for System Requests
 */

import db from '../config/db.js';

class SystemRequest {
	constructor(system_id, user_id, message, status = "pending") {
		this.system_id = system_id;
		this.user_id = user_id;
		this.status = status;
		this.message = message;
	}

	// Create System Request
	save() {
		let sql = `
    	INSERT INTO SystemUserRequests (system_id, user_id, status, message)
		VALUES (?, ?, ?, ?)`;
		return db.promise().execute(sql, [this.system_id, this.user_id, this.status, this.message]);
	}

	static async updateRequest(id, newStatus) {
		let sql = `UPDATE SystemUserRequests
					SET status = ?
					WHERE id = ?`;
		try {
			const [result] = await db.promise().query(sql, [newStatus, id]);
			console.log(result);
			return result;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async getSystemRequestsBySystemId(id) {
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
		try {
			const [rows] = await db.promise().query(sql, [id]);
			return rows;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async getSystemRequestsByOwnerId(id) {
		let sql = `SELECT 
						Users.username, Users.email, Users.birth, Users.bio,
						Systems.name AS system_name,
						SUR.status, SUR.message, SUR.created, SUR.id
					FROM SystemUserRequests AS SUR
					INNER JOIN Users ON Users.id = SUR.user_id
					INNER JOIN Systems ON Systems.id = SUR.system_id
					WHERE Systems.owner_id = ?
					AND SUR.status = 'pending'
					ORDER BY SUR.created`;
		try {
			const [rows] = await db.promise().query(sql, [id]);
			return rows;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async getSystemRequestsByUserId(id) {
		let sql = `SELECT 
						Users.id AS user_id,
						Systems.owner_id, Systems.name AS system_name,
						(SELECT username FROM Users WHERE id = Systems.owner_id) AS owner_name,
						SUR.status, SUR.message, SUR.created, SUR.id
					FROM SystemUserRequests AS SUR
					INNER JOIN Users ON Users.id = SUR.user_id
					INNER JOIN Systems ON Systems.id = SUR.system_id
					WHERE user_id = ?
					ORDER BY SUR.created;`;
		try {
			const [rows] = await db.promise().query(sql, [id]);
			return rows;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async getRequestDetails(id) {
		let sql = `SELECT system_id, user_id
                    FROM SystemUserRequests
                    WHERE id = ?`;
		try {
			const [[{ system_id, user_id }]] = await db.promise().query(sql, [id]);
			return { system_id, user_id };
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}
}

export default SystemRequest;

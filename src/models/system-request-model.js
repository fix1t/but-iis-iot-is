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

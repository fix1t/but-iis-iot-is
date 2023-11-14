import db from '../config/db.js';

class SystemUser {
	constructor(system_id, user_id) {
		this.system_id = system_id;
		this.user_id = user_id;
	}

	// Add User to System
	save() {
		let sql = `
      INSERT INTO SystemUsers (
        system_id, user_id
      ) VALUES (?, ?)
    `;
		return db.promise().execute(sql, [this.system_id, this.user_id]);
	}

	static async leaveSystem(system_id, user_id) {
		let sql = `DELETE FROM SystemUsers
								WHERE system_id = ? AND user_id = ?`;
		try {
			const [result] = await db.promise().query(sql, [system_id, user_id]);
			console.log(result);
			return result;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}
}

export default SystemUser;

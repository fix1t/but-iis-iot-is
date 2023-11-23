import db from '../config/db.js';

class Systems {
	constructor(owner_id, name, description, created = null, id = null) {
		this.owner_id = owner_id;
		this.name = name;
		this.description = description;
		this.created = created;
		this.id = id;
	}

	async save() {
		try {
			await db.promise().beginTransaction();

			let systemInsertSql = `
              INSERT INTO Systems (
                  owner_id, name, description
              ) VALUES (?, ?, ?)
          `;
			let systemUsersInsertSql = `
              INSERT INTO SystemUsers (
                  system_id, user_id
              ) VALUES (?, ?)
          `;
			// Insert into Systems table
			const [systemResult] = await db.promise().execute(systemInsertSql, [this.owner_id, this.name, this.description]);

			// Retrieve the inserted system ID
			const systemId = systemResult.insertId;

			// Insert into SystemUsers table using the retrieved system ID
			await db.promise().execute(systemUsersInsertSql, [systemId, this.owner_id]);

			await db.promise().commit();
		} catch (error) {
			console.error('Error during the transaction. ROLLBACK!', error);
			await db.promise().rollback(); //makes rollback to the default previous state of db 
			throw error;
		}
	}

	async update() {
		const dataToUpdate = {
			//owner_id: this.owner_id, //@maybe want to change owner.id as well
			name: this.name,
			description: this.description,
		};
		// Generate SQL SET part dynamically based on the object
		const updates = Object.keys(dataToUpdate).map(key => `${key} = ?`).join(', ');
		const values = Object.values(dataToUpdate);

		let sql = `UPDATE Systems SET ${updates} WHERE id = ?`;
		return db.promise().execute(sql, [...values, this.id]);
	}

	static async findAllSystems() {
		let sql = 'SELECT * FROM Systems';
		try {
			const [rows] = await db.promise().query(sql);
			return rows.map(Systems.rowToSystems);
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async deleteById(id) {
		let sql = `DELETE FROM Systems WHERE id = ?`;
		try {
			const [result] = await db.promise().query(sql, [id]);
			console.log(result);
			return result;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async getCurrentUserSystems(user_id) {
		let sql = `
          SELECT Systems.* 
          FROM Systems 
          JOIN SystemUsers ON Systems.id = SystemUsers.system_id 
          WHERE SystemUsers.user_id = ?
      `;
		try {
			const [rows] = await db.promise().query(sql, [user_id]);
			return rows.map(Systems.rowToSystems);
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async getSystemsUserIsNotIn(user_id) {
		let sql = `
			SELECT Systems.* 
			FROM Systems 
			LEFT JOIN SystemUsers ON Systems.id = SystemUsers.system_id AND SystemUsers.user_id = ?
			WHERE SystemUsers.user_id IS NULL
		`;
		try {
			const [rows] = await db.promise().query(sql, [user_id]);
			return rows.map(Systems.rowToSystems);
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async findById(id) {
		let sql = `SELECT * FROM Systems WHERE id = ?`;
		try {
			const [rows] = await db.promise().query(sql, [id]);
			return rows.length ? Systems.rowToSystems(rows[0]) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async addDeviceToSystem(system_id, device_id) {
		let sql = `
					INSERT INTO SystemDevices (
							system_id, device_id
					) VALUES (?, ?)
			`;
		try {
			const [result] = await db.promise().execute(sql, [system_id, device_id]);
			return result;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async isUserInSystem(user_id, system_id) {
		let sql = `SELECT * FROM SystemUsers WHERE user_id = ? AND system_id = ?`;
		try {
			const [rows] = await db.promise().query(sql, [user_id, system_id]);
			return rows.length ? true : false;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	// Helper function to convert a database row to a Systems instance
	static rowToSystems(row) {
		return new Systems(
			row.owner_id,
			row.name,
			row.description,
			row.created,
			row.id
		);
	}
}

export default Systems;

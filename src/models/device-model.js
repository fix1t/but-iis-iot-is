import db from '../config/db.js';


class Device {
	constructor(owner_id, type_id, name, description, user_alias, id = null) {
		this.id = id;
		this.owner_id = owner_id;
		this.type_id = type_id;
		this.name = name;
		this.description = description;
		this.user_alias = user_alias;
	}

	async save() {
		let sql = `
			INSERT INTO Devices (
				owner_id, type_id, name, description, user_alias
			) VALUES (?, ?, ?, ?, ?)
		`;
		return db.promise().execute(sql, [this.owner_id, this.type_id, this.name, this.description, this.user_alias]);
	}

	async getId() {
		let sql = `SELECT id FROM Devices WHERE owner_id = ? AND type_id = ? AND name = ? AND description = ? AND user_alias = ?`;
		try {
			const [rows] = await db.promise().query(sql, [this.owner_id, this.type_id, this.name, this.description, this.user_alias]);
			return rows.length ? rows[0].id : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	async update() {
		const dataToUpdate = {
			owner_id: this.owner_id,
			type_id: this.type_id,
			name: this.name,
			description: this.description,
			user_alias: this.user_alias
		};

		// Generate SQL SET part dynamically based on the object
		const updates = Object.keys(dataToUpdate).map(key => `${key} = ?`).join(', ');
		const values = Object.values(dataToUpdate);

		let sql = `UPDATE Devices SET ${updates} WHERE id = ?`;
		return db.promise().execute(sql, [...values, this.id]);
	}

	static async getDeviceById(id) {
		let sql = `SELECT * FROM Devices WHERE id = ?`;
		try {
			const [rows] = await db.promise().query(sql, [id]);
			return rows.length ? Device.rowToDevice(rows[0]) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async getSystemDevices(systemId) {
		let sql = `SELECT * FROM Devices WHERE id IN (SELECT device_id FROM SystemDevices WHERE system_id = ?)`;
		try {
			const [rows] = await db.promise().query(sql, [systemId]);
			return rows.length ? rows.map(row => Device.rowToDevice(row)) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static rowToDevice(row) {
		return new Device(row.owner_id, row.type_id, row.name, row.description, row.user_alias, row.id);
	}
}

export default Device;

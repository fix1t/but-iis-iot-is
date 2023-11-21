import db from '../config/db.js';

class DeviceParameter {
	constructor(device_id, parameter_id, value, recorded_at = null) {
		this.device_id = device_id;
		this.parameter_id = parameter_id;
		this.value = value;
		this.recorded_at = recorded_at;
	}

	async save() {
		let sql = `
			INSERT INTO DeviceParameters (
				device_id, parameter_id, value
			) VALUES (?, ?, ?)
		`;
		return db.promise().execute(sql, [this.device_id, this.parameter_id, this.value]);
	}

	async update() {
		let sql = `
			UPDATE DeviceParameters
			SET value = ?
			WHERE device_id = ? AND parameter_id = ?
		`;
		return db.promise().execute(sql, [this.value, this.device_id, this.parameter_id]);
	}

	static async getDeviceParameters(deviceId) {
		let sql = `SELECT * FROM DeviceParameters WHERE device_id = ?`;
		try {
			const [rows] = await db.promise().query(sql, [deviceId]);
			return rows.length ? rows.map(row => DeviceParameter.rowToDeviceParameter(row)) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async getCurrentValue(deviceId, parameterId) {
		let sql = 'SELECT * FROM DeviceParameters WHERE device_id = ? AND parameter_id = ? ORDER BY recorded_at DESC LIMIT 1';
		try {
			const [rows] = await db.promise().query(sql, [deviceId, parameterId]);
			return rows.length ? DeviceParameter.rowToDeviceParameter(rows[0]) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async getHistoricalValues(deviceId, parameterId, startDate, endDate) {
		let sql = 'SELECT * FROM DeviceParameters WHERE device_id = ? AND parameter_id = ? AND recorded_at BETWEEN ? AND ? ORDER BY recorded_at ASC';
		try {
			const [rows] = await db.promise().query(sql, [deviceId, parameterId, startDate, endDate]);
			return rows.length ? rows.map(row => DeviceParameter.rowToDeviceParameter(row)) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static rowToDeviceParameter(row) {
		return new DeviceParameter(row.device_id, row.parameter_id, row.value, row.recorded_at);
	}
}

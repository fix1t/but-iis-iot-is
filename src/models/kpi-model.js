import db from '../config/db.js';

// CREATE TABLE KPIs (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     device_id INT NOT NULL,
//     parameter_id INT NOT NULL,
//     threshold DECIMAL(10,2) NOT NULL,
//     operation ENUM('greater', 'less', 'equal', 'not_equal') NOT NULL,
//     FOREIGN KEY (device_id) REFERENCES Devices(id) ON DELETE CASCADE,
//     FOREIGN KEY (parameter_id) REFERENCES Parameters(id) ON DELETE CASCADE
// );

class KPI {
	constructor(device_id, parameter_id, threshold, operation, id = null) {
		this.id = id;
		this.device_id = device_id;
		this.parameter_id = parameter_id;
		this.threshold = threshold;
		this.operation = operation;
	}

	async save() {
		let sql = `
			INSERT INTO KPIs (
				device_id, parameter_id, threshold, operation
			) VALUES (?, ?, ?, ?)
		`;
		return db.promise().execute(sql, [this.device_id, this.parameter_id, this.threshold, this.operation]);
	}

	async update(threshold, operation) {
		let sql = `
			UPDATE KPIs
			SET threshold = ?, operation = ?
			where id = ?
		`;
		return db.promise().execute(sql, [threshold, operation, self.id]);
	}

	async delete() {
		return KPI.deleteById(this.id);
	}

	static async findByDeviceId(deviceId) {
		let sql = `SELECT * FROM KPIs WHERE device_id = ?`;
		try {
			const [rows] = await db.promise().query(sql, [deviceId]);
			return rows.length ? rows.map(row => KPI.rowToKPI(row)) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async findByDeviceIdAndParameterId(deviceId, parameterId) {
		let sql = `SELECT * FROM KPIs WHERE device_id = ? AND parameter_id = ?`;
		try {
			const [rows] = await db.promise().query(sql, [deviceId, parameterId]);
			return rows.length ? rows.map(row => KPI.rowToKPI(row)) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async deleteById(kpiId) {
		let sql = `
			DELETE FROM KPIs
			WHERE id = ?
		`;
		return db.promise().execute(sql, [kpiId]);
	}

	static deleteByDeviceIdAndParameterId(deviceId, parameterId) {
		let sql = `
			DELETE FROM KPIs
			WHERE device_id = ? AND parameter_id = ?
		`;
		return db.promise().execute(sql, [deviceId, parameterId]);
	}

	static rowToKPI(row) {
		return new KPI(row.device_id, row.parameter_id, row.threshold, row.operation, row.id);
	}
}

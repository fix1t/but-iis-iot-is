import db from '../config/db.js';
import { DEBUG } from '../utils/logger.js';

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

	static async findAllKpisByDeviceIdAndParameterId(deviceId, parameterId) {
		let sql = `
			SELECT * FROM KPIs
			WHERE device_id = ? AND parameter_id = ?
		`;
		try {
			const [rows] = await db.promise().query(sql, [deviceId, parameterId]);
			DEBUG(`Found ${rows.length} kpis for device with id ${deviceId} and parameter with id ${parameterId}`);
			return rows.length ? rows.map(row => KPI.rowToKPI(row)) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static rowToKPI(row) {
		return new KPI(row.device_id, row.parameter_id, row.threshold, row.operation, row.id);
	}
}

export default KPI;

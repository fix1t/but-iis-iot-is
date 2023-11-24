import db from '../config/db.js';
import { INFO, DEBUG, WARN, ERROR } from '../utils/logger.js';

class Parameter {
	constructor(type_id, name, unitName, id = null) {
		this.id = id;
		this.type_id = type_id;
		this.unit_name = unitName;
		this.name = name;
	}

	async save() {
		let sql = `
			INSERT INTO Parameters (
				type_id, name
			) VALUES (?, ?)
		`;
		return db.promise().execute(sql, [this.type_id, this.name]);
	}

	static async findByTypeId(typeId) {
		let sql = `SELECT * FROM Parameters WHERE type_id = ?`;
		try {
			const [rows] = await db.promise().query(sql, [typeId]);
			return rows.length ? rows.map(row => Parameter.rowToParameter(row)) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async findByTypeName(typeName) {
		let sql = `SELECT * FROM Parameters WHERE type_id = (SELECT id FROM Types WHERE name = ?)`;
		try {
			const [rows] = await db.promise().query(sql, [typeName]);
			return rows.length ? rows.map(row => Parameter.rowToParameter(row)) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	// Retrieve the last captured value for each parameter of a specific device
	static async findLatestValuesByDeviceId(deviceId) {
		let sql = `
			SELECT
				D.id AS device_id,                 -- Device ID
				P.name AS parameter_name,          -- Parameter name
				P.unit_name AS parameter_unit_name,-- Parameter unit name
				DP.value AS parameter_value        -- Last captured parameter value
			FROM
				Devices AS D                       -- Devices table alias
			JOIN
				(
					SELECT
						device_id,
						parameter_id,
						MAX(recorded_at) AS latest_recorded_at  -- Find the latest recorded timestamp for each parameter-device combination
					FROM
						DeviceParameters
					WHERE
						device_id = ?     -- Specify the target device ID
					GROUP BY
						device_id,
						parameter_id
				) AS LatestDP
			ON
				D.id = LatestDP.device_id           -- Join with Devices to get device information
			JOIN
				Parameters AS P                     -- Parameters table alias
			ON
				LatestDP.parameter_id = P.id        -- Join with Parameters to get parameter names
			JOIN
				DeviceParameters AS DP              -- DeviceParameters table alias
			ON
				LatestDP.device_id = DP.device_id
				AND LatestDP.parameter_id = DP.parameter_id
				AND LatestDP.latest_recorded_at = DP.recorded_at -- Join with DeviceParameters to get the last captured parameter values
			WHERE
				D.id = ?;                 -- Filter by the specified device ID
		`;
		try {
			const [rows] = await db.promise().query(sql, [deviceId, deviceId]);
			DEBUG('[findLatestValuesByDeviceId()]:\n' + JSON.stringify(rows, null, 2));
			return rows.length ? rows : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static rowToParameter(row) {
		return new Parameter(row.type_id, row.name, row.unit_name, row.id);
	}
}

export default Parameter;

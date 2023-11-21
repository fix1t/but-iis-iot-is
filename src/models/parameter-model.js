import db from '../config/db.js';

class Parameter {
	constructor(type_id, name, id = null) {
		this.id = id;
		this.type_id = type_id;
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

	static rowToParameter(row) {
		return new Parameter(row.type_id, row.name, row.id);
	}
}

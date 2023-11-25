import db from '../config/db.js';

class Type {
	constructor(name, id = null) {
		this.id = id;
		this.name = name;
	}

	async save() {
		let sql = `
			INSERT INTO Types (
				name
			) VALUES (?)
		`;
		const result = await db.promise().execute(sql, [this.name]);
		return result;
	}

	static async findAll() {
		const sql = `
			SELECT Types.id, Types.name, GROUP_CONCAT(Parameters.name) as parameters
			FROM Types
			LEFT JOIN Parameters ON Types.id = Parameters.type_id
			GROUP BY Types.id
		`;
		try {
			const [rows] = await db.promise().query(sql);
			return rows.length ? rows.map(row => Type.rowToType(row)) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async findById(id) {
		let sql = `SELECT * FROM Types WHERE id = ?`;
		try {
			const [rows] = await db.promise().query(sql, [id]);
			return rows.length ? Type.rowToType(rows[0]) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static rowToType(row) {
		const type = new Type(row.name, row.id);
		type.parameters = row.parameters ? row.parameters.split(',') : [];
		return type;
	}
}

export default Type;

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
		return db.promise().execute(sql, [this.name]);
	}

	static async findAll() {
		let sql = `SELECT * FROM Types`;
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
		return new Type(row.name, row.id);
	}
}

export default Type;

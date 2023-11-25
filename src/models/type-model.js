import db from '../config/db.js';
import Parameter from './parameter-model.js';
import { INFO } from '../utils/logger.js';

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

	async saveTypeWithParameters(parameters) {
		INFO(`Saving type ${this.name} with parameters ${parameters.map(p => p.name).join(', ')}`);
		
		// Save the type
		const result = await this.save();
		this.id = result[0].insertId;
		
		// Add the parameters
		for (let parameter of parameters) {
			const newParameter = new Parameter(this.id, parameter.name, parameter.unit_name);
			await newParameter.save();
		}
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

	static async findByName(name) {
		let sql = `SELECT * FROM Types WHERE name = ?`;
		try {
			const [rows] = await db.promise().query(sql, [name]);
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

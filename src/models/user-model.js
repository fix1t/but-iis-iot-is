import db from '../config/db.js';

class User {
	constructor(username, email, password, birth, gender, bio, is_admin = false, id = null, created = null) {
		this.username = username;
		this.email = email;
		this.password = password;
		this.birth = birth;
		this.gender = gender;
		this.bio = bio;
		this.is_admin = is_admin;
		this.id = id;
		this.created = created;
	}
	// Save new user to the database
	async save() {
		let sql = `
      INSERT INTO Users (
        username, email, password, is_admin, birth, gender, bio
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
		return db.promise().execute(sql, [this.username, this.email, this.password, this.is_admin, this.birth, this.gender, this.bio]);
	}

	async getId() {
		if (!this.id) {
			console.log('id not set');
			const user = await User.findByEmail(this.email);
			this.id = user.id;
		}
		return this.id;
	}

	async update() {
		const dataToUpdate = {
			username: this.username,
			email: this.email,
			password: this.password,
			birth: this.birth,
			gender: this.gender,
			bio: this.bio,
			is_admin: this.is_admin
		};

		// Generate SQL SET part dynamically based on the object
		const updates = Object.keys(dataToUpdate).map(key => `${key} = ?`).join(', ');
		const values = Object.values(dataToUpdate);

		let sql = `UPDATE Users SET ${updates} WHERE id = ?`;
		return db.promise().execute(sql, [...values, this.id]);
	}

	static async findByUsername(username) {
		let sql = `SELECT * FROM Users WHERE username = ?`;
		try {
			const [rows] = await db.promise().query(sql, [username]);
			return rows.length ? User.rowToUser(rows[0]) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async findById(id) {
		let sql = `SELECT * FROM Users WHERE id = ?`;
		try {
			const [rows] = await db.promise().query(sql, [id]);
			return rows.length ? User.rowToUser(rows[0]) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async findByEmail(email) {
		let sql = `SELECT * FROM Users WHERE email = ?`;
		try {
			const [rows] = await db.promise().query(sql, [email]);
			return rows.length ? User.rowToUser(rows[0]) : null;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async findAll() {
		let sql = 'SELECT * FROM Users';
		try {
			const [rows] = await db.promise().query(sql);
			return rows.map(User.rowToUser);
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	// returns true or false
	static async deleteById(id) {
		let sql = `DELETE FROM Users WHERE id = ?`;
		try {
			console.log('DELETE BY ID');
			const [result] = await db.promise().query(sql, [id]);
			return result.affectedRows ? true : false;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async getMultipleUsers(offset, limit) {
		let sql = `SELECT * FROM Users LIMIT ?, ?`;
		try {
			const [users] = await db.promise().query(sql, [offset, limit]);
			return users;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	static async updateById(id, user) {
		let sql = `UPDATE Users SET ? WHERE id = ?`;
		try {
			const [result] = await db.promise().query(sql, [user, id]);
			console.log(result);
			return result;
		} catch (error) {
			console.error('Error executing query:', error.stack);
			throw error;
		}
	}

	// Helper function to convert a database row to a User instance
	static rowToUser(row) {
		return new User(
			row.username,
			row.email,
			row.password,
			row.birth,
			row.gender,
			row.bio,
			row.is_admin,
			row.id,
			row.created
		);
	}
}

export default User;

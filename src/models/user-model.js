import db from '../config/db.js';

class User {
  constructor(username, email, password, birth, gender, bio, is_admin=false) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.birth = birth;
    this.gender = gender;
    this.bio = bio;
    this.is_admin = is_admin;
  }

  // Save new user to the database
  save() {
    let sql = `
      INSERT INTO Users (
        username, email, password, is_admin, birth, gender, bio
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    return db.promise().execute(sql, [this.username, this.email, this.password, this.is_admin, this.birth, this.gender, this.bio]);
  }

	update() {
		let sql = `UPDATE Users SET ? WHERE id = ?`;
		return db.promise().execute(sql, [this, this.id]);
	}

  static async findByUsername(username) {
    let sql = `SELECT * FROM Users WHERE username = ?`;
    try {
      const [rows] = await db.promise().query(sql, [username]);
      return rows;
    } catch (error) {
      console.error('Error executing query:', error.stack);
      throw error;
    }
  }

  static async findById(id) {
    let sql = `SELECT * FROM Users WHERE id = ?`;
    try {
      const [rows] = await db.promise().query(sql, [id]);
      return rows;
    } catch (error) {
      console.error('Error executing query:', error.stack);
      throw error;
    }
  }

	static async findByEmail(email) {
    let sql = `SELECT * FROM Users WHERE email = ?`;
    try {
      const [rows, fields] = await db.promise().query(sql, [email]);
      return rows;
    } catch (error) {
      console.error('Error executing query:', error.stack);
      throw error;
    }
  }

  static async findAll() {
    let sql = 'SELECT * FROM Users';
    try {
      const [rows] = await db.promise().query(sql);
      return rows;
    } catch (error) {
      console.error('Error executing query:', error.stack);
      throw error;
    }
  }

  static async deleteById(id) {
    let sql = `DELETE FROM Users WHERE id = ?`;
    try {
      const [result] = await db.promise().query(sql, [id]);
      console.log(result);
      return result;
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
}

export default User;

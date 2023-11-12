import db from '../config/db.js';

class User {
  constructor(username, email, password, birth, gender, bio, is_admin=false) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.is_admin = is_admin;
    this.birth = birth;
    this.gender = gender;
    this.bio = bio;
  }

  // Save new user to the database
  save() {
    let sql = `
      INSERT INTO Users(
        username,
        email,
        password,
        is_admin,
        birth,
        gender,
        bio
      ) VALUES (
        '${this.username}',
        '${this.email}',
        '${this.password}',
        ${this.is_admin},
        '${this.birth}',
        '${this.gender}',
        '${this.bio}'
      )
    `;
    return db.execute(sql);
  }

  static findByUsername(username) {
    let sql = `SELECT * FROM Users WHERE username = ?`;
    return db.execute(sql, [username]);
  }

	static findByEmail(email) {
		let sql = `SELECT * FROM Users WHERE email = ?`;
		return db.execute(sql, [email]);
	}

	static findById(id) {
		let sql = `SELECT * FROM Users WHERE id = ?`;
		return db.execute(sql, [id]);
	}

	static findAll() {
		let sql = 'SELECT * FROM Users';
		return db.execute(sql);
	}

	static deleteById(id) {
		let sql = `DELETE FROM Users WHERE id = ?`;
		return db.execute(sql, [id]);
	}

}

export default User;

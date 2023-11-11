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

  // Find a user by their username
  static findByUsername(username) {
    let sql = `SELECT * FROM Users WHERE username = '${username}'`;
    return db.execute(sql);
  }

	// Find a user by their email
	static findByEmail(email) {
		let sql = `SELECT * FROM Users WHERE email = '${email}'`;
		return db.execute(sql);
	}

	// Find a user by their id
	static findById(id) {
		let sql = `SELECT * FROM Users WHERE id = ${id}`;
		return db.execute(sql);
	}

	// Find all users
	static findAll() {
		let sql = 'SELECT * FROM Users';
		return db.execute(sql);
	}

	// Delete a user by their id
	static deleteById(id) {
		let sql = `DELETE FROM Users WHERE id = ${id}`;
		return db.execute(sql);
	}

}

export default User;

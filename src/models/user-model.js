import db from '../config/db.js';

class User {
  constructor(username, mail, password, is_admin, birth, gender, bio) {
    this.username = username;
    this.mail = mail;
    this.password = password;
    this.is_admin = is_admin;
    this.birth = birth;
    this.gender = gender;
    this.bio = bio;
  }

  // Save new user to the database
  save() {
    let sql = `
      INSERT INTO User(
        username,
        mail,
        password,
        is_admin,
        birth,
        gender,
        bio
      ) VALUES (
        '${this.username}',
        '${this.mail}',
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
    let sql = `SELECT * FROM User WHERE username = '${username}'`;
    return db.execute(sql);
  }

}

export default User;

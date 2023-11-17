import db from '../config/db.js';

class Systems {
    constructor(owner_id, name, description, created=null, id=null) { 
        this.owner_id = owner_id;
        this.name = name;
        this.description = description;
        this.created = created;
        this.id = id;
    }
    // Save new user to the database
    async save() {
        let sql = `
        INSERT INTO Systems (
            owner_id, name, description
        ) VALUES (?, ?, ?)
        `;
        return db.promise().execute(sql, [this.owner_id, this.name, this.description]);
    }
    async update() {
        const dataToUpdate = {
            //owner_id: this.owner_id, //@maybe want to change owner.id as well
            name: this.name,
            description: this.description,
        };
    // Generate SQL SET part dynamically based on the object
    const updates = Object.keys(dataToUpdate).map(key => `${key} = ?`).join(', ');
    const values = Object.values(dataToUpdate);

    let sql = `UPDATE Systems SET ${updates} WHERE id = ?`;
    return db.promise().execute(sql, [...values, this.id]);
    }

    static async findAllSystems() {
        let sql = 'SELECT * FROM Systems';
        try {
          const [rows] = await db.promise().query(sql);
          return rows.map(Systems.rowToSystems);
        } catch (error) {
          console.error('Error executing query:', error.stack);
          throw error;
        }
    }

    static async deleteById(id) {
      let sql = `DELETE FROM Systems WHERE id = ?`;
      try {
        const [result] = await db.promise().query(sql, [id]);
        console.log(result);
        return result;
      } catch (error) {
        console.error('Error executing query:', error.stack);
        throw error;
      }
    }
  
/*
    static async getCurrentUserSystems() {
        let sql = 'SELECT * FROM SystemsUsers WHERE user_id = ?';
        try {
          const [rows] = await db.promise().query(sql);
          return rows.map(Systems.rowToSystems);
        } catch (error) {
          console.error('Error executing query:', error.stack);
          throw error;
        }
    }
*/
    static async findById(id) {
        let sql = `SELECT * FROM Systems WHERE id = ?`;
        try {
          const [rows] = await db.promise().query(sql, [id]);
          return rows.length ? Systems.rowToSystems(rows[0]) : null;
        } catch (error) {
          console.error('Error executing query:', error.stack);
          throw error;
        }
    }

    // Helper function to convert a database row to a Systems instance
    static rowToSystems(row) {
        return new Systems(
            row.owner_id,
            row.name,
            row.description,
            row.created,
            row.id
        );
    }
}

export default Systems;
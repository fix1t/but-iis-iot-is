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
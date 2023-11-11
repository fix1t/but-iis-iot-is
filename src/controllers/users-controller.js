import db from '../config/db.js';

export const registerUser = async (req, res) => {
    const { username, email, bio } = req.body;
    let user = { username, mail: email, is_admin: false, bio, password: '123456' };

    let sql = 'INSERT INTO Users SET ?';
    db.query(sql, user, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.redirect('/');
    });
};

export const deleteUser = async (req, res) => {
    let sql = `DELETE FROM Users WHERE id = ${req.params.id}`;
    db.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).send('User deleted successfully');
    });
};

export const getAllUsers = async (req, res) => {
    let sql = 'SELECT * FROM Users';
    db.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(result);
    });
};

export const getUser = async (req, res) => {
    let sql = `SELECT * FROM Users WHERE id = ${req.params.id}`;
    db.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(result)
        res.send('User fetched..');
    });
};

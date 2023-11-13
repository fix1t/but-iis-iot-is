import db from '../config/db.js';

export const createRequest = async (req, res) => {
    const { system_id, message } = req.body;
    let user = { system_id, user_id: req.user.id, status: 'pending', message };

	// TO-DO Check if System_id exists

    let sql = 'INSERT INTO SystemUserRequests SET ?';
    db.query(sql, user, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).json({error: 'Internal Server Error'});
            return;
        }
        res.status(200).json({message: 'System Request created successfully'});
    });
};

export const usersSystem = async (req, res) => {
    let sql = `SELECT Users.username, Users.email, Users.birth, Users.bio
				FROM SystemUsers
				INNER JOIN Users ON Users.id = SystemUsers.user_id
				WHERE system_id = ${req.params.id}`;
    db.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).json({error: 'Internal Server Error'});
            return;
        }
		console.log(result);
        res.status(200).json({message: 'Users in System fetched...'});
    });
};

export const requestsSystem = async (req, res) => {
    let sql = `SELECT 
					Users.username, Users.email, Users.bio, Users.birth,
					Systems.name AS system_name,
					SUR.status, SUR.message, SUR.created
				FROM SystemUserRequests AS SUR
				INNER JOIN Users ON Users.id = SUR.user_id
				INNER JOIN Systems ON Systems.id = SUR.system_id
				WHERE system_id = ${req.params.id}`;
    db.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).json({error: 'Internal Server Error'});
            return;
        }
        res.status(200).json({message: 'Users in System fetched...'});
    });
};

export const leaveSystem = async (req, res) => {
    let sql = `DELETE FROM SystemUsers WHERE system_id = ${req.params.id} AND user_id = ${req.user.id}`;
    db.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).json({error: 'Internal Server Error'});
            return;
        }
        res.status(200).json({message: 'System left successfully'});
    });
};

function isRequestStatusValid(status){
	return status == 'pending' || status == 'accepted' || status == 'rejected';
}

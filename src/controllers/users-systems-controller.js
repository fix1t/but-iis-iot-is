import db from '../config/db.js';

// export const getAllUsers = async (req, res) => {
//     let sql = 'SELECT * FROM Users';
//     db.query(sql, (error, result) => {
//         if (error) {
//             console.error('Error executing query:', error.stack);
//             res.status(500).send('Internal Server Error');
//             return;
//         }
//         res.json(result);
//     });
// };

// export const getUser = async (req, res) => {
//     let sql = `SELECT * FROM Users WHERE id = ${req.params.id}`;
//     db.query(sql, (error, result) => {
//         if (error) {
//             console.error('Error executing query:', error.stack);
//             res.status(500).send('Internal Server Error');
//             return;
//         }
//         console.log(result)
//         res.send('User fetched..');
//     });
// };

export const leaveSystem = async (req, res) => {
    let sql = `DELETE FROM SystemUsers WHERE system_id = ${req.params.id} AND user_id = ${req.user.id}`;
    db.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).json({error: 'Internal Server Error'});
            return;
        }
        res.status(200).json({error: 'System left successfully'});
    });
};

function isRequestStatusValid(status){
	return status == 'pending' || status == 'accepted' || status == 'rejected';
}

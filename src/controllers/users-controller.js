import db from '../config/db.js';
import User from '../models/user-model.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/auth.js';

export const registerUser = async (req, res) => {
	const { username, email, password, confPassword, birth, gender, bio } = req.body;
	console.log(req.body);
	if (isMissingRequiredFields(req.body)) {
		console.log('missing required fields');
		res.status(400).json({error: 'Please provide all required fields'});
		return;
	}
	if (password !== confPassword) {
		console.log('passwords do not match');
		res.status(400).json({error: 'Passwords do not match'});
		return;
	}
	if (await userAlreadyExists(email)) {
		console.log('user already exists');
		res.status(400).json({error: 'User with that email already exists'});
		return;
	}
	if (!passwordMeetsCriteria(password)) {
		console.log('password does not meet criteria');
		res.status(400).json({error: 'Password must contain uppercase,lowercase, number and must be at least 6 characters long.'});
		return;
	}
	if (birth > Date.now()) {
		console.log('birth date is not valid');
		res.status(400).json({error: 'Birth date is not valid'});
		return;
	}
	if (!isGenderValid(gender)) {
		console.log('invalid gender')
		res.status(400).json({error: 'Gender is not valid'});
	}

	try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User(username, email, hashedPassword, birth, gender, bio);

        await user.save();

		const createdUser = await User.findByEmail(email);
		const token = generateToken(createdUser);
		res.cookie('auth-token', token, {
			httpOnly: true, // Important: This helps mitigate the risk of client side script accessing the protected cookie
			secure: process.env.NODE_ENV === 'production', // Cookies sent only over HTTPS
			sameSite: 'strict', // CSRF protection
			maxAge: 3600000 
		  });
	  
        
        res.status(200).json({message: 'User registered successfully'});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!userAlreadyExists(email)) {
            res.status(400).json({ error: 'User not found' });
            return;
        }

		const user = await User.findByEmail(email);

        const isValidPassword = await bcrypt.compare(password, user[0].password);
        if (!isValidPassword) {
            res.status(400).json({ error: 'Invalid password' });
            return;
        }

		const token = generateToken(user[0]);
		
		res.cookie('auth-token', token, {
			httpOnly: true, // Important: This helps mitigate the risk of client side script accessing the protected cookie
			secure: process.env.NODE_ENV === 'production', // Cookies sent only over HTTPS
			sameSite: 'strict', // CSRF protection
			maxAge: 3600000 
		  });

        res.status(200).json({ message: 'Logged in successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteUser = async (req, res) => {
    let sql = `DELETE FROM Users WHERE id = ${req.params.id}`;
    db.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).json({error: 'Internal Server Error'});
            return;
        }
        res.status(200).json({error: 'User deleted successfully'});
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

function isMissingRequiredFields(user) {
	const { username, email, password, confPassword, birth, gender } = user;
	return !username || !email || !password || !confPassword || !birth || !gender;
}

async function userAlreadyExists(email) {
	return User.findByEmail(email).length > 0;
}

function passwordMeetsCriteria(password) {
	var criteriaRegExp = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$"
    );
    return criteriaRegExp.test(password);
}

function isGenderValid(gender){
	return gender == 'male' || gender == 'female' || gender == 'other';
}

import db from '../config/db.js';
import User from '../models/user-model.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/auth.js';

export const registerUser = async (req, res) => {
	const { username, email, password, confPassword, birth, gender, bio } = req.body;
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
	if (await userAlreadyExists(email, username)) {
		console.log('user already exists');
		res.status(400).json({error: 'User with that email or username already exists'});
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

		const token = generateToken(user);
		res.cookie('auth-token', token, {
			httpOnly: true, // Important: This helps mitigate the risk of client side script accessing the protected cookie
			secure: process.env.NODE_ENV === 'production', // Cookies sent only over HTTPS
			sameSite: 'strict', // CSRF protection
			maxAge: 3600000 
		  });
		console.log('user registered successfully'+user);
        
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

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(400).json({ error: 'Invalid password' });
            return;
        }

		const token = generateToken(user);

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

export const logoutUser = async (req, res) => {
	res.status(200).clearCookie('auth-token').redirect('/login');
}

export const updateUser = async (req, res) => {
	const { username, email, birth, gender, bio } = req.body;
	const user = req.user;
	let userToBeUpdated;

	// fetch user from db
	try{
		userToBeUpdated = await User.findById(req.params.id);
	} catch(err){
		console.log(err);
		return res.status(500).json({error: 'Internal Server Error'});

	}

	if(!user || !userToBeUpdated){
		res.status(400).json({error: 'User not found'});
		return;
	}

	//user can only update his own profile, unless he is an admin
	if(user.id != userToBeUpdated.id && !user.is_admin){
		res.status(401).json({error: 'Unauthorized'});
		return;
	}

	if(userToBeUpdated.username != username && await usernameInUse(username)){
		res.status(400).json({error: 'Username already in use'});
		return;
	}

	if(userToBeUpdated.email != email && await emailInUse(email)){
		res.status(400).json({error: 'Email already in use'});
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

	userToBeUpdated.username = username;
	userToBeUpdated.email = email;
	userToBeUpdated.birth = birth;
	userToBeUpdated.bio = bio;
	userToBeUpdated.gender = gender;

	try{
		await userToBeUpdated.update();
		res.status(200).json({message: 'User updated successfully'});
	} catch(err){
		console.log(err);
		res.status(500).json({error: 'Internal Server Error'});
	}

}

export const getCurrentUser = async (req, res) => {
	const user = await User.findById(req.user.id);
	const data = {
		id: user.id,
		username: user.username,
		email: user.email,
		gender: user.gender,
		birth: user.birth,
		bio: user.bio
	}
	res.status(200).json(data);
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

async function userAlreadyExists(email, username) {
	return await emailInUse(email) || await usernameInUse(username);
}

async function usernameInUse(username) {
	const userByUsername = await User.findByUsername(username);
	return userByUsername != null;
}

async function emailInUse(email) {
	const userByEmail = await User.findByEmail(email);
	return userByEmail != null;
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

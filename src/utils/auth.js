import jwt from "jsonwebtoken";
import Systems from "../models/system-model.js";

export const verifyToken = (req, res, next) => {
	const token = req.cookies['auth-token'];

	if (!token) {
		return res.status(401).redirect("/login");
	}

	try {
		const verified = jwt.verify(token, process.env.TOKEN_SECRET);
		// Add user from payload
		req.user = verified;
		next(); // Continue to the next middleware or route handler
	} catch (err) {
		res.status(400).redirect("/login");
	}
};

// Check if the user is an admin or inside the system
// NOTE: expects the system_id to be in the request params
export const continueIfUserIsInSystem = async (req, res, next) => {
	const user = req.user;
	const systemId = req.params.system_id;
	if (!user.is_admin && !(await Systems.isUserInSystem(user.id, systemId))) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
	next();
}

export const redirectIfAuthenticated = (req, res, next) => {
	const token = req.cookies['auth-token'];
	if (token) {
		try {
			jwt.verify(token, process.env.TOKEN_SECRET);
			return res.redirect('/');
		} catch (err) {
			next();
		}
	} else {
		next();
	}
};

export const generateToken = (user) => {
	const token = jwt.sign({ id: user.id, is_admin: user.is_admin, username: user.username, email: user.email }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
	return token;
}

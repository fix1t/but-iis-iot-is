import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	const token = req.cookies['auth-token'];
	
	if (!token) {
	  return res.status(401).redirect("/login");
	}
  
	try {
	  const verified = jwt.verify(token, process.env.TOKEN_SECRET);
	  req.user = verified;
	  next(); // Continue to the next middleware or route handler
	} catch (err) {
	  res.status(400).redirect("/login");
	}
  };

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

export const generateToken = ( user ) => {
	const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1h'});
	return token;
}

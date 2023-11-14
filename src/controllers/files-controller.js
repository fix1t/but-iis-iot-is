import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const home = (req, res) => {
	res.sendFile(path.join(__dirname, '../views/user/user-list.html'));
}

export const login = (req, res) => {
	res.sendFile(path.join(__dirname, '../views/auth/login.html'));
}

export const register = (req, res) => {
	res.sendFile(path.join(__dirname, '../views/auth/register.html'));
}

export const users = (req, res) => {
	res.sendFile(path.join(__dirname, '../views/user/user-list.html'));
}

export const systemUsers = (req, res) => {
	res.sendFile(path.join(__dirname, '../views/system/system-users.html'));
}

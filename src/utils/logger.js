export const INFO = (data) => {
	console.log("INFO >> " + data);
}

export const DEBUG = (data) => {
	const DEBUG = process.env.DEBUG;
	console.log("DEBUG >> " + DEBUG);
	if (DEBUG === 'true')
		console.log("DEBUG >> " + data);
}

export const WARN = (data) => {
	console.log("WARN >> " + data);
}

export const ERROR = (data) => {
	console.log("ERROR >> " + data);
}

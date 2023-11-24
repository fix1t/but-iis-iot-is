import Parameter from '../models/parameter-model.js';

export const getParameterById = async (req, res) => {
	try {
		const parameter = await Parameter.findById(req.params.parameter_id);
		res.status(200).json(parameter);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
}

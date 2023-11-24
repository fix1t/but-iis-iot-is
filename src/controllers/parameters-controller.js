import Parameter from '../models/parameter-model.js';
import { ERROR, INFO } from '../utils/logger.js';

export const getParameterById = async (req, res) => {
	try {
		INFO(`Getting parameter with id ${req.params.parameter_id}`);
		const parameter = await Parameter.findById(req.params.parameter_id);
		res.status(200).json(parameter);
	} catch (error) {
		ERROR(error.message);
		res.status(404).json({ message: error.message });
	}
}

export const getAllValuesByParameterIdAndDeviceId = async (req, res) => {
	try {
		INFO(`Getting all values for parameter with id ${req.params.parameter_id} and device with id ${req.params.devices_id}`);
		const values = await Parameter.findAllValuesByDeviceIdAndParameterId(req.params.devices_id, req.params.parameter_id);
		res.status(200).json(values);
	} catch (error) {
		ERROR(error.message);
		res.status(404).json({ message: error.message });
	}
}

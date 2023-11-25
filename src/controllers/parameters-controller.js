import Parameter from '../models/parameter-model.js';
import KPI from '../models/kpi-model.js';
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
		INFO(`Getting all values for parameter with id ${req.params.parameter_id} and device with id ${req.params.device_id}`);
		const values = await Parameter.findAllValuesByDeviceIdAndParameterId(req.params.device_id, req.params.parameter_id);
		res.status(200).json(values);
	} catch (error) {
		ERROR(error.message);
		res.status(404).json({ message: error.message });
	}
}

export const getAllParametersAndValuesByDeviceId = async (req, res) => {
	const deviceId = req.params.device_id;

	try {
		const parameters = await Parameter.findLatestValuesByDeviceId(deviceId);
		res.status(200).json(parameters);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export const getAllKpisByParameterIdAndDeviceId = async (req, res) => {
	try {
		INFO(`Getting all kpis for parameter with id ${req.params.parameter_id} and device with id ${req.params.device_id}`);
		const kpis = await KPI.findAllKpisByDeviceIdAndParameterId(req.params.device_id, req.params.parameter_id);
		res.status(200).json(kpis);
	} catch (error) {
		ERROR(error.message);
		res.status(404).json({ message: error.message });
	}
}

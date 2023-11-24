import KPI from '../models/kpi-model.js';
import { ERROR, INFO } from '../utils/logger.js';

export const createKpi = async (req, res) => {
	INFO(`Creating KPI for parameter with id ${req.params.parameter_id} and device with id ${req.params.device_id}`);
	const parameterId = req.params.parameter_id;
	const deviceId = req.params.device_id;
	const { threshold, operation } = req.body;

	if (!parameterId || !deviceId || !threshold || !operation) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	try {
		const kpi = new KPI(deviceId, parameterId, threshold, operation);
		await kpi.save();
		res.status(201).json(kpi);
	} catch (error) {
		ERROR(error.message);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export const deleteKpi = async (req, res) => {
	INFO(`Deleting KPI with id ${req.params.kpi_id}`);
	const kpiId = req.params.kpi_id;

	if (!kpiId) {
		ERROR('Missing required fields');
		return res.status(400).json({ error: 'Missing required fields' });
	}
	try {
		await KPI.deleteById(req.params.kpi_id);
		res.status(204).json();
	} catch (error) {
		ERROR(error.message);
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

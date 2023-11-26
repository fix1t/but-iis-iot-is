import KPI from '../models/kpi-model.js';
import { ERROR, INFO } from '../utils/logger.js';
import { canEditKpisBool } from './devices-controller.js';

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
	const user = req.user;
	const deviceId = req.params.device_id;

	const canEdit = await canEditKpisBool(user, deviceId)

	if (!canEdit) {
		return res.status(403).json({ error: 'Forbidden' });
	}

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

export const getLatestKpiStatus = async (req, res) => {
	const deviceId = req.params.device_id;
	const { id, value } = req.body;
	let errors = []; // Collect errors within the loop

	try {
		const parameterId = id;
		const parameterValue = value;

		INFO(`Getting latest value (${parameterValue}) status for parameter ID: ${parameterId}`);

		const kpiResults = await KPI.findAllKpisByDeviceIdAndParameterId(deviceId, parameterId);

		if (kpiResults && kpiResults.length > 0) {
			// Loop through each KPI result and compare with threshold and operation
			for (let i = 0; i < kpiResults.length; i++) {
				const threshold = kpiResults[i].threshold;
				const operation = kpiResults[i].operation;

				// Collect errors
				if ((operation === 'greater' && parameterValue < threshold) ||
					(operation === 'less' && parameterValue > threshold) ||
					(operation === 'equal' && parameterValue !== threshold) ||
					(operation === 'not_equal' && parameterValue === threshold)) {
					errors.push(`Threshold violation for operation '${operation}'`);
				}
			}
		} else {
			res.status(200).json({ success: true, message: "noKPI" });
			return;
		}

		if (errors.length > 0) {
			res.status(200).json({ success: false, errors });
		} else {
			res.status(200).json({ success: true });
		}
	} catch (error) {
		ERROR(error.message);
		console.error('Error executing query:', error.stack);
		res.status(500).json({ success: false, error: 'Internal Server Error' });
	}
}

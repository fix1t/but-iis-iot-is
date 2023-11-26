import express from 'express';
import { createDevice, getMyDevices, getDeviceById, getAllTypes, getFreeDevices, addDeviceToSystem, deleteDevice, updateDevice, canEditKpis, removeDeviceFromSystem } from '../controllers/devices-controller.js';
import { getParameterById, getAllValuesByParameterIdAndDeviceId, getAllParametersAndValuesByDeviceId, getAllKpisByParameterIdAndDeviceId } from '../controllers/parameters-controller.js';
import { createKpi, deleteKpi, getLatestKpiStatus } from '../controllers/kpis-controller.js';
import { verifyToken, continueIfUserIsInSystem } from '../utils/auth.js';

const router = express.Router();

//get
router.get('/my-devices', verifyToken, getMyDevices);
router.get('/types', verifyToken, getAllTypes);
router.get('/all-free', verifyToken, getFreeDevices);
router.get('/:device_id', verifyToken, getDeviceById);
router.get('/:device_id/parameters', verifyToken, getAllParametersAndValuesByDeviceId);
router.get('/:device_id/parameters/:parameter_id', verifyToken, getParameterById)
router.get('/:device_id/parameters/:parameter_id/data', verifyToken, getAllValuesByParameterIdAndDeviceId);
router.get('/:device_id/parameters/:parameter_id/kpis', verifyToken, getAllKpisByParameterIdAndDeviceId);
router.get('/:device_id/kpis-can-edit', verifyToken, canEditKpis);
//post
router.post('/create/:system_id', verifyToken, continueIfUserIsInSystem, createDevice);
router.post('/create', verifyToken, createDevice);
router.post('/:system_id/add-device', verifyToken, addDeviceToSystem);
router.post('/:device_id/parameters/status', verifyToken, getLatestKpiStatus);
router.post('/:device_id/parameters/:parameter_id/create/kpi', verifyToken, createKpi);
//delete
router.delete('/:device_id', verifyToken, deleteDevice);
router.delete('/:device_id/parameters/:parameter_id/delete/kpi/:kpi_id', verifyToken, deleteKpi);
router.delete('/:device_id/remove/:system_id', verifyToken, removeDeviceFromSystem);
//put
router.put('/:device_id', verifyToken, updateDevice);

export default router;

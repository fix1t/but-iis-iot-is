import Type from '../models/type-model.js';
import Parameter from '../models/parameter-model.js';
import { INFO } from '../utils/logger.js';


export const createType = async (req, res) => {
    const { name } = req.body;

    try {
        // Create a new type with the provided name
        const type = new Type(name);
        // Save the new type to the database
        const savedType = await type.save();
        // Respond with the saved type
        res.status(201).json(savedType);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const addParameterToType = async (req, res) => {
    const { typeId, paramId } = req.params;

    try {
        // Find the type and parameter in the database
        const type = await Type.findById(typeId);
        const parameter = await Parameter.findById(paramId);

        // Add the parameter to the type
        type.parameters.push(parameter);

        // Save the updated type to the database
        const updatedType = await type.save();

        // Respond with the updated type
        res.status(200).json(updatedType);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAllTypesWithParameters = async (req, res) => {
    try {
        const types = await Type.findAll();
        res.status(200).json(types);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const addParametersToType = async (req, res) => {
    const { typeId } = req.params;
    const { parameterIds } = req.body;

    try {
        // Find the type in the database
        const type = await Type.findById(typeId);

        // Find the parameters in the database and add them to the type
        const parameterPromises = parameterIds.map(async paramId => {
            const parameter = await Parameter.findById(paramId);
            parameter.type_id = type.id;
            return parameter.save();
        });

        // Wait for all parameters to be updated
        const updatedParameters = await Promise.all(parameterPromises);

        // Respond with the updated parameters
        res.status(200).json(updatedParameters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// probably not needed -- WILL DELETE
export const getParametersByType = async (req, res) => {
    const typeId = req.params.typeId;

    try {
        const parameters = await Parameter.find({ type_id: typeId });
        res.status(200).json(parameters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

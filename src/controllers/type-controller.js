import Type from '../models/type-model.js';
import { ERROR, INFO } from '../utils/logger.js';


export const createType = async (req, res) => {
    const { name, parameters } = req.body;
    console.log("got here");

    if (!name || !parameters) {
        return res.status(400).json({ error: 'Name and parameters are required' });
    }
	const existingType = await Type.findByName(name);

	if (existingType) {
	ERROR(`Type ${name} already exists`);
    return res.status(409).json({ error: 'Type already exists' });
	}

    try {
        // Create a new type with the provided name
        const type = new Type(name);
        // Add the parameters to the type and save the type to the database
        await type.saveTypeWithParameters(parameters);
        // Respond with the saved type
        res.status(201).json(type);
    } catch (err) {
        console.error(`Error creating type ${name}:`, err);
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

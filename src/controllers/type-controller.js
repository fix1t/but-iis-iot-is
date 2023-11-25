import Type from '../models/type-model.js';
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


export const getAllTypesWithParameters = async (req, res) => {
    try {
        const types = await Type.findAll();
        res.status(200).json(types);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

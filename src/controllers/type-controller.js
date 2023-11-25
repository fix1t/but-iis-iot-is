import Type from '../models/type-model.js';
import Parameter from '../models/parameter-model.js';


export const createTypeWithParameters = async (req, res) => {
    const { name, parameters } = req.body;

    // Create a new type object
    const newType = new Type({
        name
    });

    // Save the new type to the database
    try {
        const savedType = await newType.save();

        // Create parameters for the type
        const parameterPromises = parameters.map(param => {
            return Parameter.create({ ...param, type_id: savedType.id });
        });

        // Wait for all parameters to be created
        const savedParameters = await Promise.all(parameterPromises);

        // Respond with the saved type and parameters
        res.status(201).json({ type: savedType, parameters: savedParameters });
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

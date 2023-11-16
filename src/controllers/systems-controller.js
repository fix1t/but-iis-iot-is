import db from '../config/db.js';
import User from '../models/user-model.js';
import Systems from '../models/system-model.js';


export const getAllSystems = async (req, res) => {
    try {
        const systems = await Systems.findAllSystems();
            const filteredSystems = systems.map(system => {
            return {
                //@TODO send attributes that we want, now sending just names (works for all even now)
                //id: system.id,
                //owner_id: system.owner_id,
                name: system.name,
                //description: system.description,
                //created: system.created,
            };
            });
            res.json(filteredSystems);
    } catch (error) {
        console.error('Error executing query:', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getSystemByID = async (req, res) => {
    try{
        const system = await Systems.findById(req.params.id);
        if (!system) {
            res.status(404).json({ error: 'System not found' });
            return;
        }
        const data = {
            id: system.id,
            owner_id: system.owner_id,
            name: system.name,
            description: system.description,
            created: system.created,
        }
    res.json(data);
    } catch (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).json({ error: 'Internal Server Error' });
    }
};

//@todo should here be adding user/admin to the UserSystems table?
export const createSystem = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from req.user
        const { name, description } = req.body;
        const system = new Systems(userId, name, description);

        if (isMissingRequiredFields(system)) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        await system.save();
        res.status(201).json({ message: 'System created successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

function isMissingRequiredFields(system) {
    const { name } = system;
    return !name;
}

async function getUserById(id) {
    const user = await User.findById(id);
    return user;
  }

import db from '../config/db.js';
import User from '../models/user-model.js';
import Systems from '../models/system-model.js';


export const getAllSystems = async (req, res) => {
    try {
        const systems = await Systems.findAllSystems();

        // Fetch owner details for all systems in parallel
        const systemsWithOwners = await Promise.all(systems.map(async (system) => {
            // Fetch the owner's name from the User model
            const owner = await User.findById(system.owner_id);

            return {
                id: system.id,
                owner_id: system.owner_id,
                owner_name: owner.username, // Add the owner's name to the data
                name: system.name,
                description: system.description,
                created: system.created,
            };
        }));

        res.json(systemsWithOwners);
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
        const owner = await User.findById(system.owner_id);
        if (!owner) {
            res.status(404).json({ error: 'Owner not found' });
            return;
        }
        const data = {
            id: system.id,
            owner_id: system.owner_id,
            owner_name: owner.username,
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
/*
//@todo shouldnt here be using the UserSystems table?
export const getCurrentUserSystems = async (req, res) => {
    try {
        const systems = await Systems.getCurrentUserSystems();
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
*/

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

export const updateSystem = async (req, res) => {
    const { name, description } = req.body;
    const user = req.user;
    let systemToUpdate;
    try {
        systemToUpdate = await Systems.findById(req.params.id);
    } catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!systemToUpdate) {
        res.status(404).json({ error: 'System not found' });
        return;
    }
    if(systemToUpdate.owner_id !== user.id && !user.isAdmin){
        res.status(401).json({ error: 'Forbidden' });
        return;
    }

    systemToUpdate.name = name;
    systemToUpdate.description = description;
    try{
        await systemToUpdate.update();
        res.status(200).json({ message: 'System updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const deleteSystem = async (req, res) => {
    const user = req.user;
    let systemToDelete;
    try {
        systemToDelete = await Systems.findById(req.params.id);
    } catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!systemToDelete) {
        res.status(404).json({ error: 'System not found' });
        return;
    }
    if(systemToDelete.owner_id !== user.id && !user.isAdmin){
        res.status(401).json({ error: 'You are not the owner. Only owner can delete a system.' });
        return;
    }
    try{
        await Systems.deleteById(systemToDelete.id);
        res.status(200).json({ message: 'System deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


function isMissingRequiredFields(system) {
    const { name } = system;
    return !name;
}

async function getUserById(id) {
    const user = await User.findById(id);
    return user;
  }

const { accessToDatabase } = require('../db/connection');
const { getFieldsOfEntity } = require('../helpers/dataframe.helpers');



const getActiveIntegrations = async (req, res) => {
    try {
        const db = await accessToDatabase('USER');
        const user = await db.collection('github-integration').findOne({});
        if (user == null) {
            return res.status(400).json({ message: 'There is no integrations', isSuccess: false });
        }

        const integrations = [
            {
                id: 'github',
                value: 'Github'
            }
        ];

        return res.status(200).json({ data: { integrations: integrations }, isSuccess: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error', isSuccess: false });
    }
};

const getEntities = async (req, res) => {
    try {
        const integration_id = req.query.iid;
        const db = await accessToDatabase(integration_id);

        const entities = (await db.listCollections().toArray()).map((col) => {
            return {
                id: col.name,
                value: col.name
            }
        });

        if (entities == null || entities.length == 0) {
            return res.status(400).json({ message: 'There is no entites', isSuccess: false });
        }

        return res.status(200).json({ data: { entities: entities }, isSuccess: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error', isSuccess: false });
    }
};

const getFields = async (req, res) => {
    try {
        const entity_id = req.query.eid;
        const integration_id = req.query.iid;

        const db = await accessToDatabase(integration_id);
        const field_names = (await getFieldsOfEntity(db, entity_id)).map((key) => {
            return {
                field: key,
                filter: true
            }
        });

        return res.status(200).json({ data: { fields: field_names }, isSuccess: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error', isSuccess: false });
    }
};

const getRecords = async (req, res) => {
    try {
        const entity_id = req.query.eid;
        const integration_id = req.query.iid;
        const { keyword } = req.body;

        const db = await accessToDatabase(integration_id);
        
        let records = [];
        if (keyword != '') {
            const orConditions = (await getFieldsOfEntity(db, entity_id)).map((key) => {
                return {
                    [key]: { $regex: keyword, $options: 'i' }
                }
            });
            
            records = await db.collection(entity_id).aggregate([
                { $match: { $or: orConditions } }
            ]).toArray();
        } else {
            records = await db.collection(entity_id).find({}).toArray();
        }

        if (records == null || records.length == 0) {
            return res.status(400).json({ data: null, isSuccess: false });
        }

        return res.status(200).json({ data: { records: records }, isSuccess: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error', isSuccess: false });
    }
};

module.exports = { getActiveIntegrations, getEntities, getFields, getRecords };
module.exports.getFieldsOfEntity = async (db, entity_id) => {
    try {
        const entity = await db.collection(entity_id).findOne();
        if (entity == null) return [];
    
        const field_names = [];
        for (key in entity) {
            field_names.push(key);
        }
    
        return field_names;
    } catch(err) {
        throw new Error(err);
    }
};
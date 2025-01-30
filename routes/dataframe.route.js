const express = require('express');
const {
    getActiveIntegrations,
    getEntities,
    getRecords,
    getFields } = require('../controllers/dataframe.controller');

const router = express.Router();

router.get('/integrations/active', getActiveIntegrations);

router.get('/entities', getEntities);

router.get('/entity/fields', getFields);

router.post('/entity/records', getRecords);

module.exports = router;
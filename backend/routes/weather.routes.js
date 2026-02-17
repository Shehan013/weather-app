const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controller');

router.get('/cities', weatherController.getCities);
router.get('/debug/cache', weatherController.getCacheStatus);

module.exports = router;


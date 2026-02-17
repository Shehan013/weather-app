const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controller');
const { checkJwt, attachUser } = require('../middleware/auth.middleware');

router.get('/cities', checkJwt, attachUser, weatherController.getCities);
router.get('/debug/cache', weatherController.getCacheStatus);

module.exports = router;


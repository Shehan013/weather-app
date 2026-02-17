const express = require('express');
const router = express.Router();
const weatherRoutes = require('./weather.routes');

router.use('/weather', weatherRoutes);

module.exports = router;
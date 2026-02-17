const express = require('express');
const router = express.Router();
const weatherRoutes = require('./weather.routes');
const userRoutes = require('./user.routes');

router.use('/weather', weatherRoutes);
router.use('/user', userRoutes);

module.exports = router;
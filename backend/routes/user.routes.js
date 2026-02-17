const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { checkJwt, attachUser } = require('../middleware/auth.middleware');

router.use(checkJwt);
router.use(attachUser);

router.get('/preferences', userController.getAllPreferences);

router.get('/preferences/:key', userController.getPreferences);

router.post('/preferences', userController.savePreferences);

module.exports = router;
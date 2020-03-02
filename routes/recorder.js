const router = require('express').Router();

const recorderController = require('../controllers/recorder');

router.get('/recorder', recorderController.getRecorder);

module.exports = router;
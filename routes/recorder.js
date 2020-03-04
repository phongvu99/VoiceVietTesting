const router = require('express').Router();

const recorderController = require('../controllers/recorder');

router.get('/recorder/:recID', recorderController.getRecording);

router.get('/recorder', recorderController.getRecorder);

router.post('/recorder', recorderController.createRecording);

module.exports = router;
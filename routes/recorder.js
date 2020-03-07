const router = require('express').Router();

const recorderController = require('../controllers/recorder');

const isAuth = require('../middleware/is-auth');

const initDrive = require('../middleware/drive').initDrive;

router.get('/recorder/recordings', isAuth, recorderController.getRecordings);

router.get('/recorder/:recID', isAuth, recorderController.getRecording);

router.get('/recorder', recorderController.getRecorder);

router.post('/recorder', initDrive, recorderController.createRecording);

module.exports = router;
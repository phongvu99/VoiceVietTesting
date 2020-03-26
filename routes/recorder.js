const router = require('express').Router();

const recorderController = require('../controllers/recorder');

const isAuth = require('../middleware/is-auth');

const initDrive = require('../middleware/drive').initDrive;

const initStorage = require('../middleware/cloudStorage').initStorage;

router.get('/recorder/recordings', isAuth, recorderController.getRecordings);

router.get('/recorder/:recID', isAuth, recorderController.getRecording);

router.get('/testing', initStorage, recorderController.downloadRecording);

router.get('/recorder', recorderController.getRecorder);

router.post('/recorder', isAuth, initStorage, recorderController.createRecording);

module.exports = router;
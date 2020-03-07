const drive = require('../drive/drive');

const User = require('../models/User');
const Recording = require('../models/Recording');

const getRecorder = async (req, res, next) => {
    // const pathTest = path.join('./');
    // console.log(pathTest);
    res.render('./recorder.ejs');
}

const getRecordings = async (req, res, next) => {
    const perPage = parseInt(req.query.per_page) || 50;
    const currentPage = parseInt(req.query.page) || 1;
    if (perPage > 100) {
        perPage = 100;
    }
    if (perPage < 1) {
        perPage = 50;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }
    console.log('Per Page', perPage);
    console.log('Current Page', currentPage);
    try {
        const totalItems = await Recording.estimatedDocumentCount();
        const recordings = await Recording.find().sort({
                createdAt: -1
            })
            .skip((currentPage - 1) * perPage)
            .limit(perPage).populate('creator', 
                '-_id firstName lastName'
            );
        res.status(200).json({
            'message': 'All recordings',
            'recordings': recordings,
            'totalItems': totalItems
        });
    } catch (err) {
        next(err);
    }


}

const createRecording = (req, res, next) => {
    if (!req.file) {
        const err = new Error('No recording file!');
        err.status = 422;
        return next(err);
    }
    const fileName = req.body.fileName;
    const fileData = req.file;
    // console.log(fileData);
    // console.log('fileData', fileData);
    drive.uploadFile(fileName, fileData, async data => {
        // const user = await User.findById(req.userID);
        try {
            const recording = new Recording({
                title: fileName,
                driveID: data[0],
                creator: '5e63b94b8e7ab243a848edd9'
            });
            const user = await User.findById('5e63b94b8e7ab243a848edd9');
            if (!user) {
                const err = new Error('No user found!');
                err.status = 404;
                throw err;
            }
            user.recordings.push(recording);
            await user.save();
            const recDoc = await recording.save();
            res.status(201).json({
                message: 'Uploaded!',
                file_id: data[0],
                file_name: data[1],
                recording: recDoc._doc
            });
        } catch (err) {
            next(err);
        }
    });

}

const getRecording = async (req, res, next) => {
    const recID = req.params.recID;
    if (!recID) {
        const err = new Error('Missing recordingID parameter!')
        err.status = 422;
        return next(err);
    }
    try {
        const recording = await Recording.findById(recID);
        if (!recording) {
            const err = new Error('The requested resource was not found.');
            err.status = 404;
            throw err;
        }
        res.status(200).json({
            message: 'Recording found!',
            recording: recording
        });
    } catch (err) {
        next(err);
    }

}

module.exports = {
    getRecorder: getRecorder,
    getRecordings: getRecordings,
    getRecording: getRecording,
    createRecording: createRecording
};
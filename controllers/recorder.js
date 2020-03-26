const drive = require('../drive/drive');
const cloudStorage = require('../cloud-storage/cloud');
const getStorage = require('../middleware/cloudStorage').getStorage;
const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const User = require('../models/User');
const Recording = require('../models/Recording');

const bucketName = 'voiceviet-recording';

const getRecorder = async (req, res, next) => {
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
        const recordings = await Recording.find({
                creator: {
                    $ne: req.userID
                }
            }).sort({
                createdAt: -1
            })
            .skip((currentPage - 1) * perPage)
            .limit(perPage).populate('creator quote',
                '-_id firstName lastName message'
            );
        res.status(200).json({
            message: 'All recordings',
            recordings: recordings,
            totalItems: totalItems
        });
    } catch (err) {
        next(err);
    }
}

const createRecording = async (req, res, next) => {
    const cloudStorageURL = 'https://storage.cloud.google.com/voiceviet-recording/';
    if (!req.file) {
        const err = new Error('No recording file!');
        err.status = 422;
        return next(err);
    }
    console.log('Req body', req.body);
    try {
        let file = {
            fileName: req.body.fileName,
            fileData: req.file
        };
        const data = await cloudStorage.uploadFile(file);
        console.log('Data', data);
        file = data[0];
        const recording = new Recording({
            title: file.name,
            cloudID: `${file.id.split('.')[0]}`,
            creator: '5e71f57d498bc60e40d18f1b',
            mediaURL: `${cloudStorageURL}${file.name}`,
            quote: req.body.quoteID
        });
        let user;
        if (req.userID) {
            user = await User.findById(req.userID);
        } else {
            user = await User.findById('5e71f57d498bc60e40d18f1b');
        }
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
            cloudID: `${file.id.split('.')[0]}`,
            fileName: file.name,
            recording: recDoc
        });
    } catch (err) {
        next(err);
    }
}

const downloadRecording = async (req, res, next) => {
    const bufs = [];
    const fileName = `temp-${new Date().toISOString().replace(/[-T:\.Z]/g, "")}.mp3`;
    const localFile = path.join(rootDir, 'tmp', fileName);
    try {
        const remoteFile = getStorage().bucket(bucketName).file('20200318161921629-recording-20200318161921619.mp3');
        remoteFile.createReadStream()
            .on('error', function (err) {})
            .on('response', function (response) {
                // Server connected and responded with the specified status and headers.
                console.log(response);
            })
            .on('data', function (chunk) {
                // console.log('Data', chunk);
                bufs.push(chunk);
            })
            .on('end', function () {
                // The file is fully downloaded.
                res.status(200).json({
                    message: 'Downloaded!',
                    path: `/${fileName}`
                });
            })
            .pipe(fs.createWriteStream(localFile));
    } catch (err) {
        next(err);
    }
}

const getRecording = async (req, res, next) => {
    const recID = req.params.recID;
    if (!recID) {
        const err = new Error('Missing recordingID parameter!')
        err.status = 422;
        return next(err);
    }
    try {
        const recording = await Recording.findOne({
            _id: recID,
            creator: {
                $ne: req.userID
            }
        }).populate('quote', '-_id message');
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
    createRecording: createRecording,
    downloadRecording: downloadRecording
};
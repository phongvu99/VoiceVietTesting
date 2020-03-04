const path = require('path');
const getDrive = require('../util/drive').getDrive;
const fs = require('fs');

const drive = require('../drive/drive');

const Recording = require('../models/Recording');

const getRecorder = (req, res, next) => {
    // const pathTest = path.join('./');
    // console.log(pathTest);
    res.render('./recorder.ejs');
}

const createRecording = (req, res, next) => {
    if (!req.file) {
        const err = new Error('No recording selected!');
        err.status = 422;
        return next(err);
    }
    const fileName = req.body.fileName;
    const fileData = req.file;
    // console.log(fileData);
    // console.log('fileData', fileData);
    try {
        drive.uploadFile(fileName, fileData, async data => {
            const recording = new Recording({
                title: fileName,
                driveID: data[0],
                creator: '5e5fe1f1ead32f219cddcae1'
            });
            const recDoc = await recording.save();
            res.status(201).json({
                message: 'Uploaded!',
                file_id: data[0],
                file_name: data[1],
                recording: recDoc._doc
            });
        });
    } catch (err) {
        next(err);
    }

}

const getRecording = async (req, res, next) => {
    const fileID = '1clX_QS6jvU9M4BOI0Iu46glrJ27IqEh2';
    const recID = req.params.recID;
    try {
        const recording = await Recording.findById(recID);
        if (!recording) {
            return res.status(404).json({
                message: 'No recording found'
            });
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
    getRecording: getRecording,
    createRecording: createRecording
};
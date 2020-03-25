const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recordingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    cloudID: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mediaURL: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Recording', recordingSchema);
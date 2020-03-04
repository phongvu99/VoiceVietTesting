const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    recording: [{
        type: Schema.Types.ObjectId,
        ref: 'Recording',
        required: true
    }]

}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);
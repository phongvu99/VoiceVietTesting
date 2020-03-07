require('dotenv').config();

const mongoose = require('mongoose');
const multer = require('multer');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Routes
const recorder = require('./routes/recorder');
const auth = require('./routes/auth');

// Controllers
const errorsController = require('./controllers/errors');

// Util
const rootDir = require('./util/path');

const app = express();

// Multer fileStorage configurations
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './tmp/');
    },
    filename: (req, file, cb) => {
        console.log('Original filename', file.originalname);
        cb(null, new Date().toISOString().replace(/[-T:\.Z]/g, "") + '-' + file.originalname);
    }
});

// Multer fileFilter configurations
const fileFilter = (req, file, cb) => {
    const type = file.mimetype;
    const types = {
        1: 'audio/wav',
        2: 'audio/mpeg',
        3: 'audio/ogg'
    };
    if (type === types[1] ||
        type === types[2] ||
        type === types[3]) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter
});

app.use(upload.single('fileData'));

app.set('view engine', 'ejs'); // EJS is supported by default
app.set('views', 'views'); // Explicitly set

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(rootDir, 'public')));

// CORS headers
app.use((req, res, next) => {
    res.header({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    next();
});

app.use(auth);
app.use(recorder);

app.use(errorsController.request_404);

app.use((err, req, res, next) => {
    console.log('Express error handling', err);
    const status = err.status || 500;
    const data = err.data || '';
    const message = err.message;
    res.status(status).json({
        status: status,
        message: message,
        data: data
    });
});

// ENV variables
const PORT = process.env.PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;

// Connection URI
const uri = `mongodb+srv://phongvu99:${DB_PASSWORD}@nodejs-course-6joar.mongodb.net/voiceviet?retryWrites=true&w=majority`;

mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((result) => {
        app.listen(PORT || process.env.PORT, () => {
            console.log('App started on port:', PORT);
        });
    })
    .catch((err) => {
        console.log(err);
    });
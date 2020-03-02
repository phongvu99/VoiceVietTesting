require('dotenv').config();

const express = require('express');
const path = require('path');
const rootDir = require('./util/path');
const bodyParser = require('body-parser');
const recorder = require('./routes/recorder');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(rootDir, 'public')));

app.set('view engine', 'ejs'); // EJS is supported by default
app.set('views', 'views'); // Explicitly set

app.use(recorder);

const port = process.env.PORT; 

app.listen(port || process.env.PORT, () => {
    console.log('App started on port:', port);
});




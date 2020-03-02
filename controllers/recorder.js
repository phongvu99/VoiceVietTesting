const getRecorder = (req, res, next) => {
    res.render('./recorder.ejs');
}

module.exports = {
    getRecorder: getRecorder
};
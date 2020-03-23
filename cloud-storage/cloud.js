const getStorage = require('../middleware/cloudStorage').getStorage;

const bucketName = 'voiceviet-recording'

const uploadFile = async (file) => {
    const storage = getStorage();
    try {
        const data = await storage.bucket(bucketName).upload(file.fileData.path, {
            gzip: true,
            metadata: {
                cacheControl: 'public, max-age=31536000'
            },
            destinations: `./recording/${file.fileName}`
        });
        // console.log('File uploaded', data[0]);
        // console.log('API response', data[1]);
        return data;
    } catch (err) {
        throw err;
    }

}

const downloadFile = async (req, res, next) => {
    const remoteFile = getStorage().bucket(bucketName).file('20200318161921629-recording-20200318161921619.mp3');
    remoteFile.createReadStream()
        .on('error', function (err) {})
        .on('response', function (response) {
            // Server connected and responded with the specified status and headers.
        })
        .on('end', function () {
            // The file is fully downloaded.
        })
        .pipe(res);
}

module.exports = {
    uploadFile: uploadFile
};
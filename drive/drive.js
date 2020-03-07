const getDrive = require('../middleware/drive').getDrive;
const rootDir = require('../util/path');

const fs = require('fs');
const path = require('path');

const {
    google
} = require('googleapis');

const downloadFile = async (fileID, cb) => {
    const auth = getDrive();
    const drive = google.drive({
        version: 'v3',
        auth
    });
    const dest = fs.createWriteStream(path.join(rootDir, 'tmp', `${new Date().toISOString().replace(/[-T:\.Z]/g, "")}-recording.mp3`));
    try {
        const res = await drive.files.get({
            fileId: fileID,
            alt: 'media'
        }, {
            responseType: "stream"
        })
        res.data.on('end', function () {
                // console.log('Done');
                cb && cb();
            })
            .on('error', function (err) {
                console.log('Error during download', err);
            })
            .pipe(dest);
    } catch (err) {
        throw err;
    }

}

const uploadFile = async (fileName, fileData, cb) => {
    // path without parameter "." start from VoiceMozilla directory
    // const pathTest = path.join('public', 'js');
    // console.log(pathTest);
    const fileStream = fs.createReadStream(path.join(rootDir, fileData.path));
    const folderID = '1dyQQ6uTwqpFxSkBYOkkZFdtaoSoqGKzZ';
    const auth = getDrive();
    const drive = google.drive({
        version: 'v3',
        auth
    });
    const fileMetadata = {
        'name': fileName,
        parents: [folderID]
    };
    const media = {
        mimeType: 'audio/mpeg',
        body: fileStream
    };
    const params = {
        resource: fileMetadata,
        media: media,
        fields: 'id'
    };
    try {
        const file = await drive.files.create(params)
        console.log('File Id: ', file.data.id);
        cb && cb([file.data.id, fileName]);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const listFiles = () => {
    const auth = getDrive();
    const drive = google.drive({
        version: 'v3',
        auth
    });
    drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });
        } else {
            console.log('No files found.');
        }
    });
}

module.exports = {
    listFiles: listFiles,
    uploadFile: uploadFile,
    downloadFile: downloadFile
}
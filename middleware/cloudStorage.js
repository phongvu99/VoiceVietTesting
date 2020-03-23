  const path = require('path');
  const rootDir = require('../util/path');

  // Imports the Google Cloud client library
  const {
      Storage
  } = require('@google-cloud/storage');

  const CREDS_PATH = path.join(rootDir, 'util', 'cloud-storage-creds.json')
  const bucketName = 'voiceviet-recording';

  // Creates a client
  //   const storage = new Storage();

  let _storage;

  async function createBucket() {
      // Creates the new bucket
      await _storage.createBucket(bucketName);
      console.log(`Bucket ${bucketName} created.`);
  }

  const getStorage = () => {
      if (!_storage) {
          throw new Error('Google Cloud Storage uninitialized!');
      }
      return _storage;
  };

  const initStorage = (req, res, next) => {
      if (!_storage) {
          console.log('Initializing Storage API...');
          // Creates a client from a Google service account key.
          _storage = new Storage({
              keyFilename: CREDS_PATH,
              projectId: 'voiceviet-api'
          });
          next();
      } else {
          next();
      }
  };

  module.exports = {
      initStorage: initStorage,
      getStorage: getStorage
  };

  //   createBucket().catch(console.error);
require('dotenv').config()

// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage').Storage;

class Upload {
  constructor() {
    this.storage = new Storage();
  }

  async uploadFile(filename, bucketName) {
    // Uploads a local file to the bucket
    await this.storage.bucket(bucketName).upload(filename, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
      },
    });

    console.log(`${filename} uploaded to ${bucketName}.`);
  }
}

module.exports = { Upload }

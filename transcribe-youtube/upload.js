require('dotenv').config()
const fs = require('fs')
const Spinner = require('cli-spinner').Spinner;

// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage').Storage;

class Upload {
  constructor() {
    this.storage = new Storage();
  }

  async runUpload(videoId, bucketName) {
    return new Promise(async (res, rej) => {
      const spinner = new Spinner('uploading video.. %s');
      spinner.setSpinnerString('|/-\\');
      spinner.start()
      // Uploads a local file to the bucket
      this.storage.bucket(bucketName).upload(`${videoId}.flac`, {
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
      }).then((onFulfilled, onRejected) => {
        spinner.stop()
        fs.unlink(`${videoId}.flac`, (err) => {
        });
        onRejected ? rej(onRejected) : res(onFulfilled)
      })
    })
  }
}

module.exports = { Upload }

require('dotenv').config()

const Spinner = require('cli-spinner').Spinner;
// Imports the Google Cloud client library
const speech = require('@google-cloud/speech').v1p1beta1;
const fs = require('fs');

class Transcribe {
  constructor() {
    // Creates a client
    this.speechClient = new speech.SpeechClient();
    this.spinner = new Spinner('processing.. %s');
    this.spinner.setSpinnerString('|/-\\');
  }

  async runTranscribe(filename) {
    return new Promise(async (res, rej) => {
      // Add config settings
      // const filename = 'audio.m4a';
      // const encoding = 'OGG_OPUS';
      const encoding = 'FLAC';
      const sampleRateHertz = 48000;
      const languageCode = 'cmn-Hant-TW';
      // const languageCode = 'en-US';

      const config = {
        enableAutomaticPunctuation: true,
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
      };
      const audio = {
        content: fs.readFileSync(filename).toString('base64'),
      };

      const request = {
        config: config,
        audio: audio,
      };

      // Detects speech in the audio file. This creates a recognition job that you
      // can wait for now, or get its result later.
      this.spinner.start()
      const [operation] = await this.speechClient.longRunningRecognize(request);

      // Get a Promise representation of the final result of the job
      const [response] = await operation.promise();
      this.spinner.stop(true)
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
      fs.writeFile('transcription.txt', transcription, (err)=> {
        err ? rej(err) : res()
      })
    })
  }

}

module.exports = { Transcribe }

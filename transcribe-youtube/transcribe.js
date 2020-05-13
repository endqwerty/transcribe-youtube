require('dotenv').config()

const Spinner = require('cli-spinner').Spinner;
// Imports the Google Cloud client library
const speech = require('@google-cloud/speech').v1p1beta1;
const fs = require('fs');

class Transcribe {
  constructor() {
    // Creates a client
    this.speechClient = new speech.SpeechClient();
  }

  async runTranscribe(videoId, useURI) {
    const encoding = 'FLAC';
    const sampleRateHertz = 16000;
    const languageCode = 'cmn-Hant-TW';

    const config = {
      enableAutomaticPunctuation: true,
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
    };
    const audio = useURI ?
      { uri: `gs://endqwerty-yt_transcribe/${videoId}.flac` } :
      { content: fs.readFileSync(`${videoId}.flac`).toString('base64') }

    const request = {
      config: config,
      audio: audio,
    };
    this.spinner = new Spinner('transcribing.. %s');
    this.spinner.setSpinnerString('|/-\\');

    return new Promise(async (res, rej) => {
      this.spinner.start()
      const [operation] = await this.speechClient.longRunningRecognize(request).catch(err => {
        this.spinner.stop()
        rej(err)
      });

      // Get a Promise representation of the final result of the job
      const [response] = await operation.promise();
      this.spinner.stop()
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      fs.writeFile(`${videoId}.txt`, transcription, (err) => {
        err ? rej(err) : res()
      })
    })
  }

}

module.exports = { Transcribe }

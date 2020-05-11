require('dotenv').config()

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');

const runTranscribe = async function () {

  // Creates a client
  const client = new speech.SpeechClient();

  // Add config settings
  const filename = 'audio.m4a';
  const encoding = 'LINEAR16';
  const sampleRateHertz = 4410;
  const languageCode = 'zh-tw';

  const config = {
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
  const [operation] = await client.longRunningRecognize(request);

  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  await console.log(`Transcription: ${transcription}`);
  await fs.writeFile('transcription.txt', transcription)
}

runTranscribe()

const Fetch = require('./fetch').Fetch
const Upload = require('./upload').Upload
const Convert = require('./convert').Convert
const Transcribe = require('./transcribe').Transcribe

// upload.uploadFile('EKbT0pQdQ2o.webm', 'endqwerty-yt_transcribe').catch(console.error);
const upload = new Upload()
const fetch = new Fetch()
const transcribe = new Transcribe()
const convert = new Convert()
async function run(videoId) {
  // await fetch.runFetch(`https://www.youtube.com/watch?v=${videoId}`)
  await fetch.runFetch()
  await convert.runConvert(`${videoId}`)
  await transcribe.runTranscribe(`${videoId}.flac`)
}

run('EKbT0pQdQ2o2')

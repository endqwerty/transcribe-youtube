const Fetch = require('./fetch').Fetch
const Upload = require('./upload').Upload
const Convert = require('./convert').Convert
const Transcribe = require('./transcribe').Transcribe
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'videoId', type: String, multiple: true, defaultOption: true }
]
const options = commandLineArgs(optionDefinitions)

const fetch = new Fetch()
const convert = new Convert()
const upload = new Upload()
const transcribe = new Transcribe()

async function run(videoId) {
  await fetch.runFetch(videoId)
  await convert.runConvert(videoId)
  await upload.runUpload(videoId, 'endqwerty-yt_transcribe')
  transcribe.runTranscribe(videoId, true).then(
    console.log(`Transcribe complete: ${videoId}`)
  )
}

async function runMultiple(videoIds) {
  for (const videoId of videoIds) {
    await run(videoId)
  }
}

if (options.videoId.length == 1) {
  run(options.videoId[0])
} else {
  runMultiple(options.videoId)
}


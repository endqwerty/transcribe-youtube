// index.js
const watson = require('./watson')
const youtube = require('./youtube')
const path = require('path')
const { program } = require('commander')
const pjson = require('./package.json')

program.version(pjson.version, '-v, --verssion', 'output the current version')
program.options('-d, --debug', 'console output debug statements')

program.parse(process.argv)
const flags = process.argv.slice(2)

if (flags[0] === 'transcribe') {
  youtube
    .getYouTubeAudio(flags[1])
    .then(
      watson.watsonSpeechToText.bind(this, path.join(__dirname, 'file.flac'))
    )
    .then(function () {
      console.log('Done transcribing video id: ' + flags[1])
    })
}

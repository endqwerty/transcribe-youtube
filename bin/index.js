#!/usr/bin/env node

require('dotenv').config()
const log = require('simple-node-logger').createSimpleLogger()
const { program } = require('commander')
const pjson = require('../package.json')

program.version(pjson.version, '-v, --version', 'output the current version')
program.option('-d, --debug', 'console output debug statements')
program.arguments('<youtube_url>').action((youtubeUrl) => {
  youtubeUrlValue = youtubeUrl
})

program.parse(process.argv)
// trace, debug, info, warn, error and fatal
program.debug ? log.setLevel('debug') : log.setLevel('warn')

log.debug(`WATSON_API: ${process.env.WATSON_API}`)
log.debug(`WATSON_URL: ${process.env.WATSON_URL}`)
log.debug(`Youtube URL: ${youtubeUrlValue}`)

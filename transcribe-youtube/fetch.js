import { createWriteStream } from 'fs'
import youtubedl from 'youtube-dl'

const video = youtubedl(
  'https://www.youtube.com/watch?v=EKbT0pQdQ2o',
  // Optional arguments passed to youtube-dl.
  ['--format=140'],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname }
)

// Will be called when the download starts.
video.on('info', function (info) {
  console.log('Download started')
  console.log('filename: ' + info._filename)
  console.log('size: ' + info.size)
})

video.pipe(createWriteStream('audio.m4a'))

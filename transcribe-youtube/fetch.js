const fs = require('fs')
const ytdl = require('ytdl-core')
const cliProgress = require('cli-progress')

// const video_url = 'https://www.youtube.com/watch?v=EKbT0pQdQ2o'

class Fetch {
  constructor() {
    this.progressBarFormat =
      'progress [{bar}] {percentage}% | {value}/{total} chunks'
    this.progressBar = new cliProgress.SingleBar(
      {
        stopOnComplete: true,
        format: this.progressBarFormat,
      },
      cliProgress.Presets.shades_classic
    )
  }

  async runFetch(videoId) {
    return new Promise(async (res, rej) => {
      let videoTitle = ''
      const video_url = `https://www.youtube.com/watch?v=${videoId}`
      // https://www.youtube.com/watch?v=ZvRJUVax4rc
      const videoStream = ytdl(video_url, {
        quality: 'highestaudio',
        filter: (format) => format.container === 'webm',
      })

      ytdl.getBasicInfo(video_url, (err, info) => {
        if (err) rej(err)
        videoTitle = info.title
      })
      let progressBarStarted = false
      videoStream.on(
        'progress',
        (chuckLength, totalBytesDownloaded, totalBytes) => {
          if (!progressBarStarted) {
            this.progressBar.start(totalBytes, totalBytesDownloaded)
            progressBarStarted = true
          } else {
            this.progressBar.update(totalBytesDownloaded)
          }
        }
      )
      videoStream.on('end', () => {
        res(videoTitle) // video details title
      })
      videoStream
        .pipe(fs.createWriteStream(`${videoId}.webm`))
        .on('error', (err) => {
          console.error(err.message)
          rej(err)
        })
    })
  }
}

module.exports = { Fetch }

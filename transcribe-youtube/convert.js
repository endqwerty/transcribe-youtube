const ffmpeg = require('ffmpeg')
const Spinner = require('cli-spinner').Spinner;
const fs = require('fs');

class Convert {
  constructor() {
  }

  async runConvert(videoId) {
    return new Promise((res, rej) => {
      const spinner = new Spinner('converting video.. %s');
      spinner.setSpinnerString('|/-\\');
      spinner.start()
      fs.unlink(`${videoId}.flac`, (err) => {
      });
      try {
        const videoProcess = new ffmpeg(`${videoId}.webm`);
        videoProcess.then(video => {
          // video.setAudioCodec('flac')
          video.setAudioChannels(1)
          video.addCommand('-c:a', 'flac')
          video.addCommand('-sample_fmt', 's16')
          video.addCommand('-ar', '16000')
          video.addCommand('-ab', '16')
          video.save(`${videoId}.flac`, function (error, file) {
            spinner.stop()
            console.log('')
            if (!error) {
              fs.unlink(`${videoId}.webm`, (err) => {
              });
              res()
            } else {
              rej(error)
            }
          })
        }, function (err) {
          spinner.stop()
          rej(err)
          console.log('Error: ' + err);
        });
      } catch (e) {
        spinner.stop()
        rej(e.msg)
        console.log(e.code);
        console.log(e.msg);
      }
    })
  }
}

module.exports = { Convert }

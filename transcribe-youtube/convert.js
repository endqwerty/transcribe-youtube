const ffmpeg = require('ffmpeg')
const Spinner = require('cli-spinner').Spinner;

class Convert {
  constructor() {
  }

  async runConvert(videoID) {
    return new Promise(async (res, rej) => {
      const spinner = new Spinner('converting video.. %s');
      spinner.setSpinnerString('|/-\\');
      spinner.start()
      try {
        const videoProcess = new ffmpeg(`${videoID}.webm`);
        videoProcess.then(function (video) {
          video.setAudioChannels(1)
          video.setAudioCodec('flac')
          video.save(`${videoID}.flac`, function (err) {
            spinner.stop(true)
            err ? rej(err) : res();
          })
        }, function (err) {
          spinner.stop(true)
          rej(err)
          console.log('Error: ' + err);
        });
      } catch (e) {
        spinner.stop(true)
        err(e.msg)
        console.log(e.code);
        console.log(e.msg);
      }
    })
  }
}

module.exports = { Convert }

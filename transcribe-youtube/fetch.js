const fs = require('fs');
const ytdl = require('ytdl-core');
const cliProgress = require('cli-progress');

const video_url = 'https://www.youtube.com/watch?v=EKbT0pQdQ2o'

const runFetch = async function () {
  const progressBarFormat = 'progress [{bar}] {percentage}% | {value}/{total} chunks'

  const progressBar = new cliProgress.SingleBar({
    stopOnComplete: true,
    format: progressBarFormat
  }, cliProgress.Presets.shades_classic);

  const videoStream = ytdl(video_url,
    {
      quality: 'highestaudio',
      filter: format => format.container === 'webm'
    })
  let video_id = ''
  await ytdl.getInfo(video_url, (err, info) => {
    if (err) throw err;
    // Strip out 'https://www.youtube.com/watch?v='
    video_id = info.video_url.substring(32)
    console.log(`Video ID: ${video_id}`)
  });
  let progressBarStarted = false
  videoStream.on("progress", (chuckLength, totalBytesDownloaded, totalBytes) => {
    if (!progressBarStarted) {
      progressBar.start(totalBytes, totalBytesDownloaded);
      progressBarStarted = true
    } else {
      progressBar.update(totalBytesDownloaded);
    }
  });

  await videoStream.pipe(fs.createWriteStream(`${video_id}.webm`))
}
runFetch()

const fetch = require("node-fetch");
const shell = require("shelljs");

if (process.argv.length <= 2) {
  console.log('Missing username.');
  console.log('Usage: node index.js <tiktok username>');
  console.log('(the default output folder is ./');
  console.log('Example: node index.js charlidamelio');
  process.exit(0);
}

const input = process.argv[2];
const username = input.startsWith('@') ? input.substring(1) : input;
const url = `https://www.tiktok.com/@${username}/live`;

fetch(url)
  .then(res => {
    return res.text();
  })
  .then(async (body) => {

    const matches = body.match(/room_id=(\d+)/);

    if (!matches) {
      console.log('No live stream found.');
      process.exit(0);
    }

    const roomId = matches[1];

    const apiURL = `https://www.tiktok.com/api/live/detail/?aid=1988&roomID=${roomId}`;

    const res = await (await fetch(apiURL)).json();
    const { title, liveUrl } = res.LiveRoomInfo;

    console.log(`Found live "${title}":`);
    console.log(`m3u8 URL: ${liveUrl}`);

    const fileName = `${username}-${Date.now()}.mp4`;

    console.log(`Downloading to ${fileName}`);
    shell.exec(`ffmpeg -i ${liveUrl} -c copy ./${fileName}`);
  });

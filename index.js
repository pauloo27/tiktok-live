const fetch = require("node-fetch");
const fs = require("fs");
const http = require("http");

if (process.argv.length <= 2) {
  console.log('Missing URL.');
  console.log('Usage: node index.js <tiktok-url>');
  console.log('(the default output folder is ./');
  console.log('Example: node index.js http://vm.tiktok.com/fMXQa8/');
  process.exit(0);
}

let url = process.argv[2];

console.log(`URL > ${url}`);

fetch(url)
  .then(res => {
    return res.text();
  })
  .then(async (body) => {
    const roomId = body.match(/room_id=(\d+)/)[1];
    const apiURL = `https://www.tiktok.com/api/live/detail/?aid=1988&roomID=${roomId}`;

    const res = await (await fetch(apiURL)).json();
    const {title, liveUrl} = res.LiveRoomInfo;

    const flvUrl = liveUrl.replace("pull-hls", "pull-flv").replace("/playlist.m3u8", ".flv").replace("https", "http").replace('.m3u8', '.flv');

    console.log(`Found live "${title}":`);
    console.log(`m3u8 URL: ${liveUrl}`);
    console.log(`flv URL: ${flvUrl}`);

    console.log(`Writing live to ${roomId}.flv. Press Ctrl C to STOP.`)
    
    const file = fs.createWriteStream(`${roomId}.flv`)
    http.get(flvUrl,(response) => {
      response.pipe(file);
    });
  });

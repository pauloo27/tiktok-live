const { program } = require("commander");
const fetch = require("node-fetch");
const shell = require("shelljs");
const fs = require("fs");
const path = require("path");

program
  .argument("<username>", "live username")
  .option(
    "--output <path>",
    "output file or folder path (eg ./folder or ./folder/file.mp4)",
    "downloads"
  )
  .option("--format <format>", "output format", "mp4");

program.parse();

const options = program.opts();
const args = program.args;

const format = options.format;

if (format != 'mp4') {
  console.error("Only mp4 format is supported at the moment");
  process.exit(1);
}

const input = args[0];
const username = input.startsWith("@") ? input.substring(1) : input;
const url = `https://www.tiktok.com/@${username}/live`;

fetch(url)
  .then((res) => {
    return res.text();
  })
  .then(async (body) => {
    const matches = body.match(/room_id=(\d+)/);

    if (!matches) {
      console.log("No live stream found.");
      process.exit(0);
    }

    const roomId = matches[1];

    const apiURL = `https://www.tiktok.com/api/live/detail/?aid=1988&roomID=${roomId}`;

    const res = await (await fetch(apiURL)).json();
    const { title, liveUrl } = res.LiveRoomInfo;

    console.log(`Found live "${title}":`);
    console.log(`m3u8 URL: ${liveUrl}`);

    const fileName = options.output.endsWith(options.format)
      ? options.output
      : `${options.output.replace(/\/$/, "")}/${username}-${Date.now()}.mp4`;

    fs.mkdirSync(path.dirname(fileName), { recursive: true });

    console.log(`Downloading to ${fileName}`);
    shell.exec(`ffmpeg -i ${liveUrl} -c copy ${fileName}`);
  });

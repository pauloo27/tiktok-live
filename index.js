const urlRegex = require("url-regex");
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

if (url.endsWith('/')) url = url.substring(0, url.length - 1);

const urlParts = url.split("/");
let id = urlParts[urlParts.length - 1];

if (id.includes("?")) id = id.split("?")[0];

console.log(`URL > ${url}`);
console.log(`ID > ${id}`);

fetch(url)
  .then(res => {
    return res.text();
  })
  .then(body => {
    const urls = body.match(urlRegex());
    const baseUrl = urls.find(url => url.includes("pull-hls-l1-mus.pstatp.com"))

    let liveUrl = baseUrl;

    liveUrl = liveUrl.replace("pull-hls-l1-mus", "pull-flv-l1-mus");
    liveUrl = liveUrl.split("/").slice(0, 5).join("/")
    liveUrl += ".flv"

    console.log(`Found live URL: ${liveUrl}`);

    console.log(`Writing live to ${id}.flv. Press Ctrl C to STOP.`)
    
    const file = fs.createWriteStream(`${id}.flv`)
    http.get(liveUrl, function (response) {
      response.pipe(file);
    });
  });
